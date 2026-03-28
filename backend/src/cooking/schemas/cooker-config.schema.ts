import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CookerConfigDocument = HydratedDocument<CookerConfig>;

@Schema({ timestamps: true })
export class CookerConfig {
  @Prop({ type: Number, default: 2 })
  termDays: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Member' }], default: [] })
  memberOrder: Types.ObjectId[];

  @Prop({ default: () => new Date() })
  rotationStartDate: Date;
}

export const CookerConfigSchema = SchemaFactory.createForClass(CookerConfig);
