import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Trim } from 'class-sanitizer';

export class CheckWaitingListAvailabilityDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(50, { message: 'Name must not exceed 50 characters' })
  @Transform(({ value }) => value?.trim())
  @Trim()
  name!: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsOptional()
  @MaxLength(100, { message: 'Email must not exceed 100 characters' })
  @Transform(({ value }) => value?.trim().toLowerCase())
  email?: string;

  @IsString({ message: 'Phone must be a string' })
  @IsOptional()
  @MaxLength(20, { message: 'Phone must not exceed 20 characters' })
  @Transform(({ value }) => value?.trim())
  phone?: string;

  @IsString({ message: 'Mobile must be a string' })
  @IsOptional()
  @MaxLength(20, { message: 'Mobile must not exceed 20 characters' })
  @Transform(({ value }) => value?.trim())
  mobile?: string;
}