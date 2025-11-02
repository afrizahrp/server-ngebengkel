-- CreateTable
CREATE TABLE "public"."sys_Branch" (
    "company_id" CHAR(5) NOT NULL,
    "id" CHAR(10) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "isMain" BOOLEAN DEFAULT false,
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "remarks" VARCHAR(255),
    "province" VARCHAR(50),
    "district" VARCHAR(50),
    "city" VARCHAR(50),
    "address1" VARCHAR(250),
    "address2" VARCHAR(250),
    "address3" VARCHAR(250),
    "postalCode" CHAR(6),
    "phone1" VARCHAR(20),
    "phone2" VARCHAR(20),
    "phone3" VARCHAR(20),
    "mobile1" VARCHAR(20),
    "mobile2" VARCHAR(20),
    "mobile3" VARCHAR(20),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sys_Branch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_sys_Branch_company_id" ON "public"."sys_Branch"("company_id");

-- AddForeignKey
ALTER TABLE "public"."sys_Branch" ADD CONSTRAINT "sys_Branch_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."sys_Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
