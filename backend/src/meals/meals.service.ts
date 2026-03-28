import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MealDay, MealDayDocument } from './schemas/meal-day.schema';
import { MealElement, MealElementDocument } from './schemas/meal-element.schema';
import { UpsertMealDayDto, CreateMealElementDto } from './dto';
import { normalizeDate, dateKey } from '../common/date.util';

@Injectable()
export class MealsService {
  constructor(
    @InjectModel(MealDay.name) private mealDayModel: Model<MealDayDocument>,
    @InjectModel(MealElement.name) private mealElementModel: Model<MealElementDocument>,
  ) {}

  // Meal Day Operations
  async upsertMealDay(dto: UpsertMealDayDto): Promise<MealDayDocument> {
    const normalizedDate = normalizeDate(dto.date);

    // Calculate totalMeals for each entry
    const entries = dto.entries?.map((entry) => ({
      memberId: new Types.ObjectId(entry.memberId),
      breakfast: entry.breakfast ?? 0,
      lunch: entry.lunch ?? 0,
      dinner: entry.dinner ?? 0,
      totalMeals: entry.totalMeals ?? ((entry.breakfast ?? 0) + (entry.lunch ?? 0) + (entry.dinner ?? 0)),
      note: entry.note,
    }));

    const existingDay = await this.mealDayModel.findOne({ date: normalizedDate });

    if (existingDay) {
      if (existingDay.isLocked && !dto.isLocked) {
        throw new BadRequestException('Cannot modify a locked meal day');
      }

      existingDay.elements = dto.elements ?? existingDay.elements;
      existingDay.entries = (entries ?? existingDay.entries) as any;
      existingDay.notes = dto.notes ?? existingDay.notes;
      if (dto.isLocked !== undefined) {
        existingDay.isLocked = dto.isLocked;
      }

      return existingDay.save();
    }

    return this.mealDayModel.create({
      date: normalizedDate,
      elements: dto.elements ?? [],
      entries: entries ?? [],
      notes: dto.notes,
      isLocked: dto.isLocked ?? false,
    });
  }

  async getMealDay(date: Date | string): Promise<MealDayDocument | null> {
    const normalizedDate = normalizeDate(date);
    return this.mealDayModel.findOne({ date: normalizedDate }).populate('entries.memberId');
  }

  async getMealDaysInRange(from: Date | string, to: Date | string): Promise<MealDayDocument[]> {
    const fromDate = normalizeDate(from);
    const toDate = normalizeDate(to);

    return this.mealDayModel
      .find({
        date: { $gte: fromDate, $lte: toDate },
      })
      .populate('entries.memberId')
      .sort({ date: 1 });
  }

  async getMemberDailyCounts(
    from: Date | string,
    to: Date | string,
  ): Promise<{
    dates: string[];
    members: { memberId: string; name: string; meals: Record<string, number> }[];
    totals: Record<string, number>;
  }> {
    const mealDays = await this.getMealDaysInRange(from, to);

    const dates: string[] = [];
    const memberMeals: Map<string, { name: string; meals: Record<string, number> }> = new Map();
    const totals: Record<string, number> = {};

    for (const day of mealDays) {
      const key = dateKey(day.date);
      dates.push(key);
      totals[key] = 0;

      for (const entry of day.entries) {
        const memberId = entry.memberId.toString();
        const memberDoc = entry.memberId as any;
        const memberName = memberDoc?.name || 'Unknown';

        if (!memberMeals.has(memberId)) {
          memberMeals.set(memberId, { name: memberName, meals: {} });
        }

        const memberData = memberMeals.get(memberId)!;
        memberData.meals[key] = entry.totalMeals;
        totals[key] += entry.totalMeals;
      }
    }

    return {
      dates,
      members: Array.from(memberMeals.entries()).map(([memberId, data]) => ({
        memberId,
        name: data.name,
        meals: data.meals,
      })),
      totals,
    };
  }

  async getMemberMealSummary(
    memberId: string,
    from: Date | string,
    to: Date | string,
  ): Promise<{
    totalMeals: number;
    totalBreakfast: number;
    totalLunch: number;
    totalDinner: number;
    dailyDetails: { date: string; breakfast: number; lunch: number; dinner: number; total: number }[];
  }> {
    const mealDays = await this.getMealDaysInRange(from, to);

    let totalMeals = 0;
    let totalBreakfast = 0;
    let totalLunch = 0;
    let totalDinner = 0;
    const dailyDetails: { date: string; breakfast: number; lunch: number; dinner: number; total: number }[] = [];

    for (const day of mealDays) {
      const entry = day.entries.find(
        (e) => e.memberId.toString() === memberId,
      );

      if (entry) {
        totalBreakfast += entry.breakfast;
        totalLunch += entry.lunch;
        totalDinner += entry.dinner;
        totalMeals += entry.totalMeals;

        dailyDetails.push({
          date: dateKey(day.date),
          breakfast: entry.breakfast,
          lunch: entry.lunch,
          dinner: entry.dinner,
          total: entry.totalMeals,
        });
      }
    }

    return {
      totalMeals,
      totalBreakfast,
      totalLunch,
      totalDinner,
      dailyDetails,
    };
  }

  async deleteMealDay(date: Date | string): Promise<{ deleted: boolean }> {
    const normalizedDate = normalizeDate(date);
    const result = await this.mealDayModel.findOneAndDelete({ date: normalizedDate });
    if (!result) {
      throw new NotFoundException(`Meal day for ${dateKey(date)} not found`);
    }
    return { deleted: true };
  }

  // Meal Element Operations
  async createMealElement(dto: CreateMealElementDto): Promise<MealElementDocument> {
    return this.mealElementModel.create(dto);
  }

  async getAllMealElements(): Promise<MealElementDocument[]> {
    return this.mealElementModel.find({ isActive: true }).sort({ usageCount: -1, name: 1 });
  }

  async updateMealElement(id: string, dto: Partial<CreateMealElementDto>): Promise<MealElementDocument> {
    const element = await this.mealElementModel.findByIdAndUpdate(
      id,
      { $set: dto },
      { new: true },
    );
    if (!element) {
      throw new NotFoundException(`Meal element with ID ${id} not found`);
    }
    return element;
  }

  async deleteMealElement(id: string): Promise<{ deleted: boolean }> {
    const result = await this.mealElementModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Meal element with ID ${id} not found`);
    }
    return { deleted: true };
  }

  async incrementElementUsage(names: string[]): Promise<void> {
    await this.mealElementModel.updateMany(
      { name: { $in: names } },
      { $inc: { usageCount: 1 } },
    );
  }

  // Quick add member meal for a day
  async quickAddMemberMeal(
    date: Date | string,
    memberId: string,
    meals: { breakfast?: number; lunch?: number; dinner?: number },
  ): Promise<MealDayDocument> {
    const normalizedDate = normalizeDate(date);
    let mealDay = await this.mealDayModel.findOne({ date: normalizedDate });

    if (!mealDay) {
      mealDay = new this.mealDayModel({
        date: normalizedDate,
        elements: [],
        entries: [],
      });
    }

    if (mealDay.isLocked) {
      throw new BadRequestException('Cannot modify a locked meal day');
    }

    const existingEntryIndex = mealDay.entries.findIndex(
      (e) => e.memberId.toString() === memberId,
    );

    const breakfast = meals.breakfast ?? 0;
    const lunch = meals.lunch ?? 0;
    const dinner = meals.dinner ?? 0;
    const totalMeals = breakfast + lunch + dinner;

    if (existingEntryIndex >= 0) {
      mealDay.entries[existingEntryIndex].breakfast = breakfast;
      mealDay.entries[existingEntryIndex].lunch = lunch;
      mealDay.entries[existingEntryIndex].dinner = dinner;
      mealDay.entries[existingEntryIndex].totalMeals = totalMeals;
    } else {
      mealDay.entries.push({
        memberId: new Types.ObjectId(memberId),
        breakfast,
        lunch,
        dinner,
        totalMeals,
        note: '',
      });
    }

    return mealDay.save();
  }
}
