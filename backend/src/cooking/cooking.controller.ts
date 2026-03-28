import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CookingService } from './cooking.service';
import { UpdateCookerConfigDto } from './dto/update-cooker-config.dto';
import { ManualAssignDto } from './dto/manual-assign.dto';

@Controller('cooking')
@UseGuards(JwtAuthGuard)
export class CookingController {
  constructor(private readonly cookingService: CookingService) {}

  @Get('config')
  config() {
    return this.cookingService.getConfigWithPreview();
  }

  @Patch('config')
  updateConfig(@Body() dto: UpdateCookerConfigDto) {
    return this.cookingService.updateConfig(dto);
  }

  @Post('manual-assign')
  manualAssign(@Body() dto: ManualAssignDto) {
    return this.cookingService.manualAssign(dto);
  }

  @Get('history')
  history(@Query('from') from?: string, @Query('to') to?: string) {
    return this.cookingService.history(from, to);
  }

  @Get('current')
  current(@Query('date') date?: string) {
    return this.cookingService.current(date);
  }
}
