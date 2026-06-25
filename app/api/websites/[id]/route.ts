import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { getUserFromRequest } from '@/lib/auth';
import Website from '@/models/Website';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    // Verify the website actually belongs to this user
    const existing = await Website.findOne({ _id: id, userId: user._id });
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const { url, dateCreated, startTime, endTime } = await req.json();
    const website = await Website.findByIdAndUpdate(
      id,
      { url, dateCreated: new Date(dateCreated), startTime, endTime },
      { new: true }
    );

    return NextResponse.json(website);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    // Verify ownership before deleting
    const existing = await Website.findOne({ _id: id, userId: user._id });
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await Website.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Website deleted!' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}