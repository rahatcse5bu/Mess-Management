import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Adjustment, AdjustmentDocument, AdjustmentType } from './schemas/adjustment.schema';
import { CreateAdjustmentDto, UpdateAdjustmentDto } from './dto';
import { normalizeDate } from '../common/date.util';

@Injectable()
export class AdjustmentsService {
  constructor(
    @InjectModel(Adjustment.name) private adjustmentModel: Model<AdjustmentDocument>,
  ) {}

  async create(dto: CreateAdjustmentDto): Promise<AdjustmentDocument> {
    const adjustment = new this.adjustmentModel({
      ...dto,
      date: normalizeDate(dto.date),
      memberId: new Types.ObjectId(dto.memberId),
      relatedMemberId: dto.relatedMemberId
        ? new Types.ObjectId(dto.relatedMemberId)
        : undefined,
    });
    return adjustment.save();
  }

  async findAll(
    from?: string,
    to?: string,
    memberId?: string,
    type?: string,
    includeVoided = false,
  ): Promise<AdjustmentDocument[]> {
    const filter: any = {};

    if (from && to) {
      filter.date = {
        $gte: normalizeDate(from),
        $lte: normalizeDate(to),
      };
    }

    if (memberId) {
      filter.memberId = new Types.ObjectId(memberId);
    }

    if (type) {
      filter.type = type;
    }

    if (!includeVoided) {
      filter.isVoided = { $ne: true };
    }

    return this.adjustmentModel
      .find(filter)
      .populate('memberId')
      .populate('relatedMemberId')
      .sort({ date: -1, createdAt: -1 });
  }

  async findOne(id: string): Promise<AdjustmentDocument> {
    const adjustment = await this.adjustmentModel
      .findById(id)
      .populate('memberId')
      .populate('relatedMemberId');

    if (!adjustment) {
      throw new NotFoundException(`Adjustment with ID ${id} not found`);
    }
    return adjustment;
  }

  async update(id: string, dto: UpdateAdjustmentDto): Promise<AdjustmentDocument> {
    const existing = await this.adjustmentModel.findById(id);
    if (!existing) {
      throw new NotFoundException(`Adjustment with ID ${id} not found`);
    }

    if (existing.isVoided) {
      throw new BadRequestException('Cannot update a voided adjustment');
    }

    const updateData: any = { ...dto };
    const dtoAny = dto as any;

    if (dtoAny.date) {
      updateData.date = normalizeDate(dtoAny.date);
    }

    if (dtoAny.memberId) {
      updateData.memberId = new Types.ObjectId(dtoAny.memberId);
    }

    if (dtoAny.relatedMemberId) {
      updateData.relatedMemberId = new Types.ObjectId(dtoAny.relatedMemberId);
    }

    const adjustment = await this.adjustmentModel
      .findByIdAndUpdate(id, { $set: updateData }, { new: true })
      .populate('memberId')
      .populate('relatedMemberId');

    return adjustment!;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const result = await this.adjustmentModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Adjustment with ID ${id} not found`);
    }
    return { deleted: true };
  }

  // Void an adjustment instead of deleting (for audit trail)
  async voidAdjustment(id: string, reason: string): Promise<AdjustmentDocument> {
    const adjustment = await this.adjustmentModel.findById(id);
    if (!adjustment) {
      throw new NotFoundException(`Adjustment with ID ${id} not found`);
    }

    if (adjustment.isVoided) {
      throw new BadRequestException('Adjustment is already voided');
    }

    adjustment.isVoided = true;
    adjustment.voidedAt = new Date();
    adjustment.voidReason = reason;

    return adjustment.save();
  }

  // Get total adjustments for a member (payments reduce due, credits reduce due, debits increase due)
  async getMemberAdjustmentTotals(
    memberId: string,
    from: string,
    to: string,
  ): Promise<{
    payments: number;
    credits: number;
    debits: number;
    settlements: number;
    netAdjustment: number;
  }> {
    const result = await this.adjustmentModel.aggregate([
      {
        $match: {
          memberId: new Types.ObjectId(memberId),
          date: {
            $gte: normalizeDate(from),
            $lte: normalizeDate(to),
          },
          isVoided: { $ne: true },
        },
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    const totals = {
      payments: 0,
      credits: 0,
      debits: 0,
      settlements: 0,
      netAdjustment: 0,
    };

    for (const item of result) {
      switch (item._id) {
        case AdjustmentType.PAYMENT:
          totals.payments = item.total;
          break;
        case AdjustmentType.CREDIT:
          totals.credits = item.total;
          break;
        case AdjustmentType.DEBIT:
          totals.debits = item.total;
          break;
        case AdjustmentType.SETTLEMENT:
          totals.settlements = item.total;
          break;
      }
    }

    // Net adjustment: payments + credits - debits (settlements are neutral)
    totals.netAdjustment = totals.payments + totals.credits - totals.debits;

    return totals;
  }

  // Get adjustments summary for all members
  async getAllMembersAdjustmentSummary(
    from: string,
    to: string,
  ): Promise<{
    memberId: string;
    memberName: string;
    payments: number;
    credits: number;
    debits: number;
    netAdjustment: number;
  }[]> {
    const result = await this.adjustmentModel.aggregate([
      {
        $match: {
          date: {
            $gte: normalizeDate(from),
            $lte: normalizeDate(to),
          },
          isVoided: { $ne: true },
        },
      },
      {
        $group: {
          _id: { memberId: '$memberId', type: '$type' },
          total: { $sum: '$amount' },
        },
      },
      {
        $group: {
          _id: '$_id.memberId',
          adjustments: {
            $push: { type: '$_id.type', total: '$total' },
          },
        },
      },
      {
        $lookup: {
          from: 'members',
          localField: '_id',
          foreignField: '_id',
          as: 'member',
        },
      },
      {
        $unwind: '$member',
      },
      {
        $project: {
          _id: 0,
          memberId: '$_id',
          memberName: '$member.name',
          adjustments: 1,
        },
      },
    ]);

    return result.map((item) => {
      const payments = item.adjustments.find((a: any) => a.type === AdjustmentType.PAYMENT)?.total || 0;
      const credits = item.adjustments.find((a: any) => a.type === AdjustmentType.CREDIT)?.total || 0;
      const debits = item.adjustments.find((a: any) => a.type === AdjustmentType.DEBIT)?.total || 0;

      return {
        memberId: item.memberId.toString(),
        memberName: item.memberName,
        payments,
        credits,
        debits,
        netAdjustment: payments + credits - debits,
      };
    });
  }

  // Quick payment entry
  async addPayment(
    memberId: string,
    amount: number,
    note?: string,
    date?: Date,
  ): Promise<AdjustmentDocument> {
    return this.create({
      date: date || new Date(),
      memberId,
      amount,
      type: AdjustmentType.PAYMENT,
      note: note || 'Payment',
    });
  }

  // Quick credit entry
  async addCredit(
    memberId: string,
    amount: number,
    note?: string,
    date?: Date,
  ): Promise<AdjustmentDocument> {
    return this.create({
      date: date || new Date(),
      memberId,
      amount,
      type: AdjustmentType.CREDIT,
      note: note || 'Credit',
    });
  }

  // Quick debit entry
  async addDebit(
    memberId: string,
    amount: number,
    note?: string,
    date?: Date,
  ): Promise<AdjustmentDocument> {
    return this.create({
      date: date || new Date(),
      memberId,
      amount,
      type: AdjustmentType.DEBIT,
      note: note || 'Debit',
    });
  }

  // Settlement between two members
  async createSettlement(
    fromMemberId: string,
    toMemberId: string,
    amount: number,
    note?: string,
    date?: Date,
  ): Promise<{ debit: AdjustmentDocument; credit: AdjustmentDocument }> {
    const settlementDate = date || new Date();
    const referenceId = `SETTLE-${Date.now()}`;

    // Create debit for paying member
    const debit = await this.create({
      date: settlementDate,
      memberId: fromMemberId,
      amount,
      type: AdjustmentType.SETTLEMENT,
      note: note || `Settlement to member`,
      referenceId,
      relatedMemberId: toMemberId,
    });

    // Create credit for receiving member
    const credit = await this.create({
      date: settlementDate,
      memberId: toMemberId,
      amount,
      type: AdjustmentType.SETTLEMENT,
      note: note || `Settlement from member`,
      referenceId,
      relatedMemberId: fromMemberId,
    });

    return { debit, credit };
  }

  // Get member's adjustment history with details
  async getMemberAdjustmentHistory(
    memberId: string,
    from?: string,
    to?: string,
  ): Promise<AdjustmentDocument[]> {
    const filter: any = {
      memberId: new Types.ObjectId(memberId),
      isVoided: { $ne: true },
    };

    if (from && to) {
      filter.date = {
        $gte: normalizeDate(from),
        $lte: normalizeDate(to),
      };
    }

    return this.adjustmentModel
      .find(filter)
      .populate('relatedMemberId')
      .sort({ date: -1, createdAt: -1 });
  }
}
