import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ApplicationModel from "@/models/ApplicationModel";
import { Application, ApiResponse } from "@/types/Application";
import { verifyOrigin } from "@/lib/security";
import { Resend } from "resend";
import crypto from "crypto";
import  verificationEmailTemplate  from "@/lib/emailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const authError = verifyOrigin(req);
    if (authError) return authError;

    await connectDB();
    const body: Application = await req.json();

    // check if user exists
    const existing = await ApplicationModel.findOne({
      registrationNumber: body.registrationNumber,
    });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Registration number already exists" },
        { status: 400 }
      );
    }

    // generate verification token
    const token = crypto.randomBytes(32).toString("hex");

    // create application with verified: false
    const newApp = await ApplicationModel.create({
      ...body,
      verified: false,
      verificationToken: token,
    });

    // send verification email
    const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/verify?token=${token}`;

    await resend.emails.send({
      from: "noreply@baujikapaisa.in",
      to: body.email,
      subject: "Verify your email - SEDS",
      html: verificationEmailTemplate(body.fullName,verifyUrl),
    });

    const res: ApiResponse<Application> = {
      success: true,
      message: "Application submitted! Please check your email for verification.",
      data: newApp,
    };

    return NextResponse.json(res, { status: 201 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      { success: false, message: "Application submission failed", error: message },
      { status: 500 }
    );
  }
}
