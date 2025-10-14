import { IsString, IsOptional, IsDate } from 'class-validator';

export class Cms_UpdateProductDescDto {
  // @IsString()
  // id: string;

  @IsString()
  descriptions: string;

  @IsString()
  @IsOptional()
  descriptions_en?: string;

  @IsString()
  benefits: string;

  @IsString()
  @IsOptional()
  benefits_en?: string;

  @IsString()
  @IsOptional()
  createdBy: string;

  @IsDate()
  @IsOptional()
  createdAt: Date;

  @IsString()
  @IsOptional()
  updatedBy: string;

  @IsDate()
  @IsOptional()
  updatedAt: Date;

  @IsString()
  company_id: string;

  @IsString()
  @IsOptional()
  branch_id: string;
}
