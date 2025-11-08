import {
  IsString,
  IsOptional,
  IsInt,
  IsEnum,
  IsArray,
  IsDateString,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  ReminderEntityTypeEnum,
  ReminderTypeEnum,
  ReminderStatusEnum,
} from '@prisma/client';

export class PaginationReminderDto {
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  limit?: number = 20;

  @IsString()
  @IsOptional()
  searchBy?: string;

  @IsString()
  @IsOptional()
  searchTerm?: string;

  @IsString()
  company_id: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  branch_id?: string[];

  // Filters
  @IsArray()
  @IsEnum(ReminderEntityTypeEnum, { each: true })
  @IsOptional()
  entityType?: ReminderEntityTypeEnum[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  entity_id?: string[];

  @IsArray()
  @IsEnum(ReminderTypeEnum, { each: true })
  @IsOptional()
  reminderType?: ReminderTypeEnum[];

  @IsArray()
  @IsEnum(ReminderStatusEnum, { each: true })
  @IsOptional()
  status?: ReminderStatusEnum[];

  @IsString()
  @IsOptional()
  customer_id?: string;

  @IsBoolean()
  @IsOptional()
  isRecurring?: boolean;

  // Date filters
  @IsDateString()
  @IsOptional()
  scheduledStartDate?: string;

  @IsDateString()
  @IsOptional()
  scheduledEndDate?: string;

  @IsDateString()
  @IsOptional()
  createdStartDate?: string;

  @IsDateString()
  @IsOptional()
  createdEndDate?: string;

  @IsDateString()
  @IsOptional()
  sentStartDate?: string;

  @IsDateString()
  @IsOptional()
  sentEndDate?: string;

  // Sorting
  @IsString()
  @IsOptional()
  orderBy?: string;

  @IsEnum(['asc', 'desc'])
  @IsOptional()
  orderDir?: 'asc' | 'desc' = 'desc';
}
