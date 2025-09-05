// src/app/api/applications/reject/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import PendingApplicationModel from "@/models/PendingApplicationModel";
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

    let decoded: JWTPayload | undefined;
    try {
      decoded = decodeJwt<JWTPayload>(token as string);
      userRole = decoded.orgRole as string;
      userDepartment = decoded.department as string;
    } catch (err) {
      console.error("JWT decode error:", err);
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    const isCore = decoded?.isCoreCommittee === true;

    if (!isCore) {
      return NextResponse.json(
        { success: false, message: "You don't have permission to reject applications. Only core committee members may reject." },
        { status: 403 }
      );
    }

    // Read applicationId from query string
    const url = new URL(req.url);
    const applicationId = url.searchParams.get("id");

    if (!applicationId) {
      return NextResponse.json({ success: false, message: "Application ID is required" }, { status: 400 });
    }

    // Find the pending application
    const application = await PendingApplicationModel.findById(applicationId);

    if (!application) {
      return NextResponse.json(
        { success: false, message: "Application not found" },
        { status: 404 }
      );
    }

    // If the core committee member is a department lead (role 'lead'), enforce department match
    if (userRole === 'lead' && application.primaryDepartment !== userDepartment) {
      return NextResponse.json(
        { success: false, message: "You can only reject applications for your department" },
        { status: 403 }
      );
    }

    // Delete the pending application
    await PendingApplicationModel.findByIdAndDelete(applicationId);

    // TODO: send rejection email notification

    return NextResponse.json({ success: true, message: "Application rejected successfully" });
  } catch (error) {
    console.error("Error rejecting application:", error);
    return NextResponse.json(
      { success: false, message: "Failed to reject application", error: String(error) },
      { status: 500 }
    );
  }
}
