import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { addDays, dayDiff, normalizeDate } from '../common/date.util';
import { Member, MemberDocument } from '../members/schemas/member.schema';
import {
  CookerConfig,
  CookerConfigDocument,
} from './schemas/cooker-config.schema';
import {
  CookingHistory,
  CookingHistoryDocument,
} from './schemas/cooking-history.schema';
import { UpdateCookerConfigDto } from './dto/update-cooker-config.dto';
import { ManualAssignDto } from './dto/manual-assign.dto';

@Injectable()
export class CookingService {
  constructor(
    @InjectModel(CookerConfig.name)
    private readonly configModel: Model<CookerConfigDocument>,
    @InjectModel(CookingHistory.name)
    private readonly historyModel: Model<CookingHistoryDocument>,
    @InjectModel(Member.name)
    private readonly memberModel: Model<MemberDocument>,
  ) {}

  private async getConfig(): Promise<CookerConfigDocument> {
    let config = await this.configModel.findOne().exec();
    if (!config) {
      const activeCookers = await this.memberModel
        .find({ isActive: true, isCooker: { $ne: false } })
        .sort({ createdAt: 1 })
        .exec();
      config = await this.configModel.create({
        termDays: 2,
        rotationStartDate: normalizeDate(new Date()),
        memberOrder: activeCookers.map((m) => new Types.ObjectId(m.id)),
      });
      return config;
    }

    // Sync memberOrder: add new active cookers, remove inactive/non-cookers
    const activeCookers = await this.memberModel
      .find({ isActive: true, isCooker: { $ne: false } })
      .sort({ createdAt: 1 })
      .exec();
    const activeCookerIds = new Set(activeCookers.map((m) => m.id));
    const existingIds = new Set(config.memberOrder.map((id) => id.toString()));

    // Remove members who are no longer active cookers
    const filtered = config.memberOrder.filter((id) =>
      activeCookerIds.has(id.toString()),
    );
    // Append new active cookers not yet in the order
    const newMembers = activeCookers
      .filter((m) => !existingIds.has(m.id))
      .map((m) => new Types.ObjectId(m.id));

    if (
      filtered.length !== config.memberOrder.length ||
      newMembers.length > 0
    ) {
      config.memberOrder = [...filtered, ...newMembers];
      await config.save();
    }

    return config;
  }

  private async autoMemberIdForDate(
    date: Date,
    config: CookerConfigDocument,
  ): Promise<Types.ObjectId | null> {
    if (!config.memberOrder.length) {
      const activeMembers = await this.memberModel
        .find({ isActive: true, isCooker: { $ne: false } })
        .sort({ createdAt: 1 })
        .exec();
      if (!activeMembers.length) {
        return null;
      }
      config.memberOrder = activeMembers.map((m) => new Types.ObjectId(m.id));
      await config.save();
    }

    const diff = Math.max(0, dayDiff(config.rotationStartDate, date));
    const slot = Math.floor(diff / Math.max(config.termDays, 1));
    return config.memberOrder[slot % config.memberOrder.length];
  }

  async ensureHistoryThrough(toDateInput: Date | string): Promise<void> {
    const config = await this.getConfig();
    const toDate = normalizeDate(toDateInput);
    const start = normalizeDate(config.rotationStartDate);

    for (let d = start; d <= toDate; d = addDays(d, 1)) {
      const existing = await this.historyModel.findOne({ date: d }).exec();
      if (existing && existing.source === 'manual') {
        continue;
      }
      const memberId = await this.autoMemberIdForDate(d, config);
      if (!memberId) {
        continue;
      }
      await this.historyModel.updateOne(
        { date: d },
        {
          $set: {
            date: d,
            memberId,
            source: 'auto',
          },
        },
        { upsert: true },
      );
    }
  }

  async getConfigWithPreview() {
    const config = await this.getConfig();

    // Rebuild future auto-history so it reflects the current memberOrder
    const today = normalizeDate(new Date());
    await this.historyModel
      .deleteMany({ date: { $gte: today }, source: 'auto' })
      .exec();
    await this.ensureHistoryThrough(addDays(today, 30));

    const history = await this.historyModel
      .find({
        date: {
          $gte: today,
          $lte: addDays(today, 30),
        },
      })
      .sort({ date: 1 })
      .populate('memberId')
      .exec();

    return { config, upcoming: history };
  }

  async updateConfig(dto: UpdateCookerConfigDto) {
    const config = await this.getConfig();
    if (dto.termDays) {
      config.termDays = dto.termDays;
    }
    if (dto.rotationStartDate) {
      config.rotationStartDate = normalizeDate(dto.rotationStartDate);
    }
    if (dto.memberOrder) {
      config.memberOrder = dto.memberOrder.map((id) => new Types.ObjectId(id));
    }
    await config.save();

    const today = normalizeDate(new Date());
    await this.historyModel
      .deleteMany({ date: { $gte: today }, source: 'auto' })
      .exec();
    await this.ensureHistoryThrough(addDays(today, 180));
    return this.getConfigWithPreview();
  }

  async manualAssign(dto: ManualAssignDto) {
    const start = normalizeDate(dto.startDate);
    const end = normalizeDate(dto.endDate);
    const memberId = new Types.ObjectId(dto.memberId);

    // 1. Write the manual entries
    for (let d = start; d <= end; d = addDays(d, 1)) {
      await this.historyModel.updateOne(
        { date: d },
        {
          $set: {
            date: d,
            memberId,
            source: 'manual',
            note: dto.note || '',
          },
        },
        { upsert: true },
      );
    }

    // 2. Shift rotation so the NEXT member starts the day after this range
    const config = await this.getConfig();
    const nextDay = addDays(end, 1);

    // Find the assigned member's position, rotate order so next person is first
    const assignedIdx = config.memberOrder.findIndex(
      (id) => id.toString() === memberId.toString(),
    );
    if (assignedIdx !== -1 && config.memberOrder.length > 1) {
      const nextIdx = (assignedIdx + 1) % config.memberOrder.length;
      // Rotate: [nextIdx ... end, 0 ... nextIdx-1]
      config.memberOrder = [
        ...config.memberOrder.slice(nextIdx),
        ...config.memberOrder.slice(0, nextIdx),
      ];
    }
    config.rotationStartDate = nextDay;
    await config.save();

    // 3. Clear future auto entries after the manual range and rebuild
    await this.historyModel
      .deleteMany({ date: { $gte: nextDay }, source: 'auto' })
      .exec();
    await this.ensureHistoryThrough(addDays(nextDay, 180));

    return { assigned: true };
  }

  async deleteHistory(id: string) {
    await this.historyModel.findByIdAndDelete(id).exec();
    return { deleted: true };
  }

  async history(from?: string, to?: string) {
    await this.ensureHistoryThrough(to || addDays(new Date(), 30));
    const fromDate = normalizeDate(from || addDays(new Date(), -30));
    const toDate = normalizeDate(to || addDays(new Date(), 30));

    return this.historyModel
      .find({ date: { $gte: fromDate, $lte: toDate } })
      .sort({ date: 1 })
      .populate('memberId')
      .exec();
  }

  async current(date?: string) {
    const forDate = normalizeDate(date || new Date());
    await this.ensureHistoryThrough(forDate);
    return this.historyModel
      .findOne({ date: forDate })
      .populate('memberId')
      .exec();
  }
}
