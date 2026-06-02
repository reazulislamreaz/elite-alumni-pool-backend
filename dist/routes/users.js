"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const User_1 = require("../models/User");
const router = (0, express_1.Router)();
router.use(auth_1.requireAuth);
router.get("/", async (_req, res) => {
    const users = await User_1.User.find().select("-passwordHash").limit(100);
    res.json(users);
});
router.get("/search", async (req, res) => {
    const q = req.query.q || "";
    const users = await User_1.User.find({ name: { $regex: q, $options: "i" } }).select("-passwordHash").limit(50);
    res.json(users);
});
exports.default = router;
//# sourceMappingURL=users.js.map