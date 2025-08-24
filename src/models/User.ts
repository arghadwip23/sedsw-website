import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import { IUser } from "../types/user";

export interface IUserDocument extends IUser, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const DepartmentSubSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: ["lead", "co-lead", "member", "none"],
      default: "none",
      required: true,
    },
    isInRole: { type: Boolean, default: false },
  },
  { _id: false }
);

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      match: /^[\d+\-\s()]{7,20}$/,
    },
    branch: { type: String, required: true, trim: true },

    orgRole: {
      type: String,
      enum: ["president", "vice-president", "secretary", "treasurer", "member"],
      default: "member",
      required: true,
    },

    department: { type: DepartmentSubSchema, required: true },

    isAdmin: { type: Boolean, default: false },

    profilePicture: { type: String, default: "" },

    password: { type: String, required: true, minlength: 6 }, // hashed password
  },
  { timestamps: true }
);

// Normalize email
UserSchema.pre("save", function (next) {
  if (this.isModified("email") && typeof this.email === "string") {
    this.email = this.email.toLowerCase().trim();
  }
  next();
});

// Hash password before saving (avoid double-hashing)
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  // If it’s already a bcrypt hash, skip hashing
  if (this.password.startsWith("$2b$")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err as any);
  }
});

// Compare password method
UserSchema.methods.comparePassword = function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User ||
  mongoose.model<IUserDocument>("User", UserSchema);
