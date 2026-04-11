import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member, MemberDocument } from '../members/schemas/member.schema';
import {
  Purchase,
  PurchaseDocument,
} from '../purchases/schemas/purchase.schema';
import {
  Adjustment,
  AdjustmentDocument,
} from '../adjustments/schemas/adjustment.schema';
import { MealDay, MealDayDocument } from '../meals/schemas/meal-day.schema';
import { normalizeDate } from '../common/date.util';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Member.name)
    private readonly memberModel: Model<MemberDocument>,
    @InjectModel(Purchase.name)
    private readonly purchaseModel: Model<PurchaseDocument>,
    @InjectModel(Adjustment.name)
    private readonly adjustmentModel: Model<AdjustmentDocument>,
    @InjectModel(MealDay.name)
    private readonly mealDayModel: Model<MealDayDocument>,
  ) {}

  async dueSummary(from?: string, to?: string) {
    const members = await this.memberModel
      .find({ isActive: true })
      .sort({ createdAt: 1 })
      .lean()
      .exec();

    const dateFilter =
      from && to
        ? { $gte: normalizeDate(from), $lte: normalizeDate(to) }
        : undefined;
    const purchaseFilter = dateFilter ? { date: dateFilter } : {};
    const mealFilter = dateFilter ? { date: dateFilter } : {};
    const adjustmentFilter = dateFilter ? { date: dateFilter } : {};

    const [purchases, mealDays, adjustments] = await Promise.all([
      this.purchaseModel.find(purchaseFilter).lean().exec(),
      this.mealDayModel.find(mealFilter).lean().exec(),
      this.adjustmentModel.find(adjustmentFilter).lean().exec(),
    ]);

    const totalCost = purchases.reduce((sum, p) => sum + p.amount, 0);

    const mealByMember = new Map<string, number>();
    let totalMeals = 0;
    for (const day of mealDays) {
      for (const entry of day.entries) {
        const key = String(entry.memberId);
        mealByMember.set(key, (mealByMember.get(key) || 0) + entry.mealCount);
        totalMeals += entry.mealCount;
      }
    }

    const mealRate = totalMeals > 0 ? totalCost / totalMeals : 0;

    const adjustmentByMember = new Map<
      string,
      { payment: number; credit: number; debit: number }
    >();
    for (const adjustment of adjustments) {
      const key = String(adjustment.memberId);
      const bucket = adjustmentByMember.get(key) || {
        payment: 0,
        credit: 0,
        debit: 0,
      };
      bucket[adjustment.type] += adjustment.amount;
      adjustmentByMember.set(key, bucket);
    }

    const membersSummary = members.map((member) => {
      const key = String(member._id);
      const meals = mealByMember.get(key) || 0;
      const gross = meals * mealRate;
      const adj = adjustmentByMember.get(key) || {
        payment: 0,
        credit: 0,
        debit: 0,
      };
      const adjusted = adj.payment + adj.credit - adj.debit;
      const due = gross - adjusted;

      return {
        memberId: member._id,
        memberName: member.name,
        meals,
        gross,
        adjusted,
        due,
      };
    });

    return {
      totalCost,
      totalMeals,
      mealRate,
      members: membersSummary,
    };
  }
}
