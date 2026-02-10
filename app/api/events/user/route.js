import dbConnect from '../../../../lib/mongodb';
import Event from '../../../../models/Event';
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();

    // Auth check
    const cookieStore = cookies();
    const token = cookieStore.get('token');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret');
    const { payload } = await jwtVerify(token.value, secret);
    
    const events = await Event.find({ creatorId: payload.id }).sort({ createdAt: -1 });
    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching user events:", error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}
