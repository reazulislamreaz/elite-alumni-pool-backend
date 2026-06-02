import mongoose from "mongoose";
export declare const Project: mongoose.Model<{
    name: string;
    description: string;
    deadline: NativeDate;
    status: "Active" | "Completed" | "On Hold";
    createdBy: mongoose.Types.ObjectId;
    members: mongoose.Types.ObjectId[];
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    name: string;
    description: string;
    deadline: NativeDate;
    status: "Active" | "Completed" | "On Hold";
    createdBy: mongoose.Types.ObjectId;
    members: mongoose.Types.ObjectId[];
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    name: string;
    description: string;
    deadline: NativeDate;
    status: "Active" | "Completed" | "On Hold";
    createdBy: mongoose.Types.ObjectId;
    members: mongoose.Types.ObjectId[];
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    name: string;
    description: string;
    deadline: NativeDate;
    status: "Active" | "Completed" | "On Hold";
    createdBy: mongoose.Types.ObjectId;
    members: mongoose.Types.ObjectId[];
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    name: string;
    description: string;
    deadline: NativeDate;
    status: "Active" | "Completed" | "On Hold";
    createdBy: mongoose.Types.ObjectId;
    members: mongoose.Types.ObjectId[];
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    name: string;
    description: string;
    deadline: NativeDate;
    status: "Active" | "Completed" | "On Hold";
    createdBy: mongoose.Types.ObjectId;
    members: mongoose.Types.ObjectId[];
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    name: string;
    description: string;
    deadline: NativeDate;
    status: "Active" | "Completed" | "On Hold";
    createdBy: mongoose.Types.ObjectId;
    members: mongoose.Types.ObjectId[];
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    name: string;
    description: string;
    deadline: NativeDate;
    status: "Active" | "Completed" | "On Hold";
    createdBy: mongoose.Types.ObjectId;
    members: mongoose.Types.ObjectId[];
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=Project.d.ts.map