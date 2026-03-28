import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MealsService } from './meals.service';
import { UpsertMealDayDto } from './dto/upsert-meal-day.dto';

@Controller('meals')
@UseGuards(JwtAuthGuard)
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @Post('day')
  upsertDay(@Body() dto: UpsertMealDayDto) {
    return this.mealsService.upsertDay(dto);
  }

  @Get('days')
  getRange(@Query('from') from: string, @Query('to') to: string) {
    return this.mealsService.getRange(from, to);
  }

  @Get('member-daily-counts')
  memberDailyCounts(@Query('from') from: string, @Query('to') to: string) {
    return this.mealsService.memberDailyCounts(from, to);
  }
}
