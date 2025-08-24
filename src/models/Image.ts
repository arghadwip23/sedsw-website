// models/Image.ts
import mongoose, { Schema, Document } from "mongoose";
import { IImage } from "../types/image";

export interface IImageDocument extends IImage, Document {}

const ImageSchema: Schema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",    // references Event model
      required: true,
    },
    altText: {
      type: String,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,      // useful for sorting gallery images
    },
  },
  { timestamps: true }
);

export default mongoose.models.Image ||
  mongoose.model<IImageDocument>("Image", ImageSchema);
