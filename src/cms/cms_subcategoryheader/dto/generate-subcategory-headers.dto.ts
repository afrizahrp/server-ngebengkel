import { IsString, IsNotEmpty } from 'class-validator';

export class GenerateSubCategoryHeadersDto {
  @IsString()
  @IsNotEmpty()
  companyId: string;

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  subCategoryId: string;
}










