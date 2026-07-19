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

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const user = await getUserFromRequest(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
        if (user.plan !== 'pro') return NextResponse.json({ error: 'Pro plan required' }, { status: 403, headers: corsHeaders });

        const keywords = await KeywordBlock.find({ userId: user._id });
        return NextResponse.json(keywords, { headers: corsHeaders });
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

        const { keyword } = await req.json();

        if (!keyword || keyword.trim().length === 0) {
            return NextResponse.json({ error: 'Keyword is required' }, { status: 400, headers: corsHeaders });
        }

        // Check for duplicate
        const existing = await KeywordBlock.findOne({
            userId: user._id,
            keyword: keyword.trim().toLowerCase()
        });
        if (existing) {
            return NextResponse.json({ error: 'Keyword already exists' }, { status: 400, headers: corsHeaders });
        }

        const block = new KeywordBlock({
            userId: user._id,
            keyword: keyword.trim().toLowerCase()
        });
        await block.save();

        return NextResponse.json({ message: 'Keyword added!', block }, { headers: corsHeaders });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
    }
}