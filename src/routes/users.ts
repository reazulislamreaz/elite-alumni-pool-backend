import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import { User } from "../models/User";

const router = Router();
router.use(requireAuth);

router.get("/", async (_req, res) => {
  const users = await User.find().select("-passwordHash").limit(100);
  res.json(users);
});

router.get("/search", async (req, res) => {
  const q = (req.query.q as string) || "";
  const users = await User.find({ name: { $regex: q, $options: "i" } }).select("-passwordHash").limit(50);
  res.json(users);
});

export default router;
