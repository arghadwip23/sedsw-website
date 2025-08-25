// middleware.ts
import { NextResponse, NextRequest } from "next/server";
import * as jose from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Paths where auth is not required
const PUBLIC_PATHS = ["/login", "/signup", "/api/auth/login", "/api/auth/signup", "/"];

// Middleware
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1️⃣ Allow public paths without auth
  if (PUBLIC_PATHS.includes(pathname)) {
    // If user is already logged in, redirect from login/signup to dashboard
    const token = req.cookies.get("token")?.value;
    if (token) {
      try {
        const secret = new TextEncoder().encode(JWT_SECRET);
        await jose.jwtVerify(token, secret);
        if (pathname === "/" || pathname.startsWith("/login") || pathname.startsWith("/signup")) {
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }
      } catch {
        // token invalid → let them continue to login/signup
      }
    }
    return NextResponse.next();
  }

  // 2️⃣ For protected routes → check token
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    await jose.jwtVerify(token, secret);
    return NextResponse.next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// 3️⃣ Config → define paths where middleware runs
export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/settings/:path*", "/login", "/signup", "/"], 
};
