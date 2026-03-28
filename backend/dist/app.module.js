"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const auth_module_1 = require("./auth/auth.module");
const members_module_1 = require("./members/members.module");
const cooking_module_1 = require("./cooking/cooking.module");
const meals_module_1 = require("./meals/meals.module");
const purchases_module_1 = require("./purchases/purchases.module");
const adjustments_module_1 = require("./adjustments/adjustments.module");
const reports_module_1 = require("./reports/reports.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRoot(process.env.MONGO_URI ||
                'mongodb+srv://rahatcse5bu:01783307672Rahat@cluster0.t9xf7li.mongodb.net/', {
                dbName: process.env.MONGO_DB || 'mess_management',
            }),
            auth_module_1.AuthModule,
            members_module_1.MembersModule,
            cooking_module_1.CookingModule,
            meals_module_1.MealsModule,
            purchases_module_1.PurchasesModule,
            adjustments_module_1.AdjustmentsModule,
            reports_module_1.ReportsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map