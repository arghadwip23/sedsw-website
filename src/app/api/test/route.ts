import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ message: "✅ MongoDB connected successfully!" });
  } catch (error) {
    return NextResponse.json({ error: "❌ Failed to connect" }, { status: 500 });
  }
}
