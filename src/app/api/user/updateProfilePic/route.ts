// app/api/user/updateProfilePic/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "supersecretkey");

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);

    const body = await req.json();
    const { profilePicture } = body;

    if (!profilePicture) {
      return NextResponse.json({ success: false, message: "No image provided" }, { status: 400 });
    }

    const user = await User.findByIdAndUpdate(
      payload.id,
      { profilePicture },
      { new: true }
    ).select("-password -__v");

    return NextResponse.json({ success: true, data: user });
  } catch (err: any) {
    console.error("Update ProfilePic Error:", err.message);
    return NextResponse.json(
      { success: false, message: "Something went wrong", error: err.message },
      { status: 500 }
    );
  }
}