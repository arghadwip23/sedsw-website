// src/lib/security.ts
export function verifyOrigin(req: Request): Response | null {
  const origin = req.headers.get("origin");

  // Allow frontend (browser) + localhost dev tools
  const allowedOrigins = [
    "http://localhost:3000",
    "https://sedsantariksh25.netlify.app/", // replace with production domain
  ];

  // ⚠️ If origin is missing (like in Thunder Client/Postman), allow in dev
  if (!origin && process.env.NODE_ENV === "development") {
    return null;
  }

  if (!origin || !allowedOrigins.includes(origin)) {
    return new Response(
      JSON.stringify({ success: false, message: "Forbidden: Invalid Origin" }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  return null; // ✅ request allowed
}
