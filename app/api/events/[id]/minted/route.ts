// import { connectToDB } from "@/lib/mongo";
// import Event from "@/models/Event";
// import { NextResponse } from "next/server";

// export async function PATCH(req: Request, context: { params: { id: string } }) {
//     const { params } = context;
//     try {
//         console.log("PATCH request received with params:", params);
//         console.log("Request body:", await req.text());
//         if (!params.id) {
//             return NextResponse.json({ message: "Missing event ID" }, { status: 400 });
//         }
//         console.log("Event ID:", params.id);

//         await connectToDB();
//         console.log("Connected to DB");

//         const updated = await Event.findByIdAndUpdate(
//             params.id,
//             { $inc: { mintedCount: 1 } },
//             { new: true }
//         );
//         console.log("Updated event:", updated);

//         return NextResponse.json(updated);
//     } catch (error) {
//         console.error("Error updating minted count:", error);
//         return NextResponse.json({ error: "Failed to update minted count" }, { status: 500 });
//     }
// }
import { connectToDB } from "@/lib/mongo";
import Event from "@/models/Event";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        // Await the params Promise
        const params = await context.params;
        
        console.log("PATCH request received with params:", params);
        console.log("Request body:", await req.text());
        
        if (!params.id) {
            return NextResponse.json({ message: "Missing event ID" }, { status: 400 });
        }
        console.log("Event ID:", params.id);

        await connectToDB();
        console.log("Connected to DB");

        const updated = await Event.findByIdAndUpdate(
            params.id,
            { $inc: { mintedCount: 1 } },
            { new: true }
        );
        console.log("Updated event:", updated);

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Error updating minted count:", error);
        return NextResponse.json({ error: "Failed to update minted count" }, { status: 500 });
    }
}