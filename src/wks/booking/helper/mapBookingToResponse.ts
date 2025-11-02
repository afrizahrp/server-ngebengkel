import { BookingResponseDto } from '../dto/response-booking.dto';
import { wks_ServiceBooking } from '@prisma/client';

export function mapBookingToResponse(
  booking: wks_ServiceBooking & {
    customer?: {
      id: string;
      name: string;
      mobile1: string;
      email?: string | null;
    } | null;
    customerVehicle?: {
      id: string;
      licensePlate: string;
      brand?: { name: string } | null;
      model?: { name: string } | null;
      vehicleYear?: number | null;
    } | null;
    bay?: {
      id: string;
      name: string;
      bayType?: string | null;
    } | null;
    mechanic?: {
      id: string;
      employee?: { name: string | null } | null;
      specialization?: string | null;
    } | null;
    serviceType?: {
      id: string;
      name: string;
      category?: string | null;
    } | null;
  },
): BookingResponseDto {
  return {
    id: booking.id,
    bookingNumber: booking.bookingNumber,
    bookingDate: booking.bookingDate,
    company_id: booking.company_id,
    branch_id: booking.branch_id,
    customer_id: booking.customer_id,
    customer: booking.customer
      ? {
          id: booking.customer.id,
          name: booking.customer.name,
          mobile1: booking.customer.mobile1,
          email: booking.customer.email || undefined,
        }
      : undefined,
    customerVehicle_id: booking.customerVehicle_id,
    vehicle: booking.customerVehicle
      ? {
          id: booking.customerVehicle.id,
          licensePlate: booking.customerVehicle.licensePlate,
          brand: booking.customerVehicle.brand?.name,
          model: booking.customerVehicle.model?.name,
          year: booking.customerVehicle.vehicleYear || undefined,
        }
      : undefined,
    preferredDate: booking.preferredDate || undefined,
    preferredStartTime: booking.preferredStartTime || undefined,
    preferredEndTime: booking.preferredEndTime || undefined,
    scheduledStart: booking.scheduledStart || undefined,
    scheduledEnd: booking.scheduledEnd || undefined,
    bay_id: booking.bay_id || undefined,
    bay: booking.bay
      ? {
          id: booking.bay.id,
          name: booking.bay.name,
          bayType: booking.bay.bayType || undefined,
        }
      : undefined,
    mechanic_id: booking.mechanic_id || undefined,
    mechanic: booking.mechanic
      ? {
          id: booking.mechanic.id,
          name: booking.mechanic.employee?.name || undefined,
          specialization: booking.mechanic.specialization || undefined,
        }
      : undefined,
    serviceType_id: booking.serviceType_id || undefined,
    serviceType: booking.serviceType
      ? {
          id: booking.serviceType.id,
          name: booking.serviceType.name,
          category: booking.serviceType.category || undefined,
        }
      : undefined,
    complaintNotes: booking.complaintNotes || undefined,
    additionalRequest: booking.additionalRequest || undefined,
    status: booking.status,
    source: booking.source,
    reminderSent: booking.reminderSent || undefined,
    checkInAt: booking.checkInAt || undefined,
    cancelledAt: booking.cancelledAt || undefined,
    cancelReason: booking.cancelReason || undefined,
    transactionStatus: booking.transactionStatus,
    remarks: booking.remarks || undefined,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
  };
}
