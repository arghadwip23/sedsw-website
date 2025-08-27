import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ApplicationModel from "@/models/ApplicationModel"; // adjust path

export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ success: false, message: "No token provided" }, { status: 400 });
    }

    const application = await ApplicationModel.findOne({ verificationToken: token });

    if (!application) {
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 404 });
    }

    if (application.verified) {
      return NextResponse.json({ success: true, message: "Your application is already verified." });
    }

    application.verified = true;
    await application.save();

    return NextResponse.json({ success: true, message: "Your application completed successfully!" });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
