-- CreateEnum
CREATE TYPE "public"."BookingStatusEnum" AS ENUM ('0', '1', '2', '3', '4', '5', '9');

-- CreateEnum
CREATE TYPE "public"."BookingSourceEnum" AS ENUM ('WEB', 'APP', 'PHONE', 'WALKIN');

-- CreateEnum
CREATE TYPE "public"."SlotStatusEnum" AS ENUM ('OPEN', 'BLOCKED', 'FULL');

-- CreateTable
CREATE TABLE "public"."wks_BranchWorkingHour" (
    "company_id" CHAR(5) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "weekday" SMALLINT NOT NULL,
    "isOpen" BOOLEAN NOT NULL DEFAULT true,
    "openTime" CHAR(5),
    "closeTime" CHAR(5),
    "bookingBufferMinutes" INTEGER DEFAULT 0,
    "remarks" VARCHAR(250),

    CONSTRAINT "pk_wks_BranchWorkingHour" PRIMARY KEY ("company_id","branch_id","weekday")
);

-- CreateTable
CREATE TABLE "public"."wks_BranchHoliday" (
    "id" CHAR(20) NOT NULL,
    "company_id" CHAR(5) NOT NULL,
    "branch_id" CHAR(10),
    "date" DATE NOT NULL,
    "name" VARCHAR(100),
    "isClosed" BOOLEAN NOT NULL DEFAULT true,
    "remarks" VARCHAR(250),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pk_wks_BranchHoliday" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."wks_MechanicAvailability" (
    "id" CHAR(20) NOT NULL,
    "company_id" CHAR(5) NOT NULL,
    "mechanic_id" CHAR(10) NOT NULL,
    "date" DATE NOT NULL,
    "availableStart" CHAR(5),
    "availableEnd" CHAR(5),
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "reason" VARCHAR(100),
    "remarks" VARCHAR(250),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pk_wks_MechanicAvailability" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."wks_BayBlock" (
    "id" CHAR(20) NOT NULL,
    "company_id" CHAR(5) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "bay_id" CHAR(10) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "reason" VARCHAR(100),
    "remarks" VARCHAR(250),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pk_wks_BayBlock" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."wks_BookingSlot" (
    "id" CHAR(20) NOT NULL,
    "company_id" CHAR(5) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "bay_id" CHAR(10),
    "date" DATE NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 1,
    "bookedCount" INTEGER NOT NULL DEFAULT 0,
    "slotStatus" "public"."SlotStatusEnum" NOT NULL DEFAULT 'OPEN',
    "remarks" VARCHAR(250),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pk_wks_BookingSlot" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."wks_ServiceBooking" (
    "id" CHAR(20) NOT NULL,
    "bookingNumber" VARCHAR(30) NOT NULL,
    "bookingDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "company_id" CHAR(5) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "customer_id" CHAR(20) NOT NULL,
    "customerVehicle_id" CHAR(20) NOT NULL,
    "vehicle_customer_id" CHAR(20) NOT NULL,
    "preferredDate" DATE,
    "preferredStartTime" CHAR(5),
    "preferredEndTime" CHAR(5),
    "scheduledStart" TIMESTAMP(3),
    "scheduledEnd" TIMESTAMP(3),
    "bay_id" CHAR(10),
    "mechanic_id" CHAR(10),
    "serviceType_id" CHAR(10),
    "complaintNotes" TEXT,
    "additionalRequest" TEXT,
    "status" "public"."BookingStatusEnum" NOT NULL DEFAULT '0',
    "source" "public"."BookingSourceEnum" NOT NULL DEFAULT 'WEB',
    "reminderSent" BOOLEAN DEFAULT false,
    "checkInAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "cancelReason" VARCHAR(250),
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "remarks" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_wks_ServiceBooking" PRIMARY KEY ("company_id","id")
);

-- CreateIndex
CREATE INDEX "idx_branch_workinghour_branch" ON "public"."wks_BranchWorkingHour"("company_id", "branch_id");

-- CreateIndex
CREATE INDEX "idx_branch_holiday_date" ON "public"."wks_BranchHoliday"("company_id", "branch_id", "date");

-- CreateIndex
CREATE INDEX "idx_mechanic_availability_date" ON "public"."wks_MechanicAvailability"("company_id", "mechanic_id", "date");

-- CreateIndex
CREATE INDEX "idx_bayblock_range" ON "public"."wks_BayBlock"("company_id", "branch_id", "bay_id", "startTime", "endTime");

-- CreateIndex
CREATE INDEX "idx_bookingslot_date" ON "public"."wks_BookingSlot"("company_id", "branch_id", "date");

-- CreateIndex
CREATE INDEX "idx_bookingslot_bay_range" ON "public"."wks_BookingSlot"("company_id", "bay_id", "startTime", "endTime");

-- CreateIndex
CREATE INDEX "idx_booking_date" ON "public"."wks_ServiceBooking"("company_id", "branch_id", "bookingDate");

-- CreateIndex
CREATE INDEX "idx_booking_status" ON "public"."wks_ServiceBooking"("company_id", "status");

-- CreateIndex
CREATE INDEX "idx_booking_scheduled_start" ON "public"."wks_ServiceBooking"("company_id", "scheduledStart");

-- CreateIndex
CREATE UNIQUE INDEX "unique_booking_number" ON "public"."wks_ServiceBooking"("company_id", "bookingNumber");

-- AddForeignKey
ALTER TABLE "public"."wks_MechanicAvailability" ADD CONSTRAINT "wks_MechanicAvailability_company_id_mechanic_id_fkey" FOREIGN KEY ("company_id", "mechanic_id") REFERENCES "public"."cmf_Mechanic"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."wks_BayBlock" ADD CONSTRAINT "wks_BayBlock_company_id_bay_id_fkey" FOREIGN KEY ("company_id", "bay_id") REFERENCES "public"."wks_ServiceBay"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."wks_BookingSlot" ADD CONSTRAINT "wks_BookingSlot_company_id_bay_id_fkey" FOREIGN KEY ("company_id", "bay_id") REFERENCES "public"."wks_ServiceBay"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."wks_ServiceBooking" ADD CONSTRAINT "wks_ServiceBooking_company_id_customer_id_fkey" FOREIGN KEY ("company_id", "customer_id") REFERENCES "public"."cmf_Customer"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."wks_ServiceBooking" ADD CONSTRAINT "wks_ServiceBooking_company_id_customer_id_customerVehicle__fkey" FOREIGN KEY ("company_id", "customer_id", "customerVehicle_id") REFERENCES "public"."cmf_CustomerVehicle"("company_id", "customer_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."wks_ServiceBooking" ADD CONSTRAINT "wks_ServiceBooking_company_id_mechanic_id_fkey" FOREIGN KEY ("company_id", "mechanic_id") REFERENCES "public"."cmf_Mechanic"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."wks_ServiceBooking" ADD CONSTRAINT "wks_ServiceBooking_company_id_bay_id_fkey" FOREIGN KEY ("company_id", "bay_id") REFERENCES "public"."wks_ServiceBay"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."wks_ServiceBooking" ADD CONSTRAINT "wks_ServiceBooking_company_id_serviceType_id_fkey" FOREIGN KEY ("company_id", "serviceType_id") REFERENCES "public"."wks_ServiceType"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;
