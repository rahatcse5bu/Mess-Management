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
import { MealsService } from './meals.service';
import { UpsertMealDayDto, CreateMealElementDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('meals')
@UseGuards(JwtAuthGuard)
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  // Meal Day Endpoints
  @Post('day')
  upsertMealDay(@Body() dto: UpsertMealDayDto) {
    return this.mealsService.upsertMealDay(dto);
  }

  @Get('day/:date')
  getMealDay(@Param('date') date: string) {
    return this.mealsService.getMealDay(date);
  }

  @Get('days')
  getMealDaysInRange(@Query('from') from: string, @Query('to') to: string) {
    return this.mealsService.getMealDaysInRange(from, to);
  }

  @Get('member-daily-counts')
  getMemberDailyCounts(@Query('from') from: string, @Query('to') to: string) {
    return this.mealsService.getMemberDailyCounts(from, to);
  }

  @Get('member/:memberId/summary')
  getMemberMealSummary(
    @Param('memberId') memberId: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.mealsService.getMemberMealSummary(memberId, from, to);
  }

  @Post('quick-add')
  quickAddMemberMeal(
    @Body() body: { date: string; memberId: string; breakfast?: number; lunch?: number; dinner?: number },
  ) {
    return this.mealsService.quickAddMemberMeal(body.date, body.memberId, {
      breakfast: body.breakfast,
      lunch: body.lunch,
      dinner: body.dinner,
    });
  }

  @Delete('day/:date')
  deleteMealDay(@Param('date') date: string) {
    return this.mealsService.deleteMealDay(date);
  }

  // Meal Elements Endpoints
  @Post('elements')
  createMealElement(@Body() dto: CreateMealElementDto) {
    return this.mealsService.createMealElement(dto);
  }

  @Get('elements')
  getAllMealElements() {
    return this.mealsService.getAllMealElements();
  }

  @Patch('elements/:id')
  updateMealElement(@Param('id') id: string, @Body() dto: Partial<CreateMealElementDto>) {
    return this.mealsService.updateMealElement(id, dto);
  }

  @Delete('elements/:id')
  deleteMealElement(@Param('id') id: string) {
    return this.mealsService.deleteMealElement(id);
  }
}
