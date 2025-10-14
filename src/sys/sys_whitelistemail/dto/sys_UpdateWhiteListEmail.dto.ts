import { IsString, IsEmail, IsOptional } from 'class-validator';

export class Sys_UpdateWhiteListEmailDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}
