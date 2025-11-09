export class WorkshopTypeResponseDto {
  id!: string;
  name!: string;
  description!: string | null;
}

export class WorkshopCategoryResponseDto {
  id!: string;
  code!: string;
  name!: string;
  description!: string | null;
  types!: WorkshopTypeResponseDto[];
}
