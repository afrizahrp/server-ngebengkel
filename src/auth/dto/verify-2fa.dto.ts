import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { Trim } from 'class-sanitizer';

/**
 * DTO untuk verify 2FA OTP code
 */
export class Verify2FaDto {
  @IsInt()
  @IsNotEmpty({ message: 'User ID is required' })
  @Min(1, { message: 'User ID must be a positive number' })
  userId!: number;

  @IsString()
  @IsNotEmpty({ message: 'OTP code is required' })
  @Length(6, 6, { message: 'OTP code must be exactly 6 characters' })
  @Transform(({ value }) => String(value).trim())
  @Trim()
  otpCode!: string;

  @Transform(({ value }) => value?.trim())
  @Trim()
  deviceName?: string;
}
