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

export async function POST(req: NextRequest) {
    const user = await getUserFromRequest(req);
    try {
        await connectDB();

        //const user = await getUserFromRequest(req);

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
        }

        if (!user.stripeCustomerId) {
            return NextResponse.json({ error: 'No subscription found' }, { status: 400, headers: corsHeaders });
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: user.stripeCustomerId,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`
        });

        return NextResponse.json({ url: session.url }, { headers: corsHeaders });
    } catch (err: any) {
        console.log('Portal error:', err.message);
        console.log('Portal error type:', err.type);
        console.log('Customer ID:', user?.stripeCustomerId);
        return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
    }
}