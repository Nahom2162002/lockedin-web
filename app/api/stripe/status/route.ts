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
                currentPeriodEnd: null,
                hasHadTrial: user.hasHadTrial ?? false
            }, { headers: corsHeaders });
        }

        const subscriptions = await stripe.subscriptions.list({
            customer: user.stripeCustomerId,
            limit: 1,
            status: 'all'
        });

        const sub = subscriptions.data[0] as any;
        console.log('Subscription keys:', Object.keys(sub));
        console.log('Raw sub:', JSON.stringify({
            status: sub.status,
            current_period_end: sub.current_period_end,
            cancel_at_period_end: sub.cancel_at_period_end,
            cancel_at: sub.cancel_at,
            ended_at: sub.ended_at,
            items: sub.items?.data?.[0]
        }));

        if (!sub || sub.status === 'canceled') {
            return NextResponse.json({
                plan: 'free',
                cancelAtPeriodEnd: false,
                currentPeriodEnd: null,
                hasHadTrial: user.hasHadTrial ?? false
            }, { headers: corsHeaders });
        }

        const cancelAtPeriodEnd = sub.cancel_at_period_end || (sub.cancel_at !== null && sub.cancel_at !== undefined);
        const periodEnd = sub.items?.current_period_end || sub.current_period_end || sub.cancel_at;
        const currentPeriodEnd = periodEnd ? new Date(periodEnd * 1000).toISOString() : null;

        const isTrialing = sub.status === 'trialing';
        const trialEnd = sub.trial_end 
            ? new Date((sub.trial_end as number) * 1000).toISOString() 
            : null;

        if (cancelAtPeriodEnd !== user.cancelAtPeriodEnd) {
            await user.updateOne({ cancelAtPeriodEnd });
        }

        return NextResponse.json({
            plan: user.plan,
            cancelAtPeriodEnd,
            currentPeriodEnd,
            isTrialing,
            trialEnd,
            hasHadTrial: user.hasHadTrial ?? false
        }, { headers: corsHeaders });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
    }
}