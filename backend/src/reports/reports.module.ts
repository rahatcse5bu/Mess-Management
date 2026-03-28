import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { AuthModule } from '../auth/auth.module';
import { MealsModule } from '../meals/meals.module';
import { PurchasesModule } from '../purchases/purchases.module';
import { AdjustmentsModule } from '../adjustments/adjustments.module';
import { MembersModule } from '../members/members.module';
import { CookingModule } from '../cooking/cooking.module';

@Module({
  imports: [
    AuthModule,
    MealsModule,
    PurchasesModule,
    AdjustmentsModule,
    MembersModule,
    CookingModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
