import { MasterRecordStatusEnum } from '@prisma/client';
import {
  IsInt,
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
} from 'class-validator';

export class Sys_UpdateUserCompanyRoleDto {
  @IsInt()
  @IsOptional()
  userRole_id?: number;

  @IsString()
  @IsOptional()
  company_id?: string;

  @IsString()
  @IsOptional()
  branch_id?: string;

  @IsEnum(MasterRecordStatusEnum)
  @IsOptional()
  iStatus?: MasterRecordStatusEnum;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
