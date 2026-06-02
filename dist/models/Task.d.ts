import mongoose from "mongoose";
export declare const Task: mongoose.Model<{
    description: string;
    status: "Completed" | "Todo" | "In Progress";
    projectId: mongoose.Types.ObjectId;
    title: string;
    normalizedTitle: string;
    assignedTo: mongoose.Types.ObjectId;
    dueDate: NativeDate;
    priority: "High" | "Medium" | "Low";
    attachments: mongoose.Types.DocumentArray<{
        fileName?: string | null | undefined;
        fileUrl?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        fileName?: string | null | undefined;
        fileUrl?: string | null | undefined;
    }, {}, {}> & {
        fileName?: string | null | undefined;
        fileUrl?: string | null | undefined;
    }>;
} & mongoose.DefaultTimestampProps, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    description: string;
    status: "Completed" | "Todo" | "In Progress";
    projectId: mongoose.Types.ObjectId;
    title: string;
    normalizedTitle: string;
    assignedTo: mongoose.Types.ObjectId;
    dueDate: NativeDate;
    priority: "High" | "Medium" | "Low";
    attachments: mongoose.Types.DocumentArray<{
        fileName?: string | null | undefined;
        fileUrl?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        fileName?: string | null | undefined;
        fileUrl?: string | null | undefined;
    }, {}, {}> & {
        fileName?: string | null | undefined;
        fileUrl?: string | null | undefined;
    }>;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, {
    timestamps: true;
}> & Omit<{
    description: string;
    status: "Completed" | "Todo" | "In Progress";
    projectId: mongoose.Types.ObjectId;
    title: string;
    normalizedTitle: string;
    assignedTo: mongoose.Types.ObjectId;
    dueDate: NativeDate;
    priority: "High" | "Medium" | "Low";
    attachments: mongoose.Types.DocumentArray<{
        fileName?: string | null | undefined;
        fileUrl?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        fileName?: string | null | undefined;
        fileUrl?: string | null | undefined;
    }, {}, {}> & {
        fileName?: string | null | undefined;
        fileUrl?: string | null | undefined;
    }>;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    description: string;
    status: "Completed" | "Todo" | "In Progress";
    projectId: mongoose.Types.ObjectId;
    title: string;
    normalizedTitle: string;
    assignedTo: mongoose.Types.ObjectId;
    dueDate: NativeDate;
    priority: "High" | "Medium" | "Low";
    attachments: mongoose.Types.DocumentArray<{
        fileName?: string | null | undefined;
        fileUrl?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        fileName?: string | null | undefined;
        fileUrl?: string | null | undefined;
    }, {}, {}> & {
        fileName?: string | null | undefined;
        fileUrl?: string | null | undefined;
    }>;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, {
    description: string;
    status: "Completed" | "Todo" | "In Progress";
    projectId: mongoose.Types.ObjectId;
    title: string;
    normalizedTitle: string;
    assignedTo: mongoose.Types.ObjectId;
    dueDate: NativeDate;
    priority: "High" | "Medium" | "Low";
    attachments: mongoose.Types.DocumentArray<{
        fileName?: string | null | undefined;
        fileUrl?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        fileName?: string | null | undefined;
        fileUrl?: string | null | undefined;
    }, {}, {}> & {
        fileName?: string | null | undefined;
        fileUrl?: string | null | undefined;
    }>;
} & mongoose.DefaultTimestampProps, {
    id: string;
}, Omit<mongoose.DefaultSchemaOptions, "timestamps"> & {
    timestamps: true;
}> & Omit<{
    description: string;
    status: "Completed" | "Todo" | "In Progress";
    projectId: mongoose.Types.ObjectId;
    title: string;
    normalizedTitle: string;
    assignedTo: mongoose.Types.ObjectId;
    dueDate: NativeDate;
    priority: "High" | "Medium" | "Low";
    attachments: mongoose.Types.DocumentArray<{
        fileName?: string | null | undefined;
        fileUrl?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        fileName?: string | null | undefined;
        fileUrl?: string | null | undefined;
    }, {}, {}> & {
        fileName?: string | null | undefined;
        fileUrl?: string | null | undefined;
    }>;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    description: string;
    status: "Completed" | "Todo" | "In Progress";
    projectId: mongoose.Types.ObjectId;
    title: string;
    normalizedTitle: string;
    assignedTo: mongoose.Types.ObjectId;
    dueDate: NativeDate;
    priority: "High" | "Medium" | "Low";
    attachments: mongoose.Types.DocumentArray<{
        fileName?: string | null | undefined;
        fileUrl?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        fileName?: string | null | undefined;
        fileUrl?: string | null | undefined;
    }, {}, {}> & {
        fileName?: string | null | undefined;
        fileUrl?: string | null | undefined;
    }>;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    description: string;
    status: "Completed" | "Todo" | "In Progress";
    projectId: mongoose.Types.ObjectId;
    title: string;
    normalizedTitle: string;
    assignedTo: mongoose.Types.ObjectId;
    dueDate: NativeDate;
    priority: "High" | "Medium" | "Low";
    attachments: mongoose.Types.DocumentArray<{
        fileName?: string | null | undefined;
        fileUrl?: string | null | undefined;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        fileName?: string | null | undefined;
        fileUrl?: string | null | undefined;
    }, {}, {}> & {
        fileName?: string | null | undefined;
        fileUrl?: string | null | undefined;
    }>;
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=Task.d.ts.map