import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { MembersModule } from './members/members.module';
import { CookingModule } from './cooking/cooking.module';
import { MealsModule } from './meals/meals.module';
import { PurchasesModule } from './purchases/purchases.module';
import { AdjustmentsModule } from './adjustments/adjustments.module';
import { ReportsModule } from './reports/reports.module';
import { validateEnv } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      validate: validateEnv,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('MONGO_URI'),
        dbName: configService.get<string>('MONGO_DB') || 'mess_management',
      }),
    }),
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
