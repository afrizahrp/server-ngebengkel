import {
  IsString,
  IsOptional,
  IsInt,
  IsDate,
  IsArray,
  IsBoolean,
} from 'class-validator';

export class Sys_BranchBasicDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  iStatus?: string;

  @IsBoolean()
  @IsOptional()
  isMain?: boolean;
}

export class Sys_ResponseCompanyWithBranchesDto {
  @IsInt()
  seq_no: number;

  @IsString()
  id: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  slug?: string;


  @IsString()
  @IsOptional()
  province_id?: string;

  @IsString()
  @IsOptional()
  city_id?: string;

  @IsString()
  @IsOptional()
  district_id?: string;

  @IsString()
  @IsOptional()
  subdistrict_id?: string;

  @IsString()
  @IsOptional()
  address1?: string;

  @IsString()
  @IsOptional()
  address2?: string;

  @IsString()
  @IsOptional()
  address3?: string;

  @IsString()
  @IsOptional()
  postalCode?: string;

  @IsString()
  @IsOptional()
  phone1?: string;

  @IsString()
  @IsOptional()
  phone2?: string;

  @IsString()
  @IsOptional()
  phone3?: string;

  @IsString()
  @IsOptional()
  mobile1?: string;

  @IsString()
  @IsOptional()
  mobile2?: string;

  @IsString()
  @IsOptional()
  mobile3?: string;

  @IsString()
  @IsOptional()
  email1?: string;

  @IsString()
  @IsOptional()
  email2?: string;

  @IsString()
  @IsOptional()
  email3?: string;

  @IsString()
  @IsOptional()
  officialWebsite?: string;

  @IsString()
  @IsOptional()
  companyLogo?: string;

  @IsString()
  @IsOptional()
  createdBy?: string;

  @IsDate()
  createdAt: Date;

  @IsString()
  @IsOptional()
  updatedBy?: string;

  @IsDate()
  updatedAt: Date;

  @IsArray()
  branches: Sys_BranchBasicDto[];
}
