import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongo";
import Event from "@/models/Event";

export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const organizer = searchParams.get("organizer");

    const query: Record<string, any> = { isActive: true };
    if (organizer) {
      query.organizerWallet = organizer.toLowerCase(); // normalize wallet casing
    }

    const events = await Event.find(query).sort({ createdAt: -1 });
    return NextResponse.json(events);
  } catch (error) {
    console.error("GET /api/events error:", error);
    return NextResponse.json(
      { message: "Failed to fetch events", error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const data = await req.json();

    const requiredFields = ["eventName", "date", "venue", "price", "organizerWallet"];
    const missing = requiredFields.filter((field) => !data[field]);

    if (missing.length > 0) {
      return NextResponse.json(
        { message: `Missing fields: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    const created = await Event.create({
      eventName: data.eventName,
      date: data.date,
      venue: data.venue,
      description: data.description || "",
      image: data.image || "",
      price: data.price,
      maxTickets: data.maxTickets || 50,
      mintedCount: 0,
      organizerWallet: data.organizerWallet.toLowerCase(), 
      verifiedOrganizer: true,
      isActive: true,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("POST /api/events error:", error);
    return NextResponse.json(
      { message: "Failed to create event", error: (error as Error).message },
      { status: 500 }
    );
  }
}
