import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsEnum,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class Cms_PaginationProductDto {
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

  @IsString({ each: true })
  @IsOptional()
  company_id?: string[];

  @IsString()
  @IsOptional()
  branch_id?: string;

  @Transform(({ value }) => {
    // Jika value adalah array (dari query seperti category=Bed&category=trolley)
    if (Array.isArray(value)) {
      return value.map((v: string) => v.trim()).filter((v: string) => v !== '');
    }
    // Jika value adalah string (dari query seperti category=Bed atau category=Bed,trolley)
    if (typeof value === 'string') {
      return value
        .split(',')
        .map((v: string) => v.trim())
        .filter((v: string) => v !== '');
    }
    return undefined;
  })
  @IsString({ each: true })
  @IsOptional()
  category?: string[];

  @Transform(({ value }) => {
    // Jika value adalah array (dari query seperti iShowedStatus=SHOW&iShowedStatus=HIDDEN)
    if (Array.isArray(value)) {
      return value.map((v: string) => v.trim()).filter((v: string) => v !== '');
    }
    // Jika value adalah string (dari query seperti iShowedStatus=SHOW atau iShowedStatus=SHOW,HIDDEN)
    if (typeof value === 'string') {
      return value
        .split(',')
        .map((v: string) => v.trim())
        .filter((v: string) => v !== '');
    }
    return undefined;
  })
  @IsEnum(['SHOW', 'HIDDEN'], { each: true })
  @IsOptional()
  iShowedStatus?: ('SHOW' | 'HIDDEN')[];

  @IsString()
  @IsOptional()
  brand_id?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  barcode?: string;

  @IsString()
  @IsOptional()
  register_id?: string;

  @IsString()
  @IsOptional()
  product_id?: string;

  @IsString()
  @IsOptional()
  category_id?: string;

  @IsString()
  @IsOptional()
  subCategory_id?: string;

  @IsString()
  @IsOptional()
  catalog_id?: string;

  @IsString()
  @IsOptional()
  status?: string;


}
