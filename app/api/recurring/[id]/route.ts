import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { getUserFromRequest } from '@/lib/auth';
import RecurringBlock from '@/models/RecurringBlock';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const user = await getUserFromRequest(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
        if (user.plan !== 'pro') return NextResponse.json({ error: 'Pro plan required' }, { status: 403, headers: corsHeaders });

        const { id } = await params;
        const existing = await RecurringBlock.findOne({ _id: id, userid: user._id });
        if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404, headers: corsHeaders });

        const body = await req.json();
        const updated = await RecurringBlock.findByIdAndUpdate(
            id,
            { $set: body },
            { returnDocument: 'after' }
        );

        return NextResponse.json(updated, { headers: corsHeaders });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const user = await getUserFromRequest(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
        if (user.plan !== 'pro') return NextResponse.json({ error: 'Pro plan required' }, { status: 403, headers: corsHeaders });

        const { id } = await params;
        const existing = await RecurringBlock.findOne({ _id: id, userId: user._id });
        if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404, headers: corsHeaders });

        await RecurringBlock.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Recurring block deleted!' }, { headers: corsHeaders });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
    }
}