import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CookingHistoryDocument = CookingHistory & Document;

@Schema({ timestamps: true })
export class CookingHistory {
  @Prop({ required: true, type: Date })
  date: Date;

  @Prop({ type: Types.ObjectId, ref: 'Member', required: true })
  memberId: Types.ObjectId;

  @Prop({ enum: ['auto', 'manual'], default: 'auto' })
  source: string;

  @Prop()
  note: string;

  @Prop({ type: Types.ObjectId, ref: 'Member' })
  swappedWith: Types.ObjectId;
}

export const CookingHistorySchema = SchemaFactory.createForClass(CookingHistory);

// Unique index for date
CookingHistorySchema.index({ date: 1 }, { unique: true });
