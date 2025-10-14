import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  isBoolean,
} from 'class-validator';
import { MasterRecordStatusEnum } from '@prisma/client';

export class Imc_CreateProductImageDto {
  @IsString()
  id?: string;

  @IsString()
  product_id: string;

  @IsString()
  imageURL: string;

  @IsBoolean()
  isPrimary: boolean = false;

  @IsNumber()
  @IsOptional()
  seq?: number; // Optional, will be calculated in backend

  @IsOptional()
  @IsBoolean()
  isBrochure?: boolean = false;

  // @IsEnum(MasterRecordStatusEnum)
  // @IsOptional()
  // iStatus?: MasterRecordStatusEnum;

  @IsString()
  @IsOptional()
  createdBy?: string;

  @IsDate()
  @IsOptional()
  createdAt?: Date;

  @IsString()
  @IsOptional()
  updatedBy?: string;

  @IsDate()
  @IsOptional()
  updatedAt?: Date;

  @IsString()
  company_id: string;
}
