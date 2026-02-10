import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get('token');

  if (!token) {
    return NextResponse.json({ user: null });
  }

  try {
    await dbConnect();
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret');
    const { payload } = await jwtVerify(token.value, secret);

    const user = await User.findById(payload.id).select('name email');

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ user: null });
  }
}
