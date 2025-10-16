-- AlterTable
ALTER TABLE "public"."sys_UserCompanyRole" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "sys_UserCompanyRole_id_seq";

-- AlterTable
ALTER TABLE "public"."sys_UserRole" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "sys_UserRole_id_seq";
