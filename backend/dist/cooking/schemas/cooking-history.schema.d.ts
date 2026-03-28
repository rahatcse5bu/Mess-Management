import { HydratedDocument, Types } from 'mongoose';
export type CookingHistoryDocument = HydratedDocument<CookingHistory>;
export declare class CookingHistory {
    date: Date;
    memberId: Types.ObjectId;
    source: 'auto' | 'manual';
    note: string;
}
export declare const CookingHistorySchema: import("mongoose").Schema<CookingHistory, import("mongoose").Model<CookingHistory, any, any, any, (import("mongoose").Document<unknown, any, CookingHistory, any, import("mongoose").DefaultSchemaOptions> & CookingHistory & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (import("mongoose").Document<unknown, any, CookingHistory, any, import("mongoose").DefaultSchemaOptions> & CookingHistory & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, CookingHistory>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, CookingHistory, import("mongoose").Document<unknown, {}, CookingHistory, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<CookingHistory & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    date?: import("mongoose").SchemaDefinitionProperty<Date, CookingHistory, import("mongoose").Document<unknown, {}, CookingHistory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CookingHistory & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    memberId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, CookingHistory, import("mongoose").Document<unknown, {}, CookingHistory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CookingHistory & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    source?: import("mongoose").SchemaDefinitionProperty<"auto" | "manual", CookingHistory, import("mongoose").Document<unknown, {}, CookingHistory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CookingHistory & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    note?: import("mongoose").SchemaDefinitionProperty<string, CookingHistory, import("mongoose").Document<unknown, {}, CookingHistory, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CookingHistory & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, CookingHistory>;
