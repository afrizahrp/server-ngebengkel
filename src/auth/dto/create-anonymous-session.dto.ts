import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * DTO untuk create/get anonymous session
 */
export class CreateAnonymousSessionDto {
  @IsUUID(4, { message: 'anonymousId must be a valid UUID v4' })
  @IsNotEmpty({ message: 'anonymousId is required' })
  anonymousId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(20, { message: 'Source must not exceed 20 characters' })
  @Transform(({ value }) => value?.trim().toLowerCase())
  source?: string;
}

