import {
  IsString,
  IsOptional,
  IsDate,
  IsEnum,
  IsInt,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BookingStatusEnum, BookingSourceEnum } from '@prisma/client';

export class CreateBookingDto {
  @IsString()
  customer_id: string;

  @IsString()
  customerVehicle_id: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  preferredDate?: Date;

  @IsString()
  @IsOptional()
  preferredStartTime?: string; // "10:00"

  @IsString()
  @IsOptional()
  preferredEndTime?: string; // "11:00"

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  scheduledStart?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  scheduledEnd?: Date;

  @IsString()
  @IsOptional()
  bay_id?: string;

  @IsString()
  @IsOptional()
  mechanic_id?: string;

  @IsString()
  @IsOptional()
  serviceType_id?: string;

  @IsString()
  @IsOptional()
  complaintNotes?: string;

  @IsString()
  @IsOptional()
  additionalRequest?: string;

  @IsEnum(BookingStatusEnum)
  @IsOptional()
  status?: BookingStatusEnum;

  @IsEnum(BookingSourceEnum)
  @IsOptional()
  source?: BookingSourceEnum;

  @IsInt()
  @IsOptional()
  estimatedDuration?: number; // in minutes

  @IsString()
  @IsOptional()
  remarks?: string;

  @IsString()
  company_id: string;

  @IsString()
  branch_id: string;

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
}
