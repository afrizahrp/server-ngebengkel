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

export class Imc_CreateProductVideoDto {
  @IsString()
  id?: string;

  @IsString()
  product_id: string;

  @IsString()
  videoURL: string;

  @IsBoolean()
  isPrimary: boolean;

  @IsNumber()
  @IsOptional()
  seq?: number; // Optional, will be calculated in backend

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

