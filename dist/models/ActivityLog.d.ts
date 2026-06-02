import mongoose from "mongoose";
export declare const ActivityLog: mongoose.Model<{
    message: string;
    actorId: mongoose.Types.ObjectId;
    entityType: string;
    entityId: string;
    action: string;
    metadata: any;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    message: string;
    actorId: mongoose.Types.ObjectId;
    entityType: string;
    entityId: string;
    action: string;
    metadata: any;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    message: string;
    actorId: mongoose.Types.ObjectId;
    entityType: string;
    entityId: string;
    action: string;
    metadata: any;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    message: string;
    actorId: mongoose.Types.ObjectId;
    entityType: string;
    entityId: string;
    action: string;
    metadata: any;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    message: string;
    actorId: mongoose.Types.ObjectId;
    entityType: string;
    entityId: string;
    action: string;
    metadata: any;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    message: string;
    actorId: mongoose.Types.ObjectId;
    entityType: string;
    entityId: string;
    action: string;
    metadata: any;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    message: string;
    actorId: mongoose.Types.ObjectId;
    entityType: string;
    entityId: string;
    action: string;
    metadata: any;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    message: string;
    actorId: mongoose.Types.ObjectId;
    entityType: string;
    entityId: string;
    action: string;
    metadata: any;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=ActivityLog.d.ts.map