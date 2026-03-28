import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CookingHistoryDocument = HydratedDocument<CookingHistory>;

@Schema({ timestamps: true })
export class CookingHistory {
  @Prop({ required: true })
  date: Date;

  @Prop({ type: Types.ObjectId, ref: 'Member', required: true })
  memberId: Types.ObjectId;

  @Prop({ default: 'auto', enum: ['auto', 'manual'] })
  source: 'auto' | 'manual';

  @Prop({ default: '' })
  note: string;
}

export const CookingHistorySchema =
  SchemaFactory.createForClass(CookingHistory);
CookingHistorySchema.index({ date: 1 }, { unique: true });
