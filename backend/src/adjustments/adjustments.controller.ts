import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdjustmentsService } from './adjustments.service';
import { CreateAdjustmentDto, UpdateAdjustmentDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('adjustments')
@UseGuards(JwtAuthGuard)
export class AdjustmentsController {
  constructor(private readonly adjustmentsService: AdjustmentsService) {}

  @Post()
  create(@Body() dto: CreateAdjustmentDto) {
    return this.adjustmentsService.create(dto);
  }

  @Get()
  findAll(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('memberId') memberId?: string,
    @Query('type') type?: string,
    @Query('includeVoided') includeVoided?: boolean,
  ) {
    return this.adjustmentsService.findAll(from, to, memberId, type, includeVoided);
  }

  @Get('summary')
  getAllMembersAdjustmentSummary(
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.adjustmentsService.getAllMembersAdjustmentSummary(from, to);
  }

  @Get('member/:memberId/totals')
  getMemberAdjustmentTotals(
    @Param('memberId') memberId: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.adjustmentsService.getMemberAdjustmentTotals(memberId, from, to);
  }

  @Get('member/:memberId/history')
  getMemberAdjustmentHistory(
    @Param('memberId') memberId: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.adjustmentsService.getMemberAdjustmentHistory(memberId, from, to);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adjustmentsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAdjustmentDto) {
    return this.adjustmentsService.update(id, dto);
  }

  @Patch(':id/void')
  voidAdjustment(@Param('id') id: string, @Body() body: { reason: string }) {
    return this.adjustmentsService.voidAdjustment(id, body.reason);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adjustmentsService.remove(id);
  }

  // Quick entry endpoints
  @Post('payment')
  addPayment(
    @Body() body: { memberId: string; amount: number; note?: string; date?: string },
  ) {
    return this.adjustmentsService.addPayment(
      body.memberId,
      body.amount,
      body.note,
      body.date ? new Date(body.date) : undefined,
    );
  }

  @Post('credit')
  addCredit(
    @Body() body: { memberId: string; amount: number; note?: string; date?: string },
  ) {
    return this.adjustmentsService.addCredit(
      body.memberId,
      body.amount,
      body.note,
      body.date ? new Date(body.date) : undefined,
    );
  }

  @Post('debit')
  addDebit(
    @Body() body: { memberId: string; amount: number; note?: string; date?: string },
  ) {
    return this.adjustmentsService.addDebit(
      body.memberId,
      body.amount,
      body.note,
      body.date ? new Date(body.date) : undefined,
    );
  }

  @Post('settlement')
  createSettlement(
    @Body() body: {
      fromMemberId: string;
      toMemberId: string;
      amount: number;
      note?: string;
      date?: string;
    },
  ) {
    return this.adjustmentsService.createSettlement(
      body.fromMemberId,
      body.toMemberId,
      body.amount,
      body.note,
      body.date ? new Date(body.date) : undefined,
    );
  }
}
