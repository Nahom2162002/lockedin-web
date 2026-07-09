import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { connectDB } from '@/lib/mongodb';
import { getUserFromRequest } from '@/lib/auth';
import User from '@/models/User';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const user = await getUserFromRequest(req);

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
        }

        if (!user.stripeCustomerId) {
            return NextResponse.json({ error: 'No subscription found' }, { status: 400, headers: corsHeaders });
        }

        const subscriptions = await stripe.subscriptions.list({
            customer: user.stripeCustomerId,
            status: 'trialing',
            limit: 1
        });

        if (subscriptions.data.length > 0) {
            const sub = subscriptions.data[0];
            await stripe.subscriptions.cancel(sub.id);

            await User.findByIdAndUpdate(user._id, {
                plan: 'free',
                cancelAtPeriodEnd: false,
                trialEnd: null,
                isTrialing: false,
                hasHadTrial: true 
            });

            return NextResponse.json({
                cancelled: true,
                message: 'Trial cancelled successfully',
                url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`
            }, { headers: corsHeaders });
        }

        const authHeader = req.headers.get('authorization');
        const token = authHeader?.split(' ')[1];

        const session = await stripe.billingPortal.sessions.create({
            customer: user.stripeCustomerId,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/portal-return?token=${token}`
        });

        return NextResponse.json({ url: session.url }, { headers: corsHeaders });
    } catch (err: any) {
        console.log('Portal error:', err.message);
        return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
    }
}