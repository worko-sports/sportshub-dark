import dbConnect from '../../../lib/mongodb';
import Event from '../../../models/Event';
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

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
    
    const body = await req.json();
    const event = await Event.create({
      ...body,
      creatorId: userId
    });
    
    return NextResponse.json(event);
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
