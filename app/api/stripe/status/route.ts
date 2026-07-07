import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { connectDB } from '@/lib/mongodb';
import { getUserFromRequest } from '@/lib/auth';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const user = await getUserFromRequest(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });

        if (!user.stripeCustomerId) {
            return NextResponse.json({ 
                plan: user.plan,
                cancelAtPeriodEnd: false,
                currentPeriodEnd: null
            }, { headers: corsHeaders });
        }

        // Fetch live subscription status directly from Stripe
        const subscriptions = await stripe.subscriptions.list({
            customer: user.stripeCustomerId,
            limit: 1,
            status: 'all'
        });

        const sub = subscriptions.data[0] as any;

        if (!sub || sub.status === 'canceled') {
            return NextResponse.json({
                plan: 'free',
                cancelAtPeriodEnd: false,
                currentPeriodEnd: null
            }, { headers: corsHeaders });
        }

        const cancelAtPeriodEnd = sub.cancel_at_period_end;
        const currentPeriodEnd = sub.current_period_end ? new Date(sub.current_period_end * 1000).toISOString() : null;

        // Sync to database if out of sync
        if (cancelAtPeriodEnd !== user.cancelAtPeriodEnd) {
            await user.updateOne({ cancelAtPeriodEnd });
        }

        return NextResponse.json({
            plan: user.plan,
            cancelAtPeriodEnd,
            currentPeriodEnd
        }, { headers: corsHeaders });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
    }
}