import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import cloudinary from "@/lib/cloudinary";
import { v4 as uuidv4 } from "uuid";
import { jwtVerify } from "jose";
import { ApiResponse } from "@/types/response";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "supersecretkey");

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Unauthorized", data: null },
        { status: 401 }
      );
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);

    // ✅ get file from formData
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "No image provided", data: null },
        { status: 400 }
      );
    }

    // ✅ Convert File → Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ✅ Upload to Cloudinary
    const uploaded = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "profiles",
          public_id: uuidv4(),
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else if (result) resolve({ secure_url: result.secure_url });
          else reject(new Error("Upload failed"));
        }
      );
      stream.end(buffer);
    });

    // ✅ Update user in DB
    const user = await User.findByIdAndUpdate(
      payload.id,
      { profilePicture: uploaded.secure_url },
      { new: true }
    ).select("-password -__v");

    return NextResponse.json<ApiResponse<typeof user>>(
      { success: true, message: "Profile picture updated successfully", data: user },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: "Something went wrong", error: errorMessage, data: null },
      { status: 500 }
    );
  }
}
