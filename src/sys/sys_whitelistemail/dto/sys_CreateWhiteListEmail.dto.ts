import { IsString, IsEmail } from 'class-validator';

export class Sys_CreateWhiteListEmailDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;
}
