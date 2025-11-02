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

export class UpdateReminderDto {
  // Entity reference
  @IsEnum(ReminderEntityTypeEnum)
  @IsOptional()
  entityType?: ReminderEntityTypeEnum;

  @IsString()
  @MaxLength(30)
  @IsOptional()
  entity_id?: string;

  // Reminder info
  @IsEnum(ReminderTypeEnum)
  @IsOptional()
  reminderType?: ReminderTypeEnum;

  @IsString()
  @MaxLength(250)
  @IsOptional()
  title?: string;

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
  scheduledTime?: string;

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

  // Channel
  @IsArray()
  @IsEnum(ReminderChannelEnum, { each: true })
  @IsOptional()
  channels?: ReminderChannelEnum[];

  // Status
  @IsEnum(ReminderStatusEnum)
  @IsOptional()
  status?: ReminderStatusEnum;

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

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  nextRecurringDate?: Date;

  // Action tracking
  @IsBoolean()
  @IsOptional()
  isRead?: boolean;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  readAt?: Date;

  @IsBoolean()
  @IsOptional()
  actionTaken?: boolean;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  actionTakenAt?: Date;

  @IsString()
  @IsOptional()
  actionNotes?: string;

  // Retry settings
  @IsInt()
  @Min(1)
  @Max(10)
  @IsOptional()
  maxRetries?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  retryCount?: number;

  @IsString()
  @MaxLength(250)
  @IsOptional()
  failureReason?: string;

  // Additional metadata
  @IsOptional()
  metadata?: any;

  // Standard fields
  @IsString()
  @IsOptional()
  updatedBy?: string;

  @IsString()
  @IsOptional()
  remarks?: string;
}

