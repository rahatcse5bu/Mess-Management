import { IsArray, IsDate, IsOptional, IsString, ValidateNested, IsNumber, Min, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class MemberMealEntryDto {
  @IsString()
  memberId: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  breakfast?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  lunch?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  dinner?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  totalMeals?: number;

  @IsString()
  @IsOptional()
  note?: string;
}

export class UpsertMealDayDto {
  @Type(() => Date)
  @IsDate()
  date: Date;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  elements?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MemberMealEntryDto)
  @IsOptional()
  entries?: MemberMealEntryDto[];

  @IsString()
  @IsOptional()
  notes?: string;

  @IsBoolean()
  @IsOptional()
  isLocked?: boolean;
}
