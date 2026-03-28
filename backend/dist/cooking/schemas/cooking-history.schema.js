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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CookingHistorySchema = exports.CookingHistory = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let CookingHistory = class CookingHistory {
    date;
    memberId;
    source;
    note;
};
exports.CookingHistory = CookingHistory;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], CookingHistory.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Member', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], CookingHistory.prototype, "memberId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'auto', enum: ['auto', 'manual'] }),
    __metadata("design:type", String)
], CookingHistory.prototype, "source", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], CookingHistory.prototype, "note", void 0);
exports.CookingHistory = CookingHistory = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], CookingHistory);
exports.CookingHistorySchema = mongoose_1.SchemaFactory.createForClass(CookingHistory);
exports.CookingHistorySchema.index({ date: 1 }, { unique: true });
//# sourceMappingURL=cooking-history.schema.js.map