import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: NextRequest) {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature')!;

    if (!sig) {
        return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

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

    try {
        await connectDB();

        if (event.type === 'invoice.paid') {
            const invoice = event.data.object as any;
            await User.findOneAndUpdate(
                { stripeCustomerId: invoice.customer },
                { plan: 'pro' },
                { new: true }
            );
        }

        if (event.type === 'customer.subscription.deleted') {
            const subscription = event.data.object as any;
            await User.findOneAndUpdate(
                { stripeCustomerId: subscription.customer },
                { plan: 'free' },
                { new: true }
            );
        }
    } catch (err: any) {
        console.log('Database error:', err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }

    return NextResponse.json({ received: true });
}