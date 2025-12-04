import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateWaitingListDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Transform(({ value }) => value?.trim())
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Transform(({ value }) => value?.trim())
  slug!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  @Transform(({ value }) => value?.trim())
  address!: string;


  @IsString()
  // @IsNotEmpty()
  @IsOptional()
  @MaxLength(250)
  @Transform(({ value }) => value?.trim())
  description?: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 15)
  @Transform(({ value }) => value?.trim())
  city!: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 15)
  @Transform(({ value }) => value?.trim())
  district!: string;

  @IsString()
  @IsNotEmpty()
  @Length(5, 5)
  @Transform(({ value }) => value?.trim())
  province!: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  @Transform(({ value }) => value?.trim())
  subdistrict!: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  @Transform(({ value }) => value?.trim().toLowerCase())
  email!: string;

  @IsString()
  @IsNotEmpty()
  @Length(5, 5)
  @Transform(({ value }) => value?.trim().toUpperCase())
  categoryId!: string;

  // Optional: mengikuti pola categoryId tapi boleh kosong
  @IsOptional()
  @IsString()
  @Length(10, 10)
  @Transform(({ value }) => value?.trim().toUpperCase())
  typeId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @Transform(({ value }) => value?.trim())
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @Transform(({ value }) => value?.trim())
  mobile?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  recaptchaToken?: string; // reCAPTCHA token dari frontend

  @IsOptional()
  @IsString()
  recaptchaAction?: string; // Action untuk reCAPTCHA v3 (default: 'submit')

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value !== undefined && value !== null && value !== '' ? Number(value) : undefined))
  gbp_rating?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value !== undefined && value !== null && value !== '' ? Number(value) : undefined))
  gbb_reviews_count?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value !== undefined && value !== null && value !== '' ? Number(value) : undefined))
  priority?: number;
}
