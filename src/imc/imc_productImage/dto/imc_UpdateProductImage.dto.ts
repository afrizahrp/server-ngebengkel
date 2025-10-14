import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { MasterRecordStatusEnum } from '@prisma/client';

export class Imc_UpdateProductImageDto {
  @IsString()
  @IsOptional()
  imageURL?: string;

  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;

  @IsNumber()
  @IsOptional()
  seq?: number;

  @IsBoolean()
  @IsOptional()
  isBrochure?: boolean;

  // @IsEnum(MasterRecordStatusEnum)
  // @IsOptional()
  // iStatus?: MasterRecordStatusEnum;

  @IsString()
  @IsOptional()
  updatedBy?: string;

  @IsDate()
  @IsOptional()
  updatedAt?: Date;
}
