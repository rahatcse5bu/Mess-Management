import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateAdjustmentDto } from './dto/create-adjustment.dto';
import { AdjustmentsService } from './adjustments.service';

@Controller('adjustments')
@UseGuards(JwtAuthGuard)
export class AdjustmentsController {
  constructor(private readonly adjustmentsService: AdjustmentsService) {}

  @Post()
  create(@Body() dto: CreateAdjustmentDto) {
    return this.adjustmentsService.create(dto);
  }

  @Get()
  list(@Query('from') from?: string, @Query('to') to?: string) {
    return this.adjustmentsService.list(from, to);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adjustmentsService.remove(id);
  }
}
