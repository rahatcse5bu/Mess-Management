import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { MembersModule } from './members/members.module';
import { MealsModule } from './meals/meals.module';
import { CookingModule } from './cooking/cooking.module';
import { PurchasesModule } from './purchases/purchases.module';
import { AdjustmentsModule } from './adjustments/adjustments.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI ||
        'mongodb+srv://rahatcse5bu:01783307672Rahat@cluster0.t9xf7li.mongodb.net/mess_management',
    ),
    ScheduleModule.forRoot(),
    AuthModule,
    MembersModule,
    MealsModule,
    CookingModule,
    PurchasesModule,
    AdjustmentsModule,
    ReportsModule,
  ],
})
export class AppModule {}
