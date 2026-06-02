import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    deadline: { type: Date, required: true },
    status: { type: String, enum: ["Active", "Completed", "On Hold"], default: "Active" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

projectSchema.index({ name: "text", description: "text" });

export const Project = mongoose.model("Project", projectSchema);
