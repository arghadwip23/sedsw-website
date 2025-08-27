// models/ApplicationModel.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ApplicationDocument extends Document {
  fullName: string;
  registrationNumber: string;
  email: string;
  phone: string;
  primaryDepartment: string;
  secondaryDepartment: string;
  motivation: string;
  verified: boolean;
  verificationToken: string | null;
}

const ApplicationSchema = new Schema<ApplicationDocument>({
  fullName: { type: String, required: true },
  registrationNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  primaryDepartment: { type: String, required: true },
  secondaryDepartment: { type: String, required: true },
  motivation: { type: String, required: true },
  verified: { type: Boolean, default: false },
  verificationToken: { type: String, default: null },
});

export default mongoose.models.Application ||
  mongoose.model<ApplicationDocument>("Application", ApplicationSchema);
