import { IsString, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class ManualAssignDto {
  @Type(() => Date)
  @IsDate()
  date: Date;

  @IsString()
  memberId: string;

  @IsString()
  @IsOptional()
  note?: string;

  @IsString()
  @IsOptional()
  swappedWith?: string;
}
