import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongo";
import Event from "@/models/Event";

export async function GET() {
  try {
    await connectToDB();
    const events = await Event.find({ isActive: true }).sort({ createdAt: -1 });
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
      organizerWallet: data.organizerWallet,
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
