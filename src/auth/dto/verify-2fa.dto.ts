import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class Verify2FaDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  otpCode: string;
}
