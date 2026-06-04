import { isPastDeadline, startOfToday } from "../utils/dates";

describe("date validation helpers", () => {
  it("startOfToday returns midnight today", () => {
    const d = startOfToday();
    expect(d.getHours()).toBe(0);
    expect(d.getMinutes()).toBe(0);
  });

  it("isPastDeadline accepts today's deadline (no false rejection)", () => {
    const todayUtcMidnight = new Date(`${new Date().toISOString().slice(0, 10)}T00:00:00.000Z`);
    expect(isPastDeadline(todayUtcMidnight)).toBe(false);
  });

  it("isPastDeadline accepts a future deadline", () => {
    const future = new Date();
    future.setUTCDate(future.getUTCDate() + 5);
    expect(isPastDeadline(future)).toBe(false);
  });

  it("isPastDeadline rejects a past deadline", () => {
    const past = new Date();
    past.setUTCDate(past.getUTCDate() - 2);
    expect(isPastDeadline(past)).toBe(true);
  });
});
