"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const Project_1 = require("../models/Project");
const auth_1 = require("../middlewares/auth");
const errors_1 = require("../utils/errors");
const activity_1 = require("../services/activity");
const router = (0, express_1.Router)();
router.use(auth_1.requireAuth);
const schema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    description: zod_1.z.string().default(""),
    deadline: zod_1.z.coerce.date(),
    status: zod_1.z.enum(["Active", "Completed", "On Hold"]).default("Active"),
});
router.get("/", async (req, res) => {
    const { search, status, page = "1", limit = "10", sort = "-createdAt" } = req.query;
    const q = {};
    if (search)
        q.$text = { $search: search };
    if (status)
        q.status = status;
    const items = await Project_1.Project.find(q)
        .sort(sort)
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .populate("members", "name email role");
    const total = await Project_1.Project.countDocuments(q);
    res.json({ items, total });
});
router.post("/", (0, auth_1.allowRoles)("Admin", "ProjectManager"), async (req, res) => {
    const body = schema.parse(req.body);
    if (body.deadline < new Date())
        throw new errors_1.AppError("Please select a valid deadline.", 400);
    const project = await Project_1.Project.create({ ...body, createdBy: req.user.userId, members: [req.user.userId] });
    await (0, activity_1.logActivity)(req.user.userId, "Project", String(project._id), "CREATE", `Project "${project.name}" created`);
    res.status(201).json(project);
});
router.patch("/:id", (0, auth_1.allowRoles)("Admin", "ProjectManager"), async (req, res) => {
    const body = schema.partial().parse(req.body);
    if (body.deadline && body.deadline < new Date())
        throw new errors_1.AppError("Please select a valid deadline.", 400);
    const project = await Project_1.Project.findByIdAndUpdate(req.params.id, body, { new: true });
    if (!project)
        throw new errors_1.AppError("Project not found", 404);
    await (0, activity_1.logActivity)(req.user.userId, "Project", String(project._id), "UPDATE", `Project "${project.name}" updated`);
    res.json(project);
});
router.delete("/:id", (0, auth_1.allowRoles)("Admin", "ProjectManager"), async (req, res) => {
    const project = await Project_1.Project.findByIdAndDelete(req.params.id);
    if (!project)
        throw new errors_1.AppError("Project not found", 404);
    await (0, activity_1.logActivity)(req.user.userId, "Project", String(project._id), "DELETE", `Project "${project.name}" deleted`);
    res.json({ ok: true });
});
router.post("/:id/members", (0, auth_1.allowRoles)("Admin", "ProjectManager"), async (req, res) => {
    const body = zod_1.z.object({ memberIds: zod_1.z.array(zod_1.z.string()).min(1) }).parse(req.body);
    const project = await Project_1.Project.findByIdAndUpdate(req.params.id, { $addToSet: { members: { $each: body.memberIds } } }, { new: true });
    if (!project)
        throw new errors_1.AppError("Project not found", 404);
    await (0, activity_1.logActivity)(req.user.userId, "Project", String(project._id), "ADD_MEMBER", "Members added to project");
    res.json(project);
});
exports.default = router;
//# sourceMappingURL=projects.js.map