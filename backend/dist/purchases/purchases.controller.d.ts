import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { PurchasesService } from './purchases.service';
export declare class PurchasesController {
    private readonly purchasesService;
    constructor(purchasesService: PurchasesService);
    create(dto: CreatePurchaseDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/purchase.schema").Purchase, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/purchase.schema").Purchase & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/purchase.schema").Purchase, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/purchase.schema").Purchase & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    list(from?: string, to?: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/purchase.schema").Purchase, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/purchase.schema").Purchase & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/purchase.schema").Purchase, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/purchase.schema").Purchase & {
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
