import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcrypt';
import { validatePassword } from '@/lib/passwordValidator';

export async function POST(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    await connectDB();
    const { password } = await req.json();
    const { token } = params;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 });
    }

    for (const oldPassword of user.passwordHistory) {
      const isSame = await bcrypt.compare(password, oldPassword);
      if (isSame) {
        return NextResponse.json({ error: 'New password cannot be the same as a previously used password' }, { status: 400 });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.passwordHistory = [...user.passwordHistory, user.password];
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return NextResponse.json({ message: 'Password reset successful!' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}