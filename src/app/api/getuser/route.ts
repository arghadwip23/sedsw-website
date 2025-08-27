import { NextResponse } from "next/server";
import users from "@/models/User"; // adjust path
import { ApiResponse } from "@/types/response"; // wherever you put ApiResponse

export async function GET() {
  try {
    // Fetch users from the database and strip out password field
    const userDocs = await users.find().lean();
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
