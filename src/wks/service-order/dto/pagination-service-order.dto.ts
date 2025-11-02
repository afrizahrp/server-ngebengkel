import {
  IsString,
  IsOptional,
  IsInt,
  IsEnum,
  IsArray,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ServiceOrderStatusEnum } from '@prisma/client';

export class PaginationServiceOrderDto {
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
  company_id: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  branch_id?: string[];

  @IsArray()
  @IsEnum(ServiceOrderStatusEnum, { each: true })
  @IsOptional()
  orderStatus?: ServiceOrderStatusEnum[];

  @IsString()
  @IsOptional()
  customer_id?: string;

  @IsString()
  @IsOptional()
  mechanic_id?: string;

  @IsString()
  @IsOptional()
  serviceBay_id?: string;

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



