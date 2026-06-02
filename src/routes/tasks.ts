import { Router } from "express";
import { z } from "zod";
import { Task } from "../models/Task";
import { Project } from "../models/Project";
import { requireAuth } from "../middlewares/auth";
import { AppError } from "../utils/errors";
import { logActivity } from "../services/activity";
import { Notification } from "../models/Notification";

const router = Router();
router.use(requireAuth);

const schema = z.object({
  projectId: z.string(),
  title: z.string().min(2),
  description: z.string().default(""),
  assignedTo: z.string(),
  dueDate: z.iso.datetime(),
  priority: z.enum(["High", "Medium", "Low"]).default("Medium"),
  status: z.enum(["Todo", "In Progress", "Completed"]).default("Todo"),
});

const canMutateTask = (role: string) => role === "Admin" || role === "ProjectManager";
const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

router.get("/", async (req, res) => {
  const { projectId, status, priority, assignedTo, search, deadlineStatus, page = "1", limit = "10", sort = "-createdAt" } =
    req.query as Record<string, string>;
  const q: any = {};
  if (projectId) q.projectId = projectId;
  if (status) q.status = status;
  if (priority) q.priority = priority;
  if (assignedTo) q.assignedTo = assignedTo;
  if (search) q.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }];
  if (deadlineStatus === "Overdue") q.dueDate = { $lt: new Date() };
  if (deadlineStatus === "Upcoming") q.dueDate = { $gte: new Date() };
  const items = await Task.find(q)
    .sort(sort)
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))
    .populate("assignedTo", "name email role");
  const total = await Task.countDocuments(q);
  res.json({ items, total });
});

router.post("/", async (req, res) => {
  if (!canMutateTask(req.user!.role)) throw new AppError("Forbidden", 403);
  const body = schema.parse(req.body);
  if (new Date(body.dueDate) < startOfToday()) throw new AppError("Please select a valid deadline.", 400);
  const project = await Project.findById(body.projectId);
  if (!project) throw new AppError("Project not found", 404);
  const task = await Task.create({ ...body, normalizedTitle: body.title.trim().toLowerCase() });
  await Notification.create({
    recipientId: body.assignedTo,
    type: "TASK_ASSIGNED",
    title: "New Task Assigned",
    message: `Task "${task.title}" has been assigned to you`,
    link: `/tasks/${task._id}`,
  });
  await logActivity(req.user!.userId, "Task", String(task._id), "CREATE", `Task "${task.title}" assigned`);
  res.status(201).json(task);
});

router.patch("/:id", async (req, res) => {
  const body = schema.partial().parse(req.body);
  const existing = await Task.findById(req.params.id);
  if (!existing) throw new AppError("Task not found", 404);
  const isOwner = String(existing.assignedTo) === req.user!.userId;
  const isRolePrivileged = canMutateTask(req.user!.role);
  if (!isRolePrivileged) {
    const keys = Object.keys(body);
    const onlyStatusUpdate = keys.length === 1 && keys[0] === "status";
    if (!(isOwner && onlyStatusUpdate && body.status)) throw new AppError("Forbidden", 403);
  }
  if (existing.status === "Completed" && body.assignedTo) throw new AppError("Completed tasks cannot be reassigned.", 400);
  if (body.dueDate && new Date(body.dueDate) < startOfToday()) throw new AppError("Please select a valid deadline.", 400);
  if (body.title) body["normalizedTitle" as keyof typeof body] = body.title.trim().toLowerCase() as never;
  const updated = await Task.findByIdAndUpdate(req.params.id, body, { new: true });
  await logActivity(req.user!.userId, "Task", String(updated!._id), "UPDATE", `Task "${updated!.title}" updated`);
  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  if (!canMutateTask(req.user!.role)) throw new AppError("Forbidden", 403);
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) throw new AppError("Task not found", 404);
  await logActivity(req.user!.userId, "Task", String(task._id), "DELETE", `Task "${task.title}" deleted`);
  res.json({ ok: true });
});

export default router;
