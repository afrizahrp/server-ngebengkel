import { IsString, IsOptional, IsEnum } from 'class-validator';
import { MasterRecordStatusEnum } from '@prisma/client';

export class Sys_ResponseBranchDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsEnum(MasterRecordStatusEnum)
  iStatus: MasterRecordStatusEnum;

  @IsString()
  @IsOptional()
  remarks?: string;

  @IsString()
  company_id: string;

  @IsOptional()
  company?: {
    id: string;
    name: string;
  };
}
