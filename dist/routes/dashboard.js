"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const Project_1 = require("../models/Project");
const Task_1 = require("../models/Task");
const dates_1 = require("../utils/dates");
const router = (0, express_1.Router)();
router.use(auth_1.requireAuth);
router.get("/kpis", async (_req, res) => {
    const [totalProjects, totalTasks, completedTasks, pendingTasks, overdueTasks] = await Promise.all([
        Project_1.Project.countDocuments(),
        Task_1.Task.countDocuments(),
        Task_1.Task.countDocuments({ status: "Completed" }),
        Task_1.Task.countDocuments({ status: { $ne: "Completed" } }),
        Task_1.Task.countDocuments({ dueDate: { $lt: new Date() }, status: { $ne: "Completed" } }),
    ]);
    res.json({ totalProjects, totalTasks, completedTasks, pendingTasks, overdueTasks });
});
router.get("/analytics", async (_req, res) => {
    const [tasksByPriority, statusDist, productivity, projectProgress] = await Promise.all([
        Task_1.Task.aggregate([{ $group: { _id: "$priority", count: { $sum: 1 } } }]),
        Task_1.Task.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
        Task_1.Task.aggregate([
            { $group: { _id: "$assignedTo", total: { $sum: 1 }, completed: { $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] } } } },
            {
                $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" },
            },
            { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 1,
                    name: { $ifNull: ["$user.name", "Unassigned"] },
                    total: 1,
                    completed: 1,
                    pending: { $subtract: ["$total", "$completed"] },
                },
            },
        ]),
        Task_1.Task.aggregate([
            { $group: { _id: "$projectId", total: { $sum: 1 }, completed: { $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] } } } },
            { $lookup: { from: "projects", localField: "_id", foreignField: "_id", as: "project" } },
            { $unwind: "$project" },
            {
                $project: {
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
    const projectSummary = projectProgress.map((p) => {
        const days = (0, dates_1.daysUntil)(new Date(p.deadline));
        let deadlineLabel = `Deadline in ${days} days`;
        if (days < 0)
            deadlineLabel = `Overdue by ${Math.abs(days)} days`;
        if (days === 0)
            deadlineLabel = "Deadline today";
        if (days === 1)
            deadlineLabel = "Deadline in 1 day";
        return {
            ...p,
            summaryLine: p.pending > 0 && p.completionPercent < 100
                ? `${p.projectName} — ${p.pending} tasks pending`
                : `${p.projectName} — ${p.completionPercent}% completed`,
            deadlineLabel,
        };
    });
    res.json({ tasksByPriority, statusDist, productivity, projectSummary, projectProgress });
});
router.get("/workload", async (_req, res) => {
    const workload = await Task_1.Task.aggregate([
        { $group: { _id: "$assignedTo", total: { $sum: 1 }, completed: { $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] } } } },
        { $addFields: { pending: { $subtract: ["$total", "$completed"] } } },
        { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
        { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
        {
            $project: {
                _id: 1,
                name: { $ifNull: ["$user.name", "Unassigned"] },
                total: 1,
                completed: 1,
                pending: 1,
            },
        },
    ]);
    res.json(workload);
});
exports.default = router;
//# sourceMappingURL=dashboard.js.map