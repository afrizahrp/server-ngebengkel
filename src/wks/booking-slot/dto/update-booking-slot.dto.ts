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

export class UpdateBookingSlotDto {
  @IsString()
  @IsOptional()
  bay_id?: string;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsDateString()
  @IsOptional()
  startTime?: string;

  @IsDateString()
  @IsOptional()
  endTime?: string;

  @IsInt()
  @IsOptional()
  capacity?: number;

  @IsInt()
  @IsOptional()
  bookedCount?: number;

  @IsEnum(SlotStatusEnum)
  @IsOptional()
  slotStatus?: SlotStatusEnum;

  @IsString()
  @IsOptional()
  remarks?: string;
}
