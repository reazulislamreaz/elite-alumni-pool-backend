import mongoose from "mongoose";
import { Role } from "../types/common";
interface IUser {
    name: string;
    email: string;
    passwordHash: string;
    role: Role;
    isDemo: boolean;
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, mongoose.DefaultSchemaOptions> & IUser & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}, any, IUser>;
export type UserDoc = IUser & {
    _id: mongoose.Types.ObjectId;
};
export {};
//# sourceMappingURL=User.d.ts.map