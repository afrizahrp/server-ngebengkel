import {
  IsString,
  IsEmail,
  IsBoolean,
  IsOptional,
  IsNumber,
  IsEnum,
  IsInt,
} from 'class-validator';
import { MasterRecordStatusEnum } from '@prisma/client';

export class Sys_CreateUserDto {
  @IsInt()
  id: number;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsEnum(MasterRecordStatusEnum)
  @IsOptional()
  iStatus: MasterRecordStatusEnum;

  @IsBoolean()
  @IsOptional()
  isAdmin: boolean;

  @IsString()
  @IsOptional()
  hashedRefreshToken?: string;

  @IsString()
  @IsOptional()
  role_id?: string;
}
