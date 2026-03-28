import { Model, Types } from 'mongoose';
import { MemberDocument } from '../members/schemas/member.schema';
import { CookerConfig, CookerConfigDocument } from './schemas/cooker-config.schema';
import { CookingHistory, CookingHistoryDocument } from './schemas/cooking-history.schema';
import { UpdateCookerConfigDto } from './dto/update-cooker-config.dto';
import { ManualAssignDto } from './dto/manual-assign.dto';
export declare class CookingService {
    private readonly configModel;
    private readonly historyModel;
    private readonly memberModel;
    constructor(configModel: Model<CookerConfigDocument>, historyModel: Model<CookingHistoryDocument>, memberModel: Model<MemberDocument>);
    private getConfig;
    private autoMemberIdForDate;
    ensureHistoryThrough(toDateInput: Date | string): Promise<void>;
    getConfigWithPreview(): Promise<{
        config: import("mongoose").Document<unknown, {}, CookerConfig, {}, import("mongoose").DefaultSchemaOptions> & CookerConfig & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
        upcoming: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, CookingHistory, {}, import("mongoose").DefaultSchemaOptions> & CookingHistory & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, CookingHistory, {}, import("mongoose").DefaultSchemaOptions> & CookingHistory & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: Types.ObjectId;
        }>)[];
    }>;
    updateConfig(dto: UpdateCookerConfigDto): Promise<{
        config: import("mongoose").Document<unknown, {}, CookerConfig, {}, import("mongoose").DefaultSchemaOptions> & CookerConfig & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        };
        upcoming: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, CookingHistory, {}, import("mongoose").DefaultSchemaOptions> & CookingHistory & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, CookingHistory, {}, import("mongoose").DefaultSchemaOptions> & CookingHistory & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        } & {
            id: string;
        } & Required<{
            _id: Types.ObjectId;
        }>)[];
    }>;
    manualAssign(dto: ManualAssignDto): Promise<{
        assigned: boolean;
    }>;
    history(from?: string, to?: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, CookingHistory, {}, import("mongoose").DefaultSchemaOptions> & CookingHistory & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, CookingHistory, {}, import("mongoose").DefaultSchemaOptions> & CookingHistory & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: Types.ObjectId;
    }>)[]>;
    current(date?: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, CookingHistory, {}, import("mongoose").DefaultSchemaOptions> & CookingHistory & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, CookingHistory, {}, import("mongoose").DefaultSchemaOptions> & CookingHistory & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: Types.ObjectId;
    }>) | null>;
}
