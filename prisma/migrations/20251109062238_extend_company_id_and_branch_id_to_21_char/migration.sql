/*
  Warnings:

  - The primary key for the `acc_BankAccount` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `acc_COA` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `acc_GLTrans` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `acc_GLTransDetail` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `apm_Invoice` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `apm_InvoiceDetail` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `apm_Payment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `apm_PaymentDetail` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `arm_CashReceipt` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `arm_CashReceiptDetail` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `arm_CreditNote` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `arm_CreditNoteDetail` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `arm_Invoice` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `arm_InvoiceDetail` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `arm_Payment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `arm_PaymentDetail` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `cmf_Customer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `cmf_CustomerContactPerson` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `cmf_CustomerVehicle` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `cmf_Employee` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `cmf_Mechanic` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `cmf_TaxScheme` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `cmf_TaxSchemeDetail` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `imc_Brand` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `imc_Category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `imc_Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `imc_ProductImage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `imc_ProductStock` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `imc_ProductStockCard` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `imc_ProductVariant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `imc_ProductVariantImage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `imc_ProductVariantOption` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `imc_ProductVariantType` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `imc_SubCategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `imc_Uom` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `imc_VariantOption` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `imc_VariantType` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `inv_InternalMovement` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `inv_InternalMovementDetail` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `prc_PurchaseOrder` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `prc_PurchaseOrderDetail` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `prc_PurchaseReceive` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `prc_PurchaseReceiveDetail` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `prc_PurchaseReturn` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `prc_PurchaseReturnDetail` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `prc_Supplier` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `sys_Company` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `sys_Numbering` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `sys_Reminder` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `sys_ReminderLog` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `wks_BayBlock` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `wks_BookingSlot` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `wks_BranchHoliday` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `wks_BranchWorkingHour` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `wks_ComplaintLog` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `wks_CustomerComplaint` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `wks_MechanicAvailability` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `wks_ServiceBay` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `wks_ServiceBooking` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `wks_ServiceHistory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `wks_ServiceOrder` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `wks_ServiceOrderDetail` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `wks_ServiceRework` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `wks_ServiceReworkItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `wks_ServiceType` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `wks_waitingList` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "public"."acc_BankAccount" DROP CONSTRAINT "acc_BankAccount_company_id_coa_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."acc_COA" DROP CONSTRAINT "acc_COA_company_id_parent_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."acc_GLTrans" DROP CONSTRAINT "acc_GLTrans_company_id_apInvoice_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."acc_GLTrans" DROP CONSTRAINT "acc_GLTrans_company_id_apPayment_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."acc_GLTrans" DROP CONSTRAINT "acc_GLTrans_company_id_cashReceipt_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."acc_GLTrans" DROP CONSTRAINT "acc_GLTrans_company_id_creditNote_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."acc_GLTrans" DROP CONSTRAINT "acc_GLTrans_company_id_invoice_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."acc_GLTrans" DROP CONSTRAINT "acc_GLTrans_company_id_payment_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."acc_GLTrans" DROP CONSTRAINT "acc_GLTrans_company_id_purchaseOrder_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."acc_GLTrans" DROP CONSTRAINT "acc_GLTrans_company_id_purchaseReturn_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."acc_GLTransDetail" DROP CONSTRAINT "acc_GLTransDetail_company_id_coa_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."acc_GLTransDetail" DROP CONSTRAINT "acc_GLTransDetail_company_id_glTrans_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."apm_Invoice" DROP CONSTRAINT "apm_Invoice_company_id_purchaseOrder_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."apm_Invoice" DROP CONSTRAINT "apm_Invoice_company_id_purchaseReceive_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."apm_Invoice" DROP CONSTRAINT "apm_Invoice_company_id_supplier_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."apm_Invoice" DROP CONSTRAINT "apm_Invoice_company_id_taxScheme_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."apm_InvoiceDetail" DROP CONSTRAINT "apm_InvoiceDetail_company_id_apInvoice_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."apm_InvoiceDetail" DROP CONSTRAINT "apm_InvoiceDetail_company_id_product_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."apm_Payment" DROP CONSTRAINT "apm_Payment_company_id_apInvoice_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."apm_Payment" DROP CONSTRAINT "apm_Payment_company_id_bankAccount_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."apm_Payment" DROP CONSTRAINT "apm_Payment_company_id_supplier_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."apm_PaymentDetail" DROP CONSTRAINT "apm_PaymentDetail_company_id_apPayment_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."arm_CashReceiptDetail" DROP CONSTRAINT "arm_CashReceiptDetail_company_id_cashReceipt_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."arm_CreditNote" DROP CONSTRAINT "arm_CreditNote_company_id_complaint_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."arm_CreditNote" DROP CONSTRAINT "arm_CreditNote_company_id_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."arm_CreditNote" DROP CONSTRAINT "arm_CreditNote_company_id_invoice_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."arm_CreditNote" DROP CONSTRAINT "arm_CreditNote_company_id_refundBankAccount_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."arm_CreditNote" DROP CONSTRAINT "arm_CreditNote_company_id_serviceOrder_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."arm_CreditNote" DROP CONSTRAINT "arm_CreditNote_company_id_serviceRework_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."arm_CreditNote" DROP CONSTRAINT "arm_CreditNote_company_id_vehicle_customer_id_customerVehi_fkey";

-- DropForeignKey
ALTER TABLE "public"."arm_CreditNoteDetail" DROP CONSTRAINT "arm_CreditNoteDetail_company_id_creditNote_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."arm_Invoice" DROP CONSTRAINT "arm_Invoice_company_id_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."arm_Invoice" DROP CONSTRAINT "arm_Invoice_company_id_source_document_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."arm_Invoice" DROP CONSTRAINT "arm_Invoice_company_id_taxScheme_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."arm_Invoice" DROP CONSTRAINT "arm_Invoice_company_id_vehicle_customer_id_customerVehicle_fkey";

-- DropForeignKey
ALTER TABLE "public"."arm_InvoiceDetail" DROP CONSTRAINT "arm_InvoiceDetail_company_id_invoice_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."arm_Payment" DROP CONSTRAINT "arm_Payment_company_id_bankAccount_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."arm_Payment" DROP CONSTRAINT "arm_Payment_company_id_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."arm_Payment" DROP CONSTRAINT "arm_Payment_company_id_invoice_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."arm_PaymentDetail" DROP CONSTRAINT "arm_PaymentDetail_company_id_payment_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."cmf_CustomerContactPerson" DROP CONSTRAINT "cmf_CustomerContactPerson_company_id_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."cmf_CustomerVehicle" DROP CONSTRAINT "cmf_CustomerVehicle_company_id_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."cmf_Mechanic" DROP CONSTRAINT "cmf_Mechanic_company_id_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."cmf_TaxScheme" DROP CONSTRAINT "cmf_TaxScheme_company_id_taxAccount_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."cmf_TaxSchemeDetail" DROP CONSTRAINT "cmf_TaxSchemeDetail_company_id_taxAccount_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."cmf_TaxSchemeDetail" DROP CONSTRAINT "cmf_TaxSchemeDetail_company_id_taxScheme_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."imc_Product" DROP CONSTRAINT "imc_Product_company_id_brand_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."imc_Product" DROP CONSTRAINT "imc_Product_company_id_category_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."imc_Product" DROP CONSTRAINT "imc_Product_company_id_category_id_subCategory_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."imc_Product" DROP CONSTRAINT "imc_Product_company_id_uom_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."imc_ProductImage" DROP CONSTRAINT "imc_ProductImage_product_id_company_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."imc_ProductStock" DROP CONSTRAINT "imc_ProductStock_id_company_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."imc_ProductVariant" DROP CONSTRAINT "imc_ProductVariant_company_id_product_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."imc_ProductVariantImage" DROP CONSTRAINT "imc_ProductVariantImage_company_id_product_id_productVaria_fkey";

-- DropForeignKey
ALTER TABLE "public"."imc_ProductVariantOption" DROP CONSTRAINT "imc_ProductVariantOption_company_id_product_id_productVari_fkey";

-- DropForeignKey
ALTER TABLE "public"."imc_ProductVariantOption" DROP CONSTRAINT "imc_ProductVariantOption_company_id_variantType_id_variant_fkey";

-- DropForeignKey
ALTER TABLE "public"."imc_ProductVariantType" DROP CONSTRAINT "imc_ProductVariantType_company_id_product_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."imc_ProductVariantType" DROP CONSTRAINT "imc_ProductVariantType_company_id_variantType_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."imc_SubCategory" DROP CONSTRAINT "imc_SubCategory_company_id_category_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."imc_VariantOption" DROP CONSTRAINT "imc_VariantOption_company_id_variantType_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."inv_InternalMovementDetail" DROP CONSTRAINT "inv_InternalMovementDetail_company_id_internalMovement_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."inv_InternalMovementDetail" DROP CONSTRAINT "inv_InternalMovementDetail_company_id_product_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."prc_PurchaseOrder" DROP CONSTRAINT "prc_PurchaseOrder_company_id_supplier_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."prc_PurchaseOrderDetail" DROP CONSTRAINT "prc_PurchaseOrderDetail_company_id_product_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."prc_PurchaseOrderDetail" DROP CONSTRAINT "prc_PurchaseOrderDetail_company_id_purchaseOrder_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."prc_PurchaseReceive" DROP CONSTRAINT "prc_PurchaseReceive_company_id_purchaseOrder_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."prc_PurchaseReceive" DROP CONSTRAINT "prc_PurchaseReceive_company_id_supplier_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."prc_PurchaseReceiveDetail" DROP CONSTRAINT "prc_PurchaseReceiveDetail_company_id_product_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."prc_PurchaseReceiveDetail" DROP CONSTRAINT "prc_PurchaseReceiveDetail_company_id_purchaseOrderDetail_i_fkey";

-- DropForeignKey
ALTER TABLE "public"."prc_PurchaseReceiveDetail" DROP CONSTRAINT "prc_PurchaseReceiveDetail_company_id_purchaseReceive_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."prc_PurchaseReturn" DROP CONSTRAINT "prc_PurchaseReturn_company_id_purchaseOrder_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."prc_PurchaseReturn" DROP CONSTRAINT "prc_PurchaseReturn_company_id_purchaseReceive_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."prc_PurchaseReturn" DROP CONSTRAINT "prc_PurchaseReturn_company_id_supplier_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."prc_PurchaseReturnDetail" DROP CONSTRAINT "prc_PurchaseReturnDetail_company_id_product_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."prc_PurchaseReturnDetail" DROP CONSTRAINT "prc_PurchaseReturnDetail_company_id_purchaseReturn_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."saas_CompanyAddon" DROP CONSTRAINT "saas_CompanyAddon_company_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."saas_CompanySubscription" DROP CONSTRAINT "saas_CompanySubscription_company_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."saas_SubscriptionBilling" DROP CONSTRAINT "saas_SubscriptionBilling_company_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."saas_UsageTracking" DROP CONSTRAINT "saas_UsageTracking_company_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."sys_Branch" DROP CONSTRAINT "sys_Branch_company_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."sys_Reminder" DROP CONSTRAINT "sys_Reminder_company_id_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."sys_Reminder" DROP CONSTRAINT "sys_Reminder_company_id_parentReminder_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."sys_ReminderLog" DROP CONSTRAINT "sys_ReminderLog_company_id_reminder_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."sys_User" DROP CONSTRAINT "sys_User_company_id_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."sys_UserCompanyRole" DROP CONSTRAINT "sys_UserCompanyRole_company_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."tmp_sys_Branch" DROP CONSTRAINT "tmp_sys_Branch_company_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."wks_BayBlock" DROP CONSTRAINT "wks_BayBlock_company_id_bay_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."wks_BookingSlot" DROP CONSTRAINT "wks_BookingSlot_company_id_bay_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."wks_ComplaintLog" DROP CONSTRAINT "wks_ComplaintLog_company_id_complaint_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."wks_CustomerComplaint" DROP CONSTRAINT "wks_CustomerComplaint_company_id_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."wks_CustomerComplaint" DROP CONSTRAINT "wks_CustomerComplaint_company_id_serviceOrder_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."wks_CustomerComplaint" DROP CONSTRAINT "wks_CustomerComplaint_company_id_vehicle_customer_id_custo_fkey";

-- DropForeignKey
ALTER TABLE "public"."wks_MechanicAvailability" DROP CONSTRAINT "wks_MechanicAvailability_company_id_mechanic_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."wks_ServiceBooking" DROP CONSTRAINT "wks_ServiceBooking_company_id_bay_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."wks_ServiceBooking" DROP CONSTRAINT "wks_ServiceBooking_company_id_customer_id_customerVehicle__fkey";

-- DropForeignKey
ALTER TABLE "public"."wks_ServiceBooking" DROP CONSTRAINT "wks_ServiceBooking_company_id_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."wks_ServiceBooking" DROP CONSTRAINT "wks_ServiceBooking_company_id_mechanic_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."wks_ServiceBooking" DROP CONSTRAINT "wks_ServiceBooking_company_id_serviceType_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."wks_ServiceHistory" DROP CONSTRAINT "wks_ServiceHistory_company_id_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."wks_ServiceHistory" DROP CONSTRAINT "wks_ServiceHistory_company_id_serviceOrder_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."wks_ServiceHistory" DROP CONSTRAINT "wks_ServiceHistory_company_id_vehicle_customer_id_customer_fkey";

-- DropForeignKey
ALTER TABLE "public"."wks_ServiceOrder" DROP CONSTRAINT "wks_ServiceOrder_company_id_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."wks_ServiceOrder" DROP CONSTRAINT "wks_ServiceOrder_company_id_mechanic_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."wks_ServiceOrder" DROP CONSTRAINT "wks_ServiceOrder_company_id_serviceBay_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."wks_ServiceOrder" DROP CONSTRAINT "wks_ServiceOrder_company_id_vehicle_customer_id_customerVe_fkey";

-- DropForeignKey
ALTER TABLE "public"."wks_ServiceOrderDetail" DROP CONSTRAINT "wks_ServiceOrderDetail_company_id_mechanic_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."wks_ServiceOrderDetail" DROP CONSTRAINT "wks_ServiceOrderDetail_company_id_product_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."wks_ServiceOrderDetail" DROP CONSTRAINT "wks_ServiceOrderDetail_company_id_serviceOrder_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."wks_ServiceOrderDetail" DROP CONSTRAINT "wks_ServiceOrderDetail_company_id_serviceType_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."wks_ServiceRework" DROP CONSTRAINT "wks_ServiceRework_company_id_complaint_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."wks_ServiceRework" DROP CONSTRAINT "wks_ServiceRework_company_id_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."wks_ServiceRework" DROP CONSTRAINT "wks_ServiceRework_company_id_mechanic_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."wks_ServiceRework" DROP CONSTRAINT "wks_ServiceRework_company_id_originalServiceOrder_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."wks_ServiceRework" DROP CONSTRAINT "wks_ServiceRework_company_id_serviceBay_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."wks_ServiceRework" DROP CONSTRAINT "wks_ServiceRework_company_id_vehicle_customer_id_customerV_fkey";

-- DropForeignKey
ALTER TABLE "public"."wks_ServiceReworkItem" DROP CONSTRAINT "wks_ServiceReworkItem_company_id_serviceRework_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."wks_WorkshopType" DROP CONSTRAINT "wks_WorkshopType_branch_id_fkey";

-- AlterTable
ALTER TABLE "public"."acc_BankAccount" DROP CONSTRAINT "pk_acc_BankAccount",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_acc_BankAccount" PRIMARY KEY ("company_id", "id");

-- AlterTable
ALTER TABLE "public"."acc_COA" DROP CONSTRAINT "pk_acc_COA",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_acc_COA" PRIMARY KEY ("company_id", "id");

-- AlterTable
ALTER TABLE "public"."acc_GLTrans" DROP CONSTRAINT "pk_acc_GLTrans",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_acc_GLTrans" PRIMARY KEY ("company_id", "id");

-- AlterTable
ALTER TABLE "public"."acc_GLTransDetail" DROP CONSTRAINT "pk_acc_GLTransDetail",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_acc_GLTransDetail" PRIMARY KEY ("company_id", "id");

-- AlterTable
ALTER TABLE "public"."apm_Invoice" DROP CONSTRAINT "pk_apm_Invoice",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_apm_Invoice" PRIMARY KEY ("company_id", "id");

-- AlterTable
ALTER TABLE "public"."apm_InvoiceDetail" DROP CONSTRAINT "pk_apm_InvoiceDetail",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_apm_InvoiceDetail" PRIMARY KEY ("company_id", "id");

-- AlterTable
ALTER TABLE "public"."apm_Payment" DROP CONSTRAINT "pk_apm_Payment",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_apm_Payment" PRIMARY KEY ("company_id", "id");

-- AlterTable
ALTER TABLE "public"."apm_PaymentDetail" DROP CONSTRAINT "pk_apm_PaymentDetail",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_apm_PaymentDetail" PRIMARY KEY ("company_id", "id");

-- AlterTable
ALTER TABLE "public"."arm_CashReceipt" DROP CONSTRAINT "pk_arm_CashReceipt",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_arm_CashReceipt" PRIMARY KEY ("company_id", "id");

-- AlterTable
ALTER TABLE "public"."arm_CashReceiptDetail" DROP CONSTRAINT "pk_arm_CashReceiptDetail",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_arm_CashReceiptDetail" PRIMARY KEY ("company_id", "id");

-- AlterTable
ALTER TABLE "public"."arm_CreditNote" DROP CONSTRAINT "pk_arm_CreditNote",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_arm_CreditNote" PRIMARY KEY ("company_id", "id");

-- AlterTable
ALTER TABLE "public"."arm_CreditNoteDetail" DROP CONSTRAINT "pk_arm_CreditNoteDetail",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_arm_CreditNoteDetail" PRIMARY KEY ("company_id", "id");

-- AlterTable
ALTER TABLE "public"."arm_Invoice" DROP CONSTRAINT "pk_arm_Invoice",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_arm_Invoice" PRIMARY KEY ("company_id", "id");

-- AlterTable
ALTER TABLE "public"."arm_InvoiceDetail" DROP CONSTRAINT "pk_arm_InvoiceDetail",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_arm_InvoiceDetail" PRIMARY KEY ("company_id", "id");

-- AlterTable
ALTER TABLE "public"."arm_Payment" DROP CONSTRAINT "pk_arm_Payment",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_arm_Payment" PRIMARY KEY ("company_id", "id");

-- AlterTable
ALTER TABLE "public"."arm_PaymentDetail" DROP CONSTRAINT "pk_arm_PaymentDetail",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_arm_PaymentDetail" PRIMARY KEY ("company_id", "id");

-- AlterTable
ALTER TABLE "public"."cmf_Customer" DROP CONSTRAINT "pk_cmf_Customer",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_cmf_Customer" PRIMARY KEY ("company_id", "id");

-- AlterTable
ALTER TABLE "public"."cmf_CustomerContactPerson" DROP CONSTRAINT "pk_cmf_CustomerContactPerson",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_cmf_CustomerContactPerson" PRIMARY KEY ("company_id", "customer_id", "id");

-- AlterTable
ALTER TABLE "public"."cmf_CustomerVehicle" DROP CONSTRAINT "pk_cmf_CustomerVehicle",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_cmf_CustomerVehicle" PRIMARY KEY ("company_id", "customer_id", "id");

-- AlterTable
ALTER TABLE "public"."cmf_Employee" DROP CONSTRAINT "pk_cmf_Employee",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_cmf_Employee" PRIMARY KEY ("company_id", "id");

-- AlterTable
ALTER TABLE "public"."cmf_Mechanic" DROP CONSTRAINT "pk_cmf_Mechanic",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_cmf_Mechanic" PRIMARY KEY ("company_id", "id");

-- AlterTable
ALTER TABLE "public"."cmf_TaxScheme" DROP CONSTRAINT "pk_cmf_TaxScheme",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_cmf_TaxScheme" PRIMARY KEY ("company_id", "id");

-- AlterTable
ALTER TABLE "public"."cmf_TaxSchemeDetail" DROP CONSTRAINT "pk_cmf_TaxSchemeDetail",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_cmf_TaxSchemeDetail" PRIMARY KEY ("company_id", "taxScheme_id", "id");

-- AlterTable
ALTER TABLE "public"."imc_Brand" DROP CONSTRAINT "pk_imc_Brands",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_imc_Brands" PRIMARY KEY ("company_id", "id");

-- AlterTable
ALTER TABLE "public"."imc_Category" DROP CONSTRAINT "pk_imc_Categories",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_imc_Categories" PRIMARY KEY ("company_id", "id");

-- AlterTable
ALTER TABLE "public"."imc_CategoryType" ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21);

-- AlterTable
ALTER TABLE "public"."imc_Floor" ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21);

-- AlterTable
ALTER TABLE "public"."imc_Product" DROP CONSTRAINT "pk_imc_Products",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_imc_Products" PRIMARY KEY ("company_id", "id");

-- AlterTable
ALTER TABLE "public"."imc_ProductImage" DROP CONSTRAINT "pk_imc_ProductImages",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_imc_ProductImages" PRIMARY KEY ("product_id", "company_id", "id");

-- AlterTable
ALTER TABLE "public"."imc_ProductStock" DROP CONSTRAINT "imc_ProductStock_pkey",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "imc_ProductStock_pkey" PRIMARY KEY ("id", "floor_id", "shelf_id", "row_id", "mExpired_dt", "yExpired_dt", "warehouse_id", "company_id");

-- AlterTable
ALTER TABLE "public"."imc_ProductStockCard" DROP CONSTRAINT "imc_ProductStockCard_pkey",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "imc_ProductStockCard_pkey" PRIMARY KEY ("product_id", "floor_id", "shelf_id", "row_id", "mExpired_dt", "yExpired_dt", "doc_id", "mutation_id", "srn_seq", "batch_no_item", "warehouse_id", "company_id");

-- AlterTable
ALTER TABLE "public"."imc_ProductVariant" DROP CONSTRAINT "pk_imc_ProductVariant",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_imc_ProductVariant" PRIMARY KEY ("company_id", "product_id", "id");

-- AlterTable
ALTER TABLE "public"."imc_ProductVariantImage" DROP CONSTRAINT "pk_imc_ProductVariantImage",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_imc_ProductVariantImage" PRIMARY KEY ("company_id", "product_id", "productVariant_id", "id");

-- AlterTable
ALTER TABLE "public"."imc_ProductVariantOption" DROP CONSTRAINT "pk_imc_ProductVariantOption",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_imc_ProductVariantOption" PRIMARY KEY ("company_id", "product_id", "productVariant_id", "variantType_id", "variantOption_id");

-- AlterTable
ALTER TABLE "public"."imc_ProductVariantType" DROP CONSTRAINT "pk_imc_ProductVariantType",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_imc_ProductVariantType" PRIMARY KEY ("company_id", "product_id", "variantType_id");

-- AlterTable
ALTER TABLE "public"."imc_Row" ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21);

-- AlterTable
ALTER TABLE "public"."imc_Shelf" ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21);

-- AlterTable
ALTER TABLE "public"."imc_SubCategory" DROP CONSTRAINT "pk_imc_SubCategories",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_imc_SubCategories" PRIMARY KEY ("company_id", "category_id", "id");

-- AlterTable
ALTER TABLE "public"."imc_Uom" DROP CONSTRAINT "pk_imc_Uoms",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_imc_Uoms" PRIMARY KEY ("company_id", "id");

-- AlterTable
ALTER TABLE "public"."imc_VariantOption" DROP CONSTRAINT "pk_imc_VariantOption",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_imc_VariantOption" PRIMARY KEY ("company_id", "variantType_id", "id");

-- AlterTable
ALTER TABLE "public"."imc_VariantType" DROP CONSTRAINT "pk_imc_VariantType",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_imc_VariantType" PRIMARY KEY ("company_id", "id");

-- AlterTable
ALTER TABLE "public"."imc_Warehouse" ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21);

-- AlterTable
ALTER TABLE "public"."inv_InternalMovement" DROP CONSTRAINT "pk_inv_InternalMovement",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_inv_InternalMovement" PRIMARY KEY ("company_id", "id");

-- AlterTable
ALTER TABLE "public"."inv_InternalMovementDetail" DROP CONSTRAINT "pk_inv_InternalMovementDetail",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_inv_InternalMovementDetail" PRIMARY KEY ("company_id", "id");

-- AlterTable
ALTER TABLE "public"."prc_PurchaseOrder" DROP CONSTRAINT "pk_prc_PurchaseOrder",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_prc_PurchaseOrder" PRIMARY KEY ("company_id", "id");

-- AlterTable
ALTER TABLE "public"."prc_PurchaseOrderDetail" DROP CONSTRAINT "pk_prc_PurchaseOrderDetail",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_prc_PurchaseOrderDetail" PRIMARY KEY ("company_id", "id");

-- AlterTable
ALTER TABLE "public"."prc_PurchaseReceive" DROP CONSTRAINT "pk_prc_PurchaseReceive",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_prc_PurchaseReceive" PRIMARY KEY ("company_id", "id");

-- AlterTable
ALTER TABLE "public"."prc_PurchaseReceiveDetail" DROP CONSTRAINT "pk_prc_PurchaseReceiveDetail",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_prc_PurchaseReceiveDetail" PRIMARY KEY ("company_id", "id");

-- AlterTable
ALTER TABLE "public"."prc_PurchaseReturn" DROP CONSTRAINT "pk_prc_PurchaseReturn",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_prc_PurchaseReturn" PRIMARY KEY ("company_id", "id");

-- AlterTable
ALTER TABLE "public"."prc_PurchaseReturnDetail" DROP CONSTRAINT "pk_prc_PurchaseReturnDetail",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_prc_PurchaseReturnDetail" PRIMARY KEY ("company_id", "id");

-- AlterTable
ALTER TABLE "public"."prc_Supplier" DROP CONSTRAINT "pk_prc_Supplier",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_prc_Supplier" PRIMARY KEY ("company_id", "id");

-- AlterTable
ALTER TABLE "public"."saas_CompanyAddon" ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21);

-- AlterTable
ALTER TABLE "public"."saas_CompanySubscription" ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21);

-- AlterTable
ALTER TABLE "public"."saas_SubscriptionBilling" ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21);

-- AlterTable
ALTER TABLE "public"."saas_UsageTracking" ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21);

-- AlterTable
ALTER TABLE "public"."sys_Branch" ALTER COLUMN "company_id" SET DATA TYPE CHAR(21);

-- AlterTable
ALTER TABLE "public"."sys_City" ALTER COLUMN "company_id" SET DATA TYPE CHAR(21);

-- AlterTable
ALTER TABLE "public"."sys_Company" DROP CONSTRAINT "sys_Company_pkey",
ALTER COLUMN "id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "sys_Company_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."sys_District" ALTER COLUMN "company_id" SET DATA TYPE CHAR(21);

-- AlterTable
ALTER TABLE "public"."sys_EmailVerification" ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21);

-- AlterTable
ALTER TABLE "public"."sys_Numbering" DROP CONSTRAINT "pk_sys_Numbering",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_sys_Numbering" PRIMARY KEY ("company_id", "branch_id", "id");

-- AlterTable
ALTER TABLE "public"."sys_PasswordReset" ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21);

-- AlterTable
ALTER TABLE "public"."sys_Province" ALTER COLUMN "company_id" SET DATA TYPE CHAR(21);

-- AlterTable
ALTER TABLE "public"."sys_Reminder" DROP CONSTRAINT "pk_sys_Reminder",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_sys_Reminder" PRIMARY KEY ("company_id", "id");

-- AlterTable
ALTER TABLE "public"."sys_ReminderLog" DROP CONSTRAINT "pk_sys_ReminderLog",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_sys_ReminderLog" PRIMARY KEY ("company_id", "id");

-- AlterTable
ALTER TABLE "public"."sys_Role" ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21);

-- AlterTable
ALTER TABLE "public"."sys_Session" ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21);

-- AlterTable
ALTER TABLE "public"."sys_SubDistrict" ALTER COLUMN "company_id" SET DATA TYPE CHAR(21);

-- AlterTable
ALTER TABLE "public"."sys_TwoFactorToken" ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21);

-- AlterTable
ALTER TABLE "public"."sys_User" ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21);

-- AlterTable
ALTER TABLE "public"."sys_UserCompanyRole" ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21);

-- AlterTable
ALTER TABLE "public"."sys_UserRole" ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21);

-- AlterTable
ALTER TABLE "public"."tmp_sys_Branch" ALTER COLUMN "company_id" SET DATA TYPE CHAR(21);

-- AlterTable
ALTER TABLE "public"."wks_BayBlock" DROP CONSTRAINT "pk_wks_BayBlock",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_wks_BayBlock" PRIMARY KEY ("company_id", "id");

-- AlterTable
ALTER TABLE "public"."wks_BookingSlot" DROP CONSTRAINT "pk_wks_BookingSlot",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_wks_BookingSlot" PRIMARY KEY ("company_id", "id");

-- AlterTable
ALTER TABLE "public"."wks_BranchHoliday" DROP CONSTRAINT "pk_wks_BranchHoliday",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_wks_BranchHoliday" PRIMARY KEY ("company_id", "id");

-- AlterTable
ALTER TABLE "public"."wks_BranchWorkingHour" DROP CONSTRAINT "pk_wks_BranchWorkingHour",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_wks_BranchWorkingHour" PRIMARY KEY ("company_id", "branch_id", "weekday");

-- AlterTable
ALTER TABLE "public"."wks_ComplaintLog" DROP CONSTRAINT "pk_wks_ComplaintLog",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_wks_ComplaintLog" PRIMARY KEY ("company_id", "id");

-- AlterTable
ALTER TABLE "public"."wks_CustomerComplaint" DROP CONSTRAINT "pk_cmf_CustomerComplaint",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_cmf_CustomerComplaint" PRIMARY KEY ("company_id", "id");

-- AlterTable
ALTER TABLE "public"."wks_MechanicAvailability" DROP CONSTRAINT "pk_wks_MechanicAvailability",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_wks_MechanicAvailability" PRIMARY KEY ("company_id", "id");

-- AlterTable
ALTER TABLE "public"."wks_ServiceBay" DROP CONSTRAINT "pk_wks_ServiceBay",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_wks_ServiceBay" PRIMARY KEY ("company_id", "id");

-- AlterTable
ALTER TABLE "public"."wks_ServiceBooking" DROP CONSTRAINT "pk_wks_ServiceBooking",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_wks_ServiceBooking" PRIMARY KEY ("company_id", "id");

-- AlterTable
ALTER TABLE "public"."wks_ServiceHistory" DROP CONSTRAINT "pk_wks_ServiceHistory",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_wks_ServiceHistory" PRIMARY KEY ("company_id", "id");

-- AlterTable
ALTER TABLE "public"."wks_ServiceOrder" DROP CONSTRAINT "pk_wks_ServiceOrder",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_wks_ServiceOrder" PRIMARY KEY ("company_id", "id");

-- AlterTable
ALTER TABLE "public"."wks_ServiceOrderDetail" DROP CONSTRAINT "pk_wks_ServiceOrderDetail",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_wks_ServiceOrderDetail" PRIMARY KEY ("company_id", "id");

-- AlterTable
ALTER TABLE "public"."wks_ServiceRework" DROP CONSTRAINT "pk_wks_ServiceRework",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_wks_ServiceRework" PRIMARY KEY ("company_id", "id");

-- AlterTable
ALTER TABLE "public"."wks_ServiceReworkItem" DROP CONSTRAINT "pk_wks_ServiceReworkItem",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_wks_ServiceReworkItem" PRIMARY KEY ("company_id", "id");

-- AlterTable
ALTER TABLE "public"."wks_ServiceType" DROP CONSTRAINT "pk_wks_ServiceType",
ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "pk_wks_ServiceType" PRIMARY KEY ("company_id", "id");

-- AlterTable
ALTER TABLE "public"."wks_WorkshopType" ALTER COLUMN "company_id" SET DATA TYPE CHAR(21),
ALTER COLUMN "branch_id" SET DATA TYPE CHAR(21);

-- AlterTable
ALTER TABLE "public"."wks_waitingList" DROP CONSTRAINT "wks_waitingList_pkey",
ALTER COLUMN "id" SET DATA TYPE CHAR(21),
ADD CONSTRAINT "wks_waitingList_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "public"."saas_CompanySubscription" ADD CONSTRAINT "saas_CompanySubscription_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."sys_Company"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."saas_SubscriptionBilling" ADD CONSTRAINT "saas_SubscriptionBilling_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."sys_Company"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."saas_UsageTracking" ADD CONSTRAINT "saas_UsageTracking_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."sys_Company"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."saas_CompanyAddon" ADD CONSTRAINT "saas_CompanyAddon_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."sys_Company"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."sys_Branch" ADD CONSTRAINT "sys_Branch_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."sys_Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sys_User" ADD CONSTRAINT "sys_User_company_id_employee_id_fkey" FOREIGN KEY ("company_id", "employee_id") REFERENCES "public"."cmf_Employee"("company_id", "id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."sys_UserCompanyRole" ADD CONSTRAINT "sys_UserCompanyRole_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."sys_Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."imc_SubCategory" ADD CONSTRAINT "imc_SubCategory_company_id_category_id_fkey" FOREIGN KEY ("company_id", "category_id") REFERENCES "public"."imc_Category"("company_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."imc_Product" ADD CONSTRAINT "imc_Product_company_id_category_id_fkey" FOREIGN KEY ("company_id", "category_id") REFERENCES "public"."imc_Category"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."imc_Product" ADD CONSTRAINT "imc_Product_company_id_category_id_subCategory_id_fkey" FOREIGN KEY ("company_id", "category_id", "subCategory_id") REFERENCES "public"."imc_SubCategory"("company_id", "category_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."imc_Product" ADD CONSTRAINT "imc_Product_company_id_uom_id_fkey" FOREIGN KEY ("company_id", "uom_id") REFERENCES "public"."imc_Uom"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."imc_Product" ADD CONSTRAINT "imc_Product_company_id_brand_id_fkey" FOREIGN KEY ("company_id", "brand_id") REFERENCES "public"."imc_Brand"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."imc_ProductStock" ADD CONSTRAINT "imc_ProductStock_id_company_id_fkey" FOREIGN KEY ("id", "company_id") REFERENCES "public"."imc_Product"("id", "company_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."imc_ProductImage" ADD CONSTRAINT "imc_ProductImage_product_id_company_id_fkey" FOREIGN KEY ("product_id", "company_id") REFERENCES "public"."imc_Product"("id", "company_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."imc_VariantOption" ADD CONSTRAINT "imc_VariantOption_company_id_variantType_id_fkey" FOREIGN KEY ("company_id", "variantType_id") REFERENCES "public"."imc_VariantType"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."imc_ProductVariantType" ADD CONSTRAINT "imc_ProductVariantType_company_id_product_id_fkey" FOREIGN KEY ("company_id", "product_id") REFERENCES "public"."imc_Product"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."imc_ProductVariantType" ADD CONSTRAINT "imc_ProductVariantType_company_id_variantType_id_fkey" FOREIGN KEY ("company_id", "variantType_id") REFERENCES "public"."imc_VariantType"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."imc_ProductVariant" ADD CONSTRAINT "imc_ProductVariant_company_id_product_id_fkey" FOREIGN KEY ("company_id", "product_id") REFERENCES "public"."imc_Product"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."imc_ProductVariantOption" ADD CONSTRAINT "imc_ProductVariantOption_company_id_product_id_productVari_fkey" FOREIGN KEY ("company_id", "product_id", "productVariant_id") REFERENCES "public"."imc_ProductVariant"("company_id", "product_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."imc_ProductVariantOption" ADD CONSTRAINT "imc_ProductVariantOption_company_id_variantType_id_variant_fkey" FOREIGN KEY ("company_id", "variantType_id", "variantOption_id") REFERENCES "public"."imc_VariantOption"("company_id", "variantType_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."imc_ProductVariantImage" ADD CONSTRAINT "imc_ProductVariantImage_company_id_product_id_productVaria_fkey" FOREIGN KEY ("company_id", "product_id", "productVariant_id") REFERENCES "public"."imc_ProductVariant"("company_id", "product_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."cmf_CustomerContactPerson" ADD CONSTRAINT "cmf_CustomerContactPerson_company_id_customer_id_fkey" FOREIGN KEY ("company_id", "customer_id") REFERENCES "public"."cmf_Customer"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."cmf_CustomerVehicle" ADD CONSTRAINT "cmf_CustomerVehicle_company_id_customer_id_fkey" FOREIGN KEY ("company_id", "customer_id") REFERENCES "public"."cmf_Customer"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."cmf_Mechanic" ADD CONSTRAINT "cmf_Mechanic_company_id_employee_id_fkey" FOREIGN KEY ("company_id", "employee_id") REFERENCES "public"."cmf_Employee"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."wks_WorkshopType" ADD CONSTRAINT "wks_WorkshopType_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."sys_Branch"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

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

-- AddForeignKey
ALTER TABLE "public"."wks_ServiceOrder" ADD CONSTRAINT "wks_ServiceOrder_company_id_customer_id_fkey" FOREIGN KEY ("company_id", "customer_id") REFERENCES "public"."cmf_Customer"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."wks_ServiceOrder" ADD CONSTRAINT "wks_ServiceOrder_company_id_vehicle_customer_id_customerVe_fkey" FOREIGN KEY ("company_id", "vehicle_customer_id", "customerVehicle_id") REFERENCES "public"."cmf_CustomerVehicle"("company_id", "customer_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."wks_ServiceOrder" ADD CONSTRAINT "wks_ServiceOrder_company_id_mechanic_id_fkey" FOREIGN KEY ("company_id", "mechanic_id") REFERENCES "public"."cmf_Mechanic"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."wks_ServiceOrder" ADD CONSTRAINT "wks_ServiceOrder_company_id_serviceBay_id_fkey" FOREIGN KEY ("company_id", "serviceBay_id") REFERENCES "public"."wks_ServiceBay"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."wks_ServiceOrderDetail" ADD CONSTRAINT "wks_ServiceOrderDetail_company_id_serviceOrder_id_fkey" FOREIGN KEY ("company_id", "serviceOrder_id") REFERENCES "public"."wks_ServiceOrder"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."wks_ServiceOrderDetail" ADD CONSTRAINT "wks_ServiceOrderDetail_company_id_serviceType_id_fkey" FOREIGN KEY ("company_id", "serviceType_id") REFERENCES "public"."wks_ServiceType"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."wks_ServiceOrderDetail" ADD CONSTRAINT "wks_ServiceOrderDetail_company_id_mechanic_id_fkey" FOREIGN KEY ("company_id", "mechanic_id") REFERENCES "public"."cmf_Mechanic"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."wks_ServiceOrderDetail" ADD CONSTRAINT "wks_ServiceOrderDetail_company_id_product_id_fkey" FOREIGN KEY ("company_id", "product_id") REFERENCES "public"."imc_Product"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."wks_ServiceHistory" ADD CONSTRAINT "wks_ServiceHistory_company_id_serviceOrder_id_fkey" FOREIGN KEY ("company_id", "serviceOrder_id") REFERENCES "public"."wks_ServiceOrder"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."wks_ServiceHistory" ADD CONSTRAINT "wks_ServiceHistory_company_id_customer_id_fkey" FOREIGN KEY ("company_id", "customer_id") REFERENCES "public"."cmf_Customer"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."wks_ServiceHistory" ADD CONSTRAINT "wks_ServiceHistory_company_id_vehicle_customer_id_customer_fkey" FOREIGN KEY ("company_id", "vehicle_customer_id", "customerVehicle_id") REFERENCES "public"."cmf_CustomerVehicle"("company_id", "customer_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."sys_Reminder" ADD CONSTRAINT "sys_Reminder_company_id_customer_id_fkey" FOREIGN KEY ("company_id", "customer_id") REFERENCES "public"."cmf_Customer"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."sys_Reminder" ADD CONSTRAINT "sys_Reminder_company_id_parentReminder_id_fkey" FOREIGN KEY ("company_id", "parentReminder_id") REFERENCES "public"."sys_Reminder"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."sys_ReminderLog" ADD CONSTRAINT "sys_ReminderLog_company_id_reminder_id_fkey" FOREIGN KEY ("company_id", "reminder_id") REFERENCES "public"."sys_Reminder"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."wks_CustomerComplaint" ADD CONSTRAINT "wks_CustomerComplaint_company_id_serviceOrder_id_fkey" FOREIGN KEY ("company_id", "serviceOrder_id") REFERENCES "public"."wks_ServiceOrder"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."wks_CustomerComplaint" ADD CONSTRAINT "wks_CustomerComplaint_company_id_customer_id_fkey" FOREIGN KEY ("company_id", "customer_id") REFERENCES "public"."cmf_Customer"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."wks_CustomerComplaint" ADD CONSTRAINT "wks_CustomerComplaint_company_id_vehicle_customer_id_custo_fkey" FOREIGN KEY ("company_id", "vehicle_customer_id", "customerVehicle_id") REFERENCES "public"."cmf_CustomerVehicle"("company_id", "customer_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."wks_ComplaintLog" ADD CONSTRAINT "wks_ComplaintLog_company_id_complaint_id_fkey" FOREIGN KEY ("company_id", "complaint_id") REFERENCES "public"."wks_CustomerComplaint"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."wks_ServiceRework" ADD CONSTRAINT "wks_ServiceRework_company_id_originalServiceOrder_id_fkey" FOREIGN KEY ("company_id", "originalServiceOrder_id") REFERENCES "public"."wks_ServiceOrder"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."wks_ServiceRework" ADD CONSTRAINT "wks_ServiceRework_company_id_complaint_id_fkey" FOREIGN KEY ("company_id", "complaint_id") REFERENCES "public"."wks_CustomerComplaint"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."wks_ServiceRework" ADD CONSTRAINT "wks_ServiceRework_company_id_customer_id_fkey" FOREIGN KEY ("company_id", "customer_id") REFERENCES "public"."cmf_Customer"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."wks_ServiceRework" ADD CONSTRAINT "wks_ServiceRework_company_id_vehicle_customer_id_customerV_fkey" FOREIGN KEY ("company_id", "vehicle_customer_id", "customerVehicle_id") REFERENCES "public"."cmf_CustomerVehicle"("company_id", "customer_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."wks_ServiceRework" ADD CONSTRAINT "wks_ServiceRework_company_id_mechanic_id_fkey" FOREIGN KEY ("company_id", "mechanic_id") REFERENCES "public"."cmf_Mechanic"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."wks_ServiceRework" ADD CONSTRAINT "wks_ServiceRework_company_id_serviceBay_id_fkey" FOREIGN KEY ("company_id", "serviceBay_id") REFERENCES "public"."wks_ServiceBay"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."wks_ServiceReworkItem" ADD CONSTRAINT "wks_ServiceReworkItem_company_id_serviceRework_id_fkey" FOREIGN KEY ("company_id", "serviceRework_id") REFERENCES "public"."wks_ServiceRework"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."arm_CreditNote" ADD CONSTRAINT "arm_CreditNote_company_id_invoice_id_fkey" FOREIGN KEY ("company_id", "invoice_id") REFERENCES "public"."arm_Invoice"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."arm_CreditNote" ADD CONSTRAINT "arm_CreditNote_company_id_serviceOrder_id_fkey" FOREIGN KEY ("company_id", "serviceOrder_id") REFERENCES "public"."wks_ServiceOrder"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."arm_CreditNote" ADD CONSTRAINT "arm_CreditNote_company_id_complaint_id_fkey" FOREIGN KEY ("company_id", "complaint_id") REFERENCES "public"."wks_CustomerComplaint"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."arm_CreditNote" ADD CONSTRAINT "arm_CreditNote_company_id_serviceRework_id_fkey" FOREIGN KEY ("company_id", "serviceRework_id") REFERENCES "public"."wks_ServiceRework"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."arm_CreditNote" ADD CONSTRAINT "arm_CreditNote_company_id_customer_id_fkey" FOREIGN KEY ("company_id", "customer_id") REFERENCES "public"."cmf_Customer"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."arm_CreditNote" ADD CONSTRAINT "arm_CreditNote_company_id_vehicle_customer_id_customerVehi_fkey" FOREIGN KEY ("company_id", "vehicle_customer_id", "customerVehicle_id") REFERENCES "public"."cmf_CustomerVehicle"("company_id", "customer_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."arm_CreditNote" ADD CONSTRAINT "arm_CreditNote_company_id_refundBankAccount_id_fkey" FOREIGN KEY ("company_id", "refundBankAccount_id") REFERENCES "public"."acc_BankAccount"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."arm_CreditNoteDetail" ADD CONSTRAINT "arm_CreditNoteDetail_company_id_creditNote_id_fkey" FOREIGN KEY ("company_id", "creditNote_id") REFERENCES "public"."arm_CreditNote"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."prc_PurchaseOrder" ADD CONSTRAINT "prc_PurchaseOrder_company_id_supplier_id_fkey" FOREIGN KEY ("company_id", "supplier_id") REFERENCES "public"."prc_Supplier"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."prc_PurchaseOrderDetail" ADD CONSTRAINT "prc_PurchaseOrderDetail_company_id_purchaseOrder_id_fkey" FOREIGN KEY ("company_id", "purchaseOrder_id") REFERENCES "public"."prc_PurchaseOrder"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."prc_PurchaseOrderDetail" ADD CONSTRAINT "prc_PurchaseOrderDetail_company_id_product_id_fkey" FOREIGN KEY ("company_id", "product_id") REFERENCES "public"."imc_Product"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."prc_PurchaseReceive" ADD CONSTRAINT "prc_PurchaseReceive_company_id_purchaseOrder_id_fkey" FOREIGN KEY ("company_id", "purchaseOrder_id") REFERENCES "public"."prc_PurchaseOrder"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."prc_PurchaseReceive" ADD CONSTRAINT "prc_PurchaseReceive_company_id_supplier_id_fkey" FOREIGN KEY ("company_id", "supplier_id") REFERENCES "public"."prc_Supplier"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."prc_PurchaseReceiveDetail" ADD CONSTRAINT "prc_PurchaseReceiveDetail_company_id_purchaseReceive_id_fkey" FOREIGN KEY ("company_id", "purchaseReceive_id") REFERENCES "public"."prc_PurchaseReceive"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."prc_PurchaseReceiveDetail" ADD CONSTRAINT "prc_PurchaseReceiveDetail_company_id_purchaseOrderDetail_i_fkey" FOREIGN KEY ("company_id", "purchaseOrderDetail_id") REFERENCES "public"."prc_PurchaseOrderDetail"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."prc_PurchaseReceiveDetail" ADD CONSTRAINT "prc_PurchaseReceiveDetail_company_id_product_id_fkey" FOREIGN KEY ("company_id", "product_id") REFERENCES "public"."imc_Product"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."inv_InternalMovementDetail" ADD CONSTRAINT "inv_InternalMovementDetail_company_id_internalMovement_id_fkey" FOREIGN KEY ("company_id", "internalMovement_id") REFERENCES "public"."inv_InternalMovement"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."inv_InternalMovementDetail" ADD CONSTRAINT "inv_InternalMovementDetail_company_id_product_id_fkey" FOREIGN KEY ("company_id", "product_id") REFERENCES "public"."imc_Product"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."acc_COA" ADD CONSTRAINT "acc_COA_company_id_parent_id_fkey" FOREIGN KEY ("company_id", "parent_id") REFERENCES "public"."acc_COA"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."acc_BankAccount" ADD CONSTRAINT "acc_BankAccount_company_id_coa_id_fkey" FOREIGN KEY ("company_id", "coa_id") REFERENCES "public"."acc_COA"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."cmf_TaxScheme" ADD CONSTRAINT "cmf_TaxScheme_company_id_taxAccount_id_fkey" FOREIGN KEY ("company_id", "taxAccount_id") REFERENCES "public"."acc_COA"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."cmf_TaxSchemeDetail" ADD CONSTRAINT "cmf_TaxSchemeDetail_company_id_taxScheme_id_fkey" FOREIGN KEY ("company_id", "taxScheme_id") REFERENCES "public"."cmf_TaxScheme"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."cmf_TaxSchemeDetail" ADD CONSTRAINT "cmf_TaxSchemeDetail_company_id_taxAccount_id_fkey" FOREIGN KEY ("company_id", "taxAccount_id") REFERENCES "public"."acc_COA"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."arm_Invoice" ADD CONSTRAINT "arm_Invoice_company_id_customer_id_fkey" FOREIGN KEY ("company_id", "customer_id") REFERENCES "public"."cmf_Customer"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."arm_Invoice" ADD CONSTRAINT "arm_Invoice_company_id_vehicle_customer_id_customerVehicle_fkey" FOREIGN KEY ("company_id", "vehicle_customer_id", "customerVehicle_id") REFERENCES "public"."cmf_CustomerVehicle"("company_id", "customer_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."arm_Invoice" ADD CONSTRAINT "arm_Invoice_company_id_source_document_id_fkey" FOREIGN KEY ("company_id", "source_document_id") REFERENCES "public"."wks_ServiceOrder"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."arm_Invoice" ADD CONSTRAINT "arm_Invoice_company_id_taxScheme_id_fkey" FOREIGN KEY ("company_id", "taxScheme_id") REFERENCES "public"."cmf_TaxScheme"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."arm_InvoiceDetail" ADD CONSTRAINT "arm_InvoiceDetail_company_id_invoice_id_fkey" FOREIGN KEY ("company_id", "invoice_id") REFERENCES "public"."arm_Invoice"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."arm_Payment" ADD CONSTRAINT "arm_Payment_company_id_invoice_id_fkey" FOREIGN KEY ("company_id", "invoice_id") REFERENCES "public"."arm_Invoice"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."arm_Payment" ADD CONSTRAINT "arm_Payment_company_id_customer_id_fkey" FOREIGN KEY ("company_id", "customer_id") REFERENCES "public"."cmf_Customer"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."arm_Payment" ADD CONSTRAINT "arm_Payment_company_id_bankAccount_id_fkey" FOREIGN KEY ("company_id", "bankAccount_id") REFERENCES "public"."acc_BankAccount"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."arm_PaymentDetail" ADD CONSTRAINT "arm_PaymentDetail_company_id_payment_id_fkey" FOREIGN KEY ("company_id", "payment_id") REFERENCES "public"."arm_Payment"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."arm_CashReceiptDetail" ADD CONSTRAINT "arm_CashReceiptDetail_company_id_cashReceipt_id_fkey" FOREIGN KEY ("company_id", "cashReceipt_id") REFERENCES "public"."arm_CashReceipt"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."apm_Invoice" ADD CONSTRAINT "apm_Invoice_company_id_supplier_id_fkey" FOREIGN KEY ("company_id", "supplier_id") REFERENCES "public"."prc_Supplier"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."apm_Invoice" ADD CONSTRAINT "apm_Invoice_company_id_purchaseReceive_id_fkey" FOREIGN KEY ("company_id", "purchaseReceive_id") REFERENCES "public"."prc_PurchaseReceive"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."apm_Invoice" ADD CONSTRAINT "apm_Invoice_company_id_purchaseOrder_id_fkey" FOREIGN KEY ("company_id", "purchaseOrder_id") REFERENCES "public"."prc_PurchaseOrder"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."apm_Invoice" ADD CONSTRAINT "apm_Invoice_company_id_taxScheme_id_fkey" FOREIGN KEY ("company_id", "taxScheme_id") REFERENCES "public"."cmf_TaxScheme"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."apm_InvoiceDetail" ADD CONSTRAINT "apm_InvoiceDetail_company_id_apInvoice_id_fkey" FOREIGN KEY ("company_id", "apInvoice_id") REFERENCES "public"."apm_Invoice"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."apm_InvoiceDetail" ADD CONSTRAINT "apm_InvoiceDetail_company_id_product_id_fkey" FOREIGN KEY ("company_id", "product_id") REFERENCES "public"."imc_Product"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."apm_Payment" ADD CONSTRAINT "apm_Payment_company_id_apInvoice_id_fkey" FOREIGN KEY ("company_id", "apInvoice_id") REFERENCES "public"."apm_Invoice"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."apm_Payment" ADD CONSTRAINT "apm_Payment_company_id_supplier_id_fkey" FOREIGN KEY ("company_id", "supplier_id") REFERENCES "public"."prc_Supplier"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."apm_Payment" ADD CONSTRAINT "apm_Payment_company_id_bankAccount_id_fkey" FOREIGN KEY ("company_id", "bankAccount_id") REFERENCES "public"."acc_BankAccount"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."apm_PaymentDetail" ADD CONSTRAINT "apm_PaymentDetail_company_id_apPayment_id_fkey" FOREIGN KEY ("company_id", "apPayment_id") REFERENCES "public"."apm_Payment"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."prc_PurchaseReturn" ADD CONSTRAINT "prc_PurchaseReturn_company_id_purchaseReceive_id_fkey" FOREIGN KEY ("company_id", "purchaseReceive_id") REFERENCES "public"."prc_PurchaseReceive"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."prc_PurchaseReturn" ADD CONSTRAINT "prc_PurchaseReturn_company_id_purchaseOrder_id_fkey" FOREIGN KEY ("company_id", "purchaseOrder_id") REFERENCES "public"."prc_PurchaseOrder"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."prc_PurchaseReturn" ADD CONSTRAINT "prc_PurchaseReturn_company_id_supplier_id_fkey" FOREIGN KEY ("company_id", "supplier_id") REFERENCES "public"."prc_Supplier"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."prc_PurchaseReturnDetail" ADD CONSTRAINT "prc_PurchaseReturnDetail_company_id_purchaseReturn_id_fkey" FOREIGN KEY ("company_id", "purchaseReturn_id") REFERENCES "public"."prc_PurchaseReturn"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."prc_PurchaseReturnDetail" ADD CONSTRAINT "prc_PurchaseReturnDetail_company_id_product_id_fkey" FOREIGN KEY ("company_id", "product_id") REFERENCES "public"."imc_Product"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."acc_GLTrans" ADD CONSTRAINT "acc_GLTrans_company_id_invoice_id_fkey" FOREIGN KEY ("company_id", "invoice_id") REFERENCES "public"."arm_Invoice"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."acc_GLTrans" ADD CONSTRAINT "acc_GLTrans_company_id_payment_id_fkey" FOREIGN KEY ("company_id", "payment_id") REFERENCES "public"."arm_Payment"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."acc_GLTrans" ADD CONSTRAINT "acc_GLTrans_company_id_cashReceipt_id_fkey" FOREIGN KEY ("company_id", "cashReceipt_id") REFERENCES "public"."arm_CashReceipt"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."acc_GLTrans" ADD CONSTRAINT "acc_GLTrans_company_id_apInvoice_id_fkey" FOREIGN KEY ("company_id", "apInvoice_id") REFERENCES "public"."apm_Invoice"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."acc_GLTrans" ADD CONSTRAINT "acc_GLTrans_company_id_apPayment_id_fkey" FOREIGN KEY ("company_id", "apPayment_id") REFERENCES "public"."apm_Payment"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."acc_GLTrans" ADD CONSTRAINT "acc_GLTrans_company_id_purchaseOrder_id_fkey" FOREIGN KEY ("company_id", "purchaseOrder_id") REFERENCES "public"."prc_PurchaseOrder"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."acc_GLTrans" ADD CONSTRAINT "acc_GLTrans_company_id_purchaseReturn_id_fkey" FOREIGN KEY ("company_id", "purchaseReturn_id") REFERENCES "public"."prc_PurchaseReturn"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."acc_GLTrans" ADD CONSTRAINT "acc_GLTrans_company_id_creditNote_id_fkey" FOREIGN KEY ("company_id", "creditNote_id") REFERENCES "public"."arm_CreditNote"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."acc_GLTransDetail" ADD CONSTRAINT "acc_GLTransDetail_company_id_glTrans_id_fkey" FOREIGN KEY ("company_id", "glTrans_id") REFERENCES "public"."acc_GLTrans"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."acc_GLTransDetail" ADD CONSTRAINT "acc_GLTransDetail_company_id_coa_id_fkey" FOREIGN KEY ("company_id", "coa_id") REFERENCES "public"."acc_COA"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."tmp_sys_Branch" ADD CONSTRAINT "tmp_sys_Branch_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."tmp_sys_Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
