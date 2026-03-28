import { IsString, IsOptional, IsBoolean, IsEmail, IsNumber, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMemberDto {
  @IsString()
  name: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  canCook?: boolean;

  @IsNumber()
  @IsOptional()
  cookerOrder?: number;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  joinedAt?: Date;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
