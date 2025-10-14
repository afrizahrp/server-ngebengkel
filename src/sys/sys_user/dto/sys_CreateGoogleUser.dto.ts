import { IsString, IsEmail, IsOptional, IsInt } from 'class-validator';
// import { MasterRecordStatusEnum } from '@prisma/client';

export class Sys_CreateGoogleUserDto {
  @IsInt()
  @IsOptional()
  id?: number; // ID akan di-generate otomatis di service

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  image?: string;

  //   @IsEnum(MasterRecordStatusEnum)
  //   @IsOptional()
  //   iStatus: MasterRecordStatusEnum;

  //   @IsBoolean()
  //   @IsOptional()
  //   isAdmin: boolean;

  //   @IsString()
  //   @IsOptional()
  //   hashedRefreshToken?: string;

  //   @IsString()
  //   @IsOptional()
  //   role_id?: string;
}
