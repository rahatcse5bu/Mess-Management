import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AdjustmentDocument = Adjustment & Document;

export enum AdjustmentType {
  PAYMENT = 'payment',     // Member paid money
  CREDIT = 'credit',       // Member receives credit (reduces their due)
  DEBIT = 'debit',         // Member owes more (increases their due)
  SETTLEMENT = 'settlement', // Final settlement between members
}

@Schema({ timestamps: true })
export class Adjustment {
  @Prop({ required: true, type: Date })
  date: Date;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Member' })
  memberId: Types.ObjectId;

  @Prop({ required: true, min: 0 })
  amount: number;

  @Prop({
    required: true,
    enum: Object.values(AdjustmentType),
    default: AdjustmentType.PAYMENT,
  })
  type: string;

  @Prop()
  note: string;

  @Prop()
  referenceId: string;

  @Prop({ type: Types.ObjectId, ref: 'Member' })
  relatedMemberId: Types.ObjectId;

  @Prop({ default: false })
  isVoided: boolean;

  @Prop()
  voidedAt: Date;

  @Prop()
  voidReason: string;
}

export const AdjustmentSchema = SchemaFactory.createForClass(Adjustment);

// Indexes
AdjustmentSchema.index({ date: 1 });
AdjustmentSchema.index({ memberId: 1 });
AdjustmentSchema.index({ type: 1 });
AdjustmentSchema.index({ isVoided: 1 });
