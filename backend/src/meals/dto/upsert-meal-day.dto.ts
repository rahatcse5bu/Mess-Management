import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class MealEntryDto {
  @IsMongoId()
  memberId: string;

  @IsNumber()
  @Min(0)
  mealCount: number;

  @IsOptional()
  @IsString()
  note?: string;
}

export class UpsertMealDayDto {
  @IsDateString()
  date: string;

  @IsArray()
  @IsString({ each: true })
  elements: string[];

  @IsArray()
  @ArrayMinSize(0)
  @ValidateNested({ each: true })
  @Type(() => MealEntryDto)
  entries: MealEntryDto[];
}
