import { IsOptional, IsString } from 'class-validator';

export class Sys_UpdateProvinceDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  company_id?: string;

  @IsString()
  @IsOptional()
  updatedBy?: string;
}
