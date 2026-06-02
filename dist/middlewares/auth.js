"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowRoles = exports.requireAuth = void 0;
const auth_1 = require("../utils/auth");
const errors_1 = require("../utils/errors");
const requireAuth = (req, _res, next) => {
    const auth = req.headers.authorization;
    const token = auth?.startsWith("Bearer ") ? auth.slice(7) : undefined;
    if (!token)
        throw new errors_1.AppError("Unauthorized", 401);
    req.user = (0, auth_1.verifyToken)(token);
    next();
};
exports.requireAuth = requireAuth;
const allowRoles = (...roles) => (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role))
        throw new errors_1.AppError("Forbidden", 403);
    next();
};
exports.allowRoles = allowRoles;
//# sourceMappingURL=auth.js.map