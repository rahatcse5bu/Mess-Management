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
exports.CookingController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const cooking_service_1 = require("./cooking.service");
const update_cooker_config_dto_1 = require("./dto/update-cooker-config.dto");
const manual_assign_dto_1 = require("./dto/manual-assign.dto");
let CookingController = class CookingController {
    cookingService;
    constructor(cookingService) {
        this.cookingService = cookingService;
    }
    config() {
        return this.cookingService.getConfigWithPreview();
    }
    updateConfig(dto) {
        return this.cookingService.updateConfig(dto);
    }
    manualAssign(dto) {
        return this.cookingService.manualAssign(dto);
    }
    history(from, to) {
        return this.cookingService.history(from, to);
    }
    current(date) {
        return this.cookingService.current(date);
    }
};
exports.CookingController = CookingController;
__decorate([
    (0, common_1.Get)('config'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CookingController.prototype, "config", null);
__decorate([
    (0, common_1.Patch)('config'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_cooker_config_dto_1.UpdateCookerConfigDto]),
    __metadata("design:returntype", void 0)
], CookingController.prototype, "updateConfig", null);
__decorate([
    (0, common_1.Post)('manual-assign'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [manual_assign_dto_1.ManualAssignDto]),
    __metadata("design:returntype", void 0)
], CookingController.prototype, "manualAssign", null);
__decorate([
    (0, common_1.Get)('history'),
    __param(0, (0, common_1.Query)('from')),
    __param(1, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CookingController.prototype, "history", null);
__decorate([
    (0, common_1.Get)('current'),
    __param(0, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CookingController.prototype, "current", null);
exports.CookingController = CookingController = __decorate([
    (0, common_1.Controller)('cooking'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [cooking_service_1.CookingService])
], CookingController);
//# sourceMappingURL=cooking.controller.js.map