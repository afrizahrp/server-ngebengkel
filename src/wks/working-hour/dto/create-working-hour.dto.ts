import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  MaxLength,
  Min,
  Max,
  Matches,
} from 'class-validator';

export class CreateWorkingHourDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(21)
  @Transform(({ value }) => value?.trim())
  waitingListId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  @Transform(({ value }) => value?.trim())
  branchId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  @Transform(({ value }) => value?.trim())
  companyId?: string;

  @IsInt()
  @Min(0)
  @Max(6)
  weekday!: number; // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat

  @IsOptional()
  @IsBoolean()
  isOpen?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(5)
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'openTime harus dalam format HH:mm (contoh: 08:00)',
  })
  @Transform(({ value }) => value?.trim())
  openTime?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5)
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'closeTime harus dalam format HH:mm (contoh: 17:00)',
  })
  @Transform(({ value }) => value?.trim())
  closeTime?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  bookingBufferMinutes?: number;

  @IsOptional()
  @IsString()
  @MaxLength(250)
  @Transform(({ value }) => value?.trim())
  remarks?: string;
}

