import { HydratedDocument, Types } from 'mongoose';
export type AdjustmentDocument = HydratedDocument<Adjustment>;
export declare class Adjustment {
    date: Date;
    memberId: Types.ObjectId;
    amount: number;
    type: 'payment' | 'credit' | 'debit';
    note: string;
}
export declare const AdjustmentSchema: import("mongoose").Schema<Adjustment, import("mongoose").Model<Adjustment, any, any, any, (import("mongoose").Document<unknown, any, Adjustment, any, import("mongoose").DefaultSchemaOptions> & Adjustment & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (import("mongoose").Document<unknown, any, Adjustment, any, import("mongoose").DefaultSchemaOptions> & Adjustment & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, Adjustment>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Adjustment, import("mongoose").Document<unknown, {}, Adjustment, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Adjustment & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    date?: import("mongoose").SchemaDefinitionProperty<Date, Adjustment, import("mongoose").Document<unknown, {}, Adjustment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Adjustment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    memberId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Adjustment, import("mongoose").Document<unknown, {}, Adjustment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Adjustment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    amount?: import("mongoose").SchemaDefinitionProperty<number, Adjustment, import("mongoose").Document<unknown, {}, Adjustment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Adjustment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    type?: import("mongoose").SchemaDefinitionProperty<"payment" | "credit" | "debit", Adjustment, import("mongoose").Document<unknown, {}, Adjustment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Adjustment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    note?: import("mongoose").SchemaDefinitionProperty<string, Adjustment, import("mongoose").Document<unknown, {}, Adjustment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Adjustment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Adjustment>;
