import mongoose from "mongoose";
export declare const Notification: mongoose.Model<{
    type: string;
    link: string;
    message: string;
    title: string;
    recipientId: mongoose.Types.ObjectId;
    isRead: boolean;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    type: string;
    link: string;
    message: string;
    title: string;
    recipientId: mongoose.Types.ObjectId;
    isRead: boolean;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    type: string;
    link: string;
    message: string;
    title: string;
    recipientId: mongoose.Types.ObjectId;
    isRead: boolean;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    type: string;
    link: string;
    message: string;
    title: string;
    recipientId: mongoose.Types.ObjectId;
    isRead: boolean;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    type: string;
    link: string;
    message: string;
    title: string;
    recipientId: mongoose.Types.ObjectId;
    isRead: boolean;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    type: string;
    link: string;
    message: string;
    title: string;
    recipientId: mongoose.Types.ObjectId;
    isRead: boolean;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    type: string;
    link: string;
    message: string;
    title: string;
    recipientId: mongoose.Types.ObjectId;
    isRead: boolean;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    type: string;
    link: string;
    message: string;
    title: string;
    recipientId: mongoose.Types.ObjectId;
    isRead: boolean;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=Notification.d.ts.map