// types/image.ts
import { Types } from "mongoose";

export interface IImage {
  url: string;
  description?: string;
  eventId: Types.ObjectId;   // reference to Event
  altText?: string;
  isFeatured?: boolean;
  order?: number;            // for gallery sorting
}
