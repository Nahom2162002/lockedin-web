import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { getUserFromRequest } from '@/lib/auth';
import Website from '@/models/Website';
import RecurringBlock from '@/models/RecurringBlock';

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

        const { urls, startTime, endTime, scheduleType, dateCreated, days, strictMode } = await req.json();

        if (!urls || !startTime || !endTime || !scheduleType) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400, headers: corsHeaders });
        }

        if (scheduleType === 'one-time') {
            if (!dateCreated) {
                return NextResponse.json({ error: 'Date is required for one-time blocks' }, { status: 400, headers: corsHeaders });
            }

            const blocks = urls.map((url: string) => ({
                userId: user._id,
                url,
                dateCreated: new Date(dateCreated),
                startTime,
                endTime,
                strictMode: strictMode ?? null
            }));

            await Website.insertMany(blocks);
            return NextResponse.json({ message: `${urls.length} sites blocked!` }, { headers: corsHeaders });
        }

        if (scheduleType === 'recurring') {
            if (!days || days.length === 0) {
                return NextResponse.json({ error: 'Days are required for recurring blocks' }, { status: 400, headers: corsHeaders });
            }

            const blocks = urls.map((url: string) => ({
                userId: user._id,
                url,
                startTime,
                endTime,
                days,
                active: true,
                strictMode: strictMode ?? null
            }));

            await RecurringBlock.insertMany(blocks);
            return NextResponse.json({ message: `${urls.length} sites blocked!` }, { headers: corsHeaders });
        }

        return NextResponse.json({ error: 'Invalid schedule type' }, { status: 400, headers: corsHeaders });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
    }
}