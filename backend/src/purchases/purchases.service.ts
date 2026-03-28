import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Purchase, PurchaseDocument } from './schemas/purchase.schema';
import { CreatePurchaseDto, UpdatePurchaseDto } from './dto';
import { normalizeDate } from '../common/date.util';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectModel(Purchase.name) private purchaseModel: Model<PurchaseDocument>,
  ) {}

  async create(dto: CreatePurchaseDto): Promise<PurchaseDocument> {
    const purchase = new this.purchaseModel({
      ...dto,
      date: normalizeDate(dto.date),
      paidByMemberId: dto.paidByMemberId
        ? new Types.ObjectId(dto.paidByMemberId)
        : undefined,
    });
    return purchase.save();
  }

  async findAll(from?: string, to?: string, category?: string): Promise<PurchaseDocument[]> {
    const filter: any = {};

    if (from && to) {
      filter.date = {
        $gte: normalizeDate(from),
        $lte: normalizeDate(to),
      };
    }

    if (category) {
      filter.category = category;
    }

    return this.purchaseModel
      .find(filter)
      .populate('paidByMemberId')
      .sort({ date: -1, createdAt: -1 });
  }

  async findOne(id: string): Promise<PurchaseDocument> {
    const purchase = await this.purchaseModel.findById(id).populate('paidByMemberId');
    if (!purchase) {
      throw new NotFoundException(`Purchase with ID ${id} not found`);
    }
    return purchase;
  }

  async update(id: string, dto: UpdatePurchaseDto): Promise<PurchaseDocument> {
    const updateData: any = { ...dto };
    const dtoAny = dto as any;

    if (dtoAny.date) {
      updateData.date = normalizeDate(dtoAny.date);
    }

    if (dtoAny.paidByMemberId) {
      updateData.paidByMemberId = new Types.ObjectId(dtoAny.paidByMemberId);
    }

    const purchase = await this.purchaseModel
      .findByIdAndUpdate(id, { $set: updateData }, { new: true })
      .populate('paidByMemberId');

    if (!purchase) {
      throw new NotFoundException(`Purchase with ID ${id} not found`);
    }
    return purchase;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const result = await this.purchaseModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Purchase with ID ${id} not found`);
    }
    return { deleted: true };
  }

  async getTotalInRange(from: string, to: string): Promise<number> {
    const result = await this.purchaseModel.aggregate([
      {
        $match: {
          date: {
            $gte: normalizeDate(from),
            $lte: normalizeDate(to),
          },
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

  async getSummaryByCategory(from: string, to: string): Promise<{
    category: string;
    total: number;
    count: number;
  }[]> {
    return this.purchaseModel.aggregate([
      {
        $match: {
          date: {
            $gte: normalizeDate(from),
            $lte: normalizeDate(to),
          },
        },
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          total: 1,
          count: 1,
        },
      },
      {
        $sort: { total: -1 },
      },
    ]);
  }

  async getSummaryByMember(from: string, to: string): Promise<{
    memberId: string;
    memberName: string;
    total: number;
    count: number;
  }[]> {
    const result = await this.purchaseModel.aggregate([
      {
        $match: {
          date: {
            $gte: normalizeDate(from),
            $lte: normalizeDate(to),
          },
          paidByMemberId: { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: '$paidByMemberId',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
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
          total: 1,
          count: 1,
        },
      },
      {
        $sort: { total: -1 },
      },
    ]);

    return result;
  }

  async getDailyTotals(from: string, to: string): Promise<{ date: string; total: number }[]> {
    const result = await this.purchaseModel.aggregate([
      {
        $match: {
          date: {
            $gte: normalizeDate(from),
            $lte: normalizeDate(to),
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          total: { $sum: '$amount' },
        },
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          total: 1,
        },
      },
      {
        $sort: { date: 1 },
      },
    ]);

    return result;
  }

  async getCategories(): Promise<string[]> {
    const result = await this.purchaseModel.distinct('category');
    return result.filter((c) => c);
  }
}
