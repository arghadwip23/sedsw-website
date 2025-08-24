// app/api/test/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcrypt";

export async function GET() {
  try {
    await connectDB();
    
    // Get a sample user
    const user = await User.findOne({});
    
    if (!user) {
      return NextResponse.json({ message: "No users found" });
    }

    // Test password comparison manually
    const testPassword = "test123"; // Replace with a known password
    const isMatch = await bcrypt.compare(testPassword, user.password);
    const isMatchMethod = await user.comparePassword(testPassword);

    return NextResponse.json({
      message: "Debug info",
      userEmail: user.email,
      passwordHash: user.password,
      bcryptDirectMatch: isMatch,
      modelMethodMatch: isMatchMethod,
      passwordHashLength: user.password.length,
      isValidBcryptHash: user.password.startsWith('$2b$') || user.password.startsWith('$2a$'),
    });
  } catch (error: unknown) {
    console.error("Test route error:", error);
    return NextResponse.json({ 
      error: "Test failed", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}
