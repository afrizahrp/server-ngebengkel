import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
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
  @Length(5, 5)
  @Transform(({ value }) => value?.trim())
  city!: string;

  @IsString()
  @IsNotEmpty()
  @Length(5, 5)
  @Transform(({ value }) => value?.trim())
  district!: string;

  @IsString()
  @IsNotEmpty()
  @Length(5, 5)
  @Transform(({ value }) => value?.trim())
  province!: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  @Transform(({ value }) => value?.trim().toLowerCase())
  email!: string;
}

