import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/models/Event";
import cloudinary from "@/lib/cloudinary";
import { v4 as uuidv4 } from "uuid";
import { ApiResponse } from "@/types/response";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();
    const eventName = formData.get("eventName") as string;
    const date = formData.get("date") as string;
    const location = formData.get("location") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const file = formData.get("thumbnail") as File | null;

    if (!eventName || !date || !location || !description || !category || !file) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "All fields including thumbnail are required", data: null },
        { status: 400 }
      );
    }

    // Upload to Cloudinary
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploaded = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "events",
          public_id: uuidv4(),
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else if (result) resolve({ secure_url: result.secure_url });
          else reject(new Error('Upload failed'));
        }
      );
      stream.end(buffer);
    });

    // Save to MongoDB
    const newEvent = await Event.create({
      eventName,
      date,
      location,
      description,
      category,
      thumbnail: uploaded.secure_url,
    });

    return NextResponse.json<ApiResponse<typeof newEvent>>(
      { success: true, message: "Event created successfully", data: newEvent },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json<ApiResponse<null>>(
      { success: false, message: errorMessage, error: errorMessage, data: null },
      { status: 500 }
    );
  }
}
