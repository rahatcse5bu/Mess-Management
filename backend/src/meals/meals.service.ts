import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { normalizeDate } from '../common/date.util';
import { MealDay, MealDayDocument } from './schemas/meal-day.schema';
import { UpsertMealDayDto } from './dto/upsert-meal-day.dto';

@Injectable()
export class MealsService {
  constructor(
    @InjectModel(MealDay.name)
    private readonly mealDayModel: Model<MealDayDocument>,
  ) {}

  async upsertDay(dto: UpsertMealDayDto) {
    const date = normalizeDate(dto.date);
    return this.mealDayModel
      .findOneAndUpdate(
        { date },
        {
          $set: {
            date,
            elements: dto.elements,
            entries: dto.entries.map((entry) => ({
              memberId: new Types.ObjectId(entry.memberId),
              mealCount: entry.mealCount,
              note: entry.note || '',
            })),
          },
        },
        { upsert: true, new: true },
      )
      .exec();
  }

  getRange(from: string, to: string) {
    return this.mealDayModel
      .find({
        date: { $gte: normalizeDate(from), $lte: normalizeDate(to) },
      })
      .sort({ date: 1 })
      .populate('entries.memberId')
      .exec();
  }

  async memberDailyCounts(from: string, to: string) {
    const days = await this.getRange(from, to);
    return days.map((day) => ({
      date: day.date,
      elements: day.elements,
      members: day.entries,
    }));
  }
}
