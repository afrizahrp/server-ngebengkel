/**
 * Public-safe DTO untuk company data
 * Hanya mengexpose data yang diperlukan untuk public endpoints
 * Tidak mengexpose sensitive information seperti phone, email, address details
 */
export class Sys_PublicCompanyDto {
  id!: string;
  name?: string;
  officialWebsite?: string;
  companyLogo?: string;
  // Exclude: phone, email, address, createdBy, updatedBy, timestamps
}









