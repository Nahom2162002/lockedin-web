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

const MAX_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000;

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

        if (user.uninstallPasswordLockedUntil && user.uninstallPasswordLockedUntil.getTime() > Date.now()) {
            const retryAfterSeconds = Math.ceil((user.uninstallPasswordLockedUntil.getTime() - Date.now()) / 1000);
            return NextResponse.json(
                { valid: false, locked: true, error: 'Too many attempts. Try again later.', retryAfterSeconds },
                { status: 429, headers: corsHeaders }
            );
        }

        const valid = await bcrypt.compare(password, user.uninstallPassword);

        if (valid) {
            await User.findByIdAndUpdate(user._id, { uninstallPasswordAttempts: 0, uninstallPasswordLockedUntil: null });
        } else {
            const attempts = (user.uninstallPasswordAttempts || 0) + 1;
            if (attempts >= MAX_ATTEMPTS) {
                await User.findByIdAndUpdate(user._id, {
                    uninstallPasswordAttempts: 0,
                    uninstallPasswordLockedUntil: new Date(Date.now() + LOCK_DURATION_MS)
                });
            } else {
                await User.findByIdAndUpdate(user._id, { uninstallPasswordAttempts: attempts });
            }
        }

        return NextResponse.json({ valid }, { headers: corsHeaders });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
    }
}

// Remove uninstall password — intentionally NOT plan-gated. Requiring pro here would
// permanently trap a user who set this while on Pro and later downgraded: they'd have
// no way to ever turn it off again, since the only UI path to this endpoint is here.
export async function DELETE(req: NextRequest) {
    try {
        await connectDB();
        const user = await getUserFromRequest(req);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });

        await User.findByIdAndUpdate(user._id, {
            uninstallPassword: null,
            uninstallPasswordAttempts: 0,
            uninstallPasswordLockedUntil: null
        });
        return NextResponse.json({ message: 'Uninstall password removed!' }, { headers: corsHeaders });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
    }
}