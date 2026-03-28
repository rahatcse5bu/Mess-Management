import { HydratedDocument, Types } from 'mongoose';
export type MealDayDocument = HydratedDocument<MealDay>;
export declare class MemberMealEntry {
    memberId: Types.ObjectId;
    mealCount: number;
    note: string;
}
export declare class MealDay {
    date: Date;
    elements: string[];
    entries: MemberMealEntry[];
}
export declare const MealDaySchema: import("mongoose").Schema<MealDay, import("mongoose").Model<MealDay, any, any, any, (import("mongoose").Document<unknown, any, MealDay, any, import("mongoose").DefaultSchemaOptions> & MealDay & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (import("mongoose").Document<unknown, any, MealDay, any, import("mongoose").DefaultSchemaOptions> & MealDay & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, MealDay>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, MealDay, import("mongoose").Document<unknown, {}, MealDay, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<MealDay & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    date?: import("mongoose").SchemaDefinitionProperty<Date, MealDay, import("mongoose").Document<unknown, {}, MealDay, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MealDay & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    elements?: import("mongoose").SchemaDefinitionProperty<string[], MealDay, import("mongoose").Document<unknown, {}, MealDay, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MealDay & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    entries?: import("mongoose").SchemaDefinitionProperty<MemberMealEntry[], MealDay, import("mongoose").Document<unknown, {}, MealDay, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MealDay & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, MealDay>;
