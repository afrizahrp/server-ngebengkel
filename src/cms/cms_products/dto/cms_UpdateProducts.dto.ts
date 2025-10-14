// src/products/dto/update-product.dto.ts
import {
  IsString,
  IsOptional,
  IsInt,
  IsBoolean,
  IsDate,
  IsEnum,
} from 'class-validator';

import { MasterRecordStatusEnum, WebsiteDisplayStatus } from '@prisma/client';

export class Cms_UpdateProductDto {
  @IsEnum(WebsiteDisplayStatus)
  iShowedStatus: WebsiteDisplayStatus;

  @IsString()
  @IsOptional()
  updatedBy?: string;
}

// @IsString()
// @IsOptional()
// name?: string;

// @IsString()
// @IsOptional()
// register_id?: string;

// @IsString()
// @IsOptional()
// catalog_id?: string;

// @IsString()
// @IsOptional()
// category_id?: string;

// @IsString()
// @IsOptional()
// subCategory_id?: string;

// @IsString()
// @IsOptional()
// brand_id?: string;

// @IsEnum(MasterRecordStatusEnum)
// @IsOptional()
// iStatus?: MasterRecordStatusEnum;

// @IsString()
// @IsOptional()
// slug?: string;

// @IsBoolean()
// @IsOptional()
// isMaterial?: boolean;

// @IsBoolean()
// @IsOptional()
// isService?: boolean;

// @IsBoolean()
// @IsOptional()
// isFinishing?: boolean;

// @IsBoolean()
// @IsOptional()
// isAccessories?: boolean;

// @IsEnum(WebsiteDisplayStatus)
// iShowedStatus: WebsiteDisplayStatus;

// @IsString()
// @IsOptional()
// updatedBy?: string;

// @IsString()
// @IsOptional()
// uom_id?: string;

// @IsString()
// @IsOptional()
// createdBy?: string;

// @IsDate()
// @IsOptional()
// createdAt?: Date;

// @IsDate()
// @IsOptional()
// updatedAt?: Date;

// @IsString()
// @IsOptional()
// company_id?: string;

// @IsString()
// @IsOptional()
// branch_id?: string;
// }
