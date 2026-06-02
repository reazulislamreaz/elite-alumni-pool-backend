"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const env_1 = require("./config/env");
const auth_1 = __importDefault(require("./routes/auth"));
const projects_1 = __importDefault(require("./routes/projects"));
const tasks_1 = __importDefault(require("./routes/tasks"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
const collaboration_1 = __importDefault(require("./routes/collaboration"));
const users_1 = __importDefault(require("./routes/users"));
const error_1 = require("./middlewares/error");
const seedDemoUsers_1 = require("./services/seedDemoUsers");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: env_1.env.clientUrl }));
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", auth_1.default);
app.use("/api/projects", projects_1.default);
app.use("/api/tasks", tasks_1.default);
app.use("/api/dashboard", dashboard_1.default);
app.use("/api/collaboration", collaboration_1.default);
app.use("/api/users", users_1.default);
app.use(error_1.errorHandler);
const bootstrap = async () => {
    await mongoose_1.default.connect(env_1.env.mongoUri);
    await (0, seedDemoUsers_1.seedDemoUsers)();
    app.listen(env_1.env.port, () => {
        console.log(`API running on ${env_1.env.port}`);
    });
};
bootstrap().catch((e) => {
    console.error(e);
    process.exit(1);
});
//# sourceMappingURL=server.js.map