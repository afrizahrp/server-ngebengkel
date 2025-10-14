import { MasterRecordStatusEnum } from '@prisma/client';
import {
  IsInt,
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsDate,
} from 'class-validator';

export class Sys_ResponseUserRoleDto {
  @IsInt()
  id: number;

  @IsInt()
  user_id: number;

  @IsString()
  role_id: string;

  @IsEnum(MasterRecordStatusEnum)
  iStatus: MasterRecordStatusEnum;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  // Include related data
  @IsOptional()
  role?: {
    id: string;
    name: string;
  };

  @IsOptional()
  user?: {
    id: number;
    name: string;
    email: string;
  };

  @IsOptional()
  userCompanies?: Array<{
    id: number;
    company_id: string;
    branch_id: string;
    iStatus: MasterRecordStatusEnum;
    isDefault?: boolean;
  }>;
}


