/*
  Warnings:

  - The primary key for the `cmf_PaymentMethod` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `branch_id` on the `cmf_PaymentMethod` table. All the data in the column will be lost.
  - You are about to drop the column `company_id` on the `cmf_PaymentMethod` table. All the data in the column will be lost.
  - The primary key for the `cmf_TransactionClass` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `branch_id` on the `cmf_TransactionClass` table. All the data in the column will be lost.
  - You are about to drop the column `company_id` on the `cmf_TransactionClass` table. All the data in the column will be lost.
  - The primary key for the `cmf_TransactionType` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `branch_id` on the `cmf_TransactionType` table. All the data in the column will be lost.
  - You are about to drop the column `company_id` on the `cmf_TransactionType` table. All the data in the column will be lost.
  - You are about to drop the column `branch_id` on the `sys_Menu` table. All the data in the column will be lost.
  - You are about to drop the column `company_id` on the `sys_Menu` table. All the data in the column will be lost.
  - You are about to drop the column `branch_id` on the `sys_Menu_Permission` table. All the data in the column will be lost.
  - You are about to drop the column `company_id` on the `sys_Menu_Permission` table. All the data in the column will be lost.
  - The primary key for the `wks_VehicleBrand` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `branch_id` on the `wks_VehicleBrand` table. All the data in the column will be lost.
  - You are about to drop the column `company_id` on the `wks_VehicleBrand` table. All the data in the column will be lost.
  - The primary key for the `wks_VehicleModel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `branch_id` on the `wks_VehicleModel` table. All the data in the column will be lost.
  - You are about to drop the column `company_id` on the `wks_VehicleModel` table. All the data in the column will be lost.
  - The primary key for the `wks_VehicleType` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `branch_id` on the `wks_VehicleType` table. All the data in the column will be lost.
  - You are about to drop the column `company_id` on the `wks_VehicleType` table. All the data in the column will be lost.
  - Added the required column `branch_id` to the `imc_ProductImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `branch_id` to the `saas_CompanyAddon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `branch_id` to the `saas_CompanySubscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `branch_id` to the `saas_SubscriptionBilling` table without a default value. This is not possible if the table is not empty.
  - Added the required column `branch_id` to the `saas_UsageTracking` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."apm_Payment" DROP CONSTRAINT "apm_Payment_company_id_paymentMethod_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."apm_PaymentDetail" DROP CONSTRAINT "apm_PaymentDetail_company_id_paymentMethod_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."arm_Payment" DROP CONSTRAINT "arm_Payment_company_id_paymentMethod_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."arm_PaymentDetail" DROP CONSTRAINT "arm_PaymentDetail_company_id_paymentMethod_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."cmf_CustomerVehicle" DROP CONSTRAINT "cmf_CustomerVehicle_company_id_vehicleType_id_brand_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."cmf_CustomerVehicle" DROP CONSTRAINT "cmf_CustomerVehicle_company_id_vehicleType_id_brand_id_mod_fkey";

-- DropForeignKey
ALTER TABLE "public"."wks_VehicleBrand" DROP CONSTRAINT "wks_VehicleBrand_company_id_vehicleType_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."wks_VehicleModel" DROP CONSTRAINT "wks_VehicleModel_company_id_vehicleType_id_brand_id_fkey";

-- AlterTable
ALTER TABLE "public"."cmf_PaymentMethod" DROP CONSTRAINT "pk_cmf_PaymentMethod",
DROP COLUMN "branch_id",
DROP COLUMN "company_id",
ADD CONSTRAINT "pk_cmf_PaymentMethod" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."cmf_TransactionClass" DROP CONSTRAINT "pk_cmf_TransactionClass",
DROP COLUMN "branch_id",
DROP COLUMN "company_id",
ADD CONSTRAINT "pk_cmf_TransactionClass" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."cmf_TransactionType" DROP CONSTRAINT "pk_cmf_TransactionType",
DROP COLUMN "branch_id",
DROP COLUMN "company_id",
ADD CONSTRAINT "pk_cmf_TransactionType" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."imc_ProductImage" ADD COLUMN     "branch_id" CHAR(10) NOT NULL;

-- AlterTable
ALTER TABLE "public"."saas_CompanyAddon" ADD COLUMN     "branch_id" CHAR(10) NOT NULL;

-- AlterTable
ALTER TABLE "public"."saas_CompanySubscription" ADD COLUMN     "branch_id" CHAR(10) NOT NULL;

-- AlterTable
ALTER TABLE "public"."saas_SubscriptionBilling" ADD COLUMN     "branch_id" CHAR(10) NOT NULL;

-- AlterTable
ALTER TABLE "public"."saas_UsageTracking" ADD COLUMN     "branch_id" CHAR(10) NOT NULL;

-- AlterTable
ALTER TABLE "public"."sys_Company" ADD COLUMN     "isMain" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "public"."sys_EmailVerification" ADD COLUMN     "branch_id" CHAR(10),
ADD COLUMN     "company_id" CHAR(5);

-- AlterTable
ALTER TABLE "public"."sys_Menu" DROP COLUMN "branch_id",
DROP COLUMN "company_id";

-- AlterTable
ALTER TABLE "public"."sys_Menu_Permission" DROP COLUMN "branch_id",
DROP COLUMN "company_id";

-- AlterTable
ALTER TABLE "public"."sys_PasswordReset" ADD COLUMN     "branch_id" CHAR(10),
ADD COLUMN     "company_id" CHAR(5);

-- AlterTable
ALTER TABLE "public"."sys_Role" ADD COLUMN     "branch_id" CHAR(10),
ADD COLUMN     "company_id" CHAR(5);

-- AlterTable
ALTER TABLE "public"."sys_Session" ADD COLUMN     "branch_id" CHAR(10),
ADD COLUMN     "company_id" CHAR(5);

-- AlterTable
ALTER TABLE "public"."sys_TwoFactorToken" ADD COLUMN     "branch_id" CHAR(10),
ADD COLUMN     "company_id" CHAR(5);

-- AlterTable
ALTER TABLE "public"."sys_User" ADD COLUMN     "branch_id" CHAR(10);

-- AlterTable
ALTER TABLE "public"."sys_UserRole" ADD COLUMN     "branch_id" CHAR(10),
ADD COLUMN     "company_id" CHAR(5);

-- AlterTable
ALTER TABLE "public"."wks_VehicleBrand" DROP CONSTRAINT "pk_wks_VehicleBrand",
DROP COLUMN "branch_id",
DROP COLUMN "company_id",
ADD CONSTRAINT "pk_wks_VehicleBrand" PRIMARY KEY ("vehicleType_id", "id");

-- AlterTable
ALTER TABLE "public"."wks_VehicleModel" DROP CONSTRAINT "pk_wks_VehicleModel",
DROP COLUMN "branch_id",
DROP COLUMN "company_id",
ADD CONSTRAINT "pk_wks_VehicleModel" PRIMARY KEY ("vehicleType_id", "brand_id", "id");

-- AlterTable
ALTER TABLE "public"."wks_VehicleType" DROP CONSTRAINT "pk_wks_VehicleType",
DROP COLUMN "branch_id",
DROP COLUMN "company_id",
ADD CONSTRAINT "pk_wks_VehicleType" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "public"."wks_VehicleBrand" ADD CONSTRAINT "wks_VehicleBrand_vehicleType_id_fkey" FOREIGN KEY ("vehicleType_id") REFERENCES "public"."wks_VehicleType"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."wks_VehicleModel" ADD CONSTRAINT "wks_VehicleModel_vehicleType_id_brand_id_fkey" FOREIGN KEY ("vehicleType_id", "brand_id") REFERENCES "public"."wks_VehicleBrand"("vehicleType_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."cmf_CustomerVehicle" ADD CONSTRAINT "cmf_CustomerVehicle_vehicleType_id_brand_id_fkey" FOREIGN KEY ("vehicleType_id", "brand_id") REFERENCES "public"."wks_VehicleBrand"("vehicleType_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."cmf_CustomerVehicle" ADD CONSTRAINT "cmf_CustomerVehicle_vehicleType_id_brand_id_model_id_fkey" FOREIGN KEY ("vehicleType_id", "brand_id", "model_id") REFERENCES "public"."wks_VehicleModel"("vehicleType_id", "brand_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."arm_Payment" ADD CONSTRAINT "arm_Payment_paymentMethod_id_fkey" FOREIGN KEY ("paymentMethod_id") REFERENCES "public"."cmf_PaymentMethod"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."arm_PaymentDetail" ADD CONSTRAINT "arm_PaymentDetail_paymentMethod_id_fkey" FOREIGN KEY ("paymentMethod_id") REFERENCES "public"."cmf_PaymentMethod"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."apm_Payment" ADD CONSTRAINT "apm_Payment_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."cmf_PaymentMethod"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."apm_PaymentDetail" ADD CONSTRAINT "apm_PaymentDetail_paymentMethod_id_fkey" FOREIGN KEY ("paymentMethod_id") REFERENCES "public"."cmf_PaymentMethod"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
