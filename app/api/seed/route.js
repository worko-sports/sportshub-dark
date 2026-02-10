import dbConnect from '../../../lib/mongodb';
import Event from '../../../models/Event';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    // Clear existing events to ensure clean seed with fixed URLs
    // await Event.deleteMany({});
    
    const count = await Event.countDocuments();
    if (count > 0) {
      return NextResponse.json({ message: 'Already seeded' });
    }

    const events = [
      {
        title: "Inter-College Football Cup",
        sport: "Football",
        city: "Mumbai",
        start: "2024-04-15",
        type: "Team",
        fee: 500,
        prize: "₹50,000",
        banner: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80",
        org: "Mumbai University Sports"
      },
      {
        title: "City Marathon 2024",
        sport: "Athletics",
        city: "Delhi",
        start: "2024-05-20",
        type: "Individual",
        fee: 200,
        prize: "₹25,000",
        banner: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80",
        org: "Delhi Runners Club"
      },
      {
        title: "Badminton Open",
        sport: "Badminton",
        city: "Bangalore",
        start: "2024-06-10",
        type: "Individual",
        fee: 300,
        prize: "₹15,000",
        banner: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80",
        org: "Karnataka Badminton Assoc"
      }
    ];
    
     await Event.insertMany(events);

    return NextResponse.json({ message: 'Seeding successful' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
