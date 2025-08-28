import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import users from "@/models/User"; // adjust path
import { ApiResponse } from "@/types/response"; // wherever you put ApiResponse

export async function GET() {
  try {
    // Connect to database first
    await connectDB();
    
    // Fetch users from the database with timeout and strip out password field
    const userDocs = await users.find().lean().maxTimeMS(8000); // 8 second timeout
    const safeUsers = userDocs.map((user) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = user;
      return rest;
    });

    const response: ApiResponse<typeof safeUsers> = {
      success: true,
      message: "Users fetched successfully",
      data: safeUsers,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: unknown) {
    const response: ApiResponse = {
      success: false,
      message: "Failed to fetch users",
      error: error instanceof Error ? error.message : "Unknown error",
    };

    return NextResponse.json(response, { status: 500 });
  }
}
