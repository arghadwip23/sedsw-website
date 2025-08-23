// app/api/applications/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ApplicationModel from "@/models/ApplicationModel";
import { Application,ApiResponse } from "@/types/Application";
import { verifyOrigin } from "@/lib/security";
import { log } from "console";

//import {  } from "@/types/ApiResponse";

export async function POST(req: Request) {
  try {
    const authError = verifyOrigin(req);
    console.log(req);
    
    if (authError) return authError;
    await connectDB();
    const body: Application = await req.json();

    const newApp = await ApplicationModel.create(body);

    const res: ApiResponse<Application> = {
      success: true,
      message: "Application submitted successfully",
      data: newApp,
    };

    return NextResponse.json(res, { status: 201 });
  } catch (error: any) {
    const res: ApiResponse = {
      success: false,
      message: "Application submission failed",
      error: error.message,
    };
    return NextResponse.json(res, { status: 500 });
  }
}
