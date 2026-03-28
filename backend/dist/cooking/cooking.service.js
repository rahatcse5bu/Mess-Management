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
exports.CookingService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const date_util_1 = require("../common/date.util");
const member_schema_1 = require("../members/schemas/member.schema");
const cooker_config_schema_1 = require("./schemas/cooker-config.schema");
const cooking_history_schema_1 = require("./schemas/cooking-history.schema");
let CookingService = class CookingService {
    configModel;
    historyModel;
    memberModel;
    constructor(configModel, historyModel, memberModel) {
        this.configModel = configModel;
        this.historyModel = historyModel;
        this.memberModel = memberModel;
    }
    async getConfig() {
        let config = await this.configModel.findOne().exec();
        if (!config) {
            const activeMembers = await this.memberModel
                .find({ isActive: true })
                .sort({ createdAt: 1 })
                .exec();
            config = await this.configModel.create({
                termDays: 2,
                rotationStartDate: (0, date_util_1.normalizeDate)(new Date()),
                memberOrder: activeMembers.map((m) => new mongoose_2.Types.ObjectId(m.id)),
            });
        }
        return config;
    }
    async autoMemberIdForDate(date, config) {
        if (!config.memberOrder.length) {
            const activeMembers = await this.memberModel
                .find({ isActive: true })
                .sort({ createdAt: 1 })
                .exec();
            if (!activeMembers.length) {
                return null;
            }
            config.memberOrder = activeMembers.map((m) => new mongoose_2.Types.ObjectId(m.id));
            await config.save();
        }
        const diff = Math.max(0, (0, date_util_1.dayDiff)(config.rotationStartDate, date));
        const slot = Math.floor(diff / Math.max(config.termDays, 1));
        return config.memberOrder[slot % config.memberOrder.length];
    }
    async ensureHistoryThrough(toDateInput) {
        const config = await this.getConfig();
        const toDate = (0, date_util_1.normalizeDate)(toDateInput);
        const start = (0, date_util_1.normalizeDate)(config.rotationStartDate);
        for (let d = start; d <= toDate; d = (0, date_util_1.addDays)(d, 1)) {
            const existing = await this.historyModel.findOne({ date: d }).exec();
            if (existing && existing.source === 'manual') {
                continue;
            }
            const memberId = await this.autoMemberIdForDate(d, config);
            if (!memberId) {
                continue;
            }
            await this.historyModel.updateOne({ date: d }, {
                $set: {
                    date: d,
                    memberId,
                    source: 'auto',
                },
            }, { upsert: true });
        }
    }
    async getConfigWithPreview() {
        const config = await this.getConfig();
        await this.ensureHistoryThrough((0, date_util_1.addDays)(new Date(), 30));
        const history = await this.historyModel
            .find({
            date: {
                $gte: (0, date_util_1.normalizeDate)(new Date()),
                $lte: (0, date_util_1.addDays)((0, date_util_1.normalizeDate)(new Date()), 30),
            },
        })
            .sort({ date: 1 })
            .populate('memberId')
            .exec();
        return { config, upcoming: history };
    }
    async updateConfig(dto) {
        const config = await this.getConfig();
        if (dto.termDays) {
            config.termDays = dto.termDays;
        }
        if (dto.rotationStartDate) {
            config.rotationStartDate = (0, date_util_1.normalizeDate)(dto.rotationStartDate);
        }
        if (dto.memberOrder) {
            config.memberOrder = dto.memberOrder.map((id) => new mongoose_2.Types.ObjectId(id));
        }
        await config.save();
        const today = (0, date_util_1.normalizeDate)(new Date());
        await this.historyModel
            .deleteMany({ date: { $gte: today }, source: 'auto' })
            .exec();
        await this.ensureHistoryThrough((0, date_util_1.addDays)(today, 180));
        return this.getConfigWithPreview();
    }
    async manualAssign(dto) {
        const start = (0, date_util_1.normalizeDate)(dto.startDate);
        const end = (0, date_util_1.normalizeDate)(dto.endDate);
        const memberId = new mongoose_2.Types.ObjectId(dto.memberId);
        for (let d = start; d <= end; d = (0, date_util_1.addDays)(d, 1)) {
            await this.historyModel.updateOne({ date: d }, {
                $set: {
                    date: d,
                    memberId,
                    source: 'manual',
                    note: dto.note || '',
                },
            }, { upsert: true });
        }
        return { assigned: true };
    }
    async history(from, to) {
        await this.ensureHistoryThrough(to || (0, date_util_1.addDays)(new Date(), 30));
        const fromDate = (0, date_util_1.normalizeDate)(from || (0, date_util_1.addDays)(new Date(), -30));
        const toDate = (0, date_util_1.normalizeDate)(to || (0, date_util_1.addDays)(new Date(), 30));
        return this.historyModel
            .find({ date: { $gte: fromDate, $lte: toDate } })
            .sort({ date: 1 })
            .populate('memberId')
            .exec();
    }
    async current(date) {
        const forDate = (0, date_util_1.normalizeDate)(date || new Date());
        await this.ensureHistoryThrough(forDate);
        return this.historyModel
            .findOne({ date: forDate })
            .populate('memberId')
            .exec();
    }
};
exports.CookingService = CookingService;
exports.CookingService = CookingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(cooker_config_schema_1.CookerConfig.name)),
    __param(1, (0, mongoose_1.InjectModel)(cooking_history_schema_1.CookingHistory.name)),
    __param(2, (0, mongoose_1.InjectModel)(member_schema_1.Member.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], CookingService);
//# sourceMappingURL=cooking.service.js.map