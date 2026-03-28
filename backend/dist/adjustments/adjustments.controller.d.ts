import { CreateAdjustmentDto } from './dto/create-adjustment.dto';
import { AdjustmentsService } from './adjustments.service';
export declare class AdjustmentsController {
    private readonly adjustmentsService;
    constructor(adjustmentsService: AdjustmentsService);
    create(dto: CreateAdjustmentDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/adjustment.schema").Adjustment, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/adjustment.schema").Adjustment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/adjustment.schema").Adjustment, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/adjustment.schema").Adjustment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    list(from?: string, to?: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/adjustment.schema").Adjustment, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/adjustment.schema").Adjustment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/adjustment.schema").Adjustment, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/adjustment.schema").Adjustment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    remove(id: string): Promise<{
        deleted: boolean;
    }>;
}
