import { NextResponse } from "next/server";
import { verifyOrigin } from "@/lib/security";
import { EmailValidator } from "@/lib/emailValidator";

export async function POST(req: Request) {
  try {
    const authError = verifyOrigin(req);
    if (authError) {
      console.log("Origin verification failed");
      return authError;
    }

    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // General email validation (any domain)
    const validationResult = await EmailValidator.validateEmail(email);
    
    if (validationResult.isValid) {
      return NextResponse.json(
        { 
          success: true, 
          message: validationResult.message, 
          email,
          details: validationResult.details
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { 
          success: false, 
          message: validationResult.message,
          details: validationResult.details
        },
        { status: 400 }
      );
    }

  } catch (error: unknown) {
    console.error("Email validation error:", error);
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    
    return NextResponse.json(
      { success: false, message: "Email validation failed", error: message },
      { status: 500 }
    );
  }
}
