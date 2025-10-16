import { IsString, IsOptional, IsEnum } from 'class-validator';
import { MasterRecordStatusEnum } from '@prisma/client';

export class Sys_UpdateBranchDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(MasterRecordStatusEnum)
  @IsOptional()
  iStatus?: MasterRecordStatusEnum;

  @IsString()
  @IsOptional()
  remarks?: string;

  @IsString()
  @IsOptional()
  company_id?: string;
}
