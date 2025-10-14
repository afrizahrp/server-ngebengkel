import { MasterRecordStatusEnum } from '@prisma/client';
import {
  IsInt,
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
} from 'class-validator';

export class Sys_ResponseUserCompanyRoleDto {
  @IsInt()
  id: number;

  @IsInt()
  userRole_id: number;

  @IsString()
  company_id: string;

  @IsString()
  branch_id: string;

  @IsEnum(MasterRecordStatusEnum)
  iStatus: MasterRecordStatusEnum;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  // Include related data
  @IsOptional()
  userRole?: {
    id: number;
    user_id: number;
    role_id: string;
    role?: {
      id: string;
      name: string;
    };
    user?: {
      id: number;
      name: string;
      email: string;
    };
  };

  @IsOptional()
  company?: {
    id: string;
    name: string;
  };

  @IsOptional()
  permissions?: Array<{
    id: number;
    menu_id: number;
    can_view: boolean;
    can_create: boolean;
    can_edit: boolean;
    can_delete: boolean;
    can_print: boolean;
    can_approve: boolean;
  }>;
}
