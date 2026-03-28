import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDto, UpdateMemberDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('members')
@UseGuards(JwtAuthGuard)
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post()
  create(@Body() createMemberDto: CreateMemberDto) {
    return this.membersService.create(createMemberDto);
  }

  @Get()
  findAll(@Query('includeInactive') includeInactive: boolean) {
    return this.membersService.findAll(includeInactive);
  }

  @Get('cookers')
  getActiveCookers() {
    return this.membersService.getActiveCookers();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membersService.findOne(id);
  }

  @Get(':id/stats')
  getMemberStats(@Param('id') id: string) {
    return this.membersService.getMemberStats(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto) {
    return this.membersService.update(id, updateMemberDto);
  }

  @Patch(':id/deactivate')
  deactivate(@Param('id') id: string) {
    return this.membersService.deactivate(id);
  }

  @Patch(':id/reactivate')
  reactivate(@Param('id') id: string) {
    return this.membersService.reactivate(id);
  }

  @Patch('order/update')
  updateCookerOrder(@Body() body: { memberOrders: { memberId: string; order: number }[] }) {
    return this.membersService.updateCookerOrder(body.memberOrders);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.membersService.remove(id);
  }
}
