import { HydratedDocument } from 'mongoose';
export type MemberDocument = HydratedDocument<Member>;
export declare class Member {
    name: string;
    email?: string;
    phone?: string;
    isActive: boolean;
    joinedAt: Date;
}
export declare const MemberSchema: import("mongoose").Schema<Member, import("mongoose").Model<Member, any, any, any, (import("mongoose").Document<unknown, any, Member, any, import("mongoose").DefaultSchemaOptions> & Member & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (import("mongoose").Document<unknown, any, Member, any, import("mongoose").DefaultSchemaOptions> & Member & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}), any, Member>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Member, import("mongoose").Document<unknown, {}, Member, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Member & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: import("mongoose").SchemaDefinitionProperty<string, Member, import("mongoose").Document<unknown, {}, Member, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Member & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    email?: import("mongoose").SchemaDefinitionProperty<string | undefined, Member, import("mongoose").Document<unknown, {}, Member, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Member & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    phone?: import("mongoose").SchemaDefinitionProperty<string | undefined, Member, import("mongoose").Document<unknown, {}, Member, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Member & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, Member, import("mongoose").Document<unknown, {}, Member, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Member & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    joinedAt?: import("mongoose").SchemaDefinitionProperty<Date, Member, import("mongoose").Document<unknown, {}, Member, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Member & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Member>;
