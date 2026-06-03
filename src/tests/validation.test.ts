import { startOfToday } from "../utils/dates";

describe("date validation helpers", () => {
  it("startOfToday returns midnight today", () => {
    const d = startOfToday();
    expect(d.getHours()).toBe(0);
    expect(d.getMinutes()).toBe(0);
  });
});
