import { Router } from "express";
import { z } from "zod";
import { Task } from "../models/Task";
import { Project } from "../models/Project";
import { User } from "../models/User";
import { requireAuth } from "../middlewares/auth";
import { AppError } from "../utils/errors";
import { logActivity } from "../services/activity";
import { Notification } from "../models/Notification";
import { isPastDeadline, startOfToday } from "../utils/dates";

const router = Router();
router.use(requireAuth);

const schema = z.object({
  projectId: z.string(),
  title: z.string().min(2),
  description: z.string().default(""),
  assignedTo: z.string(),
  dueDate: z.coerce.date(),
  priority: z.enum(["High", "Medium", "Low"]).default("Medium"),
  status: z.enum(["Todo", "In Progress", "Completed"]).default("Todo"),
});

// Update schema has NO defaults, so `.partial()` only keeps the keys the
// client actually sent. Reusing the create schema (with defaults) on a patch
// injected description/priority/status into every request — that broke
// TeamMember status updates (RBAC saw extra keys → 403) and silently wiped
// description / reset priority on Admin/Manager quick status changes.
const updateSchema = z
  .object({
    projectId: z.string(),
    title: z.string().min(2),
    description: z.string(),
    assignedTo: z.string(),
    dueDate: z.coerce.date(),
    priority: z.enum(["High", "Medium", "Low"]),
    status: z.enum(["Todo", "In Progress", "Completed"]),
  })
  .partial();

const canMutateTask = (role: string) => role === "Admin" || role === "ProjectManager";

// A task may only be assigned to someone who belongs to its project. Members
// are added to a project first (POST /projects/:id/members), then become
// assignable — matching the "add members → assign tasks" flow in the spec.
const isProjectMember = (project: { members: unknown[] }, userId: string) =>
  project.members.map(String).includes(userId);

const priorityOrder: Record<string, number> = { High: 3, Medium: 2, Low: 1 };

router.get("/", async (req, res) => {
  const { projectId, status, priority, assignedTo, search, deadlineStatus, page = "1", limit = "10", sort = "-createdAt" } =
    req.query as Record<string, string>;
  const q: Record<string, unknown> = {};
  if (req.user!.role === "TeamMember") q.assignedTo = req.user!.userId;
  if (projectId) q.projectId = projectId;
  if (status) q.status = status;
  if (priority) q.priority = priority;
  if (assignedTo && req.user!.role !== "TeamMember") q.assignedTo = assignedTo;
  if (search) q.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }];
  if (deadlineStatus === "Overdue") {
    q.dueDate = { $lt: new Date() };
    q.status = { $ne: "Completed" };
  }
  if (deadlineStatus === "Upcoming") q.dueDate = { $gte: startOfToday() };

  const total = await Task.countDocuments(q);
  const start = (Number(page) - 1) * Number(limit);
  const lim = Number(limit);

  if (sort === "-priority") {
    const all = await Task.find(q).populate("assignedTo", "name email role").populate("projectId", "name");
    const sorted = all.sort((a, b) => (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0));
    return res.json({ items: sorted.slice(start, start + lim), total });
  }

  const items = await Task.find(q)
    .sort(sort)
    .skip(start)
    .limit(lim)
    .populate("assignedTo", "name email role")
    .populate("projectId", "name");
  res.json({ items, total });
});

router.post("/", async (req, res) => {
  if (!canMutateTask(req.user!.role)) throw new AppError("Forbidden", 403);
  const body = schema.parse(req.body);
  if (isPastDeadline(body.dueDate)) throw new AppError("Please select a valid deadline.", 400);
  const project = await Project.findById(body.projectId);
  if (!project) throw new AppError("Project not found", 404);
  if (!isProjectMember(project, body.assignedTo))
    throw new AppError("You can only assign tasks to members of this project. Add the member to the project first.", 400);

  const normalizedTitle = body.title.trim().toLowerCase();
  const duplicate = await Task.findOne({ projectId: body.projectId, normalizedTitle });
  if (duplicate) throw new AppError("This task already exists in the project.", 409);

  const assignee = await User.findById(body.assignedTo);
  const task = await Task.create({ ...body, normalizedTitle });
  await Notification.create({
    recipientId: body.assignedTo,
    type: "TASK_ASSIGNED",
    title: "New Task Assigned",
    message: `Task "${task.title}" has been assigned to you`,
    link: `/tasks`,
  });
  await logActivity(
    req.user!.userId,
    "Task",
    String(task._id),
    "CREATE",
    `Task "${task.title}" assigned to ${assignee?.name || "member"}`
  );
  res.status(201).json(task);
});

router.patch("/bulk", async (req, res) => {
  if (!canMutateTask(req.user!.role)) throw new AppError("Forbidden", 403);
  const body = z
    .object({
      taskIds: z.array(z.string()).min(1),
      status: z.enum(["Todo", "In Progress", "Completed"]).optional(),
      priority: z.enum(["High", "Medium", "Low"]).optional(),
    })
    .parse(req.body);
  const update: Record<string, string> = {};
  if (body.status) update.status = body.status;
  if (body.priority) update.priority = body.priority;
  if (!Object.keys(update).length) throw new AppError("No bulk fields provided", 400);

  const result = await Task.updateMany({ _id: { $in: body.taskIds } }, update);
  await logActivity(req.user!.userId, "Task", "bulk", "BULK_UPDATE", `Bulk updated ${result.modifiedCount} task(s)`);
  res.json({ modified: result.modifiedCount });
});

router.patch("/:id", async (req, res) => {
  const body = updateSchema.parse(req.body);
  const existing = await Task.findById(req.params.id);
  if (!existing) throw new AppError("Task not found", 404);
  const isOwner = String(existing.assignedTo) === req.user!.userId;
  const isRolePrivileged = canMutateTask(req.user!.role);
  if (!isRolePrivileged) {
    const keys = Object.keys(body);
    const onlyStatusUpdate = keys.length === 1 && keys[0] === "status";
    if (!(isOwner && onlyStatusUpdate && body.status)) throw new AppError("Forbidden", 403);
  }
  // Only block an actual reassignment of a completed task — editing other
  // fields (or re-saving the same assignee) must still be allowed.
  const isReassign = body.assignedTo && body.assignedTo !== String(existing.assignedTo);
  if (existing.status === "Completed" && isReassign) throw new AppError("Completed tasks cannot be reassigned.", 400);
  if (body.dueDate && isPastDeadline(body.dueDate)) throw new AppError("Please select a valid deadline.", 400);

  // When the assignee (or the task's project) changes, the new assignee must be
  // a member of the effective project.
  if (body.assignedTo) {
    const project = await Project.findById(body.projectId || existing.projectId);
    if (!project) throw new AppError("Project not found", 404);
    if (!isProjectMember(project, body.assignedTo))
      throw new AppError("You can only assign tasks to members of this project. Add the member to the project first.", 400);
  }

  if (body.title) {
    const normalizedTitle = body.title.trim().toLowerCase();
    const duplicate = await Task.findOne({
      projectId: body.projectId || existing.projectId,
      normalizedTitle,
      _id: { $ne: existing._id },
    });
    if (duplicate) throw new AppError("This task already exists in the project.", 409);
    (body as any).normalizedTitle = normalizedTitle;
  }

  const updated = await Task.findByIdAndUpdate(req.params.id, body, { new: true }).populate("assignedTo", "name");
  const message =
    body.status === "Completed"
      ? `Task "${updated!.title}" marked as Completed`
      : body.assignedTo
        ? `Task "${updated!.title}" reassigned`
        : `Task "${updated!.title}" updated`;

  if (body.assignedTo && body.assignedTo !== String(existing.assignedTo)) {
    await Notification.create({
      recipientId: body.assignedTo,
      type: "TASK_ASSIGNED",
      title: "Task Assigned",
      message: `You were assigned task "${updated!.title}"`,
      link: `/tasks`,
    });
  }

  await logActivity(req.user!.userId, "Task", String(updated!._id), "UPDATE", message);
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
