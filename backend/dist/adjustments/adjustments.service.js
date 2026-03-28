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
exports.AdjustmentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const date_util_1 = require("../common/date.util");
const adjustment_schema_1 = require("./schemas/adjustment.schema");
let AdjustmentsService = class AdjustmentsService {
    adjustmentModel;
    constructor(adjustmentModel) {
        this.adjustmentModel = adjustmentModel;
    }
    create(dto) {
        return this.adjustmentModel.create({
            date: (0, date_util_1.normalizeDate)(dto.date),
            memberId: new mongoose_2.Types.ObjectId(dto.memberId),
            amount: dto.amount,
            type: dto.type,
            note: dto.note || '',
        });
    }
    list(from, to) {
        const filter = {};
        if (from && to) {
            filter.date = { $gte: (0, date_util_1.normalizeDate)(from), $lte: (0, date_util_1.normalizeDate)(to) };
        }
        return this.adjustmentModel
            .find(filter)
            .sort({ date: -1, createdAt: -1 })
            .populate('memberId')
            .exec();
    }
    async remove(id) {
        const deleted = await this.adjustmentModel.findByIdAndDelete(id).exec();
        if (!deleted) {
            throw new common_1.NotFoundException('Adjustment not found');
        }
        return { deleted: true };
    }
};
exports.AdjustmentsService = AdjustmentsService;
exports.AdjustmentsService = AdjustmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(adjustment_schema_1.Adjustment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AdjustmentsService);
//# sourceMappingURL=adjustments.service.js.map