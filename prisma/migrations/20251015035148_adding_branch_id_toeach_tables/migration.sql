-- DropForeignKey
ALTER TABLE "public"."sys_Session" DROP CONSTRAINT "sys_Session_user_id_fkey";

-- AlterTable
ALTER TABLE "public"."sys_Session" ALTER COLUMN "user_id" SET DATA TYPE INTEGER;

-- CreateTable
CREATE TABLE "public"."sys_Branch" (
    "id" CHAR(10) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "remarks" VARCHAR(255),
    "company_id" CHAR(5) NOT NULL,

    CONSTRAINT "sys_Branch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_sys_Branch_company_id" ON "public"."sys_Branch"("company_id");

-- AddForeignKey
ALTER TABLE "public"."sys_Branch" ADD CONSTRAINT "sys_Branch_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."sys_Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sys_Session" ADD CONSTRAINT "sys_Session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."sys_User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
