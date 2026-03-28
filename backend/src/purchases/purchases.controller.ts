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
import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto, UpdatePurchaseDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('purchases')
@UseGuards(JwtAuthGuard)
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Post()
  create(@Body() dto: CreatePurchaseDto) {
    return this.purchasesService.create(dto);
  }

  @Get()
  findAll(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('category') category?: string,
  ) {
    return this.purchasesService.findAll(from, to, category);
  }

  @Get('total')
  getTotalInRange(@Query('from') from: string, @Query('to') to: string) {
    return this.purchasesService.getTotalInRange(from, to);
  }

  @Get('summary/category')
  getSummaryByCategory(@Query('from') from: string, @Query('to') to: string) {
    return this.purchasesService.getSummaryByCategory(from, to);
  }

  @Get('summary/member')
  getSummaryByMember(@Query('from') from: string, @Query('to') to: string) {
    return this.purchasesService.getSummaryByMember(from, to);
  }

  @Get('daily-totals')
  getDailyTotals(@Query('from') from: string, @Query('to') to: string) {
    return this.purchasesService.getDailyTotals(from, to);
  }

  @Get('categories')
  getCategories() {
    return this.purchasesService.getCategories();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchasesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePurchaseDto) {
    return this.purchasesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchasesService.remove(id);
  }
}
