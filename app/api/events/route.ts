import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongo";
import Event from "@/models/Event";

export async function GET() {
    try {
        await connectToDB();
        const events = await Event.find().sort({ createdAt: -1 });
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
        console.log(data)
        const created = await Event.create(data);
        return NextResponse.json(created, { status: 201 });
    } catch (error) {
        console.error("POST /api/events error:", error);
        return NextResponse.json(
            { message: "Failed to create event", error: (error as Error).message },
            { status: 500 }
        );
    }
}
