import mongoose, { Schema, Document, Model } from "mongoose";
import { Application } from "@/types/Application";

// Use Omit to avoid conflicting _id definitions between Mongoose's Document and our Application type.
export interface PendingApplicationDocument extends Document {
  // Mongoose document id
  _id: mongoose.Types.ObjectId;

  // Application fields (omit _id to avoid duplicate declaration)
  fullName: Application["fullName"];
  registrationNumber: Application["registrationNumber"];
  email: Application["email"];
  phone: Application["phone"];
  primaryDepartment: Application["primaryDepartment"];
  secondaryDepartment: Application["secondaryDepartment"];
  motivation: Application["motivation"];

  // Extra fields for pending applications
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



