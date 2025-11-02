/*
  Warnings:

  - You are about to drop the `sys_Branch` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."sys_Branch" DROP CONSTRAINT "sys_Branch_company_id_fkey";

-- DropTable
DROP TABLE "public"."sys_Branch";
