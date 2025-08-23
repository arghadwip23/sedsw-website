// models/ApplicationModel.ts
import { Schema, model, models } from "mongoose";
import { Application } from "@/types/Application";

const ApplicationSchema = new Schema<Application>({
  fullName: { type: String, required: true },
  registrationNumber: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  primaryDepartment: { type: String, required: true },
  secondaryDepartment: { type: String, required: true },
  motivation: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ApplicationModel =
  models.Application || model<Application>("Application", ApplicationSchema);

export default ApplicationModel;
