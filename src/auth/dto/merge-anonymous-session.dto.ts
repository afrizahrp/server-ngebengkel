import { IsNotEmpty, IsUUID } from 'class-validator';

/**
 * DTO untuk merge anonymous session ke user account
 */
export class MergeAnonymousSessionDto {
  @IsUUID(4, { message: 'anonymousId must be a valid UUID v4' })
  @IsNotEmpty({ message: 'anonymousId is required' })
  anonymousId!: string;
}

