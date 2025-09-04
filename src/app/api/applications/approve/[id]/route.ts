// src/app/api/applications/approve/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import PendingApplicationModel from "@/models/PendingApplicationModel";
import User from "@/models/User";
import { cookies } from "next/headers";
import { decodeJwt } from "jose";

interface JWTPayload {
  registrationNumber?: string;
  orgRole?: string;
  department?: string;
  isAdmin?: boolean;
  isCoreCommittee?: boolean;
  [key: string]: unknown;
}

export async function POST(
  req: NextRequest,
  context: { params: { id: string } }
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

    // Check if user has permission to approve applications
    const payload: JWTPayload = decodeJwt<JWTPayload>(token);
    const isCore = payload?.isCoreCommittee === true;

    if (!isCore) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You don't have permission to approve applications. Only core committee members may approve.",
        },
        { status: 403 }
      );
    }

    // Get the application ID from the URL
    const applicationId = context.params.id;

    // Find the pending application
    const application = await PendingApplicationModel.findById(applicationId);

    if (!application) {
      return NextResponse.json(
        { success: false, message: "Application not found" },
        { status: 404 }
      );
    }

    // If the core committee member is a department lead, enforce department match
    if (userRole === "lead" && application.primaryDepartment !== userDepartment) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You can only approve applications for your department",
        },
        { status: 403 }
      );
    }

    // Format phone number
    const formatPhoneNumber = (phone: string): string => {
      const cleaned = phone.replace(/[^\d+\-\s()]/g, "");
      const digits = cleaned.replace(/\D/g, "");
      if (digits.length < 7) {
        return digits + "0".repeat(7 - digits.length);
      }
      return cleaned;
    };

    // Create a new user
    const newUser = new User({
      name: application.fullName,
      registrationNumber: application.registrationNumber,
      email: application.email,
      phoneNumber: formatPhoneNumber(application.phone),
      department: application.primaryDepartment,
      orgRole: "member",
      isCoreCommittee: false,
      verifiedByPresident: false,
      isAdmin: false,
      password: `SEDS${Math.floor(10000 + Math.random() * 90000)}`,
    });

    try {
      await newUser.save();
    } catch (saveError) {
      console.error("Failed to save new user:", saveError);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to create user from application",
          error: String(saveError),
          userData: {
            name: newUser.name,
            email: newUser.email,
            phoneNumber: newUser.phoneNumber,
            department: newUser.department,
          },
        },
        { status: 500 }
      );
    }

    // Delete the pending application
    await PendingApplicationModel.findByIdAndDelete(applicationId);

    // TODO: Send email notification

    return NextResponse.json({
      success: true,
      message: "Application approved successfully",
    });
  } catch (error) {
    console.error("Error approving application:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to approve application",
        error: String(error),
      },
      { status: 500 }
    );
  }
}
