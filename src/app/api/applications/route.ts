import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ApplicationModel from "@/models/ApplicationModel";

import { Application, ApiResponse } from "@/types/Application";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body: Application = await req.json();

    // Check for duplicate registration number
    const existingFinal = await ApplicationModel.findOne({
      registrationNumber: body.registrationNumber,
    });
    if (existingFinal) {
      return NextResponse.json(
        { success: false, message: "Registration number already exists" },
        { status: 400 }
      );
    }

    // Check for duplicate email
    const existingEmail = await ApplicationModel.findOne({
      email: body.email,
    });
    if (existingEmail) {
      return NextResponse.json(
        { success: false, message: "Email already exists" },
        { status: 400 }
      );
    }

    // Store application directly (no verification)
    await ApplicationModel.create({
      ...body,
      verified: true,
      verificationToken: null,
    });

    return NextResponse.json(
      { success: true, message: "Application submitted successfully." },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { success: false, message: "Application submission failed", error: message },
      { status: 500 }
    );
  }
}
