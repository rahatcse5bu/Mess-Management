"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CookingModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const cooking_controller_1 = require("./cooking.controller");
const cooking_service_1 = require("./cooking.service");
const cooker_config_schema_1 = require("./schemas/cooker-config.schema");
const cooking_history_schema_1 = require("./schemas/cooking-history.schema");
const member_schema_1 = require("../members/schemas/member.schema");
let CookingModule = class CookingModule {
};
exports.CookingModule = CookingModule;
exports.CookingModule = CookingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: cooker_config_schema_1.CookerConfig.name, schema: cooker_config_schema_1.CookerConfigSchema },
                { name: cooking_history_schema_1.CookingHistory.name, schema: cooking_history_schema_1.CookingHistorySchema },
                { name: member_schema_1.Member.name, schema: member_schema_1.MemberSchema },
            ]),
        ],
        controllers: [cooking_controller_1.CookingController],
        providers: [cooking_service_1.CookingService],
        exports: [cooking_service_1.CookingService],
    })
], CookingModule);
//# sourceMappingURL=cooking.module.js.map