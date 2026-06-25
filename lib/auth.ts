import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from './mongodb';
import User from '@/models/User';

export async function getUserFromRequest(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    await connectDB();
    const user = await User.findById(decoded.userId);
    
    return user || null;
  } catch {
    return null;
  }
}