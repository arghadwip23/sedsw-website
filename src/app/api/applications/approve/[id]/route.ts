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

    // Check if user has permission to approve applications
    const isExecutive = ["chairperson", "vice chairperson", "general secretary", "treasurer"].includes(userRole);
    const isLead = userRole === "lead";

    if (!isAdmin && !isExecutive && !isLead) {
      return NextResponse.json(
        { success: false, message: "You don't have permission to approve applications" },
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

    // Department leads can only approve applications for their department
    if (isLead && !isAdmin && !isExecutive && application.primaryDepartment !== userDepartment) {
      return NextResponse.json(
        { success: false, message: "You can only approve applications for your department" },
        { status: 403 }
      );
    }

    // Format phone number to ensure it matches the required format
    const formatPhoneNumber = (phone: string): string => {
      // Remove any characters that don't match the validation pattern
      const cleaned = phone.replace(/[^\d+\-\s()]/g, '');
      
      // Ensure it has at least 7 digits
      const digits = cleaned.replace(/\D/g, '');
      if (digits.length < 7) {
        // If not enough digits, add placeholder digits
        return digits + '0'.repeat(7 - digits.length);
      }
      
      return cleaned;
    };

    // Create a new user from the application data
    const newUser = new User({
      name: application.fullName,
      registrationNumber: application.registrationNumber,
      email: application.email,
      phoneNumber: formatPhoneNumber(application.phone),
      department: application.primaryDepartment,
      orgRole: "member", // Default role for new members
      isCoreCommittee: false,
      verifiedByPresident: false,
      isAdmin: false,
      // Generate a more readable temporary password (should be changed by the user)
      password: `SEDS${Math.floor(10000 + Math.random() * 90000)}`,
    });

    try {
      await newUser.save();
    } catch (saveError) {
      console.error("Failed to save new user:", saveError);
      // Return detailed error for debugging
      return NextResponse.json(
        { 
          success: false, 
          message: "Failed to create user from application",
          error: String(saveError),
          userData: {
            name: newUser.name,
            email: newUser.email,
            phoneNumber: newUser.phoneNumber,
            department: newUser.department
          }
        },
        { status: 500 }
      );
    }

    // Delete the pending application
    await PendingApplicationModel.findByIdAndDelete(applicationId);

    // Send an email to the user informing them that their application was approved
    // TODO: Implement email sending

    return NextResponse.json({
      success: true,
      message: "Application approved successfully",
    });
  } catch (error) {
    console.error("Error approving application:", error);
    return NextResponse.json(
      { success: false, message: "Failed to approve application", error: String(error) },
      { status: 500 }
    );
  }
}
