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
  const [tasksByPriority, statusDist, productivity, projectProgress] = await Promise.all([
    Task.aggregate([{ $group: { _id: "$priority", count: { $sum: 1 } } }]),
    Task.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Task.aggregate([
      { $group: { _id: "$assignedTo", total: { $sum: 1 }, completed: { $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] } } } },
    ]),
    Task.aggregate([
      { $group: { _id: "$projectId", total: { $sum: 1 }, completed: { $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] } } } },
      {
        $lookup: {
          from: "projects",
          localField: "_id",
          foreignField: "_id",
          as: "project",
        },
      },
      { $unwind: "$project" },
      {
        $project: {
          _id: 0,
          projectId: "$project._id",
          projectName: "$project.name",
          total: 1,
          completed: 1,
          pending: { $subtract: ["$total", "$completed"] },
          completionPercent: {
            $cond: [{ $eq: ["$total", 0] }, 0, { $round: [{ $multiply: [{ $divide: ["$completed", "$total"] }, 100] }, 0] }],
          },
          deadline: "$project.deadline",
        },
      },
      { $sort: { completionPercent: -1 } },
    ]),
  ]);
  const projectSummary = await Project.find().sort("deadline").limit(20);
  res.json({ tasksByPriority, statusDist, productivity, projectSummary, projectProgress });
});

router.get("/workload", async (_req, res) => {
  const workload = await Task.aggregate([
    { $group: { _id: "$assignedTo", total: { $sum: 1 }, completed: { $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] } } } },
    { $addFields: { pending: { $subtract: ["$total", "$completed"] } } },
  ]);
  res.json(workload);
});

export default router;
