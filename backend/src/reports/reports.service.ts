import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MealDay, MealDayDocument } from '../meals/schemas/meal-day.schema';
import { Purchase, PurchaseDocument } from '../purchases/schemas/purchase.schema';
import { Adjustment, AdjustmentDocument, AdjustmentType } from '../adjustments/schemas/adjustment.schema';
import { Member, MemberDocument } from '../members/schemas/member.schema';
import { CookingHistory, CookingHistoryDocument } from '../cooking/schemas/cooking-history.schema';
import { normalizeDate, dateKey } from '../common/date.util';

export interface MemberDueSummary {
  memberId: string;
  memberName: string;
  totalMeals: number;
  mealCost: number;
  purchasesPaid: number;
  payments: number;
  credits: number;
  debits: number;
  totalAdjusted: number;
  grossDue: number;
  netDue: number;
  cookingDays: number;
}

export interface DueSummaryReport {
  period: { from: string; to: string };
  totalPurchases: number;
  totalMeals: number;
  mealRate: number;
  members: MemberDueSummary[];
  totalDue: number;
  totalPaid: number;
  balance: number;
}

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(MealDay.name) private mealDayModel: Model<MealDayDocument>,
    @InjectModel(Purchase.name) private purchaseModel: Model<PurchaseDocument>,
    @InjectModel(Adjustment.name) private adjustmentModel: Model<AdjustmentDocument>,
    @InjectModel(Member.name) private memberModel: Model<MemberDocument>,
    @InjectModel(CookingHistory.name) private cookingHistoryModel: Model<CookingHistoryDocument>,
  ) {}

  async getDueSummary(from: string, to: string): Promise<DueSummaryReport> {
    const fromDate = normalizeDate(from);
    const toDate = normalizeDate(to);

    // Get all active members
    const members = await this.memberModel.find({ isActive: true });

    // Get total purchases
    const totalPurchases = await this.getTotalPurchases(fromDate, toDate);

    // Get purchases paid by each member
    const memberPurchases = await this.getPurchasesByMember(fromDate, toDate);

    // Get total meals and per-member meals
    const mealData = await this.getMealData(fromDate, toDate);

    // Calculate meal rate
    const mealRate = mealData.totalMeals > 0 ? totalPurchases / mealData.totalMeals : 0;

    // Get adjustments for each member (payments, credits, debits)
    const adjustmentData = await this.getAdjustmentData(fromDate, toDate);

    // Get cooking days for each member
    const cookingData = await this.getCookingData(fromDate, toDate);

    // Build member summaries
    const memberSummaries: MemberDueSummary[] = [];

    for (const member of members) {
      const memberId = member._id.toString();
      const memberMeals = mealData.memberMeals.get(memberId) || 0;
      const mealCost = memberMeals * mealRate;
      const purchasesPaid = memberPurchases.get(memberId) || 0;
      const adjustments = adjustmentData.get(memberId) || { payments: 0, credits: 0, debits: 0 };
      const cookingDays = cookingData.get(memberId) || 0;

      // Gross due = meal cost (what they owe for meals)
      const grossDue = mealCost;

      // Total adjusted = payments + credits - debits
      // Payments: money they paid to the mess
      // Credits: reductions to their due (e.g., purchased items for mess)
      // Debits: additions to their due
      const totalAdjusted = adjustments.payments + adjustments.credits - adjustments.debits;

      // Net due = gross due - purchases they paid - adjusted amount
      // If they paid for purchases, that reduces their due
      const netDue = grossDue - purchasesPaid - totalAdjusted;

      memberSummaries.push({
        memberId,
        memberName: member.name,
        totalMeals: memberMeals,
        mealCost: Math.round(mealCost * 100) / 100,
        purchasesPaid: Math.round(purchasesPaid * 100) / 100,
        payments: adjustments.payments,
        credits: adjustments.credits,
        debits: adjustments.debits,
        totalAdjusted: Math.round(totalAdjusted * 100) / 100,
        grossDue: Math.round(grossDue * 100) / 100,
        netDue: Math.round(netDue * 100) / 100,
        cookingDays,
      });
    }

    // Calculate totals
    const totalDue = memberSummaries.reduce((sum, m) => sum + m.grossDue, 0);
    const totalPaid = memberSummaries.reduce((sum, m) => sum + m.purchasesPaid + m.totalAdjusted, 0);

    return {
      period: { from: dateKey(fromDate), to: dateKey(toDate) },
      totalPurchases: Math.round(totalPurchases * 100) / 100,
      totalMeals: mealData.totalMeals,
      mealRate: Math.round(mealRate * 100) / 100,
      members: memberSummaries.sort((a, b) => b.netDue - a.netDue),
      totalDue: Math.round(totalDue * 100) / 100,
      totalPaid: Math.round(totalPaid * 100) / 100,
      balance: Math.round((totalDue - totalPaid) * 100) / 100,
    };
  }

  private async getTotalPurchases(from: Date, to: Date): Promise<number> {
    const result = await this.purchaseModel.aggregate([
      {
        $match: {
          date: { $gte: from, $lte: to },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);

    return result[0]?.total || 0;
  }

  private async getPurchasesByMember(from: Date, to: Date): Promise<Map<string, number>> {
    const result = await this.purchaseModel.aggregate([
      {
        $match: {
          date: { $gte: from, $lte: to },
          paidByMemberId: { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: '$paidByMemberId',
          total: { $sum: '$amount' },
        },
      },
    ]);

    const map = new Map<string, number>();
    for (const item of result) {
      map.set(item._id.toString(), item.total);
    }
    return map;
  }

  private async getMealData(from: Date, to: Date): Promise<{
    totalMeals: number;
    memberMeals: Map<string, number>;
  }> {
    const mealDays = await this.mealDayModel.find({
      date: { $gte: from, $lte: to },
    });

    let totalMeals = 0;
    const memberMeals = new Map<string, number>();

    for (const day of mealDays) {
      for (const entry of day.entries) {
        const memberId = entry.memberId.toString();
        const meals = entry.totalMeals;
        totalMeals += meals;
        memberMeals.set(memberId, (memberMeals.get(memberId) || 0) + meals);
      }
    }

    return { totalMeals, memberMeals };
  }

  private async getAdjustmentData(from: Date, to: Date): Promise<
    Map<string, { payments: number; credits: number; debits: number }>
  > {
    const result = await this.adjustmentModel.aggregate([
      {
        $match: {
          date: { $gte: from, $lte: to },
          isVoided: { $ne: true },
        },
      },
      {
        $group: {
          _id: { memberId: '$memberId', type: '$type' },
          total: { $sum: '$amount' },
        },
      },
    ]);

    const map = new Map<string, { payments: number; credits: number; debits: number }>();

    for (const item of result) {
      const memberId = item._id.memberId.toString();
      if (!map.has(memberId)) {
        map.set(memberId, { payments: 0, credits: 0, debits: 0 });
      }

      const memberData = map.get(memberId)!;
      switch (item._id.type) {
        case AdjustmentType.PAYMENT:
          memberData.payments = item.total;
          break;
        case AdjustmentType.CREDIT:
          memberData.credits = item.total;
          break;
        case AdjustmentType.DEBIT:
          memberData.debits = item.total;
          break;
        case AdjustmentType.SETTLEMENT:
          // Settlements are handled differently - they're transfers
          break;
      }
    }

    return map;
  }

  private async getCookingData(from: Date, to: Date): Promise<Map<string, number>> {
    const result = await this.cookingHistoryModel.aggregate([
      {
        $match: {
          date: { $gte: from, $lte: to },
        },
      },
      {
        $group: {
          _id: '$memberId',
          count: { $sum: 1 },
        },
      },
    ]);

    const map = new Map<string, number>();
    for (const item of result) {
      map.set(item._id.toString(), item.count);
    }
    return map;
  }

  // Get member detailed report
  async getMemberDetailedReport(
    memberId: string,
    from: string,
    to: string,
  ): Promise<{
    member: MemberDocument;
    meals: { date: string; breakfast: number; lunch: number; dinner: number; total: number }[];
    purchases: PurchaseDocument[];
    adjustments: AdjustmentDocument[];
    cookingDays: { date: string; source: string }[];
    summary: MemberDueSummary;
  }> {
    const fromDate = normalizeDate(from);
    const toDate = normalizeDate(to);

    const member = await this.memberModel.findById(memberId);
    if (!member) {
      throw new Error('Member not found');
    }

    // Get meals
    const mealDays = await this.mealDayModel.find({
      date: { $gte: fromDate, $lte: toDate },
    });

    const meals: { date: string; breakfast: number; lunch: number; dinner: number; total: number }[] = [];
    for (const day of mealDays) {
      const entry = day.entries.find((e) => e.memberId.toString() === memberId);
      if (entry) {
        meals.push({
          date: dateKey(day.date),
          breakfast: entry.breakfast,
          lunch: entry.lunch,
          dinner: entry.dinner,
          total: entry.totalMeals,
        });
      }
    }

    // Get purchases paid by member
    const purchases = await this.purchaseModel.find({
      date: { $gte: fromDate, $lte: toDate },
      paidByMemberId: new Types.ObjectId(memberId),
    });

    // Get adjustments
    const adjustments = await this.adjustmentModel.find({
      date: { $gte: fromDate, $lte: toDate },
      memberId: new Types.ObjectId(memberId),
      isVoided: { $ne: true },
    });

    // Get cooking days
    const cookingHistory = await this.cookingHistoryModel.find({
      date: { $gte: fromDate, $lte: toDate },
      memberId: new Types.ObjectId(memberId),
    });

    const cookingDays = cookingHistory.map((h) => ({
      date: dateKey(h.date),
      source: h.source,
    }));

    // Get summary from due summary
    const dueSummary = await this.getDueSummary(from, to);
    const memberSummary = dueSummary.members.find((m) => m.memberId === memberId) || {
      memberId,
      memberName: member.name,
      totalMeals: 0,
      mealCost: 0,
      purchasesPaid: 0,
      payments: 0,
      credits: 0,
      debits: 0,
      totalAdjusted: 0,
      grossDue: 0,
      netDue: 0,
      cookingDays: 0,
    };

    return {
      member,
      meals,
      purchases,
      adjustments,
      cookingDays,
      summary: memberSummary,
    };
  }

  // Get monthly report
  async getMonthlyReport(year: number, month: number): Promise<DueSummaryReport> {
    const from = new Date(Date.UTC(year, month - 1, 1));
    const to = new Date(Date.UTC(year, month, 0));
    return this.getDueSummary(dateKey(from), dateKey(to));
  }

  // Get summary statistics
  async getSummaryStats(from: string, to: string): Promise<{
    totalPurchases: number;
    totalMeals: number;
    mealRate: number;
    totalMembers: number;
    totalDue: number;
    totalPaid: number;
    averageMealPerMember: number;
    averageDuePerMember: number;
  }> {
    const report = await this.getDueSummary(from, to);

    return {
      totalPurchases: report.totalPurchases,
      totalMeals: report.totalMeals,
      mealRate: report.mealRate,
      totalMembers: report.members.length,
      totalDue: report.totalDue,
      totalPaid: report.totalPaid,
      averageMealPerMember:
        report.members.length > 0
          ? Math.round((report.totalMeals / report.members.length) * 100) / 100
          : 0,
      averageDuePerMember:
        report.members.length > 0
          ? Math.round((report.totalDue / report.members.length) * 100) / 100
          : 0,
    };
  }
}
