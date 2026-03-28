import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type MealDayDocument = HydratedDocument<MealDay>;

@Schema({ _id: false })
export class MemberMealEntry {
  @Prop({ type: Types.ObjectId, ref: 'Member', required: true })
  memberId: Types.ObjectId;

  @Prop({ required: true, min: 0 })
  mealCount: number;

  @Prop({ default: '' })
  note: string;
}

const MemberMealEntrySchema = SchemaFactory.createForClass(MemberMealEntry);

@Schema({ timestamps: true })
export class MealDay {
  @Prop({ required: true, unique: true })
  date: Date;

  @Prop({ type: [String], default: [] })
  elements: string[];

  @Prop({ type: [MemberMealEntrySchema], default: [] })
  entries: MemberMealEntry[];
}

export const MealDaySchema = SchemaFactory.createForClass(MealDay);
