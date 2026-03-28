import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CookingService } from './cooking.service';
import { UpdateCookerConfigDto, ManualAssignDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('cooking')
@UseGuards(JwtAuthGuard)
export class CookingController {
  constructor(private readonly cookingService: CookingService) {}

  @Get('config')
  getConfigWithPreview(@Query('days') days?: number) {
    return this.cookingService.getConfigWithPreview(days || 30);
  }

  @Patch('config')
  updateConfig(@Body() dto: UpdateCookerConfigDto) {
    return this.cookingService.updateConfig(dto);
  }

  @Post('reorder')
  reorderMembers(@Body() body: { memberIds: string[] }) {
    return this.cookingService.reorderMembers(body.memberIds);
  }

  @Post('sync-members')
  syncMembersFromOrder() {
    return this.cookingService.syncMembersFromOrder();
  }

  @Get('current')
  getCurrentCooker(@Query('date') date?: string) {
    return this.cookingService.getCurrentCooker(date);
  }

  @Get('preview')
  getRotationPreview(@Query('days') days?: number) {
    return this.cookingService.getRotationPreview(days || 30);
  }

  @Post('manual-assign')
  manualAssign(@Body() dto: ManualAssignDto) {
    return this.cookingService.manualAssign(dto);
  }

  @Post('swap')
  swapCookers(@Body() body: { date1: string; date2: string }) {
    return this.cookingService.swapCookers(body.date1, body.date2);
  }

  @Delete('override/:date')
  removeManualOverride(@Param('date') date: string) {
    return this.cookingService.removeManualOverride(date);
  }

  @Get('history')
  getHistory(@Query('from') from: string, @Query('to') to: string) {
    return this.cookingService.getHistory(from, to);
  }

  @Get('schedule')
  getFullSchedule(@Query('from') from: string, @Query('to') to: string) {
    return this.cookingService.getFullSchedule(from, to);
  }

  @Get('member/:memberId/stats')
  getMemberCookingStats(
    @Param('memberId') memberId: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.cookingService.getMemberCookingStats(memberId, from, to);
  }

  @Post('add-member')
  addMemberToRotation(@Body() body: { memberId: string; position?: number }) {
    return this.cookingService.addMemberToRotation(body.memberId, body.position);
  }

  @Delete('remove-member/:memberId')
  removeMemberFromRotation(@Param('memberId') memberId: string) {
    return this.cookingService.removeMemberFromRotation(memberId);
  }
}
