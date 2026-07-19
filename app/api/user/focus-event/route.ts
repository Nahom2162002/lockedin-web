import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { getUserFromRequest } from '@/lib/auth';
import FocusEvent from '@/models/FocusEvent';

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
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
        if (user.plan !== 'pro') return NextResponse.json({ error: 'Pro plan required' }, { status: 403, headers: corsHeaders });

        const { minutes, date } = await req.json();

        if (!minutes || typeof minutes !== 'number' || minutes <= 0) {
            return NextResponse.json({ error: 'Minutes must be a positive number' }, { status: 400, headers: corsHeaders });
        }
        if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return NextResponse.json({ error: 'Date must be in YYYY-MM-DD format' }, { status: 400, headers: corsHeaders });
        }

        const event = new FocusEvent({ userId: user._id, minutes, date });
        await event.save();

        return NextResponse.json({ message: 'Focus event recorded' }, { headers: corsHeaders });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
    }
}
