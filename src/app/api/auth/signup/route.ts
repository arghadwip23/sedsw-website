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
    await User.create({
      name,
      registrationNumber,
      email,
      phoneNumber,
      branch,
      password,
      orgRole:orgRole|| "member", // enforce defaults
      department: department||{ name: "", role: "none", isInRole: false },
      profilePicture:profilePicture||"https://res.cloudinary.com/dpbjhiguv/image/upload/v1756234445/gallery/vif3hrmdqfkjc1jfmho5.jpg",
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
  } catch (error: unknown) {
    console.error("Signup Error:", error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Server error. Please try again later.",
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
