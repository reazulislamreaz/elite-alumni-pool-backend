"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const zod_1 = require("zod");
const User_1 = require("../models/User");
const auth_1 = require("../utils/auth");
const auth_2 = require("../middlewares/auth");
const errors_1 = require("../utils/errors");
const seedDemoUsers_1 = require("../services/seedDemoUsers");
const router = (0, express_1.Router)();
const authSchema = zod_1.z.object({
    email: zod_1.z.email(),
    password: zod_1.z.string().min(6),
    name: zod_1.z.string().min(2).optional(),
    role: zod_1.z.enum(["Admin", "ProjectManager", "TeamMember"]).optional(),
});
router.post("/signup", async (req, res) => {
    const body = authSchema.parse(req.body);
    const existing = await User_1.User.findOne({ email: body.email });
    if (existing)
        throw new errors_1.AppError("Email already registered", 409);
    const passwordHash = await bcryptjs_1.default.hash(body.password, 10);
    const user = await User_1.User.create({
        name: body.name || body.email.split("@")[0],
        email: body.email,
        passwordHash,
        role: body.role || "TeamMember",
    });
    const token = (0, auth_1.signToken)(String(user._id), user.role);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
});
router.post("/login", async (req, res) => {
    const body = authSchema.parse(req.body);
    const user = await User_1.User.findOne({ email: body.email });
    if (!user)
        throw new errors_1.AppError("Invalid credentials", 401);
    const ok = await bcryptjs_1.default.compare(body.password, user.passwordHash);
    if (!ok)
        throw new errors_1.AppError("Invalid credentials", 401);
    const token = (0, auth_1.signToken)(String(user._id), user.role);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
});
const demoRoleSchema = zod_1.z.object({
    role: zod_1.z.enum(["Admin", "ProjectManager", "TeamMember"]).optional(),
});
router.post("/demo-login", async (req, res) => {
    const { role } = demoRoleSchema.parse(req.body ?? {});
    const demo = (0, seedDemoUsers_1.getDemoUserByRole)((role || "Admin"));
    const user = await User_1.User.findOne({ email: demo.email });
    if (!user)
        throw new errors_1.AppError("Demo account not ready. Restart the API server.", 503);
    const token = (0, auth_1.signToken)(String(user._id), user.role);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
});
router.get("/me", auth_2.requireAuth, async (req, res) => {
    const user = await User_1.User.findById(req.user.userId).select("-passwordHash");
    res.json({ user });
});
exports.default = router;
//# sourceMappingURL=auth.js.map