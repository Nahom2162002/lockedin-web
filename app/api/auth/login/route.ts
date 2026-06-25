import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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
    const { username, password } = await req.json();

    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 400, headers: corsHeaders });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 400, headers: corsHeaders });
    }

    const token = jwt.sign(
        { userId: user._id.toString() },
        process.env.JWT_SECRET!,
        { expiresIn: '30d' } 
    );

    return NextResponse.json({ message: 'Login successful!', token });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
  }
}