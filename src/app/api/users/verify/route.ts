import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { cookies } from "next/headers";
import { decodeJwt } from "jose";

interface JWTPayload {
  registrationNumber?: string;
  orgRole?: string;
  department?: string;
  isAdmin?: boolean;
  [key: string]: unknown;
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const userId = url.searchParams.get("id");
    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
    }
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized: No token provided" }, { status: 401 });
    }
    let userRole = "";
    let userDepartment = "";
    try {
      const decoded = decodeJwt<JWTPayload>(token);
      userRole = decoded.orgRole as string;
      userDepartment = decoded.department as string;
    } catch {
      return NextResponse.json({ success: false, message: "Unauthorized: Invalid token" }, { status: 401 });
    }
    const isExecutive = ["chairperson", "vice chairperson", "general secretary", "treasurer"].includes(userRole);
    if (!isExecutive) {
      return NextResponse.json({ success: false, message: "You don't have permission to verify users. Only department executives may verify members." }, { status: 403 });
    }
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }
    if (user.department !== userDepartment) {
      return NextResponse.json({ success: false, message: "You can only verify users in your department" }, { status: 403 });
    }
    user.verifiedByPresident = true;
    if (["lead", "deputy lead"].includes(user.orgRole)) {
      user.isCoreCommittee = true;
    }
    await user.save();
    return NextResponse.json({ success: true, message: "User verified successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to verify user", error: String(error) }, { status: 500 });
  }
}
