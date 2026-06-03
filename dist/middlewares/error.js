"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const zod_1 = require("zod");
const errors_1 = require("../utils/errors");
const errorHandler = (err, _req, res, _next) => {
    if (err.code === 11000) {
        return res.status(409).json({ message: "This task already exists in the project." });
    }
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({ message: err.issues[0]?.message || "Invalid request data" });
    }
    if (err instanceof errors_1.AppError)
        return res.status(err.status).json({ message: err.message });
    return res.status(500).json({ message: "Internal server error" });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.js.map