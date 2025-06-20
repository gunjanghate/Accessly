import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongo";
import Event from "@/models/Event";

export async function GET(
  request: NextRequest
) {
  try {
    await connectToDB();
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();
    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("GET /api/events/[id] error:", error);
    return NextResponse.json(
      { message: "Failed to fetch event", error: (error as Error).message },
      { status: 500 }
    );
  }
}
