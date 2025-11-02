import { BookingStatusEnum, BookingSourceEnum } from '@prisma/client';

export class BookingResponseDto {
  id: string;
  bookingNumber: string;
  bookingDate: Date;
  company_id: string;
  branch_id: string;
  customer_id: string;
  customer?: {
    id: string;
    name: string;
    mobile1: string;
    email?: string;
  };
  customerVehicle_id: string;
  vehicle?: {
    id: string;
    licensePlate: string;
    brand?: string;
    model?: string;
    year?: number;
  };
  preferredDate?: Date;
  preferredStartTime?: string;
  preferredEndTime?: string;
  scheduledStart?: Date;
  scheduledEnd?: Date;
  bay_id?: string;
  bay?: {
    id: string;
    name: string;
    bayType?: string;
  };
  mechanic_id?: string;
  mechanic?: {
    id: string;
    name?: string;
    specialization?: string;
  };
  serviceType_id?: string;
  serviceType?: {
    id: string;
    name: string;
    category?: string;
  };
  complaintNotes?: string;
  additionalRequest?: string;
  status: BookingStatusEnum;
  source: BookingSourceEnum;
  reminderSent?: boolean;
  checkInAt?: Date;
  cancelledAt?: Date;
  cancelReason?: string;
  transactionStatus: string;
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}
