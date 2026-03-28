import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MealDayDocument = MealDay & Document;

@Schema({ _id: false })
export class MemberMealEntry {
  @Prop({ type: Types.ObjectId, ref: 'Member', required: true })
  memberId: Types.ObjectId;

  @Prop({ default: 0, min: 0 })
  breakfast: number;

  @Prop({ default: 0, min: 0 })
  lunch: number;

  @Prop({ default: 0, min: 0 })
  dinner: number;

  @Prop({ default: 0, min: 0 })
  totalMeals: number;

  @Prop()
  note?: string;
}

export const MemberMealEntrySchema = SchemaFactory.createForClass(MemberMealEntry);

@Schema({ timestamps: true })
export class MealDay {
  @Prop({ required: true, unique: true, type: Date })
  date: Date;

  @Prop({ type: [String], default: [] })
  elements: string[];

  @Prop({ type: [MemberMealEntrySchema], default: [] })
  entries: MemberMealEntry[];

  @Prop()
  notes: string;

  @Prop({ default: false })
  isLocked: boolean;
}

export const MealDaySchema = SchemaFactory.createForClass(MealDay);

// Index for faster queries
MealDaySchema.index({ date: 1 });
