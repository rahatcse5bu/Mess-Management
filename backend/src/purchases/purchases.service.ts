import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { normalizeDate } from '../common/date.util';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { Purchase, PurchaseDocument } from './schemas/purchase.schema';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectModel(Purchase.name)
    private readonly purchaseModel: Model<PurchaseDocument>,
  ) {}

  create(dto: CreatePurchaseDto) {
    return this.purchaseModel.create({
      date: normalizeDate(dto.date),
      description: dto.description,
      amount: dto.amount,
      category: dto.category || 'general',
      paidByMemberId: dto.paidByMemberId
        ? new Types.ObjectId(dto.paidByMemberId)
        : undefined,
      note: dto.note || '',
    });
  }

  list(from?: string, to?: string) {
    const filter: Record<string, unknown> = {};
    if (from && to) {
      filter.date = { $gte: normalizeDate(from), $lte: normalizeDate(to) };
    }
    return this.purchaseModel
      .find(filter)
      .sort({ date: -1, createdAt: -1 })
      .populate('paidByMemberId')
      .exec();
  }

  async remove(id: string) {
    const deleted = await this.purchaseModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('Purchase not found');
    }
    return { deleted: true };
  }
}
