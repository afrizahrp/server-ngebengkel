export class PainPointServiceTypeDto {
  id!: string;
  name!: string;
  relevance!: number;
}

export class RelatedPainPointDto {
  id!: string;
  title!: string;
  slug!: string;
  category!: string;
}

export class PainPointResponseDto {
  id!: string;
  slug!: string;
  title!: string;
  description!: string | null;
  category!: string;
  keywords!: string[]; // Array dari JSON
  iconName!: string | null;
  imageUrl!: string | null;
  popularityScore!: number;
  viewCount!: number;
  searchCount!: number;
  isUrgent!: boolean;
  priority!: number;
  isActive!: boolean;
  isPopular!: boolean;
  createdAt!: string;
  updatedAt!: string;
  articles?: Array<{ id: string; status: string }>;
}

export class PainPointWorkshopTypeDto {
  id!: string;
  name!: string;
  relevance!: number;
}

export class PainPointDetailResponseDto extends PainPointResponseDto {
  serviceTypes?: PainPointServiceTypeDto[];
  workshopTypes?: PainPointWorkshopTypeDto[]; // Workshop types yang bisa handle (untuk waitingList)
  branchCount?: number; // Berapa bengkel yang bisa handle
  relatedPainPoints?: RelatedPainPointDto[]; // Pain points dengan category yang sama
}

export class PainPointSearchResultDto {
  painPoint!: PainPointResponseDto;
  confidence!: number; // 0-1
  matchedKeywords!: string[];
}

export class PainPointMatchResultDto extends PainPointSearchResultDto {
  serviceTypes?: PainPointServiceTypeDto[];
}



