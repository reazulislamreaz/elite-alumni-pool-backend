import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { Role } from "../types/common";

const DEMO_PASSWORD = process.env.DEMO_PASSWORD || "Demo@123456";

const DEMO_USERS: { name: string; email: string; role: Role }[] = [
  { name: "Demo Admin", email: "admin@demo.elitepool.com", role: "Admin" },
  { name: "Demo Manager", email: "manager@demo.elitepool.com", role: "ProjectManager" },
  { name: "Demo Member", email: "member@demo.elitepool.com", role: "TeamMember" },
];

export const seedDemoUsers = async () => {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  for (const demo of DEMO_USERS) {
    const existing = await User.findOne({ email: demo.email });
    if (!existing) {
      await User.create({ ...demo, passwordHash, isDemo: true });
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

export const getDemoUserByRole = (role: Role) =>
  DEMO_USERS.find((u) => u.role === role) ?? DEMO_USERS[0];
