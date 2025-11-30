export class WorkingHourResponseDto {
  id!: string;
  waitingListId!: string;
  branchId!: string | null;
  companyId!: string | null;
  weekday!: number; // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  isOpen!: boolean;
  openTime!: string | null;
  closeTime!: string | null;
  bookingBufferMinutes!: number | null;
  remarks!: string | null;
  createdAt!: string;
  updatedAt!: string;
  createdBy!: string | null;
  updatedBy!: string | null;
}









