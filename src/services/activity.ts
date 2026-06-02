import { ActivityLog } from "../models/ActivityLog";

export const logActivity = async (
  actorId: string,
  entityType: string,
  entityId: string,
  action: string,
  message: string,
  metadata: Record<string, unknown> = {}
) => {
  await ActivityLog.create({ actorId, entityType, entityId, action, message, metadata });
};
