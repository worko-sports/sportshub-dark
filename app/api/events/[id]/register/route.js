import dbConnect from '../../../../../lib/mongodb';
import Event from '../../../../../models/Event';
import Registration from '../../../../../models/Registration';
import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
  try {
    await dbConnect();
    const body = await request.json();
    const eventId = params.id;
    
    // Validate event exists
    const event = await Event.findById(eventId);

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const registration = await Registration.create({
      eventId,
      name: body.name,
      email: body.email,
      phone: body.phone,
      transactionId: body.transactionId,
      paymentScreenshot: body.paymentScreenshot,
      answers: body.answers,
    });

    return NextResponse.json(registration);
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
