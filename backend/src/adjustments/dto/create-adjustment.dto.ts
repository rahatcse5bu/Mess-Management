import { IsString, IsNumber, IsDate, IsOptional, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { AdjustmentType } from '../schemas/adjustment.schema';

export class CreateAdjustmentDto {
  @Type(() => Date)
  @IsDate()
  date: Date;

  @IsString()
  memberId: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsEnum(AdjustmentType)
  type: AdjustmentType;

  @IsString()
  @IsOptional()
  note?: string;

  @IsString()
  @IsOptional()
  referenceId?: string;

  @IsString()
  @IsOptional()
  relatedMemberId?: string;
}
