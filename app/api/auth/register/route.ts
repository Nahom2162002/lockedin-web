import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcrypt';
import { validatePassword } from '@/lib/passwordValidator';

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
    const { username, email, password } = await req.json();

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json({ error: 'Account already exists' }, { status: 400, headers: corsHeaders });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return NextResponse.json({ error: 'A user account with this email already exists' }, { status: 400, headers: corsHeaders });
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400, headers: corsHeaders });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword,
      passwordHistory: [hashedPassword]
    });
    await user.save();

    return NextResponse.json({ message: 'Account created!', userId: user._id });
  } catch (err: any) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern ?? {})[0];
      const message = field === 'email'
        ? 'A user account with this email already exists'
        : field === 'username'
          ? 'Account already exists'
          : 'A user account with these details already exists';
      return NextResponse.json({ error: message }, { status: 400, headers: corsHeaders });
    }
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders });
  }
}