import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { init } from '@paralleldrive/cuid2';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { CreateWorkingHourDto } from './dto/create-working-hour.dto';
import { CreateBatchWorkingHoursDto } from './dto/create-batch-working-hours.dto';
import { UpdateWorkingHourDto } from './dto/update-working-hour.dto';
import { WorkingHourResponseDto } from './dto/response-working-hour.dto';

const createWorkingHourId = init({ length: 21 });

const WORKING_HOUR_SELECT = {
  id: true,
  waitingList_id: true,
  branch_id: true,
  company_id: true,
  weekday: true,
  isOpen: true,
  openTime: true,
  closeTime: true,
  bookingBufferMinutes: true,
  remarks: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
} as const satisfies Prisma.wks_WorkingHourSelect;

type WorkingHourWithRelations = Prisma.wks_WorkingHourGetPayload<{
  select: typeof WORKING_HOUR_SELECT;
}>;

@Injectable()
export class WorkingHourService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly workingHourSelect = WORKING_HOUR_SELECT;

  async create(
    createWorkingHourDto: CreateWorkingHourDto,
  ): Promise<WorkingHourResponseDto> {
    // Validasi waitingList exists
    const waitingList = await this.prisma.wks_waitingList.findFirst({
      where: { id: createWorkingHourDto.waitingListId, isDeleted: false },
      select: { id: true },
    });

    if (!waitingList) {
      throw new NotFoundException('Waiting list tidak ditemukan');
    }

    // Validasi branch jika disediakan
    if (createWorkingHourDto.branchId) {
      const branch = await this.prisma.sys_Branch.findUnique({
        where: { id: createWorkingHourDto.branchId },
        select: { id: true, company_id: true },
      });

      if (!branch) {
        throw new NotFoundException('Branch tidak ditemukan');
      }

      // Set company_id dari branch jika tidak disediakan
      if (!createWorkingHourDto.companyId) {
        createWorkingHourDto.companyId = branch.company_id;
      }
    }

    // Validasi company jika disediakan
    if (createWorkingHourDto.companyId) {
      const company = await this.prisma.sys_Company.findUnique({
        where: { id: createWorkingHourDto.companyId },
        select: { id: true },
      });

      if (!company) {
        throw new NotFoundException('Company tidak ditemukan');
      }
    }

    // Cek apakah sudah ada working hour untuk waitingList dan weekday yang sama
    const existing = await this.prisma.wks_WorkingHour.findFirst({
      where: {
        waitingList_id: createWorkingHourDto.waitingListId,
        weekday: createWorkingHourDto.weekday,
      },
      select: { id: true },
    });

    if (existing) {
      throw new BadRequestException(
        `Working hour untuk hari ${this.getWeekdayName(createWorkingHourDto.weekday)} sudah ada`,
      );
    }

    // Validasi waktu jika isOpen = true
    if (createWorkingHourDto.isOpen !== false) {
      if (!createWorkingHourDto.openTime || !createWorkingHourDto.closeTime) {
        throw new BadRequestException(
          'openTime dan closeTime wajib diisi jika isOpen = true',
        );
      }

      // Validasi closeTime > openTime
      if (
        this.compareTime(
          createWorkingHourDto.openTime,
          createWorkingHourDto.closeTime,
        ) >= 0
      ) {
        throw new BadRequestException(
          'closeTime harus lebih besar dari openTime',
        );
      }
    }

    const id = await this.generateId();

    const workingHour = await this.prisma.wks_WorkingHour.create({
      data: {
        id,
        waitingList_id: createWorkingHourDto.waitingListId,
        branch_id: createWorkingHourDto.branchId ?? null,
        company_id: createWorkingHourDto.companyId ?? null,
        weekday: createWorkingHourDto.weekday,
        isOpen: createWorkingHourDto.isOpen ?? true,
        openTime: createWorkingHourDto.openTime ?? null,
        closeTime: createWorkingHourDto.closeTime ?? null,
        bookingBufferMinutes: createWorkingHourDto.bookingBufferMinutes ?? 0,
        remarks: createWorkingHourDto.remarks ?? null,
        createdBy: 'website',
        updatedBy: 'website',
      },
      select: this.workingHourSelect,
    });

    return this.toResponse(workingHour);
  }

  async createBatch(
    createBatchWorkingHoursDto: CreateBatchWorkingHoursDto,
  ): Promise<WorkingHourResponseDto[]> {
    const { workingHours } = createBatchWorkingHoursDto;

    if (!workingHours || workingHours.length === 0) {
      throw new BadRequestException('Working hours tidak boleh kosong');
    }

    // Validasi semua waitingListId sama
    const waitingListIds = new Set(
      workingHours.map((wh) => wh.waitingListId),
    );
    if (waitingListIds.size > 1) {
      throw new BadRequestException(
        'Semua working hours harus memiliki waitingListId yang sama',
      );
    }

    const waitingListId = Array.from(waitingListIds)[0];

    // Validasi waitingList exists
    const waitingList = await this.prisma.wks_waitingList.findFirst({
      where: { id: waitingListId, isDeleted: false },
      select: { id: true },
    });

    if (!waitingList) {
      throw new NotFoundException('Waiting list tidak ditemukan');
    }

    // Validasi tidak ada duplikasi weekday
    const weekdays = workingHours.map((wh) => wh.weekday);
    const uniqueWeekdays = new Set(weekdays);
    if (weekdays.length !== uniqueWeekdays.size) {
      throw new BadRequestException('Tidak boleh ada duplikasi weekday');
    }

    // Cek apakah sudah ada working hour untuk weekday yang sama
    const existingWeekdays = await this.prisma.wks_WorkingHour.findMany({
      where: {
        waitingList_id: waitingListId,
        weekday: { in: weekdays },
      },
      select: { weekday: true },
    });

    if (existingWeekdays.length > 0) {
      const existingWeekdayNames = existingWeekdays
        .map((ew) => this.getWeekdayName(ew.weekday))
        .join(', ');
      throw new BadRequestException(
        `Working hour untuk hari ${existingWeekdayNames} sudah ada`,
      );
    }

    // Validasi waktu untuk setiap working hour
    for (const wh of workingHours) {
      if (wh.isOpen !== false) {
        if (!wh.openTime || !wh.closeTime) {
          throw new BadRequestException(
            `openTime dan closeTime wajib diisi untuk hari ${this.getWeekdayName(wh.weekday)} jika isOpen = true`,
          );
        }

        if (this.compareTime(wh.openTime, wh.closeTime) >= 0) {
          throw new BadRequestException(
            `closeTime harus lebih besar dari openTime untuk hari ${this.getWeekdayName(wh.weekday)}`,
          );
        }
      }
    }

    // Generate IDs untuk semua working hours
    const ids = await Promise.all(
      Array.from({ length: workingHours.length }, () => this.generateId()),
    );

    // Get branch info jika ada
    let branchCompanyId: string | null = null;
    if (workingHours[0].branchId) {
      const branch = await this.prisma.sys_Branch.findUnique({
        where: { id: workingHours[0].branchId },
        select: { company_id: true },
      });

      if (!branch) {
        throw new NotFoundException('Branch tidak ditemukan');
      }

      branchCompanyId = branch.company_id;
    }

    // Create semua working hours dalam transaction
    const createdWorkingHours = await this.prisma.$transaction(async (tx) => {
      const results: WorkingHourWithRelations[] = [];
      for (let i = 0; i < workingHours.length; i++) {
        const wh = workingHours[i];
        const created = await tx.wks_WorkingHour.create({
          data: {
            id: ids[i],
            waitingList_id: waitingListId,
            branch_id: wh.branchId ?? null,
            company_id: wh.companyId ?? branchCompanyId ?? null,
            weekday: wh.weekday,
            isOpen: wh.isOpen ?? true,
            openTime: wh.openTime ?? null,
            closeTime: wh.closeTime ?? null,
            bookingBufferMinutes: wh.bookingBufferMinutes ?? 0,
            remarks: wh.remarks ?? null,
            createdBy: 'website',
            updatedBy: 'website',
          },
          select: this.workingHourSelect,
        });
        results.push(created);
      }
      return results;
    });

    return createdWorkingHours.map((wh) => this.toResponse(wh));
  }

  async findAll(
    waitingListId?: string,
    branchId?: string,
    companyId?: string,
  ): Promise<WorkingHourResponseDto[]> {
    const where: Prisma.wks_WorkingHourWhereInput = {};

    if (waitingListId) {
      where.waitingList_id = waitingListId;
    }

    if (branchId) {
      where.branch_id = branchId;
    }

    if (companyId) {
      where.company_id = companyId;
    }

    const workingHours = await this.prisma.wks_WorkingHour.findMany({
      where,
      select: this.workingHourSelect,
      orderBy: [{ weekday: 'asc' }],
    });

    return workingHours.map((wh) => this.toResponse(wh));
  }

  async findOne(id: string): Promise<WorkingHourResponseDto> {
    const workingHour = await this.prisma.wks_WorkingHour.findUnique({
      where: { id },
      select: this.workingHourSelect,
    });

    if (!workingHour) {
      throw new NotFoundException('Working hour tidak ditemukan');
    }

    return this.toResponse(workingHour);
  }

  async findByWaitingListAndWeekday(
    waitingListId: string,
    weekday: number,
  ): Promise<WorkingHourResponseDto | null> {
    const workingHour = await this.prisma.wks_WorkingHour.findFirst({
      where: {
        waitingList_id: waitingListId,
        weekday,
      },
      select: this.workingHourSelect,
    });

    if (!workingHour) {
      return null;
    }

    return this.toResponse(workingHour);
  }

  async update(
    id: string,
    updateWorkingHourDto: UpdateWorkingHourDto,
  ): Promise<WorkingHourResponseDto> {
    const existing = await this.prisma.wks_WorkingHour.findUnique({
      where: { id },
      select: {
        id: true,
        waitingList_id: true,
        branch_id: true,
        company_id: true,
        isOpen: true,
        openTime: true,
        closeTime: true,
      },
    });

    if (!existing) {
      throw new NotFoundException('Working hour tidak ditemukan');
    }

    // Validasi branch jika diupdate
    if (updateWorkingHourDto.branchId !== undefined) {
      if (updateWorkingHourDto.branchId) {
        const branch = await this.prisma.sys_Branch.findUnique({
          where: { id: updateWorkingHourDto.branchId },
          select: { id: true, company_id: true },
        });

        if (!branch) {
          throw new NotFoundException('Branch tidak ditemukan');
        }

        // Set company_id dari branch jika tidak disediakan
        if (!updateWorkingHourDto.companyId) {
          updateWorkingHourDto.companyId = branch.company_id;
        }
      }
    }

    // Validasi company jika diupdate
    if (updateWorkingHourDto.companyId !== undefined) {
      if (updateWorkingHourDto.companyId) {
        const company = await this.prisma.sys_Company.findUnique({
          where: { id: updateWorkingHourDto.companyId },
          select: { id: true },
        });

        if (!company) {
          throw new NotFoundException('Company tidak ditemukan');
        }
      }
    }

    // Validasi waktu jika isOpen = true
    const isOpen = updateWorkingHourDto.isOpen ?? existing.isOpen;
    const openTime = updateWorkingHourDto.openTime ?? existing.openTime;
    const closeTime = updateWorkingHourDto.closeTime ?? existing.closeTime;

    if (isOpen !== false) {
      if (!openTime || !closeTime) {
        throw new BadRequestException(
          'openTime dan closeTime wajib diisi jika isOpen = true',
        );
      }

      if (this.compareTime(openTime, closeTime) >= 0) {
        throw new BadRequestException(
          'closeTime harus lebih besar dari openTime',
        );
      }
    }

    const updateData: Prisma.wks_WorkingHourUpdateInput = {};

    if (updateWorkingHourDto.branchId !== undefined) {
      if (updateWorkingHourDto.branchId) {
        updateData.branch = {
          connect: { id: updateWorkingHourDto.branchId },
        };
      } else {
        updateData.branch = {
          disconnect: true,
        };
      }
    }

    if (updateWorkingHourDto.companyId !== undefined) {
      updateData.company_id = updateWorkingHourDto.companyId ?? null;
    }

    if (updateWorkingHourDto.isOpen !== undefined) {
      updateData.isOpen = updateWorkingHourDto.isOpen;
    }

    if (updateWorkingHourDto.openTime !== undefined) {
      updateData.openTime = updateWorkingHourDto.openTime ?? null;
    }

    if (updateWorkingHourDto.closeTime !== undefined) {
      updateData.closeTime = updateWorkingHourDto.closeTime ?? null;
    }

    if (updateWorkingHourDto.bookingBufferMinutes !== undefined) {
      updateData.bookingBufferMinutes =
        updateWorkingHourDto.bookingBufferMinutes ?? 0;
    }

    if (updateWorkingHourDto.remarks !== undefined) {
      updateData.remarks = updateWorkingHourDto.remarks ?? null;
    }

    updateData.updatedBy = 'website';

    const updated = await this.prisma.wks_WorkingHour.update({
      where: { id },
      data: updateData,
      select: this.workingHourSelect,
    });

    return this.toResponse(updated);
  }

  async remove(id: string): Promise<WorkingHourResponseDto> {
    const existing = await this.prisma.wks_WorkingHour.findUnique({
      where: { id },
      select: this.workingHourSelect,
    });

    if (!existing) {
      throw new NotFoundException('Working hour tidak ditemukan');
    }

    // Hard delete (karena tidak ada isActive field)
    const deleted = await this.prisma.wks_WorkingHour.delete({
      where: { id },
      select: this.workingHourSelect,
    });

    return this.toResponse(deleted);
  }

  private async generateId(): Promise<string> {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const id = createWorkingHourId();

      const exists = await this.prisma.wks_WorkingHour.findUnique({
        where: { id },
        select: { id: true },
      });

      if (!exists) {
        return id;
      }
    }

    throw new InternalServerErrorException(
      'Gagal menghasilkan ID working hour unik',
    );
  }

  private toResponse(
    data: WorkingHourWithRelations,
  ): WorkingHourResponseDto {
    return {
      id: data.id,
      waitingListId: data.waitingList_id,
      branchId: data.branch_id,
      companyId: data.company_id,
      weekday: data.weekday,
      isOpen: data.isOpen,
      openTime: data.openTime,
      closeTime: data.closeTime,
      bookingBufferMinutes: data.bookingBufferMinutes,
      remarks: data.remarks,
      createdAt: data.createdAt.toISOString(),
      updatedAt: data.updatedAt.toISOString(),
      createdBy: data.createdBy,
      updatedBy: data.updatedBy,
    };
  }

  private getWeekdayName(weekday: number): string {
    const days = [
      'Minggu',
      'Senin',
      'Selasa',
      'Rabu',
      'Kamis',
      'Jumat',
      'Sabtu',
    ];
    return days[weekday] || `Hari ${weekday}`;
  }

  private compareTime(time1: string, time2: string): number {
    const [h1, m1] = time1.split(':').map(Number);
    const [h2, m2] = time2.split(':').map(Number);
    const minutes1 = h1 * 60 + m1;
    const minutes2 = h2 * 60 + m2;
    return minutes1 - minutes2;
  }
}

