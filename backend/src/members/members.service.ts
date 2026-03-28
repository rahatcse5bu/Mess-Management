import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member, MemberDocument } from './schemas/member.schema';

@Injectable()
export class MembersService {
  constructor(
    @InjectModel(Member.name)
    private readonly memberModel: Model<MemberDocument>,
  ) {}

  create(dto: CreateMemberDto) {
    return this.memberModel.create(dto);
  }

  findAll() {
    return this.memberModel.find().sort({ createdAt: 1 }).exec();
  }

  async findOne(id: string) {
    const member = await this.memberModel.findById(id).exec();
    if (!member) {
      throw new NotFoundException('Member not found');
    }
    return member;
  }

  async update(id: string, dto: UpdateMemberDto) {
    const updated = await this.memberModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException('Member not found');
    }
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.memberModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('Member not found');
    }
    return { deleted: true };
  }
}
