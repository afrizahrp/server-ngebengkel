import { IsString, IsOptional, IsEnum } from 'class-validator';
import { MasterRecordStatusEnum } from '@prisma/client';

export class Sys_CreateBranchDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsEnum(MasterRecordStatusEnum)
  @IsOptional()
  iStatus?: MasterRecordStatusEnum;

  @IsString()
  @IsOptional()
  remarks?: string;

  @IsString()
  company_id: string;
}
