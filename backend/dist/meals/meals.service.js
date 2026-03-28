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
exports.MealsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const date_util_1 = require("../common/date.util");
const meal_day_schema_1 = require("./schemas/meal-day.schema");
let MealsService = class MealsService {
    mealDayModel;
    constructor(mealDayModel) {
        this.mealDayModel = mealDayModel;
    }
    async upsertDay(dto) {
        const date = (0, date_util_1.normalizeDate)(dto.date);
        return this.mealDayModel
            .findOneAndUpdate({ date }, {
            $set: {
                date,
                elements: dto.elements,
                entries: dto.entries.map((entry) => ({
                    memberId: new mongoose_2.Types.ObjectId(entry.memberId),
                    mealCount: entry.mealCount,
                    note: entry.note || '',
                })),
            },
        }, { upsert: true, new: true })
            .exec();
    }
    getRange(from, to) {
        return this.mealDayModel
            .find({
            date: { $gte: (0, date_util_1.normalizeDate)(from), $lte: (0, date_util_1.normalizeDate)(to) },
        })
            .sort({ date: 1 })
            .populate('entries.memberId')
            .exec();
    }
    async memberDailyCounts(from, to) {
        const days = await this.getRange(from, to);
        return days.map((day) => ({
            date: day.date,
            elements: day.elements,
            members: day.entries,
        }));
    }
};
exports.MealsService = MealsService;
exports.MealsService = MealsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(meal_day_schema_1.MealDay.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], MealsService);
//# sourceMappingURL=meals.service.js.map