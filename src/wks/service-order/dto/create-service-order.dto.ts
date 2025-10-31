import {
  IsString,
  IsOptional,
  IsDate,
  IsArray,
  ValidateNested,
  IsEnum,
  IsInt,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  FuelLevelEnum,
  PriorityEnum,
  ServiceOrderStatusEnum,
} from '@prisma/client';

export class ServiceOrderDetailDto {
  @IsString()
  @IsOptional()
  serviceType_id?: string;

  @IsString()
  @IsOptional()
  serviceName?: string;

  @IsString()
  @IsOptional()
  serviceDescription?: string;

  @IsString()
  @IsOptional()
  product_id?: string;

  @IsString()
  @IsOptional()
  productVariant_id?: string;

  @IsString()
  @IsOptional()
  partName?: string;

  @IsString()
  @IsOptional()
  partNumber?: string;

  @IsString()
  @IsOptional()
  mechanic_id?: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  unitPrice: number;

  @IsNumber()
  @IsOptional()
  discountPercent?: number;

  @IsNumber()
  @IsOptional()
  discountAmount?: number;

  @IsNumber()
  @IsOptional()
  taxPercent?: number;

  @IsNumber()
  @IsOptional()
  taxAmount?: number;

  @IsNumber()
  subtotal: number;

  @IsString()
  @IsOptional()
  remarks?: string;
}

export class CreateServiceOrderDto {
  @IsString()
  customer_id: string;

  @IsString()
  customerVehicle_id: string;

  @IsString()
  @IsOptional()
  mechanic_id?: string;

  @IsString()
  @IsOptional()
  serviceBay_id?: string;

  @IsInt()
  @IsOptional()
  odometerIn?: number;

  @IsEnum(FuelLevelEnum)
  @IsOptional()
  fuelLevel?: FuelLevelEnum;

  @IsString()
  @IsOptional()
  vehicleConditionNotes?: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  scheduledStartDate?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  scheduledEndDate?: Date;

  @IsInt()
  @IsOptional()
  estimatedDuration?: number;

  @IsString()
  @IsOptional()
  customerComplaint?: string;

  @IsString()
  @IsOptional()
  serviceRequest?: string;

  @IsString()
  @IsOptional()
  mechanicDiagnosis?: string;

  @IsString()
  @IsOptional()
  mechanicRecommendation?: string;

  @IsNumber()
  @IsOptional()
  serviceCost?: number;

  @IsNumber()
  @IsOptional()
  partsCost?: number;

  @IsNumber()
  @IsOptional()
  discountAmount?: number;

  @IsNumber()
  @IsOptional()
  taxAmount?: number;

  @IsNumber()
  @IsOptional()
  totalAmount?: number;

  @IsEnum(ServiceOrderStatusEnum)
  @IsOptional()
  orderStatus?: ServiceOrderStatusEnum;

  @IsEnum(PriorityEnum)
  @IsOptional()
  priority?: PriorityEnum;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceOrderDetailDto)
  orderDetails: ServiceOrderDetailDto[];

  @IsString()
  @IsOptional()
  remarks?: string;

  @IsString()
  company_id: string;

  @IsString()
  branch_id: string;

  @IsString()
  @IsOptional()
  createdBy?: string;

  @IsDate()
  @IsOptional()
  createdAt?: Date;

  @IsString()
  @IsOptional()
  updatedBy?: string;

  @IsDate()
  @IsOptional()
  updatedAt?: Date;
}
