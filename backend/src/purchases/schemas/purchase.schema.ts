import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PurchaseDocument = HydratedDocument<Purchase>;

@Schema({ timestamps: true })
export class Purchase {
  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, min: 0 })
  amount: number;

  @Prop({ default: 'general' })
  category: string;

  @Prop({ type: Types.ObjectId, ref: 'Member' })
  paidByMemberId?: Types.ObjectId;

  @Prop({ default: '' })
  note: string;
}

export const PurchaseSchema = SchemaFactory.createForClass(Purchase);
