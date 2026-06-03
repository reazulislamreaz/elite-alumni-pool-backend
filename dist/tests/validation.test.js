"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dates_1 = require("../utils/dates");
describe("date validation helpers", () => {
    it("startOfToday returns midnight today", () => {
        const d = (0, dates_1.startOfToday)();
        expect(d.getHours()).toBe(0);
        expect(d.getMinutes()).toBe(0);
    });
});
//# sourceMappingURL=validation.test.js.map