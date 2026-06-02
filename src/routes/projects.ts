import { Router } from "express";
import { z } from "zod";
import { Project } from "../models/Project";
import { allowRoles, requireAuth } from "../middlewares/auth";
import { AppError } from "../utils/errors";
import { logActivity } from "../services/activity";

const router = Router();
router.use(requireAuth);

const schema = z.object({
  name: z.string().min(2),
  description: z.string().default(""),
  deadline: z.coerce.date(),
  status: z.enum(["Active", "Completed", "On Hold"]).default("Active"),
});

router.get("/", async (req, res) => {
  const { search, status, page = "1", limit = "10", sort = "-createdAt" } = req.query as Record<string, string>;
  const q: any = {};
  if (search) q.$text = { $search: search };
  if (status) q.status = status;
  const items = await Project.find(q)
    .sort(sort)
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))
    .populate("members", "name email role");
  const total = await Project.countDocuments(q);
  res.json({ items, total });
});

router.post("/", allowRoles("Admin", "ProjectManager"), async (req, res) => {
  const body = schema.parse(req.body);
  if (body.deadline < new Date()) throw new AppError("Please select a valid deadline.", 400);
  const project = await Project.create({ ...body, createdBy: req.user!.userId, members: [req.user!.userId] });
  await logActivity(req.user!.userId, "Project", String(project._id), "CREATE", `Project "${project.name}" created`);
  res.status(201).json(project);
});

router.patch("/:id", allowRoles("Admin", "ProjectManager"), async (req, res) => {
  const body = schema.partial().parse(req.body);
  if (body.deadline && body.deadline < new Date()) throw new AppError("Please select a valid deadline.", 400);
  const project = await Project.findByIdAndUpdate(req.params.id, body, { new: true });
  if (!project) throw new AppError("Project not found", 404);
  await logActivity(req.user!.userId, "Project", String(project._id), "UPDATE", `Project "${project.name}" updated`);
  res.json(project);
});

router.delete("/:id", allowRoles("Admin", "ProjectManager"), async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) throw new AppError("Project not found", 404);
  await logActivity(req.user!.userId, "Project", String(project._id), "DELETE", `Project "${project.name}" deleted`);
  res.json({ ok: true });
});

router.post("/:id/members", allowRoles("Admin", "ProjectManager"), async (req, res) => {
  const body = z.object({ memberIds: z.array(z.string()).min(1) }).parse(req.body);
  const project = await Project.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { members: { $each: body.memberIds } } },
    { new: true }
  );
  if (!project) throw new AppError("Project not found", 404);
  await logActivity(req.user!.userId, "Project", String(project._id), "ADD_MEMBER", "Members added to project");
  res.json(project);
});

export default router;
