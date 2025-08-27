import mongoose, { Schema, Document, Model } from "mongoose";
import { Application } from "@/types/Application";

export interface PendingApplicationDocument extends Document, Application {
  verificationToken: string;
  createdAt: Date;
}

const PendingApplicationSchema: Schema<PendingApplicationDocument> = new Schema(
  {
    fullName: { type: String, required: true },
    registrationNumber: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    primaryDepartment: { type: String, required: true },
    secondaryDepartment: { type: String, required: true },
    motivation: { type: String, required: true },
    verificationToken: { type: String, required: true, unique: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const PendingApplicationModel: Model<PendingApplicationDocument> =
  mongoose.models.PendingApplication ||
  mongoose.model<PendingApplicationDocument>(
    "PendingApplication",
    PendingApplicationSchema
  );

export default PendingApplicationModel;



