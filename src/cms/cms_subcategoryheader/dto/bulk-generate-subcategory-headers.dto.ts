import { IsString, IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class SubCategoryIdDto {
  @IsString()
  @IsNotEmpty()
  subCategoryId: string;

  @IsString()
  @IsNotEmpty()
  categoryId: string;
}

export class BulkGenerateSubCategoryHeadersDto {
  @IsString()
  @IsNotEmpty()
  companyId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubCategoryIdDto)
  subCategoryIds: SubCategoryIdDto[];
}










