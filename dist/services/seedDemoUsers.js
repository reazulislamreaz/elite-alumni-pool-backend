"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDemoUserByRole = exports.seedDemoUsers = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("../models/User");
const DEMO_PASSWORD = process.env.DEMO_PASSWORD || "Demo@123456";
const DEMO_USERS = [
    { name: "Demo Admin", email: "admin@demo.elitepool.com", role: "Admin" },
    { name: "Demo Manager", email: "manager@demo.elitepool.com", role: "ProjectManager" },
    { name: "Demo Member", email: "member@demo.elitepool.com", role: "TeamMember" },
];
const seedDemoUsers = async () => {
    const passwordHash = await bcryptjs_1.default.hash(DEMO_PASSWORD, 10);
    for (const demo of DEMO_USERS) {
        const existing = await User_1.User.findOne({ email: demo.email });
        if (!existing) {
            await User_1.User.create({ ...demo, passwordHash, isDemo: true });
            continue;
        }
        if (existing.role !== demo.role || !existing.isDemo) {
            existing.role = demo.role;
            existing.isDemo = true;
            existing.passwordHash = passwordHash;
            await existing.save();
        }
    }
};
exports.seedDemoUsers = seedDemoUsers;
const getDemoUserByRole = (role) => DEMO_USERS.find((u) => u.role === role) ?? DEMO_USERS[0];
exports.getDemoUserByRole = getDemoUserByRole;
//# sourceMappingURL=seedDemoUsers.js.map