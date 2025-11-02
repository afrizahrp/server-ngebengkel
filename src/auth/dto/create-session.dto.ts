import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateSessionDto {
  @IsString()
  userId: number;

  @IsString()
  refreshToken: string;

  @IsOptional()
  @IsString()
  deviceName?: string;

  @IsOptional()
  @IsString()
  deviceType?: string;

  @IsOptional()
  @IsString()
  browser?: string;

  @IsOptional()
  @IsString()
  os?: string;

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;

  @IsDateString()
  expiresAt: Date;
}
