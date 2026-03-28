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
exports.CookerConfigSchema = exports.CookerConfig = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let CookerConfig = class CookerConfig {
    termDays;
    memberOrder;
    rotationStartDate;
};
exports.CookerConfig = CookerConfig;
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 2 }),
    __metadata("design:type", Number)
], CookerConfig.prototype, "termDays", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Types.ObjectId, ref: 'Member' }], default: [] }),
    __metadata("design:type", Array)
], CookerConfig.prototype, "memberOrder", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: () => new Date() }),
    __metadata("design:type", Date)
], CookerConfig.prototype, "rotationStartDate", void 0);
exports.CookerConfig = CookerConfig = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], CookerConfig);
exports.CookerConfigSchema = mongoose_1.SchemaFactory.createForClass(CookerConfig);
//# sourceMappingURL=cooker-config.schema.js.map