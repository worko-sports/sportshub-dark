import dbConnect from '../../../../lib/mongodb';
import Event from '../../../../models/Event';
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const event = await Event.findById(params.id).populate('creatorId', 'name email');

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    let userId = null;

    // 1. Check Custom Token
    const cookieStore = cookies();
    const token = cookieStore.get('token');
    
    if (token) {
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret');
            const { payload } = await jwtVerify(token.value, secret);
            userId = payload.id;
        } catch (err) {
            // Token invalid
        }
    }

    // 2. Check NextAuth Session if no custom token valid
    if (!userId) {
        const session = await getServerSession(authOptions);
        if (session && session.user && session.user.id) {
            userId = session.user.id;
        }
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const event = await Event.findById(params.id);

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Ownership check
    if (!event.creatorId || event.creatorId.toString() !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await Event.findByIdAndDelete(params.id);

    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}

