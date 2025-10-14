import {
  IsInt,
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
} from 'class-validator';

export class Sys_AssignUserRoleDto {
  @IsInt()
  userRole_id: number;

  @IsString()
  branch_id: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}

export class Sys_BulkAssignUserRoleDto {
  @IsArray()
  @IsInt({ each: true })
  userRole_ids: number[];

  @IsString()
  branch_id: string;
}


