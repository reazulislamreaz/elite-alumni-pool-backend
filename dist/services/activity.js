"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logActivity = void 0;
const ActivityLog_1 = require("../models/ActivityLog");
const logActivity = async (actorId, entityType, entityId, action, message, metadata = {}) => {
    await ActivityLog_1.ActivityLog.create({ actorId, entityType, entityId, action, message, metadata });
};
exports.logActivity = logActivity;
//# sourceMappingURL=activity.js.map