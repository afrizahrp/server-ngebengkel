import { IsEmail } from 'class-validator';

export class Sys_CheckEmailDto {
  @IsEmail()
  email: string;
}
