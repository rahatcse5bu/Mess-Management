import { IsDateString, IsMongoId, IsOptional, IsString } from 'class-validator';

export class ManualAssignDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsMongoId()
  memberId: string;

  @IsOptional()
  @IsString()
  note?: string;
}
