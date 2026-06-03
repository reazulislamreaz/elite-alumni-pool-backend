import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/errors";

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if ((err as any).code === 11000) {
    return res.status(409).json({ message: "This task already exists in the project." });
  }
  if (err instanceof ZodError) {
    return res.status(400).json({ message: err.issues[0]?.message || "Invalid request data" });
  }
  if (err instanceof AppError) return res.status(err.status).json({ message: err.message });
  return res.status(500).json({ message: "Internal server error" });
};
