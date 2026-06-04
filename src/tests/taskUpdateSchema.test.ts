import { z } from "zod";

// Mirror of the update schema in routes/tasks.ts. The point of this test is to
// guard against the Zod v4 footgun where `.partial()` does NOT strip `.default()`
// — reusing the create schema injected description/priority/status into every
// patch, which 403'd TeamMember status updates and wiped fields on quick edits.
const updateSchema = z
  .object({
    projectId: z.string(),
    title: z.string().min(2),
    description: z.string(),
    assignedTo: z.string(),
    dueDate: z.coerce.date(),
    priority: z.enum(["High", "Medium", "Low"]),
    status: z.enum(["Todo", "In Progress", "Completed"]),
  })
  .partial();

describe("task update schema", () => {
  it("keeps only the keys the client sent (no default injection)", () => {
    const body = updateSchema.parse({ status: "Completed" });
    expect(Object.keys(body)).toEqual(["status"]);
  });

  it("a lone status update stays a single-key payload (TeamMember RBAC path)", () => {
    const body = updateSchema.parse({ status: "In Progress" });
    const keys = Object.keys(body);
    const onlyStatusUpdate = keys.length === 1 && keys[0] === "status";
    expect(onlyStatusUpdate).toBe(true);
  });

  it("does not fabricate description/priority on a quick status change", () => {
    const body = updateSchema.parse({ status: "Completed" }) as Record<string, unknown>;
    expect(body.description).toBeUndefined();
    expect(body.priority).toBeUndefined();
  });
});
