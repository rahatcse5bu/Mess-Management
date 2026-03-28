import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CookerConfig, CookerConfigDocument } from './schemas/cooker-config.schema';
import { CookingHistory, CookingHistoryDocument } from './schemas/cooking-history.schema';
import { UpdateCookerConfigDto, ManualAssignDto } from './dto';
import { normalizeDate, dateKey, addDays, dayDiff } from '../common/date.util';
import { Member, MemberDocument } from '../members/schemas/member.schema';

@Injectable()
export class CookingService implements OnModuleInit {
  constructor(
    @InjectModel(CookerConfig.name) private configModel: Model<CookerConfigDocument>,
    @InjectModel(CookingHistory.name) private historyModel: Model<CookingHistoryDocument>,
    @InjectModel(Member.name) private memberModel: Model<MemberDocument>,
  ) {}

  async onModuleInit() {
    await this.ensureConfig();
  }

  private async ensureConfig(): Promise<CookerConfigDocument> {
    let config = await this.configModel.findOne();
    if (!config) {
      // Get all active cookers in order
      const members = await this.memberModel
        .find({ isActive: true, canCook: true })
        .sort({ cookerOrder: 1 });

      config = await this.configModel.create({
        termDays: 2,
        memberOrder: members.map((m) => m._id),
        rotationStartDate: normalizeDate(new Date()),
        currentIndex: 0,
        autoRotate: true,
      });
    }
    return config;
  }

  async getConfig(): Promise<CookerConfigDocument> {
    return this.ensureConfig();
  }

  async getConfigWithPreview(days = 30): Promise<{
    config: CookerConfigDocument;
    preview: { date: string; memberId: string; memberName: string; source: string }[];
  }> {
    const config = await this.getConfig();
    const configPopulated = await this.configModel
      .findById(config._id)
      .populate('memberOrder');

    const preview = await this.getRotationPreview(days);

    return {
      config: configPopulated!,
      preview,
    };
  }

  async updateConfig(dto: UpdateCookerConfigDto): Promise<CookerConfigDocument> {
    const config = await this.ensureConfig();

    if (dto.termDays !== undefined) config.termDays = dto.termDays;
    if (dto.rotationStartDate !== undefined) config.rotationStartDate = normalizeDate(dto.rotationStartDate);
    if (dto.currentIndex !== undefined) config.currentIndex = dto.currentIndex;
    if (dto.autoRotate !== undefined) config.autoRotate = dto.autoRotate;

    if (dto.memberOrder !== undefined) {
      config.memberOrder = dto.memberOrder.map((id) => new Types.ObjectId(id));
    }

    return config.save();
  }

  async reorderMembers(memberIds: string[]): Promise<CookerConfigDocument> {
    const config = await this.ensureConfig();
    config.memberOrder = memberIds.map((id) => new Types.ObjectId(id));

    // Also update member cookerOrder field
    for (let i = 0; i < memberIds.length; i++) {
      await this.memberModel.findByIdAndUpdate(memberIds[i], { cookerOrder: i });
    }

    return config.save();
  }

  async syncMembersFromOrder(): Promise<void> {
    const members = await this.memberModel
      .find({ isActive: true, canCook: true })
      .sort({ cookerOrder: 1 });

    const config = await this.ensureConfig();
    config.memberOrder = members.map((m) => m._id);
    await config.save();
  }

  // Calculate who should cook on a given date based on rotation
  async calculateCookerForDate(date: Date | string): Promise<{
    memberId: Types.ObjectId | null;
    source: 'auto' | 'manual';
    memberName?: string;
  }> {
    const normalizedDate = normalizeDate(date);

    // First check if there's a manual override
    const manualOverride = await this.historyModel
      .findOne({ date: normalizedDate, source: 'manual' })
      .populate('memberId');

    if (manualOverride) {
      const member = manualOverride.memberId as any;
      return {
        memberId: manualOverride.memberId,
        source: 'manual',
        memberName: member?.name,
      };
    }

    const config = await this.ensureConfig();
    const configPopulated = await this.configModel
      .findById(config._id)
      .populate('memberOrder');

    if (!configPopulated?.memberOrder.length) {
      return { memberId: null, source: 'auto' };
    }

    const startDate = normalizeDate(config.rotationStartDate);
    const daysFromStart = dayDiff(startDate, normalizedDate);

    if (daysFromStart < 0) {
      // Date is before rotation start
      return { memberId: null, source: 'auto' };
    }

    const termIndex = Math.floor(daysFromStart / config.termDays);
    const memberIndex = (config.currentIndex + termIndex) % configPopulated.memberOrder.length;
    const member = configPopulated.memberOrder[memberIndex] as any;

    return {
      memberId: member._id,
      source: 'auto',
      memberName: member.name,
    };
  }

  async getRotationPreview(days: number): Promise<{
    date: string;
    memberId: string;
    memberName: string;
    source: string;
  }[]> {
    const preview: { date: string; memberId: string; memberName: string; source: string }[] = [];
    const today = normalizeDate(new Date());

    for (let i = 0; i < days; i++) {
      const date = addDays(today, i);
      const cooker = await this.calculateCookerForDate(date);

      preview.push({
        date: dateKey(date),
        memberId: cooker.memberId?.toString() || '',
        memberName: cooker.memberName || 'Unassigned',
        source: cooker.source,
      });
    }

    return preview;
  }

  async getCurrentCooker(date?: Date | string): Promise<{
    date: string;
    memberId: string | null;
    memberName: string;
    source: string;
    daysRemaining: number;
  }> {
    const targetDate = date ? normalizeDate(date) : normalizeDate(new Date());
    const cooker = await this.calculateCookerForDate(targetDate);
    const config = await this.getConfig();

    // Calculate days remaining in current term
    const startDate = normalizeDate(config.rotationStartDate);
    const daysFromStart = dayDiff(startDate, targetDate);
    const dayInTerm = daysFromStart % config.termDays;
    const daysRemaining = config.termDays - dayInTerm - 1;

    return {
      date: dateKey(targetDate),
      memberId: cooker.memberId?.toString() || null,
      memberName: cooker.memberName || 'Unassigned',
      source: cooker.source,
      daysRemaining: Math.max(0, daysRemaining),
    };
  }

  // Manual assignment (override)
  async manualAssign(dto: ManualAssignDto): Promise<CookingHistoryDocument> {
    const normalizedDate = normalizeDate(dto.date);

    // Check if there's already an entry for this date
    const existing = await this.historyModel.findOne({ date: normalizedDate });

    if (existing) {
      existing.memberId = new Types.ObjectId(dto.memberId);
      existing.source = 'manual';
      existing.note = dto.note || '';
      if (dto.swappedWith) {
        existing.swappedWith = new Types.ObjectId(dto.swappedWith);
      }
      return existing.save();
    }

    return this.historyModel.create({
      date: normalizedDate,
      memberId: new Types.ObjectId(dto.memberId),
      source: 'manual',
      note: dto.note,
      swappedWith: dto.swappedWith ? new Types.ObjectId(dto.swappedWith) : undefined,
    });
  }

  // Swap cookers between two dates
  async swapCookers(date1: string, date2: string): Promise<void> {
    const cooker1 = await this.calculateCookerForDate(date1);
    const cooker2 = await this.calculateCookerForDate(date2);

    if (!cooker1.memberId || !cooker2.memberId) {
      throw new NotFoundException('Cannot swap: one or both dates have no cooker assigned');
    }

    await this.manualAssign({
      date: new Date(date1),
      memberId: cooker2.memberId.toString(),
      note: `Swapped with ${dateKey(date2)}`,
      swappedWith: cooker1.memberId.toString(),
    });

    await this.manualAssign({
      date: new Date(date2),
      memberId: cooker1.memberId.toString(),
      note: `Swapped with ${dateKey(date1)}`,
      swappedWith: cooker2.memberId.toString(),
    });
  }

  // Remove manual override (revert to auto)
  async removeManualOverride(date: Date | string): Promise<{ reverted: boolean }> {
    const normalizedDate = normalizeDate(date);
    const result = await this.historyModel.findOneAndDelete({
      date: normalizedDate,
      source: 'manual',
    });

    return { reverted: !!result };
  }

  // Get cooking history
  async getHistory(
    from: Date | string,
    to: Date | string,
  ): Promise<CookingHistoryDocument[]> {
    const fromDate = normalizeDate(from);
    const toDate = normalizeDate(to);

    return this.historyModel
      .find({
        date: { $gte: fromDate, $lte: toDate },
      })
      .populate('memberId')
      .populate('swappedWith')
      .sort({ date: -1 });
  }

  // Get full cooking schedule (auto + manual)
  async getFullSchedule(
    from: Date | string,
    to: Date | string,
  ): Promise<{
    date: string;
    memberId: string;
    memberName: string;
    source: string;
    note?: string;
  }[]> {
    const fromDate = normalizeDate(from);
    const toDate = normalizeDate(to);
    const schedule: { date: string; memberId: string; memberName: string; source: string; note?: string }[] = [];

    let currentDate = new Date(fromDate);
    while (currentDate <= toDate) {
      const cooker = await this.calculateCookerForDate(currentDate);
      const history = await this.historyModel.findOne({ date: normalizeDate(currentDate) });

      schedule.push({
        date: dateKey(currentDate),
        memberId: cooker.memberId?.toString() || '',
        memberName: cooker.memberName || 'Unassigned',
        source: cooker.source,
        note: history?.note,
      });

      currentDate = addDays(currentDate, 1);
    }

    return schedule;
  }

  // Get member cooking statistics
  async getMemberCookingStats(
    memberId: string,
    from: Date | string,
    to: Date | string,
  ): Promise<{
    totalDays: number;
    manualAssignments: number;
    dates: string[];
  }> {
    const schedule = await this.getFullSchedule(from, to);
    const memberDates = schedule.filter((s) => s.memberId === memberId);

    return {
      totalDays: memberDates.length,
      manualAssignments: memberDates.filter((s) => s.source === 'manual').length,
      dates: memberDates.map((s) => s.date),
    };
  }

  // Auto-sync history records (cron job)
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async syncDailyHistory(): Promise<void> {
    const config = await this.getConfig();
    if (!config.autoRotate) return;

    const today = normalizeDate(new Date());
    const cooker = await this.calculateCookerForDate(today);

    if (cooker.memberId) {
      const existing = await this.historyModel.findOne({ date: today });
      if (!existing) {
        await this.historyModel.create({
          date: today,
          memberId: cooker.memberId,
          source: 'auto',
        });
      }
    }
  }

  // Add member to rotation
  async addMemberToRotation(memberId: string, position?: number): Promise<CookerConfigDocument> {
    const config = await this.ensureConfig();
    const memberObjId = new Types.ObjectId(memberId);

    // Check if already in rotation
    if (config.memberOrder.some((id) => id.equals(memberObjId))) {
      return config;
    }

    if (position !== undefined && position >= 0 && position <= config.memberOrder.length) {
      config.memberOrder.splice(position, 0, memberObjId);
    } else {
      config.memberOrder.push(memberObjId);
    }

    return config.save();
  }

  // Remove member from rotation
  async removeMemberFromRotation(memberId: string): Promise<CookerConfigDocument> {
    const config = await this.ensureConfig();
    const memberObjId = new Types.ObjectId(memberId);

    config.memberOrder = config.memberOrder.filter((id) => !id.equals(memberObjId));

    // Adjust currentIndex if needed
    if (config.currentIndex >= config.memberOrder.length) {
      config.currentIndex = 0;
    }

    return config.save();
  }
}
