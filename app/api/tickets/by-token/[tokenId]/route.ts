import { connectToDB } from "@/lib/mongo";
import Ticket from "@/models/Ticket";
import { NextResponse } from "next/server";

export async function GET(_: Request, context: { params: Promise<{ tokenId: string }> }) {
  try {
    await connectToDB();
    
    // Await the params since they're now a Promise in Next.js 15
    const { tokenId } = await context.params;
    
    const ticket = await Ticket.findOne({ tokenId: parseInt(tokenId) });

    if (!ticket) {
      return NextResponse.json({ message: "Ticket not found" }, { status: 404 });
    }

    return NextResponse.json(ticket);
  } catch (err: unknown) {
    console.error("GET /api/tickets/by-token/:tokenId error:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ message: "Server error", error: errorMessage }, { status: 500 });
  }
}