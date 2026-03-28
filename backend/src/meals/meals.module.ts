import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MealsService } from './meals.service';
import { MealsController } from './meals.controller';
import { MealDay, MealDaySchema } from './schemas/meal-day.schema';
import { MealElement, MealElementSchema } from './schemas/meal-element.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MealDay.name, schema: MealDaySchema },
      { name: MealElement.name, schema: MealElementSchema },
    ]),
    AuthModule,
  ],
  controllers: [MealsController],
  providers: [MealsService],
  exports: [MealsService, MongooseModule],
})
export class MealsModule {}
