// src/app/api/applications/approve/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import PendingApplicationModel from "@/models/PendingApplicationModel";
import User from "@/models/User";
import { decodeJwt } from "jose";

interface JWTPayload {
  registrationNumber?: string;
  orgRole?: string;
  department?: string;
  isAdmin?: boolean;
  isCoreCommittee?: boolean;
  [key: string]: unknown;
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { token, applicationId } = body;

    if (!token || !applicationId) {
      return NextResponse.json(
        { success: false, message: "Token and applicationId are required" },
        { status: 400 }
      );
    }

    let userRole = "";
    let userDepartment = "";
    let isCore = false;

    try {
      const decoded = decodeJwt<JWTPayload>(token);
      userRole = decoded.orgRole as string;
      userDepartment = decoded.department as string;
      isCore = decoded.isCoreCommittee === true;
  } catch {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    if (!isCore) {
      return NextResponse.json(
        { success: false, message: "Only core committee members may approve applications." },
        { status: 403 }
      );
    }

    const application = await PendingApplicationModel.findById(applicationId);
    if (!application) {
      return NextResponse.json(
        { success: false, message: "Application not found" },
        { status: 404 }
      );
    }

    if (userRole === "lead" && application.primaryDepartment !== userDepartment) {
      return NextResponse.json(
        { success: false, message: "You can only approve applications for your department" },
        { status: 403 }
      );
    }

    const formatPhoneNumber = (phone: string): string => {
      const cleaned = phone.replace(/[^-\u007F]+/g, "");
      const digits = cleaned.replace(/\D/g, "");
      if (digits.length < 7) {
        return digits + "0".repeat(7 - digits.length);
      }
      return cleaned;
    };

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
      return NextResponse.json(
        { success: false, message: "Failed to create user from application", error: String(saveError) },
        { status: 500 }
      );
    }

    await PendingApplicationModel.findByIdAndDelete(applicationId);

    return NextResponse.json({ success: true, message: "Application approved successfully" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to approve application", error: String(error) },
      { status: 500 }
    );
  }
}
