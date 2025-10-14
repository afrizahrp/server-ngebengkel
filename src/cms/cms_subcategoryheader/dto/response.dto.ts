export interface SubCategoryHeaderData {
  H1: string;
  H1_en: string;
  H2: string;
  H2_en: string;
  H3: Array<{ title: string; desc: string }>;
  H3_en: Array<{ title: string; desc: string }>;
}

export interface SubCategoryWithHeaders {
  id: string;
  category_id: string;
  name: string;
  name_en: string | null;
}

export interface PaginationInfo {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface GetSubCategoryHeadersResponseDto {
  success: boolean;
  message: string;
  data: SubCategoryHeaderData | null;
}

export interface GetAllSubCategoryHeadersResponseDto {
  success: boolean;
  message: string;
  data: Array<SubCategoryHeaderData & { subCategory: SubCategoryWithHeaders }>;
  pagination: PaginationInfo;
}

export interface BulkGenerateResult {
  successful: Array<{
    subCategoryId: string;
    categoryId: string;
    headers: SubCategoryHeaderData;
  }>;
  failed: Array<{ subCategoryId: string; categoryId: string; error: string }>;
  skipped: Array<{ subCategoryId: string; categoryId: string; reason: string }>;
  summary: {
    total: number;
    successful: number;
    failed: number;
    skipped: number;
  };
}

export interface BulkGenerateResponseDto {
  success: boolean;
  message: string;
  data: BulkGenerateResult;
}

export interface SimpleAutoBulkGenerateResponseDto {
  success: boolean;
  message: string;
  data: {
    successful: Array<{
      subCategoryId: string;
      categoryId: string;
      headers: SubCategoryHeaderData;
    }>;
    failed: Array<{ subCategoryId: string; categoryId: string; error: string }>;
    summary: {
      total: number;
      successful: number;
      failed: number;
    };
  };
}

export interface GetSubCategoriesWithoutHeadersResponseDto {
  success: boolean;
  message: string;
  data: Array<SubCategoryWithHeaders>;
  pagination: PaginationInfo;
}










