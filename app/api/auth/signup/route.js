import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    await dbConnect();
    const { name, email, password } = await req.json();

    // Input Validation
    if (!name || name.length < 2) {
      return NextResponse.json({ error: 'Name must be at least 2 characters' }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }
    if (!password || password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret');
    const token = await new SignJWT({ id: user._id.toString(), email: user.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(secret);

    cookies().set('token', token, { httpOnly: true, path: '/' });

    return NextResponse.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Signup failed' }, { status: 500 });
  }
}
