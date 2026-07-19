import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { getUserFromRequest } from '@/lib/auth';
import User from '@/models/User';
import bcrypt from 'bcrypt';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: corsHeaders });
}

// Set or update uninstall password
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const user = await getUserFromRequest(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
        if (user.plan !== 'pro') return NextResponse.json({ error: 'Pro plan required' }, { status: 403, headers: corsHeaders });

        const { password } = await req.json();

        if (!password || password.length < 4) {
            return NextResponse.json({ error: 'Password must be at least 4 characters' }, { status: 400, headers: corsHeaders });
        }

        const hashed = await bcrypt.hash(password, 10);
        await User.findByIdAndUpdate(user._id, { uninstallPassword: hashed });

        return NextResponse.json({ message: 'Uninstall password set!' }, { headers: corsHeaders });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
    }
}

// Verify uninstall password
export async function PUT(req: NextRequest) {
    try {
        await connectDB();
        const user = await getUserFromRequest(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });

        const { password } = await req.json();

        if (!user.uninstallPassword) {
            return NextResponse.json({ valid: true }, { headers: corsHeaders });
        }

        const valid = await bcrypt.compare(password, user.uninstallPassword);
        return NextResponse.json({ valid }, { headers: corsHeaders });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
    }
}

// Remove uninstall password
export async function DELETE(req: NextRequest) {
    try {
        await connectDB();
        const user = await getUserFromRequest(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
        if (user.plan !== 'pro') return NextResponse.json({ error: 'Pro plan required' }, { status: 403, headers: corsHeaders });

        await User.findByIdAndUpdate(user._id, { uninstallPassword: null });
        return NextResponse.json({ message: 'Uninstall password removed!' }, { headers: corsHeaders });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
    }
}