import { PartialType } from '@nestjs/mapped-types';
import { CreateMemberDto } from './create-member.dto';
import { IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateMemberDto extends PartialType(CreateMemberDto) {
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  leftAt?: Date;
}
