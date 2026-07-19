import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { getUserFromRequest } from '@/lib/auth';
import KeywordBlock from '@/models/KeywordBlock';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const user = await getUserFromRequest(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
        if (user.plan !== 'pro') return NextResponse.json({ error: 'Pro plan required' }, { status: 403, headers: corsHeaders });

        const { id } = await params;
        const existing = await KeywordBlock.findOne({ _id: id, userId: user._id });
        if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404, headers: corsHeaders });

        const { startTime, endTime, days, strictMode } = await req.json();

        if (!startTime || !endTime || !days || days.length === 0) {
            return NextResponse.json({ error: 'Please fill in all fields and select at least one day' }, { status: 400, headers: corsHeaders });
        }
        if (endTime <= startTime) {
            return NextResponse.json({ error: 'End time must be after start time' }, { status: 400, headers: corsHeaders });
        }

        const updated = await KeywordBlock.findByIdAndUpdate(
            id,
            { startTime, endTime, days, strictMode: strictMode ?? null },
            { returnDocument: 'after' }
        );

        return NextResponse.json(updated, { headers: corsHeaders });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const user = await getUserFromRequest(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
        if (user.plan !== 'pro') return NextResponse.json({ error: 'Pro plan required' }, { status: 403, headers: corsHeaders });

        const { id } = await params;
        const existing = await KeywordBlock.findOne({ _id: id, userId: user._id });
        if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404, headers: corsHeaders });

        await KeywordBlock.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Keyword deleted!' }, { headers: corsHeaders });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
    }
}