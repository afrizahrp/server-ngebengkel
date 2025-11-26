import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  MaxLength,
  Min,
  ValidateNested,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';

class CreateImageItemDto {
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

export class CreateBatchImagesDto {
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

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10) // Maksimal 10 images per batch
  @ValidateNested({ each: true })
  @Type(() => CreateImageItemDto)
  images!: CreateImageItemDto[];
}


