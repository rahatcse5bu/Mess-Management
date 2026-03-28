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
exports.PurchasesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const date_util_1 = require("../common/date.util");
const purchase_schema_1 = require("./schemas/purchase.schema");
let PurchasesService = class PurchasesService {
    purchaseModel;
    constructor(purchaseModel) {
        this.purchaseModel = purchaseModel;
    }
    create(dto) {
        return this.purchaseModel.create({
            date: (0, date_util_1.normalizeDate)(dto.date),
            description: dto.description,
            amount: dto.amount,
            category: dto.category || 'general',
            paidByMemberId: dto.paidByMemberId
                ? new mongoose_2.Types.ObjectId(dto.paidByMemberId)
                : undefined,
            note: dto.note || '',
        });
    }
    list(from, to) {
        const filter = {};
        if (from && to) {
            filter.date = { $gte: (0, date_util_1.normalizeDate)(from), $lte: (0, date_util_1.normalizeDate)(to) };
        }
        return this.purchaseModel
            .find(filter)
            .sort({ date: -1, createdAt: -1 })
            .populate('paidByMemberId')
            .exec();
    }
    async remove(id) {
        const deleted = await this.purchaseModel.findByIdAndDelete(id).exec();
        if (!deleted) {
            throw new common_1.NotFoundException('Purchase not found');
        }
        return { deleted: true };
    }
};
exports.PurchasesService = PurchasesService;
exports.PurchasesService = PurchasesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(purchase_schema_1.Purchase.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], PurchasesService);
//# sourceMappingURL=purchases.service.js.map