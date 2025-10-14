import { IsOptional, IsString, IsIn } from 'class-validator';

export class Cms_ProductFilterDto {
  @IsOptional()
  @IsString()
  company_id?: string;

  @IsOptional()
  @IsString()
  category_id?: string;

  @IsOptional()
  @IsString()
  catalog_id?: string;

  @IsOptional()
  @IsString()
  @IsIn(['Active', 'Inactive']) // Sesuaikan dengan enum status
  status?: string;
}
