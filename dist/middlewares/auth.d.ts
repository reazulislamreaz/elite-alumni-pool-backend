import { NextFunction, Request, Response } from "express";
import { Role } from "../types/common";
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                role: Role;
            };
        }
    }
}
export declare const requireAuth: (req: Request, _res: Response, next: NextFunction) => void;
export declare const allowRoles: (...roles: Role[]) => (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map