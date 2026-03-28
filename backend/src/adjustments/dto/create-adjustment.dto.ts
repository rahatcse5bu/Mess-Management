import {
  IsDateString,
  IsIn,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateAdjustmentDto {
  @IsDateString()
  date: string;

  @IsMongoId()
  memberId: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsIn(['payment', 'credit', 'debit'])
  type: 'payment' | 'credit' | 'debit';

  @IsOptional()
  @IsString()
  note?: string;
}
