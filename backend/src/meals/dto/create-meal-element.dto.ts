import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateMealElementDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
