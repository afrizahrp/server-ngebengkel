import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { wks_specializationEnum } from '@prisma/client';

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

  @IsEnum(wks_specializationEnum)
  specialization!: wks_specializationEnum;

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
}
