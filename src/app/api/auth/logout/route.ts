// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  // Remove the token cookie by setting it to empty and expired
  const response = NextResponse.json({ success: true, message: "Logged out" });
  response.cookies.set("token", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
    sameSite: "lax",
  });
  return response;
}
