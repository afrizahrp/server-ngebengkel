import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  BookingStatusEnum,
  ReminderEntityTypeEnum,
  ReminderTypeEnum,
  ReminderStatusEnum,
  ReminderChannelEnum,
  ReminderLogTypeEnum,
} from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingResponseDto } from './dto/response-booking.dto';
import { PaginationBookingDto } from './dto/pagination-booking.dto';
import {
  bookingWhereCondition,
  BookingFilter,
} from './helper/bookingWhereCondition';
import {
  buildSearchCondition,
  sortFieldBy,
  buildPagination,
} from '../../utils/query-operator';
import { mapBookingToResponse } from './helper/mapBookingToResponse';
import { generateDocumentNumber } from '../../utils/generateDocumentNumber';
import { WablasService } from '../../whatsapp/wablas.service';

type DateRange = { start: Date; end: Date };

function rangesOverlap(a: DateRange, b: DateRange, bufferMinutes = 0): boolean {
  const bufferMs = bufferMinutes * 60_000;
  const aStart = a.start.getTime();
  const aEnd = a.end.getTime();
  const bStart = b.start.getTime();
  const bEnd = b.end.getTime();
  return aStart < bEnd + bufferMs && bStart < aEnd + bufferMs;
}

@Injectable()
export class BookingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly wablasService: WablasService,
  ) {}

  async getBranchBufferMinutes(
    companyId: string,
    branchId: string,
    when: Date,
  ): Promise<number> {
    const weekday = when.getDay(); // 0..6
    const wh = await this.prisma.wks_BranchWorkingHour.findUnique({
      where: {
        company_id_branch_id_weekday: {
          company_id: companyId,
          branch_id: branchId,
          weekday,
        },
      },
      select: { bookingBufferMinutes: true },
    });
    return wh?.bookingBufferMinutes ?? 0;
  }

  async isHoliday(
    companyId: string,
    branchId: string,
    date: Date,
  ): Promise<boolean> {
    const start = new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
    );
    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000 - 1);
    const count = await this.prisma.wks_BranchHoliday.count({
      where: {
        company_id: companyId,
        date: { gte: start, lte: end },
        OR: [{ branch_id: branchId }, { branch_id: null }],
        isClosed: true,
      },
    });
    return count > 0;
  }

  async isWithinWorkingHours(
    companyId: string,
    branchId: string,
    range: DateRange,
  ): Promise<boolean> {
    const weekday = range.start.getDay();
    const wh = await this.prisma.wks_BranchWorkingHour.findUnique({
      where: {
        company_id_branch_id_weekday: {
          company_id: companyId,
          branch_id: branchId,
          weekday,
        },
      },
    });
    if (!wh || !wh.isOpen || !wh.openTime || !wh.closeTime) return false;
    const [oH, oM] = wh.openTime.split(':').map(Number);
    const [cH, cM] = wh.closeTime.split(':').map(Number);
    const open = new Date(range.start);
    open.setHours(oH, oM, 0, 0);
    const close = new Date(range.start);
    close.setHours(cH, cM, 0, 0);
    return range.start >= open && range.end <= close;
  }

  async hasBayConflict(
    companyId: string,
    branchId: string,
    bayId: string,
    range: DateRange,
    bufferMinutes: number,
  ): Promise<boolean> {
    if (!bayId) return false;
    const [bookings, blocks] = await Promise.all([
      this.prisma.wks_ServiceBooking.findMany({
        where: {
          company_id: companyId,
          branch_id: branchId,
          bay_id: bayId,
          status: { in: ['CONFIRMED', 'CHECKED_IN', 'IN_SERVICE'] as any },
        },
        select: { scheduledStart: true, scheduledEnd: true },
      }),
      this.prisma.wks_BayBlock.findMany({
        where: {
          company_id: companyId,
          branch_id: branchId,
          bay_id: bayId,
        },
        select: { startTime: true, endTime: true },
      }),
    ]);

    return (
      bookings.some(
        (b) =>
          b.scheduledStart &&
          b.scheduledEnd &&
          rangesOverlap(
            { start: b.scheduledStart, end: b.scheduledEnd },
            range,
            bufferMinutes,
          ),
      ) ||
      blocks.some((b) =>
        rangesOverlap(
          { start: b.startTime, end: b.endTime },
          range,
          bufferMinutes,
        ),
      )
    );
  }

  async hasMechanicConflict(
    companyId: string,
    branchId: string,
    mechanicId: string,
    range: DateRange,
    bufferMinutes: number,
  ): Promise<boolean> {
    if (!mechanicId) return false;
    const bookings = await this.prisma.wks_ServiceBooking.findMany({
      where: {
        company_id: companyId,
        branch_id: branchId,
        mechanic_id: mechanicId,
        status: { in: ['CONFIRMED', 'CHECKED_IN', 'IN_SERVICE'] as any },
      },
      select: { scheduledStart: true, scheduledEnd: true },
    });
    return bookings.some(
      (b) =>
        b.scheduledStart &&
        b.scheduledEnd &&
        rangesOverlap(
          { start: b.scheduledStart, end: b.scheduledEnd },
          range,
          bufferMinutes,
        ),
    );
  }

  async autoPickBay(
    companyId: string,
    branchId: string,
    range: DateRange,
    bufferMinutes: number,
  ): Promise<string | null> {
    const bays = await this.prisma.wks_ServiceBay.findMany({
      where: {
        company_id: companyId,
        branch_id: branchId,
        iStatus: 'Active' as any,
      },
      select: { id: true },
      orderBy: { id: 'asc' },
    });
    for (const bay of bays) {
      const conflict = await this.hasBayConflict(
        companyId,
        branchId,
        bay.id,
        range,
        bufferMinutes,
      );
      if (!conflict) return bay.id;
    }
    return null;
  }

  async autoPickMechanic(
    companyId: string,
    branchId: string,
    range: DateRange,
    bufferMinutes: number,
  ): Promise<string | null> {
    const mechanics = await this.prisma.cmf_Mechanic.findMany({
      where: {
        company_id: companyId,
        branch_id: branchId,
        iStatus: 'Active' as any,
        isAvailable: true,
      },
      select: { id: true },
      orderBy: { id: 'asc' },
    });
    for (const m of mechanics) {
      const conflict = await this.hasMechanicConflict(
        companyId,
        branchId,
        m.id,
        range,
        bufferMinutes,
      );
      if (!conflict) return m.id;
    }
    return null;
  }

  // Validate and optionally assign bay/mechanic, returning the chosen plan
  async validateAndPlan(
    companyId: string,
    branchId: string,
    desiredStart: Date,
    durationMinutes: number,
    bayId?: string | null,
    mechanicId?: string | null,
  ): Promise<{
    scheduledStart: Date;
    scheduledEnd: Date;
    bayId: string | null;
    mechanicId: string | null;
  }> {
    const scheduledStart = desiredStart;
    const scheduledEnd = new Date(
      scheduledStart.getTime() + durationMinutes * 60_000,
    );
    const range = { start: scheduledStart, end: scheduledEnd };

    if (await this.isHoliday(companyId, branchId, scheduledStart)) {
      throw new Error('Selected date is a holiday/closed for this branch');
    }
    if (!(await this.isWithinWorkingHours(companyId, branchId, range))) {
      throw new Error('Requested time is outside branch working hours');
    }
    const buffer = await this.getBranchBufferMinutes(
      companyId,
      branchId,
      scheduledStart,
    );

    // Validate or auto-pick bay
    let finalBayId = bayId ?? null;
    if (finalBayId) {
      const conflict = await this.hasBayConflict(
        companyId,
        branchId,
        finalBayId,
        range,
        buffer,
      );
      if (conflict) throw new Error('Selected bay has a conflicting schedule');
    } else {
      finalBayId = await this.autoPickBay(companyId, branchId, range, buffer);
    }

    // Validate or auto-pick mechanic
    let finalMechanicId = mechanicId ?? null;
    if (finalMechanicId) {
      const conflict = await this.hasMechanicConflict(
        companyId,
        branchId,
        finalMechanicId,
        range,
        buffer,
      );
      if (conflict)
        throw new Error('Selected mechanic has a conflicting schedule');
    } else {
      finalMechanicId = await this.autoPickMechanic(
        companyId,
        branchId,
        range,
        buffer,
      );
    }

    return {
      scheduledStart,
      scheduledEnd,
      bayId: finalBayId,
      mechanicId: finalMechanicId,
    };
  }

  // Confirm a booking: set scheduledStart/End, assign bay/mechanic, move status to CONFIRMED
  async confirmBooking(
    bookingId: string,
    companyId: string,
    durationMinutes: number,
  ): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const booking = await tx.wks_ServiceBooking.findUnique({
        where: {
          company_id_id: {
            company_id: companyId,
            id: bookingId,
          },
        },
      });
      if (!booking) throw new Error('Booking not found');
      if (booking.isDeleted) throw new Error('Booking not found');
      if (booking.status !== 'PENDING')
        throw new Error('Only PENDING bookings can be confirmed');
      const desiredStart = booking.scheduledStart ?? new Date();
      const plan = await this.validateAndPlan(
        booking.company_id,
        booking.branch_id,
        desiredStart,
        durationMinutes,
        booking.bay_id,
        booking.mechanic_id,
      );

      await tx.wks_ServiceBooking.update({
        where: {
          company_id_id: {
            company_id: companyId,
            id: bookingId,
          },
        },
        data: {
          scheduledStart: plan.scheduledStart,
          scheduledEnd: plan.scheduledEnd,
          bay_id: plan.bayId ?? undefined,
          mechanic_id: plan.mechanicId ?? undefined,
          status: 'CONFIRMED' as any,
        },
      });
    });
  }

  // CRUD Operations
  async generateBookingNumber(
    companyId: string,
    branchId: string,
  ): Promise<string> {
    // Use helper to generate document number using sys_Numbering
    return await generateDocumentNumber({
      prisma: this.prisma,
      module_id: 'WKS',
      company_id: companyId,
      branch_id: branchId,
      date: new Date(),
      prefix: 'BKG', // Booking prefix
    });
  }

  async create(
    createBookingDto: CreateBookingDto,
  ): Promise<BookingResponseDto> {
    const {
      company_id,
      branch_id,
      customer_id,
      customerVehicle_id,
      preferredDate,
      preferredStartTime,
      estimatedDuration,
      ...bookingData
    } = createBookingDto;

    // Generate booking ID (max 20 chars: BKG + YYYYMMDD + 6 digits)
    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const timestamp = String(Date.now()).slice(-6);
    const bookingId = `BKG${dateStr}${timestamp}`.substring(0, 20);

    // Generate booking number
    const bookingNumber = await this.generateBookingNumber(
      company_id,
      branch_id,
    );

    // Calculate scheduledStart/End if preferredDate and time provided
    let scheduledStart: Date | undefined;
    let scheduledEnd: Date | undefined;

    if (preferredDate && preferredStartTime && estimatedDuration) {
      scheduledStart = new Date(preferredDate);
      const [hours, minutes] = preferredStartTime.split(':').map(Number);
      scheduledStart.setHours(hours, minutes, 0, 0);

      scheduledEnd = new Date(
        scheduledStart.getTime() + estimatedDuration * 60_000,
      );
    }

    const booking = await this.prisma.wks_ServiceBooking.create({
      data: {
        id: bookingId,
        bookingNumber,
        bookingDate: new Date(),
        company_id,
        branch_id,
        customer_id,
        customerVehicle_id,
        vehicle_customer_id: customer_id,
        preferredDate,
        preferredStartTime,
        preferredEndTime: bookingData.preferredEndTime,
        scheduledStart,
        scheduledEnd,
        bay_id: bookingData.bay_id,
        mechanic_id: bookingData.mechanic_id,
        serviceType_id: bookingData.serviceType_id,
        complaintNotes: bookingData.complaintNotes,
        additionalRequest: bookingData.additionalRequest,
        status: bookingData.status || BookingStatusEnum.PENDING,
        source: bookingData.source || 'WEB',
        remarks: bookingData.remarks,
        createdBy: bookingData.createdBy,
        updatedAt: new Date(),
      },
    });

    return this.findOne(company_id, booking.id);
  }

  // New pagination-based findAll
  async findAll(paginationDto: PaginationBookingDto): Promise<{
    data: BookingResponseDto[];
    totalRecords: number;
  }> {
    const {
      page = 1,
      limit = 20,
      searchBy,
      searchTerm,
      company_id,
      branch_id,
      status,
      customer_id,
      start_date,
      end_date,
      bay_id,
      mechanic_id,
      orderBy,
      orderDir = 'desc',
    } = paginationDto;

    // Build pagination
    const pagination = buildPagination({ page, limit, maxLimit: 100 });

    // Build sort
    const orderByCondition = sortFieldBy(
      [
        'bookingNumber',
        'bookingDate',
        'preferredDate',
        'scheduledStart',
        'status',
        'createdAt',
      ],
      orderBy,
      orderDir,
    );

    const filter: BookingFilter = {
      company_id,
      branch_id: branch_id && branch_id.length > 0 ? branch_id : undefined,
      status: status && status.length > 0 ? status : undefined,
      customer_id,
      start_date,
      end_date,
      bay_id: bay_id && bay_id.length > 0 ? bay_id : undefined,
      mechanic_id:
        mechanic_id && mechanic_id.length > 0 ? mechanic_id : undefined,
    };

    const whereCondition = bookingWhereCondition(filter);
    const searchConditions = buildSearchCondition({ searchBy, searchTerm });

    if (searchConditions) {
      if (Array.isArray(whereCondition.AND)) {
        whereCondition.AND = [...whereCondition.AND, ...searchConditions];
      } else {
        whereCondition.AND = searchConditions;
      }
    }

    const bookingInclude = {
      customer: {
        select: {
          id: true,
          name: true,
          mobile1: true,
          email: true,
        },
      },
      customerVehicle: {
        select: {
          id: true,
          licensePlate: true,
          brand: { select: { name: true } },
          model: { select: { name: true } },
          vehicleYear: true,
        },
      },
      bay: {
        select: {
          id: true,
          name: true,
          bayType: true,
        },
      },
      mechanic: {
        select: {
          id: true,
          employee: { select: { name: true } },
          specialization: true,
        },
      },
      serviceType: {
        select: {
          id: true,
          name: true,
          category: true,
        },
      },
    };

    const [totalRecords, bookings] = await Promise.all([
      this.prisma.wks_ServiceBooking.count({ where: whereCondition }),
      this.prisma.wks_ServiceBooking.findMany({
        where: whereCondition,
        include: bookingInclude,
        orderBy: orderByCondition,
        skip: pagination.skip,
        take: pagination.take,
      }),
    ]);

    return {
      data: bookings.map(mapBookingToResponse),
      totalRecords,
    };
  }

  async findOne(companyId: string, id: string): Promise<BookingResponseDto> {
    const booking = await this.prisma.wks_ServiceBooking.findUnique({
      where: {
        company_id_id: {
          company_id: companyId,
          id,
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
        customerVehicle: {
          select: {
            id: true,
            licensePlate: true,
            brand: { select: { name: true } },
            model: { select: { name: true } },
            vehicleYear: true,
          },
        },
        bay: {
          select: {
            id: true,
            name: true,
            bayType: true,
          },
        },
        mechanic: {
          select: {
            id: true,
            employee: { select: { name: true } },
            specialization: true,
          },
        },
        serviceType: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    // Check if booking is deleted
    if (booking.isDeleted) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return mapBookingToResponse(booking);
  }

  async update(
    companyId: string,
    id: string,
    updateBookingDto: UpdateBookingDto,
  ): Promise<BookingResponseDto> {
    const booking = await this.findOne(companyId, id);

    const {
      preferredDate,
      preferredStartTime,
      estimatedDuration,
      updatedBy,
      ...updateData
    } = updateBookingDto;

    // Recalculate scheduledStart/End if preferredDate/time/duration changed
    let scheduledStart = updateData.scheduledStart;
    let scheduledEnd = updateData.scheduledEnd;

    if (
      (preferredDate !== undefined || booking.preferredDate) &&
      (preferredStartTime !== undefined || booking.preferredStartTime) &&
      estimatedDuration !== undefined
    ) {
      const date =
        preferredDate !== undefined
          ? preferredDate instanceof Date
            ? preferredDate
            : new Date(preferredDate)
          : booking.preferredDate;
      const time =
        preferredStartTime !== undefined
          ? preferredStartTime
          : booking.preferredStartTime;
      const duration = estimatedDuration;

      if (date && time && duration) {
        const dateObj = date instanceof Date ? date : new Date(date);
        scheduledStart = new Date(dateObj);
        const [hours, minutes] = time.split(':').map(Number);
        scheduledStart.setHours(hours, minutes, 0, 0);

        scheduledEnd = new Date(scheduledStart.getTime() + duration * 60_000);
      }
    }

    await this.prisma.wks_ServiceBooking.update({
      where: {
        company_id_id: {
          company_id: companyId,
          id,
        },
      },
      data: {
        preferredDate: preferredDate !== undefined ? preferredDate : undefined,
        preferredStartTime:
          preferredStartTime !== undefined ? preferredStartTime : undefined,
        preferredEndTime: updateData.preferredEndTime,
        scheduledStart,
        scheduledEnd,
        bay_id: updateData.bay_id,
        mechanic_id: updateData.mechanic_id,
        serviceType_id: updateData.serviceType_id,
        complaintNotes: updateData.complaintNotes,
        additionalRequest: updateData.additionalRequest,
        status: updateData.status,
        source: updateData.source,
        remarks: updateData.remarks,
        cancelReason: updateData.cancelReason,
        updatedBy,
        updatedAt: new Date(),
      },
    });

    return this.findOne(companyId, id);
  }

  async remove(companyId: string, id: string): Promise<{ message: string }> {
    await this.findOne(companyId, id);

    await this.prisma.wks_ServiceBooking.delete({
      where: {
        company_id_id: {
          company_id: companyId,
          id,
        },
      },
    });

    return { message: 'Booking deleted successfully' };
  }

  /**
   * Kirim reminder untuk booking menggunakan sys_Reminder
   */
  async sendReminder(bookingId: string, companyId: string) {
    // Get booking dengan relasi lengkap
    const booking = await this.findOne(companyId, bookingId);

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Cek apakah customer punya nomor telepon
    const customerPhone = booking.customer?.mobile1;
    if (!customerPhone) {
      throw new BadRequestException('Customer tidak memiliki nomor telepon');
    }

    // Generate reminder number
    const reminderNumber = await generateDocumentNumber({
      prisma: this.prisma,
      module_id: 'WKS',
      company_id: companyId,
      branch_id: booking.branch_id,
      date: new Date(),
      prefix: 'REM', // Reminder prefix
    });

    // Generate reminder ID (max 30 chars)
    const reminderId = (
      companyId +
      'REM' +
      Date.now().toString(36) +
      Math.random().toString(36).slice(2)
    )
      .toUpperCase()
      .slice(0, 30);

    // Generate reminder message
    const reminderMessage = this.generateReminderMessage(booking);

    // Create reminder record
    await this.prisma.sys_Reminder.create({
      data: {
        id: reminderId,
        reminderNumber,
        entityType: ReminderEntityTypeEnum.BOOKING,
        entity_id: bookingId,
        reminderType: ReminderTypeEnum.APPOINTMENT,
        title: `Reminder Booking ${booking.bookingNumber}`,
        message: reminderMessage,
        scheduledDate:
          booking.scheduledStart || booking.preferredDate || new Date(),
        customer_id: booking.customer_id,
        recipientPhone: customerPhone,
        channels: 'WA', // WhatsApp channel code
        status: ReminderStatusEnum.PENDING,
        company_id: companyId,
        branch_id: booking.branch_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Kirim via WhatsApp
    const result = await this.wablasService.sendTextMessage(
      customerPhone,
      reminderMessage,
    );

    if (result.status) {
      // Update reminder status dan create log
      const logId = (
        companyId +
        'RML' +
        Date.now().toString(36) +
        Math.random().toString(36).slice(2)
      )
        .toUpperCase()
        .slice(0, 30);

      await this.prisma.$transaction(async (tx) => {
        await tx.sys_Reminder.update({
          where: {
            company_id_id: {
              company_id: companyId,
              id: reminderId,
            },
          },
          data: {
            status: ReminderStatusEnum.SENT,
            lastSentAt: new Date(),
            sentCount: { increment: 1 },
            updatedAt: new Date(),
          },
        });

        await tx.sys_ReminderLog.create({
          data: {
            id: logId,
            reminder_id: reminderId,
            logType: ReminderLogTypeEnum.SENT,
            channel: ReminderChannelEnum.WHATSAPP,
            sentAt: new Date(),
            message: reminderMessage,
            responseMessage: result.message || 'Success',
            company_id: companyId,
            branch_id: booking.branch_id,
            createdAt: new Date(),
          },
        });
      });

      return {
        success: true,
        message: 'Reminder berhasil dikirim',
        reminderId,
      };
    } else {
      // Update reminder status failed
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
          failureReason: result.message || 'Gagal mengirim reminder',
          updatedAt: new Date(),
        },
      });

      throw new BadRequestException(
        result.message || 'Gagal mengirim reminder via WhatsApp',
      );
    }
  }

  /**
   * Generate reminder message text untuk booking
   */
  private generateReminderMessage(booking: BookingResponseDto): string {
    const {
      bookingNumber,
      scheduledStart,
      preferredDate,
      preferredStartTime,
      customer,
      vehicle,
      complaintNotes,
    } = booking;

    let message = `╔══════════════════════════════════╗
║      🔔 REMINDER BOOKING         ║
╚══════════════════════════════════╝

Halo *${customer?.name || 'Pelanggan'}* 👋

Kami ingin mengingatkan Anda tentang booking:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🆔 No. Booking: *${bookingNumber}*`;

    if (vehicle?.licensePlate) {
      message += `\n🚗 Kendaraan: *${vehicle.licensePlate}*`;
    }

    if (scheduledStart) {
      const scheduledDate = new Date(scheduledStart);
      const dateStr = scheduledDate.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
      const timeStr = scheduledDate.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      });
      message += `\n📅 Jadwal Booking: *${dateStr}* pukul *${timeStr}*`;
    } else if (preferredDate && preferredStartTime) {
      const date =
        preferredDate instanceof Date ? preferredDate : new Date(preferredDate);
      const dateStr = date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
      message += `\n📅 Tanggal Preferred: *${dateStr}* pukul *${preferredStartTime}*`;
    }

    if (complaintNotes) {
      message += `\n\n📝 Keluhan:\n${complaintNotes}`;
    }

    message += `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Mohon datang tepat waktu ya! 🙏

Jika ada perubahan jadwal, silakan hubungi kami.

Terima kasih!

---
🔧 Ngebengkel`;

    return message;
  }

  async cancel(
    companyId: string,
    id: string,
    cancelReason?: string,
  ): Promise<BookingResponseDto> {
    const booking = await this.findOne(companyId, id);

    if (booking.status === 'COMPLETED') {
      throw new BadRequestException('Cannot cancel a completed booking');
    }

    await this.prisma.wks_ServiceBooking.update({
      where: {
        company_id_id: {
          company_id: companyId,
          id,
        },
      },
      data: {
        status: BookingStatusEnum.CANCELLED,
        cancelReason: cancelReason || 'Cancelled by user',
        cancelledAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return this.findOne(companyId, id);
  }
}
