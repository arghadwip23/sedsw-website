import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Image from "@/models/Image";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    await connectDB();

    // Parse query params
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Event ID is required" },
        { status: 400 }
      );
    }

    // Convert string id to ObjectId
    const eventId = new mongoose.Types.ObjectId(id);

    // Fetch all images linked to this eventId, sorted by "order"
    const images = await Image.find({ eventId })
      .sort({ order: 1 })
      .lean();

    if (!images || images.length === 0) {
      return NextResponse.json(
        { success: false, message: "No images found for this event" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: images });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
