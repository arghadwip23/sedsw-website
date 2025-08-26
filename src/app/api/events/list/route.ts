import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/models/Event";

export async function GET() {
  try {
    await connectDB();

    // Only pick the fields you want
    const events = await Event.find()
      .select("eventName date location category thumbnail _id")
      .sort({ createdAt: -1 }) // newest first
      .lean();

    return NextResponse.json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error: unknown) {
    console.error("Error fetching events:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
