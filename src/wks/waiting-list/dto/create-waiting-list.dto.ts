import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsEmail,
  IsNotEmpty,
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
  @MaxLength(250)
  @Transform(({ value }) => value?.trim())
  address!: string;

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

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(50)
  @ArrayUnique()
  @IsString({ each: true })
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value
          .map((item: string | null | undefined) => item?.trim())
          .filter(
            (item: string | null | undefined): item is string =>
              Boolean(item && item.length > 0),
          )
          .map((item: string) => item.toUpperCase())
      : [],
  )
  workshopTypeIds!: string[];

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
}
