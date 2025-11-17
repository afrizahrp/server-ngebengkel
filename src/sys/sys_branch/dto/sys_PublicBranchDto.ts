/**
 * Public-safe DTO untuk branch data
 * Hanya mengexpose data yang diperlukan untuk public endpoints
 */
export class Sys_PublicBranchDto {
  id!: string;
  name!: string;
  company_id!: string;
  isMain?: boolean;
  // Exclude: remarks, iStatus, company details
}













