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

class CreateVideoItemDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  @Transform(({ value }) => value?.trim())
  videoURL!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Transform(({ value }) => value?.trim())
  thumbnailURL?: string;

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
  @IsInt()
  @Min(0)
  duration?: number;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  seq?: number;
}

export class CreateBatchVideosDto {
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
  @ArrayMaxSize(5) // Maksimal 5 videos per batch
  @ValidateNested({ each: true })
  @Type(() => CreateVideoItemDto)
  videos!: CreateVideoItemDto[];
}

