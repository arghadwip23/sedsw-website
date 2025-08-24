import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ApplicationModel from "@/models/ApplicationModel";
import { Application, ApiResponse } from "@/types/Application";
import { verifyOrigin } from "@/lib/security";

export async function POST(req: Request) {
  try {
    const authError = verifyOrigin(req);
    if (authError) return authError;

    await connectDB();
    const body: Application = await req.json();

    // 🔍 Check if registration number already exists
    const existingApp = await ApplicationModel.findOne({
      registrationNumber: body.registrationNumber,
    });

    if (existingApp) {
      const res: ApiResponse<null> = {
        success: false,
        message: "Application with this registration number already exists",
        error: "Duplicate registration number",
      };
      return NextResponse.json(res, { status: 409 }); // 409 = Conflict
    }

    // ✅ Create new application
    const newApp = await ApplicationModel.create(body);

    const res: ApiResponse<Application> = {
      success: true,
      message: "Application submitted successfully",
      data: newApp,
    };

    return NextResponse.json(res, { status: 201 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";

    const res: ApiResponse<null> = {
      success: false,
      message: "Application submission failed",
      error: message,
    };

    return NextResponse.json(res, { status: 500 });
  }
}
