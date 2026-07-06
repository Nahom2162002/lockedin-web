import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { getUserFromRequest } from '@/lib/auth';
import RecurringBlock from '@/models/RecurringBlock';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const user = await getUserFromRequest(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
        if (user.plan !== 'pro') return NextResponse.json({ error: 'Pro plan required' }, { status: 403, headers: corsHeaders });

        const blocks = await RecurringBlock.find({ userId: user._id });
        return NextResponse.json(blocks, { headers: corsHeaders });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const user = await getUserFromRequest(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
        if (user.plan !== 'pro') return NextResponse.json({ error: 'Pro plan required' }, { status: 403, headers: corsHeaders });

        const { url, startTime, endTime, days, strictMode } = await req.json();

        if (!url || !startTime || !endTime || !days || days.length === 0) {
            return NextResponse.json({ error: 'Please fill in all fields' }, { status: 400, headers: corsHeaders });
        }

        if (endTime <= startTime) {
            return NextResponse.json({ error: 'End time must be after start time' }, { status: 400, headers: corsHeaders });
        }

        const block = new RecurringBlock({
            userId: user._id,
            url,
            startTime,
            endTime,
            days,
            active: true,
            strictMode: strictMode ?? null
        });
        await block.save();

        return NextResponse.json({ message: 'Recurring block created!', block }, { headers: corsHeaders });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
    }
}