import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdjustmentsController } from './adjustments.controller';
import { AdjustmentsService } from './adjustments.service';
import { Adjustment, AdjustmentSchema } from './schemas/adjustment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Adjustment.name, schema: AdjustmentSchema },
    ]),
  ],
  controllers: [AdjustmentsController],
  providers: [AdjustmentsService],
  exports: [AdjustmentsService],
})
export class AdjustmentsModule {}
