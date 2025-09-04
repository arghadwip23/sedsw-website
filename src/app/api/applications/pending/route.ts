// src/app/api/applications/pending/route.ts
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

export async function GET(req: NextRequest) {
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

    // Check if user has permission to see applications
    const isExecutive = ["chairperson", "vice chairperson", "general secretary", "treasurer"].includes(userRole);
    const isLead = userRole === "lead";

    if (!isAdmin && !isExecutive && !isLead) {
      return NextResponse.json(
        { success: false, message: "You don't have permission to view applications" },
        { status: 403 }
      );
    }

    // Get requested department from query params
    const url = new URL(req.url);
    const departmentParam = url.searchParams.get("department");

    // Determine which applications to fetch based on user role and department
    let query = {};

    if (isAdmin || isExecutive) {
      // Admins and executives can see all applications, or filter by department
      if (departmentParam && departmentParam !== "all") {
        query = { primaryDepartment: departmentParam };
      }
    } else if (isLead) {
      // Department leads can only see applications for their department
      query = { primaryDepartment: userDepartment };
    }

    const applications = await PendingApplicationModel.find(query).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      message: "Applications retrieved successfully",
      data: applications,
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch applications", error: String(error) },
      { status: 500 }
    );
  }
}
