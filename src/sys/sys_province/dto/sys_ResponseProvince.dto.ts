export class Sys_ResponseProvinceDto {
  id: string;
  name: string;
  company_id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string | null;
  updatedBy?: string | null;
  cities?: Array<{
    id: string;
    name: string;
  }>;
}
