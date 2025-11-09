/*
  Warnings:

  - You are about to drop the column `specialization` on the `wks_WorkshopCategory` table. All the data in the column will be lost.
  - You are about to drop the column `specialization` on the `wks_waitingList` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."idx_workshop_category_specialization";

-- AlterTable
ALTER TABLE "public"."wks_WorkshopCategory" DROP COLUMN "specialization";

-- AlterTable
ALTER TABLE "public"."wks_waitingList" DROP COLUMN "specialization",
ADD COLUMN     "category_id" CHAR(5);

-- DropEnum
DROP TYPE "public"."wks_specializationEnum";

-- CreateIndex
CREATE INDEX "idx_wks_waitinglist_category" ON "public"."wks_waitingList"("category_id");

-- AddForeignKey
ALTER TABLE "public"."wks_waitingList" ADD CONSTRAINT "wks_waitingList_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."wks_WorkshopCategory"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
