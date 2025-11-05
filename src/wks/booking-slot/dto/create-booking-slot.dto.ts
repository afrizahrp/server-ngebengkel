import {
  IsString,
  IsOptional,
  IsDate,
  IsEnum,
  IsInt,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SlotStatusEnum } from '@prisma/client';

export class CreateBookingSlotDto {
  @IsString()
  company_id: string;

  @IsString()
  branch_id: string;

  @IsString()
  @IsOptional()
  bay_id?: string;

  @IsDateString()
  date: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsInt()
  @IsOptional()
  capacity?: number = 1;

  @IsInt()
  @IsOptional()
  bookedCount?: number = 0;

  @IsEnum(SlotStatusEnum)
  @IsOptional()
  slotStatus?: SlotStatusEnum = SlotStatusEnum.OPEN;

  @IsString()
  @IsOptional()
  remarks?: string;
}
