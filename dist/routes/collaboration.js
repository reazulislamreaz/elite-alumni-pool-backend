"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const zod_1 = require("zod");
const auth_1 = require("../middlewares/auth");
const Comment_1 = require("../models/Comment");
const Task_1 = require("../models/Task");
const Notification_1 = require("../models/Notification");
const ActivityLog_1 = require("../models/ActivityLog");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
router.use(auth_1.requireAuth);
router.get("/activities", async (req, res) => {
    const limit = Number(req.query.limit || 10);
    const items = await ActivityLog_1.ActivityLog.find().sort("-createdAt").limit(limit);
    res.json(items);
});
router.get("/notifications", async (req, res) => {
    const items = await Notification_1.Notification.find({ recipientId: req.user.userId }).sort("-createdAt").limit(20);
    res.json(items);
});
router.patch("/notifications/:id/read", async (req, res) => {
    const item = await Notification_1.Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    res.json(item);
});
router.get("/tasks/:taskId/comments", async (req, res) => {
    const items = await Comment_1.Comment.find({ taskId: req.params.taskId }).sort("createdAt").populate("authorId", "name");
    res.json(items);
});
router.post("/tasks/:taskId/comments", async (req, res) => {
    const body = zod_1.z.object({ body: zod_1.z.string().min(1) }).parse(req.body);
    const item = await Comment_1.Comment.create({ taskId: req.params.taskId, authorId: req.user.userId, body: body.body });
    res.status(201).json(item);
});
router.post("/tasks/:taskId/attachments", upload.single("file"), async (req, res) => {
    if (!req.file)
        return res.status(400).json({ message: "Missing file" });
    const fakeUrl = `https://files.local/${Date.now()}-${req.file.originalname}`;
    const task = await Task_1.Task.findByIdAndUpdate(req.params.taskId, { $push: { attachments: { fileName: req.file.originalname, fileUrl: fakeUrl } } }, { new: true });
    res.json(task);
});
exports.default = router;
//# sourceMappingURL=collaboration.js.map