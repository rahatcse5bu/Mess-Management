import { Model, Types } from 'mongoose';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { Purchase, PurchaseDocument } from './schemas/purchase.schema';
export declare class PurchasesService {
    private readonly purchaseModel;
    constructor(purchaseModel: Model<PurchaseDocument>);
    private withPopulatedRefs;
    create(dto: CreatePurchaseDto, userId: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Purchase, {}, import("mongoose").DefaultSchemaOptions> & Purchase & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Purchase, {}, import("mongoose").DefaultSchemaOptions> & Purchase & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    list(from?: string, to?: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Purchase, {}, import("mongoose").DefaultSchemaOptions> & Purchase & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Purchase, {}, import("mongoose").DefaultSchemaOptions> & Purchase & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: Types.ObjectId;
    }>)[]>;
    update(id: string, dto: UpdatePurchaseDto, userId: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Purchase, {}, import("mongoose").DefaultSchemaOptions> & Purchase & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Purchase, {}, import("mongoose").DefaultSchemaOptions> & Purchase & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: Types.ObjectId;
    }>) | null>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
