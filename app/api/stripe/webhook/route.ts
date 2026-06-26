import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: NextRequest) {
    console.log('Webhook endpoint hit');

    const body = await req.text();
    const sig = req.headers.get('stripe-signature')!;

    console.log('Stripe signature present:', !!sig);
    console.log('Webhook secret present:', !!process.env.STRIPE_WEBHOOK_SECRET);

    if (!sig) {
        console.log('No signature found');
        return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    let event;
    try {
        event = stripe.webhooks.constructEvent(
            body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
        console.log('Event constructed successfully:', event.type);
    } catch (err: any) {
        console.log('Webhook verification failed:', err.message);
        return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
    }

    await connectDB();

    switch (event.type) {
        case 'invoice.paid': {
            const invoice = event.data.object as any;
            console.log('invoice.paid - customer:', invoice.customer);
            const result = await User.findOneAndUpdate(
                { stripeCustomerId: invoice.customer },
                { plan: 'pro' }
            );
            console.log('invoice.paid update result:', result);
            break;
        }
        case 'customer.subscription.deleted': {
            const subscription = event.data.object as any;
            console.log('subscription.deleted - customer:', subscription.customer);

            const user = await User.findOne({ stripeCustomerId: subscription.customer });
            console.log('user found:', user);

            const result = await User.findOneAndUpdate(
                { stripeCustomerId: subscription.customer },
                { plan: 'free' }
            );
            console.log('subscription.deleted update result:', result);
            break;
        }
    }

    return NextResponse.json({ received: true });
}