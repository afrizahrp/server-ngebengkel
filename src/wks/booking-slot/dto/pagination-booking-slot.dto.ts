import {
  IsString,
  IsOptional,
  IsInt,
  IsEnum,
  IsArray,
  IsDateString,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { SlotStatusEnum } from '@prisma/client';

export class PaginationBookingSlotDto {
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  limit?: number = 20;

  @IsString()
  @IsOptional()
  searchBy?: string;

  @IsString()
  @IsOptional()
  searchTerm?: string;

  @IsString()
  @IsOptional()
  company_id?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    return Array.isArray(value) ? value : [value];
  })
  branch_id?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    return Array.isArray(value) ? value : [value];
  })
  bay_id?: string[];

  @IsArray()
  @IsEnum(SlotStatusEnum, { each: true })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    return Array.isArray(value) ? value : [value];
  })
  slotStatus?: SlotStatusEnum[];

  @IsDateString()
  @IsOptional()
  start_date?: string;

  @IsDateString()
  @IsOptional()
  end_date?: string;

  @IsString()
  @IsOptional()
  orderBy?: string;

  @IsEnum(['asc', 'desc'])
  @IsOptional()
  orderDir?: 'asc' | 'desc' = 'desc';
}
