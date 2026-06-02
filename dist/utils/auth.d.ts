import { JwtPayload, Role } from "../types/common";
export declare const signToken: (userId: string, role: Role) => string;
export declare const verifyToken: (token: string) => JwtPayload;
//# sourceMappingURL=auth.d.ts.map