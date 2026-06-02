import { signToken, verifyToken } from "../utils/auth";

describe("auth utils", () => {
  it("signs and verifies jwt payload", () => {
    const token = signToken("u1", "Admin");
    const payload = verifyToken(token);
    expect(payload.userId).toBe("u1");
    expect(payload.role).toBe("Admin");
  });
});
