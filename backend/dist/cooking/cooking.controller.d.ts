import { CookingService } from './cooking.service';
import { UpdateCookerConfigDto } from './dto/update-cooker-config.dto';
import { ManualAssignDto } from './dto/manual-assign.dto';
export declare class CookingController {
    private readonly cookingService;
    constructor(cookingService: CookingService);
    config(): Promise<{
        config: import("mongoose").Document<unknown, {}, import("./schemas/cooker-config.schema").CookerConfig, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/cooker-config.schema").CookerConfig & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
        upcoming: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/cooking-history.schema").CookingHistory, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/cooking-history.schema").CookingHistory & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/cooking-history.schema").CookingHistory, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/cooking-history.schema").CookingHistory & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>)[];
    }>;
    updateConfig(dto: UpdateCookerConfigDto): Promise<{
        config: import("mongoose").Document<unknown, {}, import("./schemas/cooker-config.schema").CookerConfig, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/cooker-config.schema").CookerConfig & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
        upcoming: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/cooking-history.schema").CookingHistory, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/cooking-history.schema").CookingHistory & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/cooking-history.schema").CookingHistory, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/cooking-history.schema").CookingHistory & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>)[];
    }>;
    manualAssign(dto: ManualAssignDto): Promise<{
        assigned: boolean;
    }>;
    history(from?: string, to?: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/cooking-history.schema").CookingHistory, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/cooking-history.schema").CookingHistory & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/cooking-history.schema").CookingHistory, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/cooking-history.schema").CookingHistory & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    current(date?: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/cooking-history.schema").CookingHistory, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/cooking-history.schema").CookingHistory & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/cooking-history.schema").CookingHistory, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/cooking-history.schema").CookingHistory & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>) | null>;
}
