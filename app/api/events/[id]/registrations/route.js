import dbConnect from '../../../../../lib/mongodb';
import Event from '../../../../../models/Event';
import Registration from '../../../../../models/Registration';
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    // 1. Auth Check
    const cookieStore = cookies();
    const token = cookieStore.get('token');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret');
    const { payload } = await jwtVerify(token.value, secret);

    // 2. Fetch Event & Check Ownership
    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    if (event.creatorId && event.creatorId.toString() !== payload.id) {
      return NextResponse.json({ error: 'Forbidden: You are not the host of this event' }, { status: 403 });
    }

    // 3. Fetch Registrations
    const registrations = await Registration.find({ eventId: id }).sort({ createdAt: -1 });

    return NextResponse.json(registrations);
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
