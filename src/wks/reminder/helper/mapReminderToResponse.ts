import { ReminderResponseDto } from '../dto/response-reminder.dto';
import { sys_Reminder } from '@prisma/client';

export function mapReminderToResponse(reminder: any): ReminderResponseDto {
  return {
    id: reminder.id,
    reminderNumber: reminder.reminderNumber,
    entityType: reminder.entityType,
    entity_id: reminder.entity_id,
    reminderType: reminder.reminderType,
    title: reminder.title,
    message: reminder.message,
    scheduledDate: reminder.scheduledDate,
    scheduledTime: reminder.scheduledTime,
    sendBeforeDays: reminder.sendBeforeDays,
    sendBeforeHours: reminder.sendBeforeHours,
    customer_id: reminder.customer_id,
    recipientPhone: reminder.recipientPhone,
    recipientEmail: reminder.recipientEmail,
    channels: reminder.channels,
    status: reminder.status,
    lastAttemptAt: reminder.lastAttemptAt,
    lastSentAt: reminder.lastSentAt,
    sentCount: reminder.sentCount,
    maxRetries: reminder.maxRetries,
    retryCount: reminder.retryCount,
    failureReason: reminder.failureReason,
    isRead: reminder.isRead,
    readAt: reminder.readAt,
    actionTaken: reminder.actionTaken,
    actionTakenAt: reminder.actionTakenAt,
    actionNotes: reminder.actionNotes,
    metadata: reminder.metadata,
    isRecurring: reminder.isRecurring,
    recurringInterval: reminder.recurringInterval,
    recurringEndDate: reminder.recurringEndDate,
    nextRecurringDate: reminder.nextRecurringDate,
    parentReminder_id: reminder.parentReminder_id,
    customer: reminder.customer
      ? {
          id: reminder.customer.id,
          name: reminder.customer.name,
          mobile1: reminder.customer.mobile1,
          email: reminder.customer.email,
        }
      : undefined,
    parentReminder: reminder.parentReminder
      ? mapReminderToResponse(reminder.parentReminder)
      : undefined,
    reminderLogs: reminder.reminderLogs
      ? reminder.reminderLogs.map((log: any) => ({
          id: log.id,
          logType: log.logType,
          channel: log.channel,
          sentAt: log.sentAt,
          status: log.status,
          responseMessage: log.responseMessage,
          errorMessage: log.errorMessage,
          createdAt: log.createdAt,
        }))
      : undefined,
    iStatus: reminder.iStatus,
    remarks: reminder.remarks,
    createdBy: reminder.createdBy,
    createdAt: reminder.createdAt,
    updatedBy: reminder.updatedBy,
    updatedAt: reminder.updatedAt,
    company_id: reminder.company_id,
    branch_id: reminder.branch_id,
  };
}

