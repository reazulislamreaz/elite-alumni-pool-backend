"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../utils/auth");
describe("auth utils", () => {
    it("signs and verifies jwt payload", () => {
        const token = (0, auth_1.signToken)("u1", "Admin");
        const payload = (0, auth_1.verifyToken)(token);
        expect(payload.userId).toBe("u1");
        expect(payload.role).toBe("Admin");
    });
});
//# sourceMappingURL=auth.test.js.map