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
  bay?: {
    id: string;
    name: string;
    bayType: string;
  } | null;
}
