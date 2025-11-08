import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import {
  ReminderChannelEnum,
  ReminderStatusEnum,
  ReminderLogTypeEnum,
  ReminderTypeEnum,
} from '@prisma/client';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { PaginationReminderDto } from './dto/pagination-reminder.dto';
import { ReminderResponseDto } from './dto/response-reminder.dto';
import {
  reminderWhereCondition,
  buildReminderSearchCondition,
} from './helper/reminderWhereCondition';
import { mapReminderToResponse } from './helper/mapReminderToResponse';
import { WablasService } from '../../whatsapp/wablas.service';
import { sortFieldBy, buildPagination } from '../../utils/query-operator';
import { generateDocumentNumber } from '../../utils/generateDocumentNumber';

@Injectable()
export class ReminderService {
  private readonly logger = new Logger(ReminderService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly wablasService: WablasService,
  ) {}

  /**
   * Generate reminder number using sys_Numbering
   */
  async generateReminderNumber(
    companyId: string,
    branchId: string,
  ): Promise<string> {
    // Use helper to generate document number
    return await generateDocumentNumber({
      prisma: this.prisma,
      module_id: 'WKS',
      company_id: companyId,
      branch_id: branchId,
      date: new Date(),
      prefix: 'REM', // Reminder prefix
    });
  }

  /**
   * Create a new reminder
   */
  async create(
    createReminderDto: CreateReminderDto,
  ): Promise<ReminderResponseDto> {
    const { company_id, branch_id, channels, metadata, ...reminderData } =
      createReminderDto;

    // Generate reminder ID
    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const timestamp = String(Date.now()).slice(-6);
    const reminderId = `REM${dateStr}${timestamp}`.substring(0, 30);

    // Generate reminder number
    const reminderNumber = await this.generateReminderNumber(
      company_id,
      branch_id,
    );

    // Convert channels array to comma-separated string with mapped values
    // ReminderChannelEnum maps: WHATSAPP->WA, EMAIL->EM, SMS->SM
    const channelsStr =
      channels && channels.length > 0
        ? channels
            .map((ch) => {
              switch (ch) {
                case ReminderChannelEnum.WHATSAPP:
                  return 'WA';
                case ReminderChannelEnum.EMAIL:
                  return 'EM';
                case ReminderChannelEnum.SMS:
                  return 'SM';
                default:
                  return ch;
              }
            })
            .join(',')
        : null;

    const reminder = await this.prisma.sys_Reminder.create({
      data: {
        id: reminderId,
        reminderNumber,
        entityType: reminderData.entityType,
        entity_id: reminderData.entity_id,
        reminderType:
          reminderData.reminderType || ReminderTypeEnum.SCHEDULED_SERVICE,
        title: reminderData.title,
        message: reminderData.message,
        channels: channelsStr,
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined,
        scheduledDate: reminderData.scheduledDate,
        scheduledTime: reminderData.scheduledTime,
        sendBeforeDays: reminderData.sendBeforeDays,
        sendBeforeHours: reminderData.sendBeforeHours,
        customer_id: reminderData.customer_id,
        recipientPhone: reminderData.recipientPhone,
        recipientEmail: reminderData.recipientEmail,
        status: ReminderStatusEnum.PENDING,
        maxRetries: reminderData.maxRetries || 3,
        sentCount: 0,
        retryCount: 0,
        isRecurring: reminderData.isRecurring || false,
        recurringInterval: reminderData.recurringInterval,
        recurringEndDate: reminderData.recurringEndDate,
        parentReminder_id: reminderData.parentReminder_id,
        isDeleted: false,
        company_id,
        branch_id,
        createdBy: reminderData.createdBy,
        remarks: reminderData.remarks,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            mobile1: true,
            email: true,
          },
        },
        reminderLogs: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    return mapReminderToResponse(reminder);
  }

  /**
   * Get all reminders with pagination
   */
  async findAll(paginationDto: PaginationReminderDto): Promise<{
    data: ReminderResponseDto[];
    totalRecords: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  }> {
    const {
      page = 1,
      limit = 20,
      company_id,
      branch_id,
      entityType,
      entity_id,
      reminderType,
      status,
      customer_id,
      isRecurring,
      scheduledStartDate,
      scheduledEndDate,
      createdStartDate,
      createdEndDate,
      sentStartDate,
      sentEndDate,
      orderBy,
      orderDir = 'desc',
    } = paginationDto;

    // Build where condition
    const where = reminderWhereCondition({
      company_id,
      branch_id,
      entityType,
      entity_id,
      reminderType,
      status,
      customer_id,
      isRecurring,
      scheduledStartDate: scheduledStartDate
        ? new Date(scheduledStartDate)
        : undefined,
      scheduledEndDate: scheduledEndDate
        ? new Date(scheduledEndDate)
        : undefined,
      createdStartDate: createdStartDate
        ? new Date(createdStartDate)
        : undefined,
      createdEndDate: createdEndDate ? new Date(createdEndDate) : undefined,
      sentStartDate: sentStartDate ? new Date(sentStartDate) : undefined,
      sentEndDate: sentEndDate ? new Date(sentEndDate) : undefined,
    });

    // Add search condition
    const searchConditions = buildReminderSearchCondition(paginationDto);
    if (searchConditions && searchConditions.length > 0) {
      if (Array.isArray(where.AND)) {
        where.AND = [...where.AND, ...searchConditions];
      } else {
        where.AND = searchConditions;
      }
    }

    // Build pagination
    const pagination = buildPagination({ page, limit, maxLimit: 100 });

    // Build order by
    const orderByCondition = sortFieldBy(
      [
        'createdAt',
        'scheduledDate',
        'lastSentAt',
        'status',
        'title',
        'reminderNumber',
      ],
      orderBy,
      orderDir,
    );

    // Execute queries
    const [reminders, totalRecords] = await Promise.all([
      this.prisma.sys_Reminder.findMany({
        where,
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              mobile1: true,
              email: true,
            },
          },
          reminderLogs: {
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
        },
        orderBy: orderByCondition,
        skip: pagination.skip,
        take: pagination.take,
      }),
      this.prisma.sys_Reminder.count({ where }),
    ]);

    const totalPages = pagination.totalPages(totalRecords);

    return {
      data: reminders.map(mapReminderToResponse),
      totalRecords,
      totalPages,
      currentPage: page,
      limit,
    };
  }

  /**
   * Get a single reminder by ID
   */
  async findOne(
    companyId: string,
    reminderId: string,
  ): Promise<ReminderResponseDto> {
    const reminder = await this.prisma.sys_Reminder.findUnique({
      where: {
        company_id_id: {
          company_id: companyId,
          id: reminderId,
        },
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            mobile1: true,
            email: true,
          },
        },
        parentReminder: {
          include: {
            customer: {
              select: {
                id: true,
                name: true,
                mobile1: true,
                email: true,
              },
            },
          },
        },
        reminderLogs: {
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
      },
    });

    if (!reminder) {
      throw new NotFoundException('Reminder not found');
    }

    // Check if reminder is deleted
    if (reminder.isDeleted) {
      throw new NotFoundException('Reminder not found');
    }

    return mapReminderToResponse(reminder);
  }

  /**
   * Update a reminder
   */
  async update(
    companyId: string,
    reminderId: string,
    updateReminderDto: UpdateReminderDto,
  ): Promise<ReminderResponseDto> {
    // Check if reminder exists
    const existingReminder = await this.prisma.sys_Reminder.findUnique({
      where: {
        company_id_id: {
          company_id: companyId,
          id: reminderId,
        },
      },
    });

    if (!existingReminder) {
      throw new NotFoundException('Reminder not found');
    }

    // Check if reminder is deleted
    if (existingReminder.isDeleted) {
      throw new NotFoundException('Reminder not found');
    }

    const { channels, metadata, ...reminderData } = updateReminderDto;

    // Prepare update data
    const updateData: any = {
      ...reminderData,
      updatedAt: new Date(),
    };

    // Convert channels array to comma-separated string if provided
    // ReminderChannelEnum maps: WHATSAPP->WA, EMAIL->EM, SMS->SM
    if (channels !== undefined) {
      updateData.channels =
        channels && channels.length > 0
          ? channels
              .map((ch) => {
                switch (ch) {
                  case ReminderChannelEnum.WHATSAPP:
                    return 'WA';
                  case ReminderChannelEnum.EMAIL:
                    return 'EM';
                  case ReminderChannelEnum.SMS:
                    return 'SM';
                  default:
                    return ch;
                }
              })
              .join(',')
          : null;
    }

    // Handle metadata
    if (metadata !== undefined) {
      updateData.metadata = JSON.parse(JSON.stringify(metadata));
    }

    const reminder = await this.prisma.sys_Reminder.update({
      where: {
        company_id_id: {
          company_id: companyId,
          id: reminderId,
        },
      },
      data: updateData,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            mobile1: true,
            email: true,
          },
        },
        reminderLogs: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    return mapReminderToResponse(reminder);
  }

  /**
   * Delete a reminder
   */
  async remove(companyId: string, reminderId: string): Promise<void> {
    // Check if reminder exists
    const reminder = await this.prisma.sys_Reminder.findUnique({
      where: {
        company_id_id: {
          company_id: companyId,
          id: reminderId,
        },
      },
    });

    if (!reminder) {
      throw new NotFoundException('Reminder not found');
    }

    // Check if reminder is deleted
    if (reminder.isDeleted) {
      throw new NotFoundException('Reminder not found');
    }

    // Delete the reminder
    await this.prisma.sys_Reminder.delete({
      where: {
        company_id_id: {
          company_id: companyId,
          id: reminderId,
        },
      },
    });
  }

  /**
   * Send a reminder immediately
   */
  async sendReminder(
    companyId: string,
    reminderId: string,
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    const reminder = await this.findOne(companyId, reminderId);

    if (reminder.status === ReminderStatusEnum.CANCELLED) {
      throw new BadRequestException('Cannot send cancelled reminder');
    }

    // Determine channels to use
    const channels = reminder.channels
      ? reminder.channels.split(',')
      : ['WHATSAPP']; // Default to WhatsApp

    const results: Array<{
      channel: string;
      success: boolean;
      error?: string;
    }> = [];

    for (const channel of channels) {
      try {
        let success = false;
        let responseMessage = '';
        let errorMessage = '';
        let channelEnum: ReminderChannelEnum = ReminderChannelEnum.WHATSAPP;

        switch (channel.trim().toUpperCase()) {
          case 'WHATSAPP':
          case 'WA':
            channelEnum = ReminderChannelEnum.WHATSAPP;
            if (!reminder.recipientPhone) {
              errorMessage = 'No phone number provided';
            } else {
              const result = await this.wablasService.sendTextMessage(
                reminder.recipientPhone,
                reminder.message || reminder.title,
              );
              success = result.status;
              responseMessage = result.message || '';
              errorMessage = success ? '' : result.message || 'Failed to send';
            }
            break;

          case 'EMAIL':
          case 'EM':
            channelEnum = ReminderChannelEnum.EMAIL;
            // TODO: Implement email sending
            errorMessage = 'Email channel not yet implemented';
            break;

          case 'SMS':
          case 'SM':
            channelEnum = ReminderChannelEnum.SMS;
            // TODO: Implement SMS sending
            errorMessage = 'SMS channel not yet implemented';
            break;

          default:
            errorMessage = `Unknown channel: ${channel}`;
        }

        // Create log entry
        const logDateStr = new Date()
          .toISOString()
          .split('T')[0]
          .replace(/-/g, '');
        const logTimestamp = String(Date.now()).slice(-6);
        const logId = `RML${logDateStr}${logTimestamp}`.substring(0, 30);

        await this.prisma.sys_ReminderLog.create({
          data: {
            company_id: companyId,
            branch_id: reminder.branch_id,
            id: logId,
            reminder_id: reminderId,
            logType: success
              ? ReminderLogTypeEnum.SENT
              : ReminderLogTypeEnum.FAILED,
            channel: channelEnum,
            sentAt: success ? new Date() : undefined,
            message: reminder.message || reminder.title,
            recipient: reminder.recipientPhone || reminder.recipientEmail || '',
            status: success ? 'Success' : 'Failed',
            responseMessage,
            errorMessage,
            createdAt: new Date(),
          },
        });

        results.push({ channel, success });

        if (success) {
          // Update reminder
          await this.prisma.sys_Reminder.update({
            where: {
              company_id_id: {
                company_id: companyId,
                id: reminderId,
              },
            },
            data: {
              status: ReminderStatusEnum.SENT,
              lastSentAt: new Date(),
              lastAttemptAt: new Date(),
              sentCount: { increment: 1 },
            },
          });
        } else {
          // Update reminder on failure
          await this.prisma.sys_Reminder.update({
            where: {
              company_id_id: {
                company_id: companyId,
                id: reminderId,
              },
            },
            data: {
              status: ReminderStatusEnum.FAILED,
              lastAttemptAt: new Date(),
              retryCount: { increment: 1 },
              failureReason: errorMessage || 'Failed to send reminder',
            },
          });
        }
      } catch (error: any) {
        this.logger.error(
          `Error sending reminder via ${channel}: ${error.message}`,
        );
        results.push({ channel, success: false, error: error.message });
      }
    }

    const allSuccess = results.every((r) => r.success);
    const successCount = results.filter((r) => r.success).length;

    return {
      success: allSuccess,
      message: allSuccess
        ? `Reminder sent successfully via ${channels.length} channel(s)`
        : `Partial success: sent via ${successCount} of ${channels.length} channel(s)`,
    };
  }

  /**
   * Cancel a reminder
   */
  async cancel(
    companyId: string,
    reminderId: string,
  ): Promise<ReminderResponseDto> {
    return this.update(companyId, reminderId, {
      status: ReminderStatusEnum.CANCELLED,
    });
  }

  /**
   * Send reminders for upcoming services (for scheduled jobs)
   */
  async sendUpcomingServiceReminders(hoursBefore: number = 24): Promise<void> {
    try {
      const now = new Date();
      const reminderTime = new Date(
        now.getTime() + hoursBefore * 60 * 60 * 1000,
      );

      // Find pending reminders scheduled between now and reminderTime
      const upcomingReminders = await this.prisma.sys_Reminder.findMany({
        where: {
          status: {
            in: [ReminderStatusEnum.PENDING, ReminderStatusEnum.SCHEDULED],
          },
          scheduledDate: {
            gte: now,
            lte: reminderTime,
          },
        },
      });

      this.logger.log(
        `Found ${upcomingReminders.length} upcoming reminders to send`,
      );

      for (const reminder of upcomingReminders) {
        try {
          await this.sendReminder(reminder.company_id, reminder.id);
          // Delay to avoid rate limit
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error: any) {
          this.logger.error(
            `Error sending reminder ${reminder.id}: ${error.message}`,
          );
        }
      }
    } catch (error: any) {
      this.logger.error(
        `Error in sendUpcomingServiceReminders: ${error.message}`,
        error.stack,
      );
    }
  }
}
