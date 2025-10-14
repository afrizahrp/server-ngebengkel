import { IsString, IsOptional, IsObject, IsBoolean } from 'class-validator';

export class Cms_GenerateDescriptionDto {
  @IsObject()
  productSpecs: Record<string, string>;

  @IsString()
  @IsOptional()
  productName?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  language?: string = 'id'; // Default to Indonesian

  @IsBoolean()
  @IsOptional()
  isMedicalProduct?: boolean = true; // Default to medical/healthcare context

  @IsString()
  @IsOptional()
  targetAudience?: string = 'healthcare_professionals'; // healthcare_professionals, procurement, patients
}

export class Cms_TranslateDescriptionDto {
  @IsString()
  text: string;

  @IsString()
  @IsOptional()
  targetLanguage?: string = 'en'; // Default to English
}
