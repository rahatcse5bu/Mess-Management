import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { PurchasesService } from './purchases.service';

@Controller('purchases')
@UseGuards(JwtAuthGuard)
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Post()
  create(
    @Body() dto: CreatePurchaseDto,
    @Req() req: { user: { sub: string } },
  ) {
    return this.purchasesService.create(dto, req.user.sub);
  }

  @Get()
  list(@Query('from') from?: string, @Query('to') to?: string) {
    return this.purchasesService.list(from, to);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePurchaseDto,
    @Req() req: { user: { sub: string } },
  ) {
    return this.purchasesService.update(id, dto, req.user.sub);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchasesService.remove(id);
  }
}
