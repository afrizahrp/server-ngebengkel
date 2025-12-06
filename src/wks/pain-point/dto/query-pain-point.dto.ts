import { IsOptional, IsString, IsBoolean, IsIn, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryPainPointDto {
  @IsOptional()
  @IsString()
  @IsIn(['URGENT', 'GENERAL', 'MAINTENANCE', 'BODYWORK', 'ELECTRICAL', 'STEERING', 'SUSPENSION', 'TIRES'])
  category?: 'URGENT' | 'GENERAL' | 'MAINTENANCE' | 'BODYWORK' | 'ELECTRICAL' | 'STEERING' | 'SUSPENSION' | 'TIRES';

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isPopular?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean; // Default: true

  @IsOptional()
  @IsString()
  search?: string; // Untuk search di title/keywords

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number; // Default: 1

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number; // Default: 12

  @IsOptional()
  @IsString()
  @IsIn(['popularity', 'name'])
  orderBy?: 'popularity' | 'name'; // Default: 'popularity'

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  orderDir?: 'asc' | 'desc'; // Default: 'desc'
}




