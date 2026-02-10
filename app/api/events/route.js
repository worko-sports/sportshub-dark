import dbConnect from '../../../lib/mongodb';
import Event from '../../../models/Event';
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const events = await Event.find({}).sort({ createdAt: -1 });
    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(req) {
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
    
    const body = await req.json();
    const event = await Event.create({
      ...body,
      creatorId: payload.id
    });
    
    return NextResponse.json(event);
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
