import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductKeywordSetDto {
  @IsArray()
  @IsString({ each: true })
  short: string[];

  @IsArray()
  @IsString({ each: true })
  long: string[];
}

export class ProductKeywordsDto {
  @ValidateNested()
  @Type(() => ProductKeywordSetDto)
  indonesian: ProductKeywordSetDto;

  @ValidateNested()
  @Type(() => ProductKeywordSetDto)
  english: ProductKeywordSetDto;
}

export class GenerateProductKeywordsDto {
  @IsString()
  productId: string;

  @IsString()
  companyId: string;
}

export class BulkGenerateProductKeywordsDto {
  @IsOptional()
  @IsString()
  companyId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  excludeIds?: string[];
}

export class ProductKeywordGenerationResultDto {
  success: boolean;
  keywords?: ProductKeywordsDto;
  error?: string;
}

export class BulkProductKeywordResultDto {
  totalProcessed: number;
  successCount: number;
  errorCount: number;
  errors: Array<{
    productId: string;
    error: string;
  }>;
}

export class ProductKeywordStatsDto {
  totalProducts: number;
  productsWithKeywords: number;
  pending: number;
}
