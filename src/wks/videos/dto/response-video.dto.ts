export class VideoResponseDto {
  id!: string;
  waitingListId!: string;
  branchId!: string | null;
  videoURL!: string;
  thumbnailURL!: string | null;
  title!: string | null;
  description!: string | null;
  duration!: number | null;
  isPrimary!: boolean;
  seq!: number | null;
  isActive!: boolean;
  createdAt!: string;
  updatedAt!: string;
  createdBy!: string | null;
  updatedBy!: string | null;
}


