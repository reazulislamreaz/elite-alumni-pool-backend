import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { JwtPayload, Role } from "../types/common";

export const signToken = (userId: string, role: Role) =>
  jwt.sign({ userId, role }, env.jwtSecret, { expiresIn: "1d" });

export const verifyToken = (token: string) => jwt.verify(token, env.jwtSecret) as JwtPayload;
