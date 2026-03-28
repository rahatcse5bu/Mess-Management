import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdjustmentsService } from './adjustments.service';
import { AdjustmentsController } from './adjustments.controller';
import { Adjustment, AdjustmentSchema } from './schemas/adjustment.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Adjustment.name, schema: AdjustmentSchema }]),
    AuthModule,
  ],
  controllers: [AdjustmentsController],
  providers: [AdjustmentsService],
  exports: [AdjustmentsService, MongooseModule],
})
export class AdjustmentsModule {}
