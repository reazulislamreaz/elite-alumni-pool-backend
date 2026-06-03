"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const Task_1 = require("../models/Task");
const Project_1 = require("../models/Project");
const User_1 = require("../models/User");
const auth_1 = require("../middlewares/auth");
const errors_1 = require("../utils/errors");
const activity_1 = require("../services/activity");
const Notification_1 = require("../models/Notification");
const dates_1 = require("../utils/dates");
const router = (0, express_1.Router)();
router.use(auth_1.requireAuth);
const schema = zod_1.z.object({
    projectId: zod_1.z.string(),
    title: zod_1.z.string().min(2),
    description: zod_1.z.string().default(""),
    assignedTo: zod_1.z.string(),
    dueDate: zod_1.z.coerce.date(),
    priority: zod_1.z.enum(["High", "Medium", "Low"]).default("Medium"),
    status: zod_1.z.enum(["Todo", "In Progress", "Completed"]).default("Todo"),
});
const canMutateTask = (role) => role === "Admin" || role === "ProjectManager";
const priorityOrder = { High: 3, Medium: 2, Low: 1 };
router.get("/", async (req, res) => {
    const { projectId, status, priority, assignedTo, search, deadlineStatus, page = "1", limit = "10", sort = "-createdAt" } = req.query;
    const q = {};
    if (req.user.role === "TeamMember")
        q.assignedTo = req.user.userId;
    if (projectId)
        q.projectId = projectId;
    if (status)
        q.status = status;
    if (priority)
        q.priority = priority;
    if (assignedTo && req.user.role !== "TeamMember")
        q.assignedTo = assignedTo;
    if (search)
        q.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }];
    if (deadlineStatus === "Overdue") {
        q.dueDate = { $lt: new Date() };
        q.status = { $ne: "Completed" };
    }
    if (deadlineStatus === "Upcoming")
        q.dueDate = { $gte: (0, dates_1.startOfToday)() };
    const total = await Task_1.Task.countDocuments(q);
    const start = (Number(page) - 1) * Number(limit);
    const lim = Number(limit);
    if (sort === "-priority") {
        const all = await Task_1.Task.find(q).populate("assignedTo", "name email role").populate("projectId", "name");
        const sorted = all.sort((a, b) => (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0));
        return res.json({ items: sorted.slice(start, start + lim), total });
    }
    const items = await Task_1.Task.find(q)
        .sort(sort)
        .skip(start)
        .limit(lim)
        .populate("assignedTo", "name email role")
        .populate("projectId", "name");
    res.json({ items, total });
});
router.post("/", async (req, res) => {
    if (!canMutateTask(req.user.role))
        throw new errors_1.AppError("Forbidden", 403);
    const body = schema.parse(req.body);
    if (body.dueDate < (0, dates_1.startOfToday)())
        throw new errors_1.AppError("Please select a valid deadline.", 400);
    const project = await Project_1.Project.findById(body.projectId);
    if (!project)
        throw new errors_1.AppError("Project not found", 404);
    const normalizedTitle = body.title.trim().toLowerCase();
    const duplicate = await Task_1.Task.findOne({ projectId: body.projectId, normalizedTitle });
    if (duplicate)
        throw new errors_1.AppError("This task already exists in the project.", 409);
    const assignee = await User_1.User.findById(body.assignedTo);
    const task = await Task_1.Task.create({ ...body, normalizedTitle });
    await Notification_1.Notification.create({
        recipientId: body.assignedTo,
        type: "TASK_ASSIGNED",
        title: "New Task Assigned",
        message: `Task "${task.title}" has been assigned to you`,
        link: `/tasks`,
    });
    await (0, activity_1.logActivity)(req.user.userId, "Task", String(task._id), "CREATE", `Task "${task.title}" assigned to ${assignee?.name || "member"}`);
    res.status(201).json(task);
});
router.patch("/bulk", async (req, res) => {
    if (!canMutateTask(req.user.role))
        throw new errors_1.AppError("Forbidden", 403);
    const body = zod_1.z
        .object({
        taskIds: zod_1.z.array(zod_1.z.string()).min(1),
        status: zod_1.z.enum(["Todo", "In Progress", "Completed"]).optional(),
        priority: zod_1.z.enum(["High", "Medium", "Low"]).optional(),
    })
        .parse(req.body);
    const update = {};
    if (body.status)
        update.status = body.status;
    if (body.priority)
        update.priority = body.priority;
    if (!Object.keys(update).length)
        throw new errors_1.AppError("No bulk fields provided", 400);
    const result = await Task_1.Task.updateMany({ _id: { $in: body.taskIds } }, update);
    await (0, activity_1.logActivity)(req.user.userId, "Task", "bulk", "BULK_UPDATE", `Bulk updated ${result.modifiedCount} task(s)`);
    res.json({ modified: result.modifiedCount });
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
    if (body.dueDate && body.dueDate < (0, dates_1.startOfToday)())
        throw new errors_1.AppError("Please select a valid deadline.", 400);
    if (body.title) {
        const normalizedTitle = body.title.trim().toLowerCase();
        const duplicate = await Task_1.Task.findOne({
            projectId: body.projectId || existing.projectId,
            normalizedTitle,
            _id: { $ne: existing._id },
        });
        if (duplicate)
            throw new errors_1.AppError("This task already exists in the project.", 409);
        body.normalizedTitle = normalizedTitle;
    }
    const updated = await Task_1.Task.findByIdAndUpdate(req.params.id, body, { new: true }).populate("assignedTo", "name");
    const message = body.status === "Completed"
        ? `Task "${updated.title}" marked as Completed`
        : body.assignedTo
            ? `Task "${updated.title}" reassigned`
            : `Task "${updated.title}" updated`;
    if (body.assignedTo && body.assignedTo !== String(existing.assignedTo)) {
        await Notification_1.Notification.create({
            recipientId: body.assignedTo,
            type: "TASK_ASSIGNED",
            title: "Task Assigned",
            message: `You were assigned task "${updated.title}"`,
            link: `/tasks`,
        });
    }
    await (0, activity_1.logActivity)(req.user.userId, "Task", String(updated._id), "UPDATE", message);
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