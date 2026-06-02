"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const Task_1 = require("../models/Task");
const Project_1 = require("../models/Project");
const auth_1 = require("../middlewares/auth");
const errors_1 = require("../utils/errors");
const activity_1 = require("../services/activity");
const Notification_1 = require("../models/Notification");
const router = (0, express_1.Router)();
router.use(auth_1.requireAuth);
const schema = zod_1.z.object({
    projectId: zod_1.z.string(),
    title: zod_1.z.string().min(2),
    description: zod_1.z.string().default(""),
    assignedTo: zod_1.z.string(),
    dueDate: zod_1.z.iso.datetime(),
    priority: zod_1.z.enum(["High", "Medium", "Low"]).default("Medium"),
    status: zod_1.z.enum(["Todo", "In Progress", "Completed"]).default("Todo"),
});
const canMutateTask = (role) => role === "Admin" || role === "ProjectManager";
const startOfToday = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
};
router.get("/", async (req, res) => {
    const { projectId, status, priority, assignedTo, search, deadlineStatus, page = "1", limit = "10", sort = "-createdAt" } = req.query;
    const q = {};
    if (projectId)
        q.projectId = projectId;
    if (status)
        q.status = status;
    if (priority)
        q.priority = priority;
    if (assignedTo)
        q.assignedTo = assignedTo;
    if (search)
        q.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }];
    if (deadlineStatus === "Overdue")
        q.dueDate = { $lt: new Date() };
    if (deadlineStatus === "Upcoming")
        q.dueDate = { $gte: new Date() };
    const items = await Task_1.Task.find(q)
        .sort(sort)
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .populate("assignedTo", "name email role");
    const total = await Task_1.Task.countDocuments(q);
    res.json({ items, total });
});
router.post("/", async (req, res) => {
    if (!canMutateTask(req.user.role))
        throw new errors_1.AppError("Forbidden", 403);
    const body = schema.parse(req.body);
    if (new Date(body.dueDate) < startOfToday())
        throw new errors_1.AppError("Please select a valid deadline.", 400);
    const project = await Project_1.Project.findById(body.projectId);
    if (!project)
        throw new errors_1.AppError("Project not found", 404);
    const task = await Task_1.Task.create({ ...body, normalizedTitle: body.title.trim().toLowerCase() });
    await Notification_1.Notification.create({
        recipientId: body.assignedTo,
        type: "TASK_ASSIGNED",
        title: "New Task Assigned",
        message: `Task "${task.title}" has been assigned to you`,
        link: `/tasks/${task._id}`,
    });
    await (0, activity_1.logActivity)(req.user.userId, "Task", String(task._id), "CREATE", `Task "${task.title}" assigned`);
    res.status(201).json(task);
});
router.patch("/:id", async (req, res) => {
    const body = schema.partial().parse(req.body);
    const existing = await Task_1.Task.findById(req.params.id);
    if (!existing)
        throw new errors_1.AppError("Task not found", 404);
    const isOwner = String(existing.assignedTo) === req.user.userId;
    const isRolePrivileged = canMutateTask(req.user.role);
    if (!isRolePrivileged) {
        const keys = Object.keys(body);
        const onlyStatusUpdate = keys.length === 1 && keys[0] === "status";
        if (!(isOwner && onlyStatusUpdate && body.status))
            throw new errors_1.AppError("Forbidden", 403);
    }
    if (existing.status === "Completed" && body.assignedTo)
        throw new errors_1.AppError("Completed tasks cannot be reassigned.", 400);
    if (body.dueDate && new Date(body.dueDate) < startOfToday())
        throw new errors_1.AppError("Please select a valid deadline.", 400);
    if (body.title)
        body["normalizedTitle"] = body.title.trim().toLowerCase();
    const updated = await Task_1.Task.findByIdAndUpdate(req.params.id, body, { new: true });
    await (0, activity_1.logActivity)(req.user.userId, "Task", String(updated._id), "UPDATE", `Task "${updated.title}" updated`);
    res.json(updated);
});
router.delete("/:id", async (req, res) => {
    if (!canMutateTask(req.user.role))
        throw new errors_1.AppError("Forbidden", 403);
    const task = await Task_1.Task.findByIdAndDelete(req.params.id);
    if (!task)
        throw new errors_1.AppError("Task not found", 404);
    await (0, activity_1.logActivity)(req.user.userId, "Task", String(task._id), "DELETE", `Task "${task.title}" deleted`);
    res.json({ ok: true });
});
exports.default = router;
//# sourceMappingURL=tasks.js.map