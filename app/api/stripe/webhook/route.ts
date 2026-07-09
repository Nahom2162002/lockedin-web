import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import User from '@/models/User';
import mongoose from 'mongoose';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    console.log('WEBHOOK HIT - time:', new Date().toISOString());

    const body = await req.text();    
    const sig = req.headers.get('stripe-signature');

    if (!sig) {
        console.log('No signature - returning 400');
        return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    let event;
    try {
        event = stripe.webhooks.constructEvent(
            body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
        console.log('Event type:', event.type);
    } catch (err: any) {
        console.log('Signature verification failed:', err.message);
        return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
    }

    try {
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(process.env.MONGODB_URI!);
        }

        if (event.type === 'invoice.paid') {
            const invoice = event.data.object as any;
            console.log('invoice.paid - customer:', invoice.customer);

            const updated = await User.findOneAndUpdate(
                { stripeCustomerId: invoice.customer },
                { $set: { plan: 'pro', cancelAtPeriodEnd: false } },
                { returnDocument: 'after' }
            );
            console.log('invoice.paid - updated:', updated?.username, updated?.plan);
        }

        if (event.type === 'customer.subscription.updated') {
            const subscription = event.data.object as any;
            console.log('subscription.updated - status:', subscription.status);
            console.log('subscription.updated - customer:', subscription.customer);

            const latestSub = await stripe.subscriptions.retrieve(subscription.id);
            console.log('latest cancel_at_period_end:', latestSub.cancel_at_period_end);
            console.log('latest status:', latestSub.status);

            if (latestSub.cancel_at_period_end === true) {
                const updated = await User.findOneAndUpdate(
                    { stripeCustomerId: subscription.customer },
                    { $set: { cancelAtPeriodEnd: true } },
                    { returnDocument: 'after' }
                );
                console.log('Cancellation scheduled for:', updated?.username, 'cancelAtPeriodEnd:', updated?.cancelAtPeriodEnd);
            } else if (latestSub.status === 'active' && !latestSub.cancel_at_period_end) {
                const updated = await User.findOneAndUpdate(
                    { stripeCustomerId: subscription.customer },
                    { $set: { plan: 'pro', cancelAtPeriodEnd: false }},
                    { returnDocument: 'after' }
                );
                console.log('Subscription reactivated for:', updated?.username);
            }
        }

        if (event.type === 'customer.subscription.deleted') {
            const subscription = event.data.object as any;
            console.log('subscription.deleted - customer:', subscription.customer);

            const updated = await User.findOneAndUpdate(
                { stripeCustomerId: subscription.customer },
                { $set: { plan: 'free', cancelAtPeriodEnd: false }},
                { returnDocument: 'after' }
            );
            console.log('Plan set to free for:', updated?.username);
        }

        if (event.type === 'customer.subscription.trial_will_end') {
            const subscription = event.data.object as any;
            console.log('Trial ending soon for:', subscription.customer);
        }

        if (event.type === 'customer.subscription.created') {
            const subscription = event.data.object as any;
            console.log('subscription.created - status:', subscription.status);

            if (subscription.status === 'trialing') {
                const updated = await User.findOneAndUpdate(
                    { stripeCustomerId: subscription.customer },
                    { $set: { plan: 'pro', trialEnd: new Date(subscription.trial_end * 1000), hasHadTrial: true } },
                    { returnDocument: 'after' }
                );
                console.log('Trial started for:', updated?.username);
            }
        }
    } catch (err: any) {
        console.log('Database error:', err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }

    return NextResponse.json({ received: true });
}