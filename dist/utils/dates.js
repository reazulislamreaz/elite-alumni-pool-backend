"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.daysUntil = exports.startOfToday = void 0;
const startOfToday = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
};
exports.startOfToday = startOfToday;
const daysUntil = (date) => {
    const today = (0, exports.startOfToday)();
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);
    return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};
exports.daysUntil = daysUntil;
//# sourceMappingURL=dates.js.map