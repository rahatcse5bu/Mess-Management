import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { normalizeDate } from '../common/date.util';
import { CreateAdjustmentDto } from './dto/create-adjustment.dto';
import { Adjustment, AdjustmentDocument } from './schemas/adjustment.schema';

@Injectable()
export class AdjustmentsService {
  constructor(
    @InjectModel(Adjustment.name)
    private readonly adjustmentModel: Model<AdjustmentDocument>,
  ) {}

  create(dto: CreateAdjustmentDto) {
    return this.adjustmentModel.create({
      date: normalizeDate(dto.date),
      memberId: new Types.ObjectId(dto.memberId),
      amount: dto.amount,
      type: dto.type,
      note: dto.note || '',
    });
  }

  list(from?: string, to?: string) {
    const filter: Record<string, unknown> = {};
    if (from && to) {
      filter.date = { $gte: normalizeDate(from), $lte: normalizeDate(to) };
    }
    return this.adjustmentModel
      .find(filter)
      .sort({ date: -1, createdAt: -1 })
      .populate('memberId')
      .exec();
  }

  async remove(id: string) {
    const deleted = await this.adjustmentModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('Adjustment not found');
    }
    return { deleted: true };
  }
}
