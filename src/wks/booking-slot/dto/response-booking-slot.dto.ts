import { SlotStatusEnum } from '@prisma/client';

export class BookingSlotResponseDto {
  id: string;
  company_id: string;
  branch_id: string;
  bay_id: string | null;
  date: Date;
  startTime: Date;
  endTime: Date;
  capacity: number;
  bookedCount: number;
  slotStatus: SlotStatusEnum;
  remarks: string | null;
  createdAt: Date;
  createdBy: string | null;
  updatedBy: string | null;
  updatedAt: Date | null;
  isDeleted: boolean;
  deletedAt: Date | null;
  deletedBy: string | null;
  bay?: {
    id: string;
    name: string;
    bayType: string;
  } | null;
}
