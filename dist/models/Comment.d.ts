import mongoose from "mongoose";
export declare const Comment: mongoose.Model<{
    taskId: mongoose.Types.ObjectId;
    authorId: mongoose.Types.ObjectId;
    body: string;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    taskId: mongoose.Types.ObjectId;
    authorId: mongoose.Types.ObjectId;
    body: string;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    taskId: mongoose.Types.ObjectId;
    authorId: mongoose.Types.ObjectId;
    body: string;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    taskId: mongoose.Types.ObjectId;
    authorId: mongoose.Types.ObjectId;
    body: string;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    taskId: mongoose.Types.ObjectId;
    authorId: mongoose.Types.ObjectId;
    body: string;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    taskId: mongoose.Types.ObjectId;
    authorId: mongoose.Types.ObjectId;
    body: string;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    taskId: mongoose.Types.ObjectId;
    authorId: mongoose.Types.ObjectId;
    body: string;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    taskId: mongoose.Types.ObjectId;
    authorId: mongoose.Types.ObjectId;
    body: string;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=Comment.d.ts.map