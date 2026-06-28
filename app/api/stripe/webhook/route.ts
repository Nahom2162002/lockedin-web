import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import mongoose from 'mongoose';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    console.log('WEBHOOK HIT - method:', req.method, 'time:', new Date().toISOString());

    const body = await req.text();    
    const sig = req.headers.get('stripe-signature');

    console.log('Signature present:', !!sig);
    console.log('Webhook secret present:', !!process.env.STRIPE_WEBHOOK_SECRET);

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
                { $set: { plan: 'pro' } },
                { returnDocument: 'after' }
            );
            console.log('invoice.paid - updated:', updated?.username, 'plan:', updated?.plan);
        }

        if (event.type === 'customer.subscription.updated') {
            const subscription = event.data.object as any;
            console.log('subscription.updated - status:', subscription.status);
            console.log('subscription.updated - customer:', subscription.customer);

            if (subscription.status === 'canceled') {
                const updated = await User.findOneAndUpdate(
                    { stripeCustomerId: subscription.customer },
                    { $set: { plan: 'free' } },
                    { returnDocument: 'after' }
                );
                console.log('Plan set to free for:', updated?.username);
            }
        }
    } catch (err: any) {
        console.log('Database error:', err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }

    return NextResponse.json({ received: true });
}