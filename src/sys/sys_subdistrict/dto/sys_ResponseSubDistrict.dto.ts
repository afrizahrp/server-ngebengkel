export class Sys_ResponseSubDistrictDto {
  id: string;
  name: string;
  company_id: string;
  district_id: string;
  city_id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string | null;
  updatedBy?: string | null;
  district?: {
    id: string;
    name: string;
    city?: {
      id: string;
      name: string;
    };
  };
  city?: {
    id: string;
    name: string;
    province?: {
      id: string;
      name: string;
    };
  };
}
