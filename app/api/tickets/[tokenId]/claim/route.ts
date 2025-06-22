import { connectToDB } from "@/lib/mongo";
import Ticket from "@/models/Ticket";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, context: { params: Promise<{ tokenId: string }> })
 {
    try {
        console.log("PATCH request body:", await req.text());
        
        const { tokenId } = await context.params;
        await connectToDB();
    
    const ticket = await Ticket.findOneAndUpdate(
      { tokenId: parseInt(tokenId) },
      { isClaimed: true },
      { new: true }
    );

    if (!ticket) {
      return NextResponse.json({ message: "Ticket not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Ticket marked as claimed", ticket });
  } catch (err: unknown) {
    console.error("PATCH /api/tickets/:tokenId/claim error:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ message: "Server error", error: errorMessage }, { status: 500 });
  }
}