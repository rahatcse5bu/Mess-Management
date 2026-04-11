import {
  IsArray,
  IsDateString,
  IsMongoId,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class UpdateCookerConfigDto {
  @IsOptional()
  @IsPositive()
  termDays?: number;

  @IsOptional()
  @IsDateString()
  rotationStartDate?: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  memberOrder?: string[];
}
