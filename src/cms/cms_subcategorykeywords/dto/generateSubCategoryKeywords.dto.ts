import { IsString, IsOptional, IsArray } from 'class-validator';

export class SubCategoryKeywordsDto {
  indonesian: {
    short: string[];
    long: string[];
  };
  english: {
    short: string[];
    long: string[];
  };
}

export class GenerateSubCategoryKeywordsDto {
  @IsString()
  subCategoryId: string;

  @IsString()
  categoryId: string;

  @IsString()
  companyId: string;
}

export class BulkGenerateSubCategoryKeywordsDto {
  @IsOptional()
  @IsString()
  companyId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  excludeIds?: string[];
}

export class SubCategoryKeywordGenerationResultDto {
  success: boolean;
  keywords?: SubCategoryKeywordsDto;
  error?: string;
}

export class BulkSubCategoryKeywordResultDto {
  totalProcessed: number;
  successCount: number;
  errorCount: number;
  errors: Array<{
    subCategoryId: string;
    error: string;
  }>;
}

export class SubCategoryKeywordStatsDto {
  totalSubCategories: number;
  subCategoriesWithKeywords: number;
  pending: number;
}


