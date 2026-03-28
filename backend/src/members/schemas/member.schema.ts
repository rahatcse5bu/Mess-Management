import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MemberDocument = Member & Document;

@Schema({ timestamps: true })
export class Member {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ lowercase: true, trim: true })
  email: string;

  @Prop({ trim: true })
  phone: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: () => new Date() })
  joinedAt: Date;

  @Prop()
  leftAt: Date;

  @Prop({ default: 0 })
  cookerOrder: number;

  @Prop({ default: true })
  canCook: boolean;

  @Prop()
  avatar: string;

  @Prop()
  notes: string;
}

export const MemberSchema = SchemaFactory.createForClass(Member);
