export interface ProductFilter {
  company_id?: string | string[];
  category?: string | string[];
  category_id?: string | string[];
  catalog_id?: string;
  iShowedStatus?: 'SHOW' | 'HIDDEN' | ('SHOW' | 'HIDDEN')[];
  activeStatus?: 'ACTIVE' | 'INACTIVE';
  isMaterial?: boolean;
}
