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

export class UpdateProductStatusDto {
  @IsEnum(WebsiteDisplayStatus)
  iShowedStatus: WebsiteDisplayStatus;

  @IsString()
  @IsOptional()
  updatedBy?: string;
}
