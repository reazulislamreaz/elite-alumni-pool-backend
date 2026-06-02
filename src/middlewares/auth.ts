import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/auth";
import { AppError } from "../utils/errors";
import { Role } from "../types/common";

declare global {
  namespace Express {
    interface Request {
      user?: { userId: string; role: Role };
    }
  }
}

export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : undefined;
  if (!token) throw new AppError("Unauthorized", 401);
  req.user = verifyToken(token);
  next();
};

export const allowRoles = (...roles: Role[]) => (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user || !roles.includes(req.user.role)) throw new AppError("Forbidden", 403);
  next();
};
