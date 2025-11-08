import { IsOptional, IsString } from 'class-validator';

export class Sys_UpdateSubDistrictDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  company_id?: string;

  @IsString()
  @IsOptional()
  district_id?: string;

  @IsString()
  @IsOptional()
  city_id?: string;

  @IsString()
  @IsOptional()
  updatedBy?: string;
}
