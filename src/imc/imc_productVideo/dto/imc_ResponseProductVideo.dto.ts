import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { MasterRecordStatusEnum } from '@prisma/client';

export class Imc_ResponseProductVideoDto {
  @IsString()
  id: string;

  @IsString()
  product_id: string;

  @IsString()
  videoURL: string;

  @IsBoolean()
  isPrimary: boolean;

  @IsNumber()
  seq: number;

  // @IsEnum(MasterRecordStatusEnum)
  // iStatus: MasterRecordStatusEnum;

  @IsString()
  @IsOptional()
  createdBy?: string;

  @IsDate()
  createdAt: Date;

  @IsString()
  updatedBy: string;

  @IsDate()
  updatedAt: Date;

  @IsString()
  company_id: string;
}

