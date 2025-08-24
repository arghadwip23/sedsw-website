// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ApiResponse } from "@/types/response";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
const JWT_EXPIRES_IN = "1h"; // Adjust as needed

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Email/Registration and password are required", data: null },
        { status: 400 }
      );
    }

    // Find user by email or registration number
    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { registrationNumber: identifier },
      ],
    });

    if (!user) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "No user found with these credentials", data: null },
        { status: 401 }
      );
    }

    // Verify password
    const isMatch = await bcrypt.compare(String(password), user.password);
    if (!isMatch) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Invalid credentials", data: null },
        { status: 401 }
      );
    }

    // Create JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, registrationNumber: user.registrationNumber, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // ✅ Set token in HttpOnly cookie
    const response = NextResponse.json<ApiResponse<{ redirect: string }>>(
      {
        success: true,
        message: "Login successful",
        data: { redirect: "/dashboard" },
      },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // ✅ only secure in production
      sameSite: "strict",
      maxAge: 60 * 60, // 1 hour
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "Something went wrong", data: null },
      { status: 500 }
    );
  }
}
