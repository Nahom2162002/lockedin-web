import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: NextRequest) {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature')!;

    let event;
    try {
        event = stripe.webhooks.constructEvent(
            body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
    }

    await connectDB();

    switch (event.type) {
        case 'invoice.paid': {
            const session = event.data.object as any;
            await User.findOneAndUpdate(
                { stripeCustomerId: session.customer },
                { plan: 'pro' }
            );
            break;
        }
        case 'customer.subscription.deleted': {
            const subscription = event.data.object as any;
            await User.findOneAndUpdate(
                { stripeCustomerId: subscription.customer },
                { plan: 'free' }
            );
            break;
        }
    }

    return NextResponse.json({ received: true });
}