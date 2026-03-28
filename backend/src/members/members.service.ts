import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member, MemberDocument } from './schemas/member.schema';
import { CreateMemberDto, UpdateMemberDto } from './dto';

@Injectable()
export class MembersService {
  constructor(
    @InjectModel(Member.name) private memberModel: Model<MemberDocument>,
  ) {}

  async create(createMemberDto: CreateMemberDto): Promise<MemberDocument> {
    // Get max cooker order to auto-increment
    const maxOrder = await this.memberModel
      .findOne()
      .sort({ cookerOrder: -1 })
      .select('cookerOrder');

    const newCookerOrder = (maxOrder?.cookerOrder ?? -1) + 1;

    const member = new this.memberModel({
      ...createMemberDto,
      cookerOrder: createMemberDto.cookerOrder ?? newCookerOrder,
    });
    return member.save();
  }

  async findAll(includeInactive = false): Promise<MemberDocument[]> {
    const filter = includeInactive ? {} : { isActive: true };
    return this.memberModel.find(filter).sort({ cookerOrder: 1, name: 1 });
  }

  async findOne(id: string): Promise<MemberDocument> {
    const member = await this.memberModel.findById(id);
    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }
    return member;
  }

  async update(id: string, updateMemberDto: UpdateMemberDto): Promise<MemberDocument> {
    const member = await this.memberModel.findByIdAndUpdate(
      id,
      { $set: updateMemberDto },
      { new: true },
    );
    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }
    return member;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const result = await this.memberModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }
    return { deleted: true };
  }

  async deactivate(id: string): Promise<MemberDocument> {
    return this.update(id, { isActive: false, leftAt: new Date() } as any);
  }

  async reactivate(id: string): Promise<MemberDocument> {
    const member = await this.memberModel.findByIdAndUpdate(
      id,
      { $set: { isActive: true }, $unset: { leftAt: 1 } },
      { new: true },
    );
    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }
    return member;
  }

  async updateCookerOrder(memberOrders: { memberId: string; order: number }[]): Promise<void> {
    const bulkOps = memberOrders.map(({ memberId, order }) => ({
      updateOne: {
        filter: { _id: memberId },
        update: { $set: { cookerOrder: order } },
      },
    }));
    await this.memberModel.bulkWrite(bulkOps);
  }

  async getActiveCookers(): Promise<MemberDocument[]> {
    return this.memberModel
      .find({ isActive: true, canCook: true })
      .sort({ cookerOrder: 1 });
  }

  async getMemberStats(id: string): Promise<any> {
    const member = await this.findOne(id);
    // This can be extended to include meal counts, cooking history, due amounts etc.
    return {
      member,
      stats: {
        // Placeholder - will be calculated from other modules
      },
    };
  }
}
