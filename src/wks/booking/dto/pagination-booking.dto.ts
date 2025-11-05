import {
  IsString,
  IsOptional,
  IsInt,
  IsEnum,
  IsArray,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationBookingDto {
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
  branch_id?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  status?: string[];

  @IsString()
  @IsOptional()
  customer_id?: string;

  @IsDateString()
  @IsOptional()
  start_date?: string;

  @IsDateString()
  @IsOptional()
  end_date?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  bay_id?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  mechanic_id?: string[];

  @IsString()
  @IsOptional()
  orderBy?: string;

  @IsEnum(['asc', 'desc'])
  @IsOptional()
  orderDir?: 'asc' | 'desc' = 'asc';
}
