import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import { Project } from "../models/Project";
import { Task } from "../models/Task";

const router = Router();
router.use(requireAuth);

router.get("/kpis", async (_req, res) => {
  const [totalProjects, totalTasks, completedTasks, pendingTasks, overdueTasks] = await Promise.all([
    Project.countDocuments(),
    Task.countDocuments(),
    Task.countDocuments({ status: "Completed" }),
    Task.countDocuments({ status: { $ne: "Completed" } }),
    Task.countDocuments({ dueDate: { $lt: new Date() }, status: { $ne: "Completed" } }),
  ]);
  res.json({ totalProjects, totalTasks, completedTasks, pendingTasks, overdueTasks });
});

router.get("/analytics", async (_req, res) => {
  const [tasksByPriority, statusDist, productivity] = await Promise.all([
    Task.aggregate([{ $group: { _id: "$priority", count: { $sum: 1 } } }]),
    Task.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Task.aggregate([
      { $group: { _id: "$assignedTo", total: { $sum: 1 }, completed: { $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] } } } },
    ]),
  ]);
  const projectSummary = await Project.find().limit(20);
  res.json({ tasksByPriority, statusDist, productivity, projectSummary });
});

router.get("/workload", async (_req, res) => {
  const workload = await Task.aggregate([
    { $group: { _id: "$assignedTo", total: { $sum: 1 }, completed: { $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] } } } },
    { $addFields: { pending: { $subtract: ["$total", "$completed"] } } },
  ]);
  res.json(workload);
});

export default router;
