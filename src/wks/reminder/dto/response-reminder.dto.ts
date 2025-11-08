import {
  ReminderEntityTypeEnum,
  ReminderTypeEnum,
  ReminderStatusEnum,
  ReminderChannelEnum,
  MasterRecordStatusEnum,
} from '@prisma/client';

export class ReminderResponseDto {
  id: string;
  reminderNumber: string;
  entityType: ReminderEntityTypeEnum;
  entity_id: string;
  reminderType: ReminderTypeEnum;
  title: string;
  message?: string;

  // Schedule
  scheduledDate?: Date;
  scheduledTime?: string;
  sendBeforeDays?: number;
  sendBeforeHours?: number;

  // Recipient
  customer_id?: string;
  recipientPhone?: string;
  recipientEmail?: string;
  channels?: string;

  // Status & Tracking
  status: ReminderStatusEnum;
  lastAttemptAt?: Date;
  lastSentAt?: Date;
  sentCount: number;
  maxRetries: number;
  retryCount: number;
  failureReason?: string;

  // Response tracking
  isRead?: boolean;
  readAt?: Date;
  actionTaken?: boolean;
  actionTakenAt?: Date;
  actionNotes?: string;

  // Additional data
  metadata?: any;

  // Recurring
  isRecurring?: boolean;
  recurringInterval?: number;
  recurringEndDate?: Date;
  nextRecurringDate?: Date;

  // Related reminders
  parentReminder_id?: string;

  // Relations
  customer?: {
    id: string;
    name: string;
    mobile1?: string;
    email?: string;
  };

  parentReminder?: ReminderResponseDto;
  reminderLogs?: {
    id: string;
    logType: string;
    channel: string;
    sentAt?: Date;
    status?: string;
    responseMessage?: string;
    errorMessage?: string;
    createdAt: Date;
  }[];

  // Standard metadata
  iStatus: MasterRecordStatusEnum;
  remarks?: string;
  createdBy?: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt: Date;
  company_id: string;
  branch_id: string;
}
