import { HydratedDocument, Types } from 'mongoose';
export type CookerConfigDocument = HydratedDocument<CookerConfig>;
export declare class CookerConfig {
    termDays: number;
    memberOrder: Types.ObjectId[];
    rotationStartDate: Date;
}
export declare const CookerConfigSchema: import("mongoose").Schema<CookerConfig, import("mongoose").Model<CookerConfig, any, any, any, (import("mongoose").Document<unknown, any, CookerConfig, any, import("mongoose").DefaultSchemaOptions> & CookerConfig & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (import("mongoose").Document<unknown, any, CookerConfig, any, import("mongoose").DefaultSchemaOptions> & CookerConfig & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, CookerConfig>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, CookerConfig, import("mongoose").Document<unknown, {}, CookerConfig, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<CookerConfig & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    termDays?: import("mongoose").SchemaDefinitionProperty<number, CookerConfig, import("mongoose").Document<unknown, {}, CookerConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CookerConfig & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    memberOrder?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId[], CookerConfig, import("mongoose").Document<unknown, {}, CookerConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CookerConfig & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    rotationStartDate?: import("mongoose").SchemaDefinitionProperty<Date, CookerConfig, import("mongoose").Document<unknown, {}, CookerConfig, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CookerConfig & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, CookerConfig>;
