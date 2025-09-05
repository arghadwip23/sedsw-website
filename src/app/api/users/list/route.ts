// src/app/api/users/list/route.ts
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
  let isAdmin = false;

    try {
      const decoded = decodeJwt<JWTPayload>(token);
  userRole = decoded.orgRole as string;
      isAdmin = decoded.isAdmin === true;
    } catch (error) {
      console.error("JWT decode error:", error);
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    // Check if user has permission to see users
    const isExecutive = ["chairperson", "vice chairperson", "general secretary", "treasurer"].includes(userRole);
    
    if (!isAdmin && !isExecutive) {
      return NextResponse.json(
        { success: false, message: "You don't have permission to view users" },
        { status: 403 }
      );
    }

    // Get query parameters
    const url = new URL(req.url);
    const departmentParam = url.searchParams.get("department");
    const verifiedParam = url.searchParams.get("verified");
    
  // Build the query
  const query: Record<string, unknown> = {};
    
    // Filter by department if provided
    if (departmentParam && departmentParam !== "all") {
      query.department = departmentParam;
    }
    
    // Filter by verification status if provided
    if (verifiedParam === "true") {
      query.verifiedByPresident = true;
    } else if (verifiedParam === "false") {
      query.verifiedByPresident = false;
    }
    
    // Define fields to return (exclude password)
    const projection = {
      password: 0,
    };

    // Fetch users based on query
    const users = await User.find(query, projection).sort({ department: 1, orgRole: 1 });

    return NextResponse.json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch users", error: String(error) },
      { status: 500 }
    );
  }
}
