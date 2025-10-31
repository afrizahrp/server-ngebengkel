import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from '../../prisma.service';

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
  constructor(private readonly prisma: PrismaService) {}

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
    await this.prisma.$transaction(async (tx: PrismaClient) => {
      const booking = await tx.wks_ServiceBooking.findUnique({
        where: {
          company_id_id: {
            company_id: companyId,
            id: bookingId,
          },
        },
      });
      if (!booking) throw new Error('Booking not found');
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
}
