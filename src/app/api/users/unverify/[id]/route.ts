// src/app/api/users/unverify/[id]/route.ts
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

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    // Verify the user is authenticated and get their role
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    let userRole = "";
    let userDepartment = "";
    let isAdmin = false;

    try {
      const decoded = decodeJwt<JWTPayload>(token);
      userRole = decoded.orgRole as string;
      userDepartment = decoded.department as string;
      isAdmin = decoded.isAdmin === true;
    } catch (error) {
      console.error("JWT decode error:", error);
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    // Check if user has permission to unverify users
    const isExecutive = ["chairperson", "vice chairperson", "general secretary", "treasurer"].includes(userRole);

    // Enforce: only department executives may unverify users (admins are NOT allowed per new policy)
    if (!isExecutive) {
      return NextResponse.json(
        { success: false, message: "You don't have permission to unverify users. Only department executives may unverify members." },
        { status: 403 }
      );
    }

    // Get the user ID from the URL
    const userId = params.id;

    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Department executives can only unverify users in their department
    if (user.department !== userDepartment) {
      return NextResponse.json(
        { success: false, message: "You can only unverify users in your department" },
        { status: 403 }
      );
    }

    // Update the user's verification status
    user.verifiedByPresident = false;
    
    // If they're no longer verified, they can't be core committee members
    if (!["chairperson", "vice chairperson", "general secretary", "treasurer"].includes(user.orgRole)) {
      user.isCoreCommittee = false;
    }

    await user.save();

    return NextResponse.json({
      success: true,
      message: "User unverified successfully",
    });
  } catch (error) {
    console.error("Error unverifying user:", error);
    return NextResponse.json(
      { success: false, message: "Failed to unverify user", error: String(error) },
      { status: 500 }
    );
  }
}
