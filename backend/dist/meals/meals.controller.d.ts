import { MealsService } from './meals.service';
import { UpsertMealDayDto } from './dto/upsert-meal-day.dto';
export declare class MealsController {
    private readonly mealsService;
    constructor(mealsService: MealsService);
    upsertDay(dto: UpsertMealDayDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/meal-day.schema").MealDay, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/meal-day.schema").MealDay & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/meal-day.schema").MealDay, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/meal-day.schema").MealDay & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    getRange(from: string, to: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/meal-day.schema").MealDay, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/meal-day.schema").MealDay & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("./schemas/meal-day.schema").MealDay, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/meal-day.schema").MealDay & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    memberDailyCounts(from: string, to: string): Promise<{
        date: Date;
        elements: string[];
        members: import("./schemas/meal-day.schema").MemberMealEntry[];
    }[]>;
}
