export class Sys_ResponseCityDto {
  id: string;
  name: string;
  company_id: string;
  province_id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string | null;
  updatedBy?: string | null;
  province?: {
    id: string;
    name: string;
  };
  districts?: Array<{
    id: string;
    name: string;
  }>;
}
