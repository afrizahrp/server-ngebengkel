import { IsOptional, IsString } from 'class-validator';

export class Sys_CreateProvinceDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  company_id: string;

  @IsString()
  @IsOptional()
  createdBy?: string;

  @IsString()
  @IsOptional()
  updatedBy?: string;
}
