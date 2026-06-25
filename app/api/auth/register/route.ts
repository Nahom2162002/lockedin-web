import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcrypt';
import { validatePassword } from '@/lib/passwordValidator';

export { OPTIONS } from '@/lib/cors';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { username, email, password } = await req.json();

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json({ error: 'Account already exists' }, { status: 400 });
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 });
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
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}