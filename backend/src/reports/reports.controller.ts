import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ReportsService } from './reports.service';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('due-summary')
  dueSummary(@Query('from') from?: string, @Query('to') to?: string) {
    return this.reportsService.dueSummary(from, to);
  }
}
