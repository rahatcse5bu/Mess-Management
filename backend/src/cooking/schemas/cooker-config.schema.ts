import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CookerConfigDocument = CookerConfig & Document;

@Schema({ timestamps: true })
export class CookerConfig {
  @Prop({ default: 2 })
  termDays: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Member' }], default: [] })
  memberOrder: Types.ObjectId[];

  @Prop({ type: Date, default: () => new Date() })
  rotationStartDate: Date;

  @Prop({ default: 0 })
  currentIndex: number;

  @Prop()
  lastRotationDate: Date;

  @Prop({ default: true })
  autoRotate: boolean;
}

export const CookerConfigSchema = SchemaFactory.createForClass(CookerConfig);
