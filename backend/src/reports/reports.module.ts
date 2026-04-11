import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Member, MemberSchema } from '../members/schemas/member.schema';
import { Purchase, PurchaseSchema } from '../purchases/schemas/purchase.schema';
import {
  Adjustment,
  AdjustmentSchema,
} from '../adjustments/schemas/adjustment.schema';
import { MealDay, MealDaySchema } from '../meals/schemas/meal-day.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Member.name, schema: MemberSchema },
      { name: Purchase.name, schema: PurchaseSchema },
      { name: Adjustment.name, schema: AdjustmentSchema },
      { name: MealDay.name, schema: MealDaySchema },
    ]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
