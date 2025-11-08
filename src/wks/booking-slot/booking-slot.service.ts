import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateBookingSlotDto } from './dto/create-booking-slot.dto';
import { UpdateBookingSlotDto } from './dto/update-booking-slot.dto';
import { BookingSlotResponseDto } from './dto/response-booking-slot.dto';
import { PaginationBookingSlotDto } from './dto/pagination-booking-slot.dto';
import {
  BookingSlotStatsQueryDto,
  BookingSlotStatsResponseDto,
} from './dto/stats-booking-slot.dto';
import {
  buildSearchCondition,
  sortFieldBy,
  buildPagination,
} from '../../utils/query-operator';

@Injectable()
export class BookingSlotService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createBookingSlotDto: CreateBookingSlotDto,
    createdBy: string,
  ): Promise<BookingSlotResponseDto> {
    const {
      company_id,
      branch_id,
      bay_id,
      date,
      startTime,
      endTime,
      capacity = 1,
      bookedCount = 0,
      slotStatus,
      remarks,
    } = createBookingSlotDto;

    // Generate booking slot ID (max 20 chars)
    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const timestamp = String(Date.now()).slice(-6);
    const slotId = `BSL${dateStr}${timestamp}`.substring(0, 20);

    // Parse dates
    const dateObj = new Date(date);
    const startTimeObj = new Date(startTime);
    const endTimeObj = new Date(endTime);
    const now = new Date();

    const bookingSlot = await this.prisma.wks_BookingSlot.create({
      data: {
        id: slotId,
        company_id,
        branch_id,
        bay_id: bay_id || null,
        date: dateObj,
        startTime: startTimeObj,
        endTime: endTimeObj,
        capacity,
        bookedCount,
        slotStatus: slotStatus || 'OPEN',
        remarks: remarks || null,
        createdAt: now,
        createdBy: createdBy || null,
        isDeleted: false,
      },
      include: {
        bay: {
          select: {
            id: true,
            name: true,
            bayType: true,
          },
        },
      },
    });

    return this.mapToResponse(bookingSlot);
  }

  async findAll(paginationDto: PaginationBookingSlotDto): Promise<{
    data: BookingSlotResponseDto[];
    totalRecords: number;
  }> {
    const {
      page = 1,
      limit = 20,
      searchBy,
      searchTerm,
      company_id,
      branch_id,
      bay_id,
      slotStatus,
      start_date,
      end_date,
      orderBy,
      orderDir = 'desc',
    } = paginationDto;

    // Build pagination
    const pagination = buildPagination({ page, limit, maxLimit: 100 });

    // Build sort
    const orderByCondition = sortFieldBy(
      ['date', 'startTime', 'endTime', 'slotStatus', 'createdAt'],
      orderBy,
      orderDir,
    );

    // Build where condition
    const whereCondition: any = {
      company_id,
      isDeleted: false, // Hanya ambil yang tidak dihapus (soft delete)
    };

    if (branch_id && branch_id.length > 0) {
      whereCondition.branch_id = { in: branch_id };
    }

    if (bay_id && bay_id.length > 0) {
      whereCondition.bay_id = { in: bay_id };
    }

    if (slotStatus && slotStatus.length > 0) {
      whereCondition.slotStatus = { in: slotStatus };
    }

    if (start_date || end_date) {
      whereCondition.date = {};
      if (start_date) {
        whereCondition.date.gte = new Date(start_date);
      }
      if (end_date) {
        whereCondition.date.lte = new Date(end_date);
      }
    }

    // Build search condition
    const searchConditions = buildSearchCondition({ searchBy, searchTerm });

    if (searchConditions) {
      if (Array.isArray(whereCondition.AND)) {
        whereCondition.AND = [...whereCondition.AND, ...searchConditions];
      } else {
        whereCondition.AND = searchConditions;
      }
    }

    const include = {
      bay: {
        select: {
          id: true,
          name: true,
          bayType: true,
        },
      },
    };

    const [totalRecords, bookingSlots] = await Promise.all([
      this.prisma.wks_BookingSlot.count({ where: whereCondition }),
      this.prisma.wks_BookingSlot.findMany({
        where: whereCondition,
        include,
        orderBy: orderByCondition,
        skip: pagination.skip,
        take: pagination.take,
      }),
    ]);

    return {
      data: bookingSlots.map((slot) => this.mapToResponse(slot)),
      totalRecords,
    };
  }

  async findOne(
    companyId: string,
    id: string,
  ): Promise<BookingSlotResponseDto> {
    const bookingSlot = await this.prisma.wks_BookingSlot.findFirst({
      where: {
        company_id: companyId,
        id,
        isDeleted: false, // Hanya ambil yang tidak dihapus (soft delete)
      },
      include: {
        bay: {
          select: {
            id: true,
            name: true,
            bayType: true,
          },
        },
      },
    });

    if (!bookingSlot) {
      throw new NotFoundException(`Booking slot with ID ${id} not found`);
    }

    return this.mapToResponse(bookingSlot);
  }

  async getStats(
    query: BookingSlotStatsQueryDto,
  ): Promise<BookingSlotStatsResponseDto> {
    const { company_id, branch_id, bay_id, slotStatus, start_date, end_date } =
      query;

    const where: any = {
      company_id,
      isDeleted: false, // Hanya ambil yang tidak dihapus (soft delete)
    };
    if (branch_id && branch_id.length > 0) where.branch_id = { in: branch_id };
    if (bay_id && bay_id.length > 0) where.bay_id = { in: bay_id };
    if (slotStatus && slotStatus.length > 0)
      where.slotStatus = { in: slotStatus as any };
    if (start_date || end_date) {
      where.date = {};
      if (start_date) where.date.gte = new Date(start_date);
      if (end_date) where.date.lte = new Date(end_date);
    }

    // Group by status for counts, and aggregate sums for capacity/bookedCount
    const [grouped, sums, total] = await Promise.all([
      this.prisma.wks_BookingSlot.groupBy({
        by: ['slotStatus'],
        where,
        _count: { _all: true },
      }),
      this.prisma.wks_BookingSlot.aggregate({
        where,
        _sum: { capacity: true, bookedCount: true },
      }),
      this.prisma.wks_BookingSlot.count({ where }),
    ]);

    const getCount = (status: string) =>
      grouped.find((g) => g.slotStatus === status)?._count?._all || 0;

    const totalCapacity = sums._sum.capacity || 0;
    const totalBooked = sums._sum.bookedCount || 0;
    const averageUtilization =
      totalCapacity > 0 ? Math.round((totalBooked / totalCapacity) * 100) : 0;

    return {
      total,
      open: getCount('OPEN'),
      booked: getCount('BOOKED'),
      cancelled: getCount('CANCELLED'),
      closed: getCount('CLOSED'),
      totalCapacity,
      totalBooked,
      averageUtilization,
    };
  }

  async update(
    companyId: string,
    id: string,
    updateBookingSlotDto: UpdateBookingSlotDto,
    updatedBy: string,
  ): Promise<BookingSlotResponseDto> {
    await this.findOne(companyId, id);

    const updateData: any = {
      updatedBy: updatedBy || null,
      updatedAt: new Date(),
    };

    if (updateBookingSlotDto.bay_id !== undefined) {
      updateData.bay_id = updateBookingSlotDto.bay_id || null;
    }

    if (updateBookingSlotDto.date !== undefined) {
      updateData.date = new Date(updateBookingSlotDto.date);
    }

    if (updateBookingSlotDto.startTime !== undefined) {
      updateData.startTime = new Date(updateBookingSlotDto.startTime);
    }

    if (updateBookingSlotDto.endTime !== undefined) {
      updateData.endTime = new Date(updateBookingSlotDto.endTime);
    }

    if (updateBookingSlotDto.capacity !== undefined) {
      updateData.capacity = updateBookingSlotDto.capacity;
    }

    if (updateBookingSlotDto.bookedCount !== undefined) {
      updateData.bookedCount = updateBookingSlotDto.bookedCount;
    }

    if (updateBookingSlotDto.slotStatus !== undefined) {
      updateData.slotStatus = updateBookingSlotDto.slotStatus;
    }

    if (updateBookingSlotDto.remarks !== undefined) {
      updateData.remarks = updateBookingSlotDto.remarks || null;
    }

    await this.prisma.wks_BookingSlot.update({
      where: {
        company_id_id: {
          company_id: companyId,
          id,
        },
      },
      data: updateData,
    });

    return this.findOne(companyId, id);
  }

  async remove(
    companyId: string,
    id: string,
    deletedBy: string,
  ): Promise<{ message: string }> {
    await this.findOne(companyId, id);

    // Soft delete: update isDeleted, deletedAt, deletedBy
    await this.prisma.wks_BookingSlot.update({
      where: {
        company_id_id: {
          company_id: companyId,
          id,
        },
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: deletedBy || null,
      },
    });

    return { message: 'Booking slot deleted successfully' };
  }

  private mapToResponse(slot: any): BookingSlotResponseDto {
    return {
      id: slot.id,
      company_id: slot.company_id,
      branch_id: slot.branch_id,
      bay_id: slot.bay_id,
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      capacity: slot.capacity,
      bookedCount: slot.bookedCount,
      slotStatus: slot.slotStatus,
      remarks: slot.remarks,
      createdAt: slot.createdAt,
      createdBy: slot.createdBy || null,
      updatedBy: slot.updatedBy || null,
      updatedAt: slot.updatedAt || null,
      isDeleted: slot.isDeleted || false,
      deletedAt: slot.deletedAt || null,
      deletedBy: slot.deletedBy || null,
      bay: slot.bay || null,
    };
  }
}
