import { Model, Types } from 'mongoose';
import { CreateAdjustmentDto } from './dto/create-adjustment.dto';
import { Adjustment, AdjustmentDocument } from './schemas/adjustment.schema';
export declare class AdjustmentsService {
    private readonly adjustmentModel;
    constructor(adjustmentModel: Model<AdjustmentDocument>);
    create(dto: CreateAdjustmentDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Adjustment, {}, import("mongoose").DefaultSchemaOptions> & Adjustment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Adjustment, {}, import("mongoose").DefaultSchemaOptions> & Adjustment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    list(from?: string, to?: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Adjustment, {}, import("mongoose").DefaultSchemaOptions> & Adjustment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Adjustment, {}, import("mongoose").DefaultSchemaOptions> & Adjustment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: Types.ObjectId;
    }>)[]>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
