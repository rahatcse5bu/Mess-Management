import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MealElementDocument = MealElement & Document;

@Schema({ timestamps: true })
export class MealElement {
  @Prop({ required: true, unique: true, trim: true })
  name: string;

  @Prop()
  category: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  usageCount: number;
}

export const MealElementSchema = SchemaFactory.createForClass(MealElement);
