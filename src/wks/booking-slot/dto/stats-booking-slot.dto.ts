import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';

export class BookingSlotStatsResponseDto {
  total: number;
  open: number;
  booked: number;
  cancelled: number;
  closed: number;
  totalCapacity: number;
  totalBooked: number;
  averageUtilization: number; // 0-100 rounded
}

export class BookingSlotStatsQueryDto {
  @IsString()
  @IsOptional()
  company_id?: string;

  @IsArray()
  @IsOptional()
  branch_id?: string[];

  @IsArray()
  @IsOptional()
  bay_id?: string[];

  @IsArray()
  @IsOptional()
  slotStatus?: string[];

  @IsDateString()
  @IsOptional()
  start_date?: string;

  @IsDateString()
  @IsOptional()
  end_date?: string;
}


