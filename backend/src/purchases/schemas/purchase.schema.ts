import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PurchaseDocument = Purchase & Document;

@Schema({ timestamps: true })
export class Purchase {
  @Prop({ required: true, type: Date })
  date: Date;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ required: true, min: 0 })
  amount: number;

  @Prop({ default: 'general' })
  category: string;

  @Prop({ type: Types.ObjectId, ref: 'Member' })
  paidByMemberId: Types.ObjectId;

  @Prop()
  note: string;

  @Prop({ type: [String], default: [] })
  items: string[];

  @Prop()
  receiptUrl: string;

  @Prop({ default: false })
  isVerified: boolean;
}

export const PurchaseSchema = SchemaFactory.createForClass(Purchase);

// Indexes
PurchaseSchema.index({ date: 1 });
PurchaseSchema.index({ category: 1 });
PurchaseSchema.index({ paidByMemberId: 1 });
