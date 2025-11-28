import { WorkshopTypeResponseDto } from './workshop-category.dto';

export class WaitingListResponseDto {
  id!: string;
  name!: string;
  slug!: string;
  description!: string;
  address!: string;
  city!: string;
  district!: string;
  province!: string;
  subdistrict!: string;
  email!: string;
  phone!: string | null;
  mobile!: string | null;
  categoryId!: string | null;
  typeId!:string|null;
  categoryCode?: string | null;
  categoryName?: string | null;
  workshopTypes!: WorkshopTypeResponseDto[];
  hasPromo?: boolean;
  promoPreview?: {
    id: string;
    title: string;
    promoType: string;
    checklist?: string[] | null;
  } | null;
  createdAt!: string;
  updatedAt!: string;
  createdBy!: string | null;
  updatedBy!: string | null;
  // Claim fields
  claimStatus?: string | null;
  claimedBy?: string | null;
  claimedAt?: string | null;
  isPublicData?: boolean;
  // Promo linked field
  isPromoLinked?: boolean;
}
