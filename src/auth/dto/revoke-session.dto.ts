import { IsString, IsOptional } from 'class-validator';

export class RevokeSessionDto {
  @IsString()
  sessionId: string;

  @IsOptional()
  @IsString()
  reason?: string;
}

