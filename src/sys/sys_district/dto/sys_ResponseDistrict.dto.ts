export class Sys_ResponseDistrictDto {
  id: string;
  name: string;
  company_id: string;
  city_id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string | null;
  updatedBy?: string | null;
  city?: {
    id: string;
    name: string;
    province?: {
      id: string;
      name: string;
    };
  };
  subdistricts?: Array<{
    id: string;
    name: string;
  }>;
}
