// src/app/api/applications/reject/[id]/route.ts
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

    // Check if user has permission to reject applications
    const isExecutive = ["chairperson", "vice chairperson", "general secretary", "treasurer"].includes(userRole);
    const isLead = userRole === "lead";

    if (!isAdmin && !isExecutive && !isLead) {
      return NextResponse.json(
        { success: false, message: "You don't have permission to reject applications" },
        { status: 403 }
      );
    }

    // Get the application ID from the URL
    const applicationId = params.id;

    // Find the pending application
    const application = await PendingApplicationModel.findById(applicationId);

    if (!application) {
      return NextResponse.json(
        { success: false, message: "Application not found" },
        { status: 404 }
      );
    }

    // Department leads can only reject applications for their department
    if (isLead && !isAdmin && !isExecutive && application.primaryDepartment !== userDepartment) {
      return NextResponse.json(
        { success: false, message: "You can only reject applications for your department" },
        { status: 403 }
      );
    }

    // Delete the pending application
    await PendingApplicationModel.findByIdAndDelete(applicationId);

    // Send an email to the user informing them that their application was rejected
    // TODO: Implement email sending

    return NextResponse.json({
      success: true,
      message: "Application rejected successfully",
    });
  } catch (error) {
    console.error("Error rejecting application:", error);
    return NextResponse.json(
      { success: false, message: "Failed to reject application", error: String(error) },
      { status: 500 }
    );
  }
}
