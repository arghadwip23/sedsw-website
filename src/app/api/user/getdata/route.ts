// app/api/user/getdata/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "supersecretkey");

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // 1️⃣ Get token from cookies
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    // 2️⃣ Verify token
    const { payload } = await jwtVerify(token, JWT_SECRET);

    // 3️⃣ Fetch user
    const user = await User.findById(payload.id).select(
      "-password -__v" // exclude sensitive fields
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (err: any) {
    console.error("GetData Error:", err.message);
    return NextResponse.json(
      { success: false, message: "Invalid or expired token", error: err.message },
      { status: 401 }
    );
  }
}
