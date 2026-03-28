import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CookingService } from './cooking.service';
import { CookingController } from './cooking.controller';
import { CookerConfig, CookerConfigSchema } from './schemas/cooker-config.schema';
import { CookingHistory, CookingHistorySchema } from './schemas/cooking-history.schema';
import { AuthModule } from '../auth/auth.module';
import { MembersModule } from '../members/members.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CookerConfig.name, schema: CookerConfigSchema },
      { name: CookingHistory.name, schema: CookingHistorySchema },
    ]),
    AuthModule,
    MembersModule,
  ],
  controllers: [CookingController],
  providers: [CookingService],
  exports: [CookingService, MongooseModule],
})
export class CookingModule {}
