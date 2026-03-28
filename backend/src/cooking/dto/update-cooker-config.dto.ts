import { IsNumber, IsArray, IsString, IsDate, IsBoolean, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCookerConfigDto {
  @IsNumber()
  @Min(1)
  @IsOptional()
  termDays?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  memberOrder?: string[];

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  rotationStartDate?: Date;

  @IsNumber()
  @Min(0)
  @IsOptional()
  currentIndex?: number;

  @IsBoolean()
  @IsOptional()
  autoRotate?: boolean;
}
