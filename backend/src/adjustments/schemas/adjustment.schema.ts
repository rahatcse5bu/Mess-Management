import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AdjustmentDocument = HydratedDocument<Adjustment>;

@Schema({ timestamps: true })
export class Adjustment {
  @Prop({ required: true })
  date: Date;

  @Prop({ type: Types.ObjectId, ref: 'Member', required: true })
  memberId: Types.ObjectId;

  @Prop({ required: true, min: 0 })
  amount: number;

  @Prop({ required: true, enum: ['payment', 'credit', 'debit'] })
  type: 'payment' | 'credit' | 'debit';

  @Prop({ default: '' })
  note: string;
}

export const AdjustmentSchema = SchemaFactory.createForClass(Adjustment);
