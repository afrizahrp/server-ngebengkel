import { IsOptional, IsString, IsArray, IsInt, Min, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryWaitingListDto {
  @IsOptional()
  @IsString()
  searchTerm?: string;

  @IsOptional()
  @IsString()
  @IsIn(['name', 'phone', 'email', 'address', 'city', 'district', 'province'])
  searchBy?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  claimStatus?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  category_id?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  province_id?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  city_id?: string[];

  @IsOptional()
  @IsString()
  start_date?: string;

  @IsOptional()
  @IsString()
  end_date?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsString()
  orderBy?: string;

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  orderDir?: 'asc' | 'desc';
}

