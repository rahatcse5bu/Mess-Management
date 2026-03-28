import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MealsController } from './meals.controller';
import { MealsService } from './meals.service';
import { MealDay, MealDaySchema } from './schemas/meal-day.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MealDay.name, schema: MealDaySchema }]),
  ],
  controllers: [MealsController],
  providers: [MealsService],
  exports: [MealsService],
})
export class MealsModule {}
