import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";

export async function GET() {
  await dbConnect();
  
  // 1. Check Custom Token
  const cookieStore = cookies();
  const token = cookieStore.get('token');

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret');
      const { payload } = await jwtVerify(token.value, secret);
      const user = await User.findById(payload.id).select('name email image');
      if (user) return NextResponse.json({ user });
    } catch (error) {
      // Token invalid, fall through
    }
  }

  // 2. Check NextAuth Session
  const session = await getServerSession(authOptions);
  if (session && session.user) {
    return NextResponse.json({ user: session.user });
  }

  return NextResponse.json({ user: null });
}
