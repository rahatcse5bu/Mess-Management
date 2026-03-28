"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const member_schema_1 = require("../members/schemas/member.schema");
const purchase_schema_1 = require("../purchases/schemas/purchase.schema");
const adjustment_schema_1 = require("../adjustments/schemas/adjustment.schema");
const meal_day_schema_1 = require("../meals/schemas/meal-day.schema");
const date_util_1 = require("../common/date.util");
let ReportsService = class ReportsService {
    memberModel;
    purchaseModel;
    adjustmentModel;
    mealDayModel;
    constructor(memberModel, purchaseModel, adjustmentModel, mealDayModel) {
        this.memberModel = memberModel;
        this.purchaseModel = purchaseModel;
        this.adjustmentModel = adjustmentModel;
        this.mealDayModel = mealDayModel;
    }
    async dueSummary(from, to) {
        const members = await this.memberModel
            .find({ isActive: true })
            .sort({ createdAt: 1 })
            .lean()
            .exec();
        const dateFilter = from && to
            ? { $gte: (0, date_util_1.normalizeDate)(from), $lte: (0, date_util_1.normalizeDate)(to) }
            : undefined;
        const purchaseFilter = dateFilter ? { date: dateFilter } : {};
        const mealFilter = dateFilter ? { date: dateFilter } : {};
        const adjustmentFilter = dateFilter ? { date: dateFilter } : {};
        const [purchases, mealDays, adjustments] = await Promise.all([
            this.purchaseModel.find(purchaseFilter).lean().exec(),
            this.mealDayModel.find(mealFilter).lean().exec(),
            this.adjustmentModel.find(adjustmentFilter).lean().exec(),
        ]);
        const totalCost = purchases.reduce((sum, p) => sum + p.amount, 0);
        const mealByMember = new Map();
        let totalMeals = 0;
        for (const day of mealDays) {
            for (const entry of day.entries) {
                const key = String(entry.memberId);
                mealByMember.set(key, (mealByMember.get(key) || 0) + entry.mealCount);
                totalMeals += entry.mealCount;
            }
        }
        const mealRate = totalMeals > 0 ? totalCost / totalMeals : 0;
        const adjustmentByMember = new Map();
        for (const adjustment of adjustments) {
            const key = String(adjustment.memberId);
            const bucket = adjustmentByMember.get(key) || {
                payment: 0,
                credit: 0,
                debit: 0,
            };
            bucket[adjustment.type] += adjustment.amount;
            adjustmentByMember.set(key, bucket);
        }
        const membersSummary = members.map((member) => {
            const key = String(member._id);
            const meals = mealByMember.get(key) || 0;
            const gross = meals * mealRate;
            const adj = adjustmentByMember.get(key) || {
                payment: 0,
                credit: 0,
                debit: 0,
            };
            const adjusted = adj.payment + adj.credit - adj.debit;
            const due = gross - adjusted;
            return {
                memberId: member._id,
                memberName: member.name,
                meals,
                gross,
                adjusted,
                due,
            };
        });
        return {
            totalCost,
            totalMeals,
            mealRate,
            members: membersSummary,
        };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(member_schema_1.Member.name)),
    __param(1, (0, mongoose_1.InjectModel)(purchase_schema_1.Purchase.name)),
    __param(2, (0, mongoose_1.InjectModel)(adjustment_schema_1.Adjustment.name)),
    __param(3, (0, mongoose_1.InjectModel)(meal_day_schema_1.MealDay.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], ReportsService);
//# sourceMappingURL=reports.service.js.map