import {
  FuelLevelEnum,
  PaymentStatusEnum,
  PriorityEnum,
  ServiceOrderStatusEnum,
} from '@prisma/client';

export class ServiceOrderDetailResponseDto {
  id: string;
  serviceOrder_id: string;
  lineNumber: number;
  detailType: string;
  serviceType_id?: string;
  serviceName?: string;
  serviceDescription?: string;
  product_id?: string;
  productVariant_id?: string;
  partName?: string;
  partNumber?: string;
  mechanic_id?: string;
  quantity: number;
  unitPrice: number;
  discountPercent?: number;
  discountAmount?: number;
  taxPercent?: number;
  taxAmount?: number;
  subtotal: number;
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  detailStatus?: string;
  iStatus: string;
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ServiceOrderResponseDto {
  id: string;
  orderNumber: string;
  orderDate: Date;
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
  odometerIn?: number;
  fuelLevel?: FuelLevelEnum;
  vehicleConditionNotes?: string;
  mechanic_id?: string;
  mechanic?: {
    id: string;
    name?: string;
    specialization?: string;
  };
  serviceBay_id?: string;
  serviceBay?: {
    id: string;
    name: string;
    bayType?: string;
  };
  scheduledStartDate?: Date;
  scheduledEndDate?: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
  estimatedDuration?: number;
  actualDuration?: number;
  customerComplaint?: string;
  serviceRequest?: string;
  mechanicDiagnosis?: string;
  mechanicRecommendation?: string;
  serviceCost?: number;
  partsCost?: number;
  discountAmount?: number;
  taxAmount?: number;
  totalAmount?: number;
  orderStatus: ServiceOrderStatusEnum;
  paymentStatus?: PaymentStatusEnum;
  priority?: PriorityEnum;
  qcCheckedBy?: string;
  qcCheckedDate?: Date;
  qcNotes?: string;
  qcApproved?: boolean;
  customerRating?: number;
  customerFeedback?: string;
  customerSignature?: string;
  iStatus: string;
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
  orderDetails?: ServiceOrderDetailResponseDto[];
}




