import { IsOptional, IsInt, Min, Max, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class SeedPainPointDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  count?: number; // Jumlah pain points yang akan di-generate (default: 10)

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  dryRun?: boolean; // Jika true, hanya return hasil tanpa save ke database (default: false)

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  overwrite?: boolean; // Jika true, overwrite pain points yang sudah ada dengan slug yang sama (default: false)
}




