"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.env = {
    port: Number(process.env.PORT || 5000),
    mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/elite_alumni_pool",
    jwtSecret: process.env.JWT_SECRET || "dev_secret_change_me",
    demoEmail: process.env.DEMO_EMAIL || "demo@elitepool.com",
    demoPassword: process.env.DEMO_PASSWORD || "Demo@123456",
    clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
};
//# sourceMappingURL=env.js.map