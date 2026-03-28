import { HydratedDocument, Types } from 'mongoose';
export type PurchaseDocument = HydratedDocument<Purchase>;
export declare class Purchase {
    date: Date;
    description: string;
    amount: number;
    category: string;
    paidByMemberId?: Types.ObjectId;
    note: string;
}
export declare const PurchaseSchema: import("mongoose").Schema<Purchase, import("mongoose").Model<Purchase, any, any, any, (import("mongoose").Document<unknown, any, Purchase, any, import("mongoose").DefaultSchemaOptions> & Purchase & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (import("mongoose").Document<unknown, any, Purchase, any, import("mongoose").DefaultSchemaOptions> & Purchase & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, Purchase>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Purchase, import("mongoose").Document<unknown, {}, Purchase, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Purchase & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    date?: import("mongoose").SchemaDefinitionProperty<Date, Purchase, import("mongoose").Document<unknown, {}, Purchase, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Purchase & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string, Purchase, import("mongoose").Document<unknown, {}, Purchase, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Purchase & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    amount?: import("mongoose").SchemaDefinitionProperty<number, Purchase, import("mongoose").Document<unknown, {}, Purchase, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Purchase & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    category?: import("mongoose").SchemaDefinitionProperty<string, Purchase, import("mongoose").Document<unknown, {}, Purchase, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Purchase & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    paidByMemberId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | undefined, Purchase, import("mongoose").Document<unknown, {}, Purchase, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Purchase & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    note?: import("mongoose").SchemaDefinitionProperty<string, Purchase, import("mongoose").Document<unknown, {}, Purchase, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Purchase & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Purchase>;
