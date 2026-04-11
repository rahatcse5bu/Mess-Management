import {
  IsDateString,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreatePurchaseDto {
  @IsDateString()
  date: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsMongoId()
  paidByMemberId?: string;

  @IsOptional()
  @IsString()
  note?: string;
}
