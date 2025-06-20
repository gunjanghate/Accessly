import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongo";
import Ticket from "@/models/Ticket";

export async function GET(req: NextRequest) {
  try {
    await connectToDB();
    const { searchParams } = new URL(req.url);
    const owner = searchParams.get("owner");
    const eventId = searchParams.get("eventId");

    const query: Record<string, unknown> = {};
    if (owner) query.ownerWallet = owner;
    if (eventId) query.eventId = eventId;

    const tickets = await Ticket.find(query).sort({ mintedAt: -1 });
    return NextResponse.json(tickets);
  } catch (error) {
    console.error("GET /api/tickets error:", error);
    return NextResponse.json(
      { message: "Failed to fetch tickets", error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const data = await req.json();

    const requiredFields = ["eventId", "tokenId", "tokenURI", "txHash", "ownerWallet"];
    const missing = requiredFields.filter((f) => !data[f]);

    if (missing.length > 0) {
      return NextResponse.json({ message: `Missing fields: ${missing.join(", ")}` }, { status: 400 });
    }

    const created = await Ticket.create(data);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("POST /api/tickets error:", error);
    return NextResponse.json(
      { message: "Failed to create ticket", error: (error as Error).message },
      { status: 500 }
    );
  }
}
