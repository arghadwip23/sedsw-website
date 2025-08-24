// models/Event.ts
import mongoose, { Schema, Document } from "mongoose";
import { IEvent } from "../types/event";

export interface IEventDocument extends IEvent, Document {}

const EventSchema: Schema = new Schema(
  {
    eventName: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
      match: /^\d{2}-\d{2}-\d{4}$/ // ensures dd-mm-yyyy format
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["music", "art", "tech", "sports", "conference", "other"],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Event ||
  mongoose.model<IEventDocument>("Event", EventSchema);
