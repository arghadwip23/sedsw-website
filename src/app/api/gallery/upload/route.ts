import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import connectDB from "@/lib/mongodb";
import Image from "@/models/Image";

export async function POST(req: Request) {
  try {
    await connectDB();

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const description = formData.get("description") as string;
    const eventId = formData.get("eventId") as string;

    if (!file || !eventId) {
      return NextResponse.json({ success: false, message: "File and Event are required" }, { status: 400 });
    }

    // Convert file → Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadRes = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "gallery",
        },
        (err, result) => {
          if (err) reject(err);
          else if (result) resolve({ secure_url: result.secure_url });
          else reject(new Error('Upload failed'));
        }
      );
      stream.end(buffer);
    });

    // Save to DB
    const newImage = await Image.create({
      url: uploadRes.secure_url,
      description,
      eventId,
    });

    return NextResponse.json({ success: true, data: newImage });
  } catch (error: unknown) {
    console.error("Upload error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
