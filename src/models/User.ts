import mongoose, { Schema } from "mongoose";
import { Role } from "../types/common";

interface IUser {
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  isDemo: boolean;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["Admin", "ProjectManager", "TeamMember"],
      default: "TeamMember",
      required: true,
    },
    isDemo: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
export type UserDoc = IUser & { _id: mongoose.Types.ObjectId };
