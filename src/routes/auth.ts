import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { User } from "../models/User";
import { signToken } from "../utils/auth";
import { requireAuth } from "../middlewares/auth";
import { AppError } from "../utils/errors";
import { getDemoUserByRole } from "../services/seedDemoUsers";
import { Role } from "../types/common";

const router = Router();
const authSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  name: z.string().min(2).optional(),
  role: z.enum(["Admin", "ProjectManager", "TeamMember"]).optional(),
});

router.post("/signup", async (req, res) => {
  const body = authSchema.parse(req.body);
  const existing = await User.findOne({ email: body.email });
  if (existing) throw new AppError("Email already registered", 409);
  const passwordHash = await bcrypt.hash(body.password, 10);
  const user = await User.create({
    name: body.name || body.email.split("@")[0],
    email: body.email,
    passwordHash,
    role: body.role || "TeamMember",
  });
  const token = signToken(String(user._id), user.role);
  res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
});

router.post("/login", async (req, res) => {
  const body = authSchema.parse(req.body);
  const user = await User.findOne({ email: body.email });
  if (!user) throw new AppError("Invalid credentials", 401);
  const ok = await bcrypt.compare(body.password, user.passwordHash);
  if (!ok) throw new AppError("Invalid credentials", 401);
  const token = signToken(String(user._id), user.role);
  res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
});

const demoRoleSchema = z.object({
  role: z.enum(["Admin", "ProjectManager", "TeamMember"]).optional(),
});

router.post("/demo-login", async (req, res) => {
  const { role } = demoRoleSchema.parse(req.body ?? {});
  const demo = getDemoUserByRole((role || "Admin") as Role);
  const user = await User.findOne({ email: demo.email });
  if (!user) throw new AppError("Demo account not ready. Restart the API server.", 503);
  const token = signToken(String(user._id), user.role);
  res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
});

router.get("/me", requireAuth, async (req, res) => {
  const user = await User.findById(req.user!.userId).select("-passwordHash");
  res.json({ user });
});

export default router;
