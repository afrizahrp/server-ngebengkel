import { IsOptional, IsString } from 'class-validator';

export class Sys_UpdateCityDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  company_id?: string;

  @IsString()
  @IsOptional()
  province_id?: string;

  @IsString()
  @IsOptional()
  updatedBy?: string;
}
