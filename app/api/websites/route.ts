import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { getUserFromRequest } from '@/lib/auth';
import Website from '@/models/Website';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Auth check — missing in your original Express code
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const websites = await Website.find({ userId: user._id });
    return NextResponse.json(websites);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { url, dateCreated, startTime, endTime } = await req.json();
    const parsedDate = dateCreated ? new Date(dateCreated) : null;

    const website = new Website({
      userId: user._id,   // use verified user._id, not whatever was sent in the body
      url,
      dateCreated: parsedDate,
      startTime,
      endTime
    });
    await website.save();

    return NextResponse.json({ message: 'Website added!', website });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}