import { IsString, IsNumber, IsDate, IsOptional, IsArray, IsBoolean, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePurchaseDto {
  @Type(() => Date)
  @IsDate()
  date: Date;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  paidByMemberId?: string;

  @IsString()
  @IsOptional()
  note?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  items?: string[];

  @IsString()
  @IsOptional()
  receiptUrl?: string;

  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;
}
