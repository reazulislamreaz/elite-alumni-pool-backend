export type Role = "Admin" | "ProjectManager" | "TeamMember";
export type ProjectStatus = "Active" | "Completed" | "On Hold";
export type TaskPriority = "High" | "Medium" | "Low";
export type TaskStatus = "Todo" | "In Progress" | "Completed";
export interface JwtPayload {
    userId: string;
    role: Role;
}
//# sourceMappingURL=common.d.ts.map