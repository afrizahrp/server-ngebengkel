import {
  IsString,
  IsOptional,
  IsDate,
  IsEnum,
  IsInt,
  IsBoolean,
  IsArray,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  ReminderEntityTypeEnum,
  ReminderTypeEnum,
  ReminderStatusEnum,
  ReminderChannelEnum,
} from '@prisma/client';

export class CreateReminderDto {
  // Entity reference
  @IsEnum(ReminderEntityTypeEnum)
  entityType: ReminderEntityTypeEnum;

  @IsString()
  @MaxLength(30)
  entity_id: string;

  // Reminder info
  @IsEnum(ReminderTypeEnum)
  @IsOptional()
  reminderType?: ReminderTypeEnum;

  @IsString()
  @MaxLength(250)
  title: string;

  @IsString()
  @IsOptional()
  message?: string;

  // Schedule
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  scheduledDate?: Date;

  @IsString()
  @MaxLength(10)
  @IsOptional()
  scheduledTime?: string; // HH:mm format

  // Timing
  @IsInt()
  @Min(0)
  @Max(365)
  @IsOptional()
  sendBeforeDays?: number;

  @IsInt()
  @Min(0)
  @Max(8760)
  @IsOptional()
  sendBeforeHours?: number;

  // Recipient
  @IsString()
  @IsOptional()
  customer_id?: string;

  @IsString()
  @MaxLength(20)
  @IsOptional()
  recipientPhone?: string;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  recipientEmail?: string;

  // Channel - store as comma-separated: "WA,EM,SM" atau JSON array
  @IsArray()
  @IsEnum(ReminderChannelEnum, { each: true })
  @IsOptional()
  channels?: ReminderChannelEnum[];

  // Recurring
  @IsBoolean()
  @IsOptional()
  isRecurring?: boolean;

  @IsInt()
  @Min(1)
  @Max(365)
  @IsOptional()
  recurringInterval?: number;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  recurringEndDate?: Date;

  // Parent reminder
  @IsString()
  @MaxLength(30)
  @IsOptional()
  parentReminder_id?: string;

  // Retry settings
  @IsInt()
  @Min(1)
  @Max(10)
  @IsOptional()
  maxRetries?: number;

  // Additional metadata (as JSON)
  @IsOptional()
  metadata?: any;

  // Standard fields
  @IsString()
  company_id: string;

  @IsString()
  branch_id: string;

  @IsString()
  @IsOptional()
  createdBy?: string;

  @IsString()
  @IsOptional()
  remarks?: string;
}

