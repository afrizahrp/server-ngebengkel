import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsEnum,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { MasterRecordStatusEnum, WebsiteDisplayStatus } from '@prisma/client';

export class Imc_PaginationProductDto {
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @IsOptional()
  page?: number;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @IsOptional()
  limit?: number;

  @IsOptional()
  @IsString()
  searchBy?: string;

  @IsOptional()
  @IsString()
  searchTerm?: string;

  @IsOptional()
  @IsString()
  orderBy?: string;

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  orderDir?: 'asc' | 'desc';

  @Transform(({ value }) =>
    Array.isArray(value)
      ? value
      : value?.split(',').map((v: string) => v.trim()),
  )
  @IsString({ each: true })
  @IsOptional()
  company_id?: string[];

  @IsString()
  @IsOptional()
  branch_id?: string;

  @IsString()
  @IsOptional()
  category_id?: string;

  @IsString()
  @IsOptional()
  subCategory_id?: string;

  @IsString()
  @IsOptional()
  catalog_id?: string;

  @IsEnum(WebsiteDisplayStatus)
  iShowedStatus?: WebsiteDisplayStatus;

  @IsString()
  @IsOptional()
  showStatus?: string;

  @IsString()
  @IsOptional()
  status?: string;
}
