import { Router } from "express";
import multer from "multer";
import { z } from "zod";
import { requireAuth } from "../middlewares/auth";
import { Comment } from "../models/Comment";
import { Task } from "../models/Task";
import { Notification } from "../models/Notification";
import { ActivityLog } from "../models/ActivityLog";
import { logActivity } from "../services/activity";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });
router.use(requireAuth);

router.get("/activities", async (req, res) => {
  const limit = Math.min(Number((req.query.limit as string) || 10), 10);
  const items = await ActivityLog.find().sort("-createdAt").limit(limit).populate("actorId", "name");
  res.json(items);
});

router.get("/notifications", async (req, res) => {
  const items = await Notification.find({ recipientId: req.user!.userId }).sort("-createdAt").limit(20);
  res.json(items);
});

router.patch("/notifications/:id/read", async (req, res) => {
  const item = await Notification.findOneAndUpdate(
    { _id: req.params.id, recipientId: req.user!.userId },
    { isRead: true },
    { new: true }
  );
  if (!item) return res.status(404).json({ message: "Notification not found" });
  res.json(item);
});

router.get("/tasks/:taskId/comments", async (req, res) => {
  const items = await Comment.find({ taskId: req.params.taskId }).sort("createdAt").populate("authorId", "name");
  res.json(items);
});

router.post("/tasks/:taskId/comments", async (req, res) => {
  const body = z.object({ body: z.string().min(1) }).parse(req.body);
  const task = await Task.findById(req.params.taskId);
  const item = await Comment.create({ taskId: req.params.taskId, authorId: req.user!.userId, body: body.body });
  if (task) await logActivity(req.user!.userId, "Task", String(task._id), "COMMENT", `Comment added on task "${task.title}"`);
  res.status(201).json(item);
});

router.post("/tasks/:taskId/attachments", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Missing file" });
  const fakeUrl = `https://files.local/${Date.now()}-${req.file.originalname}`;
  const task = await Task.findByIdAndUpdate(
    req.params.taskId,
    { $push: { attachments: { fileName: req.file.originalname, fileUrl: fakeUrl } } },
    { new: true }
  );
  res.json(task);
});

export default router;
