import { WorkshopTypeResponseDto } from './workshop-category.dto';

export class WaitingListResponseDto {
  id!: string;
  name!: string;
  address!: string;
  city!: string;
  district!: string;
  province!: string;
  subdistrict!: string;
  email!: string;
  phone!: string | null;
  mobile!: string | null;
  categoryId!: string | null;
  categoryCode?: string | null;
  categoryName?: string | null;
  workshopTypes!: WorkshopTypeResponseDto[];
  createdAt!: string;
  updatedAt!: string;
  createdBy!: string | null;
  updatedBy!: string | null;
}
