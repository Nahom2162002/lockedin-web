import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { getUserFromRequest } from '@/lib/auth';
import User from '@/models/User';

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

        return NextResponse.json({
            goals: user.goals || { dailyMinutes: 0, weeklyMinutes: 0 }
        }, { headers: corsHeaders });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
    }
}

export async function PUT(req: NextRequest) {
    try {
        await connectDB();
        const user = await getUserFromRequest(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
        if (user.plan !== 'pro') return NextResponse.json({ error: 'Pro plan required' }, { status: 403, headers: corsHeaders });

        const { dailyMinutes, weeklyMinutes } = await req.json();

        if (dailyMinutes < 0 || weeklyMinutes < 0) {
            return NextResponse.json({ error: 'Goals must be positive' }, { status: 400, headers: corsHeaders });
        }

        const updated = await User.findByIdAndUpdate(
            user._id,
            { $set: { 'goals.dailyMinutes': dailyMinutes, 'goals.weeklyMinutes': weeklyMinutes } },
            { returnDocument: 'after' }
        );

        return NextResponse.json({ goals: updated?.goals }, { headers: corsHeaders });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
    }
}