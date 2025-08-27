import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import PendingApplicationModel from "@/models/PendingApplicationModel";
import ApplicationModel from "@/models/ApplicationModel";
import { verifyOrigin } from "@/lib/security";

export async function GET(req: Request) {
  try {
    console.log("Verification API called");
    
    // Add security check
    const authError = verifyOrigin(req);
    if (authError) {
      console.log("Origin verification failed:", authError);
      return authError;
    }

    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      console.log("No token provided");
      return new NextResponse(`
        <!DOCTYPE html>
        <html>
          <head><title>Verification Failed - SEDS</title></head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #000; color: #fff;">
            <div style="max-width: 500px; margin: 0 auto; background: #111; padding: 30px; border-radius: 10px; border: 1px solid #333;">
              <div style="color: #f44336; font-size: 24px; margin-bottom: 20px;">Verification Failed</div>
              <p>No verification token provided.</p>
              <p><a href="/join" style="color: #4CAF50;">Return to Join Page</a></p>
            </div>
          </body>
        </html>
      `, { headers: { 'Content-Type': 'text/html' } });
    }

    await connectDB();
    console.log("Database connected");
    console.log("Looking for pending application with token:", token);

    // Find pending by token
    const pending = await PendingApplicationModel.findOne({ verificationToken: token });
    if (!pending) {
      console.log("No pending application found for token:", token);
      return new NextResponse(`
        <!DOCTYPE html>
        <html>
          <head><title>Verification Failed - SEDS</title></head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #000; color: #fff;">
            <div style="max-width: 500px; margin: 0 auto; background: #111; padding: 30px; border-radius: 10px; border: 1px solid #333;">
              <div style="color: #f44336; font-size: 24px; margin-bottom: 20px;">Verification Failed</div>
              <p>Invalid or expired verification token.</p>
              <p><a href="/join" style="color: #4CAF50;">Return to Join Page</a></p>
            </div>
          </body>
        </html>
      `, { headers: { 'Content-Type': 'text/html' } });
    }

    console.log("Found pending application:", pending._id);

    // Before creating, ensure reg no not already taken in final collection
    const exists = await ApplicationModel.findOne({ registrationNumber: pending.registrationNumber });
    if (exists) {
      console.log("Registration number already exists in final collection");
      // Cleanup pending
      await PendingApplicationModel.deleteOne({ _id: pending._id });
      return new NextResponse(`
        <!DOCTYPE html>
        <html>
          <head><title>Verification Failed - SEDS</title></head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #000; color: #fff;">
            <div style="max-width: 500px; margin: 0 auto; background: #111; padding: 30px; border-radius: 10px; border: 1px solid #333;">
              <div style="color: #f44336; font-size: 24px; margin-bottom: 20px;">Verification Failed</div>
              <p>Registration number already exists.</p>
              <p><a href="/join" style="color: #4CAF50;">Return to Join Page</a></p>
            </div>
          </body>
        </html>
      `, { headers: { 'Content-Type': 'text/html' } });
    }

    // Ensure no legacy unique index on email blocks creation
    try {
      const indexes = await ApplicationModel.collection.indexes();
      const emailIdx = indexes.find((i: any) => i.name === 'email_1');
      if (emailIdx && emailIdx.unique) {
        console.log('Dropping legacy unique index on email');
        await ApplicationModel.collection.dropIndex('email_1');
      }
    } catch (indexErr) {
      console.warn('Index check/drop failed (non-fatal):', indexErr);
    }

    // Create final verified record
    try {
      const finalApp = await ApplicationModel.create({
        fullName: pending.fullName,
        registrationNumber: pending.registrationNumber,
        email: pending.email,
        phone: pending.phone,
        primaryDepartment: pending.primaryDepartment,
        secondaryDepartment: pending.secondaryDepartment,
        motivation: pending.motivation,
        verified: true,
        verificationToken: null,
      });
      console.log("Created final application:", finalApp._id);
    } catch (createError: any) {
      console.error("Failed to create final application:", createError);
      // Handle duplicate-key errors gracefully
      if (createError && createError.code === 11000) {
        const which = createError.keyPattern ? Object.keys(createError.keyPattern).join(', ') : 'a unique field';
        return new NextResponse(`
          <!DOCTYPE html>
          <html>
            <head><title>Verification Failed - SEDS</title></head>
            <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #000; color: #fff;">
              <div style="max-width: 500px; margin: 0 auto; background: #111; padding: 30px; border-radius: 10px; border: 1px solid #333;">
                <div style="color: #f44336; font-size: 24px; margin-bottom: 20px;">Verification Failed</div>
                <p>Duplicate value for ${which}. Please try submitting again with different details.</p>
                <p><a href="/join" style="color: #4CAF50;">Return to Join Page</a></p>
              </div>
            </body>
          </html>
        `, { headers: { 'Content-Type': 'text/html' } });
      }
      throw new Error(`Failed to create final application: ${createError instanceof Error ? createError.message : 'Unknown error'}`);
    }
    //CHANGE LOCALHOST URL
    // Remove pending
    await PendingApplicationModel.deleteOne({ _id: pending._id });
    console.log("Removed pending application");

    // Return a success page that will redirect to join with verified=1
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                   (req.headers.get("host") ? `http://${req.headers.get("host")}` : "http://localhost:3000");
    
    const redirectUrl = `${baseUrl}/join?verified=1`;
    
    return new NextResponse(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Email Verified - SEDS</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              text-align: center; 
              padding: 50px; 
              background: #000; 
              color: #fff; 
            }
            .container { 
              max-width: 500px; 
              margin: 0 auto; 
              background: #111; 
              padding: 30px; 
              border-radius: 10px; 
              border: 1px solid #333; 
            }
            .success { color: #4CAF50; font-size: 24px; margin-bottom: 20px; }
            .redirect { color: #888; margin-top: 20px; }
            .spinner { 
              border: 3px solid #333; 
              border-top: 3px solid #4CAF50; 
              border-radius: 50%; 
              width: 30px; 
              height: 30px; 
              animation: spin 1s linear infinite; 
              margin: 20px auto; 
            }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="success">Email Verified Successfully!</div>
            <p>Your application has been verified and submitted to SEDS Antariksh.</p>
            <p>You will be redirected to the thank you page in a few seconds...</p>
            <div class="spinner"></div>
            <div class="redirect">
              <a href="${redirectUrl}" style="color: #4CAF50;">Click here if you're not redirected automatically</a>
            </div>
          </div>
          <script>
            // Signal other tabs that verification succeeded
            try {
              localStorage.setItem('seds_verified', '1');
              if (window.BroadcastChannel) {
                const ch = new BroadcastChannel('seds_verification');
                ch.postMessage({ verified: true, ts: Date.now() });
                ch.close();
              }
            } catch (e) { /* noop */ }
            // Auto-redirect after 3 seconds
            setTimeout(() => {
              window.location.href = "${redirectUrl}";
            }, 3000);
          </script>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    });
    // CHANGE LOCALHOST URL HERE
  } catch (error) {
    console.error("Verification error:", error);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                   (req.headers.get("host") ? `http://${req.headers.get("host")}` : "http://localhost:3000");
    return new NextResponse(`
      <html>
        <head><title>Server Error - SEDS</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #000; color: #fff;">
          <div style="max-width: 500px; margin: 0 auto; background: #111; padding: 30px; border-radius: 10px; border: 1px solid #333;">
            <div style="color: #f44336; font-size: 24px; margin-bottom: 20px;">Server Error</div>
            <p>An unexpected error occurred during verification.</p>
            <p><a href="/join" style="color: #4CAF50;">Return to Join Page</a></p>
          </div>
        </body>
      </html>
    `, { headers: { 'Content-Type': 'text/html' } });
  }
}


