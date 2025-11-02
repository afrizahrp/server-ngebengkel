/*
  Warnings:

  - You are about to drop the column `address1` on the `sys_Company` table. All the data in the column will be lost.
  - You are about to drop the column `address2` on the `sys_Company` table. All the data in the column will be lost.
  - You are about to drop the column `address3` on the `sys_Company` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `sys_Company` table. All the data in the column will be lost.
  - You are about to drop the column `district` on the `sys_Company` table. All the data in the column will be lost.
  - You are about to drop the column `mobile1` on the `sys_Company` table. All the data in the column will be lost.
  - You are about to drop the column `mobile2` on the `sys_Company` table. All the data in the column will be lost.
  - You are about to drop the column `mobile3` on the `sys_Company` table. All the data in the column will be lost.
  - You are about to drop the column `phone1` on the `sys_Company` table. All the data in the column will be lost.
  - You are about to drop the column `phone2` on the `sys_Company` table. All the data in the column will be lost.
  - You are about to drop the column `phone3` on the `sys_Company` table. All the data in the column will be lost.
  - You are about to drop the column `postalCode` on the `sys_Company` table. All the data in the column will be lost.
  - You are about to drop the column `province` on the `sys_Company` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."sys_Branch" ADD COLUMN     "address1" VARCHAR(250),
ADD COLUMN     "address2" VARCHAR(250),
ADD COLUMN     "address3" VARCHAR(250),
ADD COLUMN     "city" VARCHAR(50),
ADD COLUMN     "district" VARCHAR(50),
ADD COLUMN     "mobile1" VARCHAR(20),
ADD COLUMN     "mobile2" VARCHAR(20),
ADD COLUMN     "mobile3" VARCHAR(20),
ADD COLUMN     "phone1" VARCHAR(20),
ADD COLUMN     "phone2" VARCHAR(20),
ADD COLUMN     "phone3" VARCHAR(20),
ADD COLUMN     "postalCode" CHAR(6),
ADD COLUMN     "province" VARCHAR(50);

-- AlterTable
ALTER TABLE "public"."sys_Company" DROP COLUMN "address1",
DROP COLUMN "address2",
DROP COLUMN "address3",
DROP COLUMN "city",
DROP COLUMN "district",
DROP COLUMN "mobile1",
DROP COLUMN "mobile2",
DROP COLUMN "mobile3",
DROP COLUMN "phone1",
DROP COLUMN "phone2",
DROP COLUMN "phone3",
DROP COLUMN "postalCode",
DROP COLUMN "province";
