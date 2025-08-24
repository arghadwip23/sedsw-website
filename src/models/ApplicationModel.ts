// models/ApplicationModel.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ApplicationDocument extends Document {
  fullName: string;
  registrationNumber: string;
  email: string;
  phone: string;
  primaryDepartment: string;
  secondaryDepartment?: string;
  motivation: string;
  verified: boolean;
  verificationToken: string | null;
}

const ApplicationSchema = new Schema<ApplicationDocument>({
  fullName: String,
  registrationNumber: { type: String, unique: true },
  email: { type: String, unique: true },
  phone: String,
  primaryDepartment: String,
  secondaryDepartment: String,
  motivation: String,
  verified: { type: Boolean, default: false },
  verificationToken: { type: String, default: null },
});

export default mongoose.models.Application ||
  mongoose.model<ApplicationDocument>("Application", ApplicationSchema);
