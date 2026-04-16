import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { normalizeDate } from '../common/date.util';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { Purchase, PurchaseDocument } from './schemas/purchase.schema';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectModel(Purchase.name)
    private readonly purchaseModel: Model<PurchaseDocument>,
  ) {}

  private withPopulatedRefs(query: ReturnType<Model<PurchaseDocument>['find']>) {
    return query
      .populate('paidByMemberId')
      .populate('addedBy', 'name email')
      .populate('updatedBy', 'name email');
  }

  async create(dto: CreatePurchaseDto, userId: string) {
    return this.purchaseModel.create({
      date: normalizeDate(dto.date),
      description: dto.description,
      amount: dto.amount,
      category: dto.category || 'general',
      paidByMemberId: dto.paidByMemberId
        ? new Types.ObjectId(dto.paidByMemberId)
        : undefined,
      addedBy: new Types.ObjectId(userId),
      note: dto.note || '',
    });
  }

  list(from?: string, to?: string) {
    const filter: Record<string, unknown> = {};
    if (from && to) {
      filter.date = { $gte: normalizeDate(from), $lte: normalizeDate(to) };
    }
    return this.withPopulatedRefs(
      this.purchaseModel.find(filter).sort({ date: -1, createdAt: -1 }),
    ).exec();
  }

  async update(id: string, dto: UpdatePurchaseDto, userId: string) {
    const update: Record<string, unknown> = {
      updatedBy: new Types.ObjectId(userId),
    };

    if (dto.date) {
      update.date = normalizeDate(dto.date);
    }

    if (dto.description !== undefined) {
      update.description = dto.description;
    }

    if (dto.amount !== undefined) {
      update.amount = dto.amount;
    }

    if (dto.category !== undefined) {
      update.category = dto.category || 'general';
    }

    if (Object.prototype.hasOwnProperty.call(dto, 'paidByMemberId')) {
      update.paidByMemberId = dto.paidByMemberId
        ? new Types.ObjectId(dto.paidByMemberId)
        : undefined;
    }

    if (dto.note !== undefined) {
      update.note = dto.note || '';
    }

    const updated = await this.purchaseModel
      .findByIdAndUpdate(id, { $set: update }, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException('Purchase not found');
    }

    return this.withPopulatedRefs(this.purchaseModel.find({ _id: updated._id }))
      .findOne()
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
