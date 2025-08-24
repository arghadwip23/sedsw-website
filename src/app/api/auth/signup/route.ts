import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { ApiResponse } from "@/types/response";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
   const {
  name,
  registrationNumber,
  email,
  phoneNumber,
  branch,
  password,
  department,   // ✅ accept from request
  orgRole,
  profilePicture
} = body;

    // 1️⃣ Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { registrationNumber }],
    });
    if (existingUser) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "User already exists with this email or registration number",
          error: "DUPLICATE_USER",
        },
        { status: 400 }
      );
    }

    // 2️⃣ Create new user (password gets hashed by model pre-save hook)
    const newUser = await User.create({
      name,
      registrationNumber,
      email,
      phoneNumber,
      branch,
      password,
      orgRole:orgRole|| "member", // enforce defaults
      department: department||{ name: "", role: "none", isInRole: false },
      profilePicture:profilePicture||"https://example.com",
      isAdmin: false,
    });

    // 3️⃣ Response
    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "User registered successfully. Please login to continue.",
        data: { redirect: "/login" },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup Error:", error.message);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Server error. Please try again later.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
