import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import authRoutes from "./routes/auth";
import projectRoutes from "./routes/projects";
import taskRoutes from "./routes/tasks";
import dashboardRoutes from "./routes/dashboard";
import collaborationRoutes from "./routes/collaboration";
import userRoutes from "./routes/users";
import { errorHandler } from "./middlewares/error";

// The Express app is built here (with no listen/DB side effects) so it can be
// reused both by the local dev server (server.ts) and the Vercel serverless
// handler (serverless.ts).
const app = express();
app.use(helmet());
app.use(cors({ origin: env.clientUrl }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/collaboration", collaborationRoutes);
app.use("/api/users", userRoutes);
app.use(errorHandler);

export default app;
