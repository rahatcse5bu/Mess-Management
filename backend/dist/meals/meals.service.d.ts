import { Model, Types } from 'mongoose';
import { MealDay, MealDayDocument } from './schemas/meal-day.schema';
import { UpsertMealDayDto } from './dto/upsert-meal-day.dto';
export declare class MealsService {
    private readonly mealDayModel;
    constructor(mealDayModel: Model<MealDayDocument>);
    upsertDay(dto: UpsertMealDayDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, MealDay, {}, import("mongoose").DefaultSchemaOptions> & MealDay & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, MealDay, {}, import("mongoose").DefaultSchemaOptions> & MealDay & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    getRange(from: string, to: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, MealDay, {}, import("mongoose").DefaultSchemaOptions> & MealDay & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, MealDay, {}, import("mongoose").DefaultSchemaOptions> & MealDay & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: Types.ObjectId;
    }>)[]>;
    memberDailyCounts(from: string, to: string): Promise<{
        date: Date;
        elements: string[];
        members: import("./schemas/meal-day.schema").MemberMealEntry[];
    }[]>;
}
