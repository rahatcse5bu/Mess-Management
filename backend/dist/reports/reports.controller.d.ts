import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
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
