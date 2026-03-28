import { Model } from 'mongoose';
import { MemberDocument } from '../members/schemas/member.schema';
import { PurchaseDocument } from '../purchases/schemas/purchase.schema';
import { AdjustmentDocument } from '../adjustments/schemas/adjustment.schema';
import { MealDayDocument } from '../meals/schemas/meal-day.schema';
export declare class ReportsService {
    private readonly memberModel;
    private readonly purchaseModel;
    private readonly adjustmentModel;
    private readonly mealDayModel;
    constructor(memberModel: Model<MemberDocument>, purchaseModel: Model<PurchaseDocument>, adjustmentModel: Model<AdjustmentDocument>, mealDayModel: Model<MealDayDocument>);
    dueSummary(from?: string, to?: string): Promise<{
        totalCost: number;
        totalMeals: number;
        mealRate: number;
        members: {
            memberId: import("mongoose").Types.ObjectId;
            memberName: string;
            meals: number;
            gross: number;
            adjusted: number;
            due: number;
        }[];
    }>;
}
