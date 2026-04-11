import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CookingController } from './cooking.controller';
import { CookingService } from './cooking.service';
import {
  CookerConfig,
  CookerConfigSchema,
} from './schemas/cooker-config.schema';
import {
  CookingHistory,
  CookingHistorySchema,
} from './schemas/cooking-history.schema';
import { Member, MemberSchema } from '../members/schemas/member.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CookerConfig.name, schema: CookerConfigSchema },
      { name: CookingHistory.name, schema: CookingHistorySchema },
      { name: Member.name, schema: MemberSchema },
    ]),
  ],
  controllers: [CookingController],
  providers: [CookingService],
  exports: [CookingService],
})
export class CookingModule {}
