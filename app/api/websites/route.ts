import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { getUserFromRequest } from '@/lib/auth';
import Website from '@/models/Website';

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

    // Auth check — missing in your original Express code
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
    }

    const websites = await Website.find({ userId: user._id });
    return NextResponse.json(websites, { headers: corsHeaders });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
    }

    if (user.plan === 'free') {
      const count = await Website.countDocuments({ userId: user._id });
      if (count >= 3) {
        return NextResponse.json({
          error: 'Free accounts are limited to 3 blocked websites. Upgrade to Pro for unlimited blocking.',
          limitReached: true 
        }, { status: 403, headers: corsHeaders });
      }
    }

    const { url, dateCreated, startTime, endTime, strictMode } = await req.json();
    const parsedDate = dateCreated ? new Date(dateCreated) : null;

    const website = new Website({
      userId: user._id,   
      url,
      dateCreated: parsedDate,
      startTime,
      endTime,
      strictMode: strictMode ?? null 
    });
    await website.save();

    return NextResponse.json({ message: 'Website added!', website });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
  }
}