import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateImageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(21)
  @Transform(({ value }) => value?.trim())
  waitingListId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  @Transform(({ value }) => value?.trim())
  branchId?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  @Transform(({ value }) => value?.trim())
  imageURL!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Transform(({ value }) => value?.trim())
  description?: string;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  seq?: number;
}




