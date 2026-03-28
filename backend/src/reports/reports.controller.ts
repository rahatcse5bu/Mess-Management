import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('due-summary')
  getDueSummary(@Query('from') from: string, @Query('to') to: string) {
    return this.reportsService.getDueSummary(from, to);
  }

  @Get('member/:memberId')
  getMemberDetailedReport(
    @Param('memberId') memberId: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.reportsService.getMemberDetailedReport(memberId, from, to);
  }

  @Get('monthly/:year/:month')
  getMonthlyReport(@Param('year') year: number, @Param('month') month: number) {
    return this.reportsService.getMonthlyReport(year, month);
  }

  @Get('stats')
  getSummaryStats(@Query('from') from: string, @Query('to') to: string) {
    return this.reportsService.getSummaryStats(from, to);
  }
}
