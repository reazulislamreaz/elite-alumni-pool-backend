import mongoose, { Schema } from "mongoose";

const attachmentSchema = new Schema(
  {
    fileName: String,
    fileUrl: String,
  },
  { _id: false }
);

const taskSchema = new Schema(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    title: { type: String, required: true, trim: true },
    normalizedTitle: { type: String, required: true },
    description: { type: String, default: "" },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User", required: true },
    dueDate: { type: Date, required: true },
    priority: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" },
    status: { type: String, enum: ["Todo", "In Progress", "Completed"], default: "Todo" },
    attachments: [attachmentSchema],
  },
  { timestamps: true }
);

taskSchema.index({ projectId: 1, normalizedTitle: 1 }, { unique: true });
taskSchema.index({ status: 1, priority: 1, assignedTo: 1, dueDate: 1 });

export const Task = mongoose.model("Task", taskSchema);
