import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { MembersModule } from './members/members.module';
import { CookingModule } from './cooking/cooking.module';
import { MealsModule } from './meals/meals.module';
import { PurchasesModule } from './purchases/purchases.module';
import { AdjustmentsModule } from './adjustments/adjustments.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_URI ||
        'mongodb+srv://rahatcse5bu:01783307672Rahat@cluster0.t9xf7li.mongodb.net/',
      {
        dbName: process.env.MONGO_DB || 'mess_management',
      },
    ),
    AuthModule,
    MembersModule,
    CookingModule,
    MealsModule,
    PurchasesModule,
    AdjustmentsModule,
    ReportsModule,
  ],
})
export class AppModule {}
