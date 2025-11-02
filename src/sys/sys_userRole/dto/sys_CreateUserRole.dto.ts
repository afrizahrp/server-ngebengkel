import { MasterRecordStatusEnum } from '@prisma/client';
import {
  IsInt,
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
} from 'class-validator';

export class Sys_CreateUserRoleDto {
  @IsInt()
  user_id: number;

  @IsString()
  role_id: string;

  @IsEnum(MasterRecordStatusEnum)
  @IsOptional()
  iStatus?: MasterRecordStatusEnum;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
