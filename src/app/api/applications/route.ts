import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ApplicationModel from "@/models/ApplicationModel";
import PendingApplicationModel from "@/models/PendingApplicationModel";
import { Application, ApiResponse } from "@/types/Application";
//import { verifyOrigin } from "@/lib/security";
import { Resend } from "resend";
import crypto from "crypto";
import  verificationEmailTemplate  from "@/lib/emailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    console.log("Applications API called");
    // const authError = verifyOrigin(req);
    // if (authError) {
    //   console.log("Origin verification failed:", authError);
    //   return authError;
    // }

    await connectDB();
    console.log("Database connected");
    const body: Application = await req.json();
    console.log("Request body received:", { 
      fullName: body.fullName,
      registrationNumber: body.registrationNumber,
      email: body.email,
      primaryDepartment: body.primaryDepartment,
      secondaryDepartment: body.secondaryDepartment
    });

    // check if user exists in final or pending
    const existingFinal = await ApplicationModel.findOne({
      registrationNumber: body.registrationNumber,
    });
    const existingPending = await PendingApplicationModel.findOne({
      registrationNumber: body.registrationNumber,
    });
    console.log("Duplicate check results:", { 
      existingFinal: !!existingFinal, 
      existingPending: !!existingPending 
    });

    // If already verified/finalized, block with duplicate error
    if (existingFinal) {
      console.log("Duplicate registration in final collection:", body.registrationNumber);
      return NextResponse.json(
        { success: false, message: "Registration number already exists" },
        { status: 400 }
      );
    }

    // If exists in pending (not yet verified), refresh token and resend verification instead of erroring
    if (existingPending) {
      const token = crypto.randomBytes(32).toString("hex");
      existingPending.set({ ...body, verificationToken: token });
      await existingPending.save();

      const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL || `http://${req.headers.get('host') || 'localhost:3000'}`}/api/verify?token=${token}`;
      console.log("Resending verification for pending application to:", body.email);
      console.log("Verification URL:", verifyUrl);

      try {
        await resend.emails.send({
          from: "noreply@sedsantariksh.com",
          to: body.email,
          subject: "Verify your application",
          html: verificationEmailTemplate(body.fullName, verifyUrl),
        });
        console.log("Verification email re-sent successfully");
      } catch (emailError) {
        console.error("Failed to resend verification email:", emailError);
        return NextResponse.json(
          { success: false, message: "Failed to send verification email. Please try again." },
          { status: 500 }
        );
      }

      const res: ApiResponse = {
        success: true,
        message: "Verification mail sent to your email.",
      };
      return NextResponse.json(res, { status: 201 });
    }

    // generate verification token for new pending application
    const token = crypto.randomBytes(32).toString("hex");

    // store as pending until verified via email link
    const pending = await PendingApplicationModel.create({
      ...body,
      verificationToken: token,
    });
    
    console.log("Created pending application:", pending._id);

    // send verification email
    const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL || `http://${req.headers.get('host') || 'localhost:3000'}`}/api/verify?token=${token}`;
    
    console.log("Sending verification email to:", body.email);
    console.log("Verification URL:", verifyUrl);

    try {
      // await resend.emails.send({
      //   from: "noreply@baujikapaisa.in",
      //   to: body.email,
      //   subject: "Verify your email",
      //   html: verificationEmailTemplate(body.fullName, verifyUrl),
      // });
      console.log("Verification email sent successfully");
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Delete the pending application if email fails
      await PendingApplicationModel.deleteOne({ _id: pending._id });
      return NextResponse.json(
        { success: false, message: "Failed to send verification email. Please try again." },
        { status: 500 }
      );
    }

    const res: ApiResponse = {
      success: true,
      message: "Verification mail sent to your email.",
    };

    return NextResponse.json(res, { status: 201 });
  } catch (error: unknown) {
    console.error("Applications API error:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      { success: false, message: "Application submission failed", error: message },
      { status: 500 }
    );
  }
}
