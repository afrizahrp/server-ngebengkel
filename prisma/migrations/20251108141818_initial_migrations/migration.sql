-- CreateEnum
CREATE TYPE "public"."BookingStatusEnum" AS ENUM ('0', '1', '2', '3', '4', '5', '9');

-- CreateEnum
CREATE TYPE "public"."BookingSourceEnum" AS ENUM ('WEB', 'APP', 'PHONE', 'WALKIN');

-- CreateEnum
CREATE TYPE "public"."SlotStatusEnum" AS ENUM ('OPEN', 'BLOCKED', 'FULL');

-- CreateEnum
CREATE TYPE "public"."MasterRecordStatusEnum" AS ENUM ('0', '1');

-- CreateEnum
CREATE TYPE "public"."TransactionRecordStatusEnum" AS ENUM ('0', '1', '2', '3');

-- CreateEnum
CREATE TYPE "public"."ApprovalStatusEnum" AS ENUM ('0', '1', '2');

-- CreateEnum
CREATE TYPE "public"."PostingStatusEnum" AS ENUM ('0', '1');

-- CreateEnum
CREATE TYPE "public"."TransactionStatusEnum" AS ENUM ('E', 'P', 'U');

-- CreateEnum
CREATE TYPE "public"."PriorityEnum" AS ENUM ('L', 'N', 'H', 'U');

-- CreateEnum
CREATE TYPE "public"."BillingCycleEnum" AS ENUM ('M', 'Y');

-- CreateEnum
CREATE TYPE "public"."SubscriptionStatusEnum" AS ENUM ('T', 'A', 'E', 'S', 'C');

-- CreateEnum
CREATE TYPE "public"."BillingStatusEnum" AS ENUM ('0', '1', '2', '3', '9');

-- CreateEnum
CREATE TYPE "public"."AddonStatusEnum" AS ENUM ('A', 'S', 'E', 'C');

-- CreateEnum
CREATE TYPE "public"."CustomerTypeEnum" AS ENUM ('I', 'C');

-- CreateEnum
CREATE TYPE "public"."GenderEnum" AS ENUM ('M', 'F');

-- CreateEnum
CREATE TYPE "public"."FuelLevelEnum" AS ENUM ('E', 'Q', 'H', 'F');

-- CreateEnum
CREATE TYPE "public"."ServiceCategoryEnum" AS ENUM ('MAINT', 'REPAIR', 'BODY', 'WASH', 'INSP', 'TUNE', 'EMERG');

-- CreateEnum
CREATE TYPE "public"."MechanicLevelEnum" AS ENUM ('JR', 'SR', 'MT', 'FM');

-- CreateEnum
CREATE TYPE "public"."ServiceBayTypeEnum" AS ENUM ('GEN', 'HEAVY', 'QUICK', 'BODY', 'WASH');

-- CreateEnum
CREATE TYPE "public"."ServiceOrderStatusEnum" AS ENUM ('0', '1', '2', '3', '4', '5', '6', '9');

-- CreateEnum
CREATE TYPE "public"."PaymentStatusEnum" AS ENUM ('0', '1', '2', '3');

-- CreateEnum
CREATE TYPE "public"."DetailTypeEnum" AS ENUM ('S', 'P');

-- CreateEnum
CREATE TYPE "public"."DetailStatusEnum" AS ENUM ('0', '1', '2', '9');

-- CreateEnum
CREATE TYPE "public"."SupplierTypeEnum" AS ENUM ('V', 'D', 'M', 'A');

-- CreateEnum
CREATE TYPE "public"."PurchaseOrderStatusEnum" AS ENUM ('0', '1', '2', '3', '4', '5', '9');

-- CreateEnum
CREATE TYPE "public"."ReceiveStatusEnum" AS ENUM ('0', '1', '2', '3', '5');

-- CreateEnum
CREATE TYPE "public"."PODetailStatusEnum" AS ENUM ('0', '1', '2', '9');

-- CreateEnum
CREATE TYPE "public"."QualityStatusEnum" AS ENUM ('0', '1', '2', '3');

-- CreateEnum
CREATE TYPE "public"."ReceiveDetailStatusEnum" AS ENUM ('0', '1', '2', '3');

-- CreateEnum
CREATE TYPE "public"."InternalMovementTypeEnum" AS ENUM ('TRF', 'ADJ', 'RET', 'SCP', 'ASM', 'DIS', 'ALC', 'CSM');

-- CreateEnum
CREATE TYPE "public"."TransactionTypeEnum" AS ENUM ('I', 'O');

-- CreateEnum
CREATE TYPE "public"."MovementStatusEnum" AS ENUM ('0', '1', '2', '3', '5', '9');

-- CreateEnum
CREATE TYPE "public"."MovementDetailStatusEnum" AS ENUM ('0', '1', '2', '3', '9');

-- CreateEnum
CREATE TYPE "public"."ComplaintTypeEnum" AS ENUM ('SQ', 'PQ', 'PR', 'DL', 'SB', 'FC', 'WR', 'OT');

-- CreateEnum
CREATE TYPE "public"."SeverityEnum" AS ENUM ('L', 'M', 'H', 'C');

-- CreateEnum
CREATE TYPE "public"."ComplaintSourceEnum" AS ENUM ('PH', 'EM', 'WA', 'IP', 'SM', 'WB', 'SV');

-- CreateEnum
CREATE TYPE "public"."ComplaintStatusEnum" AS ENUM ('0', '1', '2', '3', '4', '5', '6', '9');

-- CreateEnum
CREATE TYPE "public"."ComplaintLogTypeEnum" AS ENUM ('SC', 'AS', 'RS', 'ES', 'RE', 'FU', 'NT', 'CL', 'EM', 'CP');

-- CreateEnum
CREATE TYPE "public"."ReworkReasonEnum" AS ENUM ('PQ', 'IC', 'WP', 'MF', 'DM', 'OT');

-- CreateEnum
CREATE TYPE "public"."ReworkStatusEnum" AS ENUM ('0', '1', '2', '3', '9');

-- CreateEnum
CREATE TYPE "public"."ReworkActionEnum" AS ENUM ('RD', 'RP', 'AD', 'RF', 'VC');

-- CreateEnum
CREATE TYPE "public"."CreditReasonEnum" AS ENUM ('SI', 'OC', 'GW', 'RT', 'CP', 'OT');

-- CreateEnum
CREATE TYPE "public"."RefundMethodEnum" AS ENUM ('CSH', 'TRF', 'CTA', 'VCH', 'OFF');

-- CreateEnum
CREATE TYPE "public"."CreditNoteStatusEnum" AS ENUM ('0', '1', '2', '3', '4', '9');

-- CreateEnum
CREATE TYPE "public"."DocumentResetEnum" AS ENUM ('N', 'Y', 'M', 'D');

-- CreateEnum
CREATE TYPE "public"."PaymentMethodTypeEnum" AS ENUM ('CASH', 'BANK', 'CARD', 'EWLT', 'QRIS', 'GIRO');

-- CreateEnum
CREATE TYPE "public"."COATypeEnum" AS ENUM ('A', 'L', 'E', 'R', 'X');

-- CreateEnum
CREATE TYPE "public"."BalanceTypeEnum" AS ENUM ('D', 'C');

-- CreateEnum
CREATE TYPE "public"."InvoiceStatusEnum" AS ENUM ('0', '1', '2', '3', '4', '5', '9');

-- CreateEnum
CREATE TYPE "public"."InvoicePaymentStatusEnum" AS ENUM ('0', '1', '2', '3');

-- CreateEnum
CREATE TYPE "public"."InvoiceItemTypeEnum" AS ENUM ('S', 'P', 'O');

-- CreateEnum
CREATE TYPE "public"."PaymentConfirmStatusEnum" AS ENUM ('0', '1', '2', '9');

-- CreateEnum
CREATE TYPE "public"."CashReceiptStatusEnum" AS ENUM ('0', '1', '2', '5', '9');

-- CreateEnum
CREATE TYPE "public"."JournalStatusEnum" AS ENUM ('0', '1', '2', '5', '8', '9');

-- CreateEnum
CREATE TYPE "public"."APInvoiceStatusEnum" AS ENUM ('0', '1', '2', '3', '4', '5', '9');

-- CreateEnum
CREATE TYPE "public"."APPaymentStatusEnum" AS ENUM ('0', '1', '2', '9');

-- CreateEnum
CREATE TYPE "public"."APPaymentConfirmStatusEnum" AS ENUM ('0', '1', '2', '9');

-- CreateEnum
CREATE TYPE "public"."ReturnReasonEnum" AS ENUM ('DMG', 'DEF', 'WRG', 'EXC', 'EXP', 'OTH');

-- CreateEnum
CREATE TYPE "public"."ReturnStatusEnum" AS ENUM ('0', '1', '2', '3', '4', '5', '8', '9');

-- CreateEnum
CREATE TYPE "public"."ReturnDetailStatusEnum" AS ENUM ('0', '1', '2', '3', '9');

-- CreateEnum
CREATE TYPE "public"."TaxTypeEnum" AS ENUM ('S', 'P', 'W', 'O');

-- CreateEnum
CREATE TYPE "public"."ReminderEntityTypeEnum" AS ENUM ('SO', 'BK', 'SH', 'VM', 'SUB', 'PAY', 'CUS');

-- CreateEnum
CREATE TYPE "public"."ReminderTypeEnum" AS ENUM ('SCH', 'DUE', 'APT', 'PAY', 'EXP', 'FUP', 'CUS');

-- CreateEnum
CREATE TYPE "public"."ReminderChannelEnum" AS ENUM ('WA', 'EM', 'SM');

-- CreateEnum
CREATE TYPE "public"."ReminderStatusEnum" AS ENUM ('P', 'S', 'T', 'F', 'C');

-- CreateEnum
CREATE TYPE "public"."ReminderLogTypeEnum" AS ENUM ('S', 'F', 'C', 'U');

-- CreateEnum
CREATE TYPE "public"."wks_specializationEnum" AS ENUM ('MC', 'CA', 'TR', 'BU');

-- CreateTable
CREATE TABLE "public"."saas_SubscriptionPlan" (
    "id" CHAR(10) NOT NULL,
    "planCode" VARCHAR(20) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "description_en" TEXT,
    "monthlyPrice" DECIMAL(21,4) NOT NULL,
    "yearlyPrice" DECIMAL(21,4) NOT NULL,
    "yearlyMonthlyEquiv" DECIMAL(21,4),
    "discountYearly" DECIMAL(5,2),
    "currency" CHAR(3) NOT NULL DEFAULT 'IDR',
    "maxUsers" INTEGER,
    "maxBranches" INTEGER,
    "maxProducts" INTEGER,
    "maxCustomers" INTEGER,
    "maxVehicles" INTEGER,
    "maxTransactions" INTEGER,
    "storageLimit" INTEGER,
    "features" JSONB,
    "displayOrder" INTEGER DEFAULT 0,
    "isPopular" BOOLEAN DEFAULT false,
    "highlightText" VARCHAR(100),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "remarks" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_saas_SubscriptionPlan" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."saas_CompanySubscription" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(30) NOT NULL,
    "subscriptionNumber" VARCHAR(30) NOT NULL,
    "plan_id" CHAR(10) NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "billingCycle" "public"."BillingCycleEnum" NOT NULL,
    "monthlyPrice" DECIMAL(21,4) NOT NULL,
    "yearlyPrice" DECIMAL(21,4),
    "discountPercent" DECIMAL(5,2) DEFAULT 0,
    "discountAmount" DECIMAL(21,4) DEFAULT 0,
    "finalPrice" DECIMAL(21,4) NOT NULL,
    "autoRenewal" BOOLEAN NOT NULL DEFAULT true,
    "renewalDate" DATE,
    "isTrialPeriod" BOOLEAN DEFAULT false,
    "trialEndDate" DATE,
    "subscriptionStatus" "public"."SubscriptionStatusEnum" NOT NULL DEFAULT 'A',
    "isCancelled" BOOLEAN DEFAULT false,
    "cancelledDate" TIMESTAMP(3),
    "cancelReason" TEXT,
    "notifyBeforeExpiry" SMALLINT DEFAULT 7,
    "lastNotificationDate" TIMESTAMP(3),
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "remarks" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_saas_CompanySubscription" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."saas_PlanFeature" (
    "id" CHAR(20) NOT NULL,
    "plan_id" CHAR(10) NOT NULL,
    "featureCode" VARCHAR(30) NOT NULL,
    "featureName" VARCHAR(100) NOT NULL,
    "featureName_en" VARCHAR(100),
    "category" VARCHAR(30),
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "customLimit" INTEGER,
    "description" TEXT,
    "seq" INTEGER DEFAULT 0,
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pk_saas_PlanFeature" PRIMARY KEY ("plan_id","id")
);

-- CreateTable
CREATE TABLE "public"."saas_SubscriptionBilling" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(30) NOT NULL,
    "billingNumber" VARCHAR(30) NOT NULL,
    "billingDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" DATE NOT NULL,
    "subscription_id" CHAR(30) NOT NULL,
    "periodStart" DATE NOT NULL,
    "periodEnd" DATE NOT NULL,
    "billingCycle" "public"."BillingCycleEnum" NOT NULL,
    "baseAmount" DECIMAL(21,4) NOT NULL,
    "additionalCharges" DECIMAL(21,4) DEFAULT 0,
    "discountAmount" DECIMAL(21,4) DEFAULT 0,
    "taxAmount" DECIMAL(21,4) DEFAULT 0,
    "totalAmount" DECIMAL(21,4) NOT NULL,
    "paidAmount" DECIMAL(21,4) DEFAULT 0,
    "outstandingAmount" DECIMAL(21,4),
    "paymentMethod" VARCHAR(30),
    "paymentDate" TIMESTAMP(3),
    "paymentReference" VARCHAR(50),
    "billingStatus" "public"."BillingStatusEnum" NOT NULL DEFAULT '0',
    "isPosted" BOOLEAN DEFAULT false,
    "postedDate" TIMESTAMP(3),
    "notes" TEXT,
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "remarks" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_saas_SubscriptionBilling" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."saas_UsageTracking" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(30) NOT NULL,
    "subscription_id" CHAR(30) NOT NULL,
    "trackingDate" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalUsers" INTEGER DEFAULT 0,
    "totalBranches" INTEGER DEFAULT 0,
    "totalProducts" INTEGER DEFAULT 0,
    "totalCustomers" INTEGER DEFAULT 0,
    "totalVehicles" INTEGER DEFAULT 0,
    "totalTransactions" INTEGER DEFAULT 0,
    "storageUsed" DECIMAL(10,2) DEFAULT 0,
    "monthlyServiceOrders" INTEGER DEFAULT 0,
    "monthlyInvoices" INTEGER DEFAULT 0,
    "monthlyPurchaseOrders" INTEGER DEFAULT 0,
    "isOverLimit" BOOLEAN DEFAULT false,
    "alertSent" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pk_saas_UsageTracking" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."saas_AddonFeature" (
    "id" CHAR(10) NOT NULL,
    "addonCode" VARCHAR(30) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "category" VARCHAR(30),
    "description" TEXT,
    "description_en" TEXT,
    "monthlyPrice" DECIMAL(21,4) NOT NULL,
    "yearlyPrice" DECIMAL(21,4),
    "currency" CHAR(3) NOT NULL DEFAULT 'IDR',
    "additionalLimit" INTEGER,
    "limitType" VARCHAR(20),
    "availableForLite" BOOLEAN NOT NULL DEFAULT true,
    "availableForPro" BOOLEAN NOT NULL DEFAULT true,
    "availableForEnterprise" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER DEFAULT 0,
    "isPopular" BOOLEAN DEFAULT false,
    "iconName" VARCHAR(50),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "remarks" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_saas_AddonFeature" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."saas_CompanyAddon" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(30) NOT NULL,
    "subscription_id" CHAR(30) NOT NULL,
    "addon_id" CHAR(10) NOT NULL,
    "activatedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiryDate" DATE,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "monthlyPrice" DECIMAL(21,4) NOT NULL,
    "yearlyPrice" DECIMAL(21,4),
    "lastBilledDate" TIMESTAMP(3),
    "nextBillingDate" TIMESTAMP(3),
    "addonStatus" "public"."AddonStatusEnum" NOT NULL DEFAULT 'A',
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "remarks" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_saas_CompanyAddon" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sys_Company" (
    "seq_no" SMALLINT NOT NULL,
    "id" CHAR(10) NOT NULL,
    "name" VARCHAR(50),
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "isMain" BOOLEAN DEFAULT false,
    "email1" VARCHAR(100),
    "email2" VARCHAR(100),
    "email3" VARCHAR(100),
    "officialWebsite" VARCHAR(100),
    "companyLogo" VARCHAR(255),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sys_Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sys_Branch" (
    "company_id" CHAR(10) NOT NULL,
    "id" CHAR(10) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "isMain" BOOLEAN DEFAULT false,
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "remarks" VARCHAR(255),
    "province_id" CHAR(5),
    "city_id" CHAR(15),
    "district_id" CHAR(15),
    "subdistrict_id" CHAR(20),
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

-- CreateTable
CREATE TABLE "public"."sys_Role" (
    "company_id" CHAR(10),
    "branch_id" CHAR(10),
    "id" CHAR(20) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "remarks" VARCHAR(255),

    CONSTRAINT "sys_Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sys_WhiteListEmail" (
    "id" SMALLINT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sys_WhiteListEmail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sys_User" (
    "company_id" CHAR(10),
    "branch_id" CHAR(10),
    "id" SMALLINT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerifiedAt" TIMESTAMP(3),
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "image" VARCHAR(255),
    "password" VARCHAR(255) NOT NULL,
    "hashedRefreshToken" VARCHAR(255),
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "employee_id" CHAR(20),

    CONSTRAINT "sys_User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sys_EmailVerification" (
    "company_id" CHAR(10),
    "branch_id" CHAR(10),
    "id" VARCHAR(50) NOT NULL,
    "user_id" SMALLINT NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sys_EmailVerification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sys_TwoFactorToken" (
    "company_id" CHAR(10),
    "branch_id" CHAR(10),
    "id" VARCHAR(50) NOT NULL,
    "user_id" SMALLINT NOT NULL,
    "code" VARCHAR(6) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sys_TwoFactorToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sys_PasswordReset" (
    "company_id" CHAR(10),
    "branch_id" CHAR(10),
    "id" SERIAL NOT NULL,
    "user_id" SMALLINT NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "used" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "sys_PasswordReset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sys_Session" (
    "company_id" CHAR(10),
    "branch_id" CHAR(10),
    "id" VARCHAR(50) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "refreshToken" VARCHAR(500) NOT NULL,
    "deviceName" VARCHAR(255),
    "deviceType" VARCHAR(50),
    "browser" VARCHAR(100),
    "os" VARCHAR(100),
    "ipAddress" VARCHAR(45),
    "userAgent" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastActivityAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),
    "revokedReason" VARCHAR(255),
    "hasRefreshedToken" BOOLEAN NOT NULL DEFAULT false,
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',

    CONSTRAINT "sys_Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sys_UserRole" (
    "company_id" CHAR(10),
    "branch_id" CHAR(10),
    "id" SMALLINT NOT NULL,
    "user_id" SMALLINT NOT NULL,
    "role_id" CHAR(20) NOT NULL,
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "isDefault" BOOLEAN DEFAULT false,

    CONSTRAINT "sys_UserRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sys_UserCompanyRole" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" SMALLINT NOT NULL,
    "userRole_id" SMALLINT NOT NULL,
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "isDefault" BOOLEAN DEFAULT false,

    CONSTRAINT "sys_UserCompanyRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sys_Menu" (
    "id" SMALLINT NOT NULL,
    "parent_id" SMALLINT,
    "menu_description" VARCHAR(255) NOT NULL,
    "href" VARCHAR(255),
    "module_id" CHAR(3) NOT NULL,
    "menu_type" VARCHAR(50),
    "has_child" BOOLEAN NOT NULL DEFAULT false,
    "icon" VARCHAR(50),
    "iStatus" TEXT NOT NULL DEFAULT '1',
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "sys_Menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sys_Menu_Permission" (
    "id" INTEGER NOT NULL,
    "userCompanyRole_id" INTEGER NOT NULL,
    "menu_id" INTEGER NOT NULL,
    "can_view" BOOLEAN NOT NULL DEFAULT false,
    "can_create" BOOLEAN NOT NULL DEFAULT false,
    "can_edit" BOOLEAN NOT NULL DEFAULT false,
    "can_delete" BOOLEAN NOT NULL DEFAULT false,
    "can_print" BOOLEAN NOT NULL DEFAULT false,
    "can_approve" BOOLEAN NOT NULL DEFAULT false,
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "sys_Menu_Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sys_Migration_log" (
    "id" SERIAL NOT NULL,
    "from_tableName" TEXT NOT NULL,
    "to_tableName" TEXT NOT NULL,
    "migratedAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "sys_Migration_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sys_Module" (
    "id" CHAR(3) NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "sys_Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sys_Numbering" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "module_id" VARCHAR(3) NOT NULL,
    "id" VARCHAR(10) NOT NULL,
    "description" VARCHAR(100),
    "prefix" VARCHAR(10),
    "delimiter" VARCHAR(5) NOT NULL DEFAULT '/',
    "includeYear" BOOLEAN NOT NULL DEFAULT true,
    "includeMonth" BOOLEAN NOT NULL DEFAULT true,
    "startNumber" INTEGER NOT NULL DEFAULT 1,
    "currentNumber" INTEGER NOT NULL DEFAULT 0,
    "sequenceLength" INTEGER NOT NULL DEFAULT 5,
    "resetAt" "public"."DocumentResetEnum" NOT NULL DEFAULT 'M',
    "format" VARCHAR(50) NOT NULL,
    "sampleOutput" VARCHAR(50),
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "remarks" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_sys_Numbering" PRIMARY KEY ("company_id","branch_id","id")
);

-- CreateTable
CREATE TABLE "public"."imc_Warehouse" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(4) NOT NULL,
    "name" CHAR(60),
    "iMain" INTEGER,
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "address" VARCHAR(250),
    "postalCode" CHAR(6),
    "phone" CHAR(12),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "imc_Warehouse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."imc_Floor" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "warehouse_id" CHAR(4) NOT NULL,
    "id" CHAR(5) NOT NULL,
    "name" CHAR(35),
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_ic_floor" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."imc_Shelf" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "floor_id" CHAR(5) NOT NULL,
    "id" CHAR(15) NOT NULL,
    "name" CHAR(35),
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_ic_shelf" PRIMARY KEY ("floor_id","id")
);

-- CreateTable
CREATE TABLE "public"."imc_Row" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "floor_id" CHAR(5) NOT NULL,
    "shelf_id" CHAR(15) NOT NULL,
    "id" CHAR(15) NOT NULL,
    "name" CHAR(35),
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "storages" CHAR(15),

    CONSTRAINT "pk_ic_row" PRIMARY KEY ("floor_id","shelf_id","id")
);

-- CreateTable
CREATE TABLE "public"."imc_Uom" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(10) NOT NULL,
    "name" VARCHAR(50),
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "remarks" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_imc_Uoms" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."imc_CategoryType" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10),
    "id" SMALLSERIAL NOT NULL,
    "name" VARCHAR(20),
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "remarks" VARCHAR(250),
    "stock_acct" CHAR(10),
    "sales_acct" CHAR(10),
    "cogs_acct" CHAR(10),
    "expense_acct" CHAR(10),
    "asset_acct" CHAR(10),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "imc_CategoryType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."imc_Category" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "type" SMALLINT NOT NULL,
    "id" CHAR(10) NOT NULL,
    "name" VARCHAR(80),
    "seq" INTEGER DEFAULT 0,
    "remarks" VARCHAR(250),
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "imageURL" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "href" VARCHAR(150),
    "icon" VARCHAR(50),

    CONSTRAINT "pk_imc_Categories" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."imc_SubCategory" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(10) NOT NULL,
    "seq" INTEGER DEFAULT 0,
    "imageURL" VARCHAR(250),
    "category_id" CHAR(10) NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "descriptions" VARCHAR(250),
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "remarks" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_imc_SubCategories" PRIMARY KEY ("company_id","category_id","id")
);

-- CreateTable
CREATE TABLE "public"."imc_Brand" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(10) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "slug" VARCHAR(50),
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "remarks" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_imc_Brands" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."imc_Product" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(20) NOT NULL,
    "register_id" CHAR(20),
    "catalog_id" CHAR(20),
    "name" VARCHAR(250) NOT NULL,
    "category_id" CHAR(10) NOT NULL,
    "subCategory_id" CHAR(10) NOT NULL,
    "brand_id" CHAR(10) NOT NULL,
    "uom_id" CHAR(10) NOT NULL,
    "eCatalogURL" VARCHAR(250),
    "remarks" VARCHAR(250),
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "isMaterial" BOOLEAN NOT NULL DEFAULT false,
    "isService" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN DEFAULT false,
    "isFinishing" BOOLEAN NOT NULL DEFAULT false,
    "isAccessories" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" CHAR(50),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(50),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_imc_Products" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."imc_ProductStock" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(20) NOT NULL,
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "warehouse_id" CHAR(4) NOT NULL,
    "floor_id" CHAR(5) NOT NULL,
    "shelf_id" CHAR(15) NOT NULL,
    "row_id" CHAR(15) NOT NULL,
    "batch_no" CHAR(20),
    "mExpired_dt" CHAR(10) NOT NULL,
    "yExpired_dt" CHAR(4) NOT NULL,
    "product_cd" CHAR(20),
    "i_month_expired" INTEGER,
    "i_year_expired" INTEGER,
    "req_qty" DECIMAL(12,4),
    "po_qty" DECIMAL(12,4),
    "grn_qty" DECIMAL(12,4),
    "so_qty" DECIMAL(12,4),
    "spk_qty" DECIMAL(12,4),
    "sj_qty" DECIMAL(12,4),
    "sl_invoice_qty" DECIMAL(12,4),
    "sl_return_qty" DECIMAL(12,4),
    "po_return_qty" DECIMAL(12,4),
    "stock_opname_qty" DECIMAL(12,4),
    "intern_receive_qty" DECIMAL(12,4),
    "intern_issue_qty" DECIMAL(12,4),
    "onhand_qty" DECIMAL(22,4),
    "unit_cost" DECIMAL(21,4),
    "selling_price" DECIMAL(21,4),
    "createdBy" CHAR(50),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(50),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "imc_ProductStock_pkey" PRIMARY KEY ("id","floor_id","shelf_id","row_id","mExpired_dt","yExpired_dt","warehouse_id","company_id")
);

-- CreateTable
CREATE TABLE "public"."imc_ProductStockCard" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "customer_or_supplier_id" CHAR(20) NOT NULL,
    "trx_id" CHAR(2) NOT NULL,
    "trx_class" CHAR(2) NOT NULL,
    "module_id" CHAR(2) NOT NULL,
    "is_in_or_out" CHAR(1) NOT NULL,
    "doc_year" SMALLINT NOT NULL,
    "doc_month" SMALLINT NOT NULL,
    "doc_date" TIMESTAMP(3) NOT NULL,
    "doc_id" CHAR(20) NOT NULL,
    "descs" VARCHAR(250),
    "mutation_id" CHAR(20) NOT NULL,
    "mutation_date" TIMESTAMP(3) NOT NULL,
    "ref_id" CHAR(20) NOT NULL,
    "ref_date" TIMESTAMP(3) NOT NULL,
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "warehouse_id" CHAR(4) NOT NULL,
    "to_warehouse_id" CHAR(4) NOT NULL,
    "srn_seq" SMALLINT NOT NULL,
    "product_id" CHAR(20) NOT NULL,
    "qty" DECIMAL(12,4) NOT NULL,
    "mutation_qty" DECIMAL(12,4) NOT NULL,
    "unit_cost" DECIMAL(21,4),
    "mutation_cost" DECIMAL(21,4),
    "floor_id" CHAR(5) NOT NULL,
    "shelf_id" CHAR(15) NOT NULL,
    "row_id" CHAR(15) NOT NULL,
    "batch_no_item" CHAR(20) NOT NULL,
    "mExpired_dt" CHAR(10) NOT NULL,
    "yExpired_dt" CHAR(4) NOT NULL,
    "product_cd" CHAR(20),
    "i_month_expired" SMALLINT,
    "i_year_expired" INTEGER,
    "selling_price" DECIMAL(21,4),
    "createdBy" CHAR(50),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(50),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "imc_ProductStockCard_pkey" PRIMARY KEY ("product_id","floor_id","shelf_id","row_id","mExpired_dt","yExpired_dt","doc_id","mutation_id","srn_seq","batch_no_item","warehouse_id","company_id")
);

-- CreateTable
CREATE TABLE "public"."imc_ProductImage" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(150) NOT NULL,
    "product_id" CHAR(20) NOT NULL,
    "imageURL" VARCHAR(250) NOT NULL,
    "isPrimary" BOOLEAN NOT NULL,
    "isBrochure" BOOLEAN,
    "seq" INTEGER,
    "isVideo" BOOLEAN DEFAULT false,
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_imc_ProductImages" PRIMARY KEY ("product_id","company_id","id")
);

-- CreateTable
CREATE TABLE "public"."imc_VariantType" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(10) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "remarks" VARCHAR(250),
    "seq" INTEGER DEFAULT 0,
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_imc_VariantType" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."imc_VariantOption" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(15) NOT NULL,
    "variantType_id" CHAR(10) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" CHAR(20),
    "hexColorCode" CHAR(7),
    "imageURL" VARCHAR(250),
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "remarks" VARCHAR(250),
    "seq" INTEGER DEFAULT 0,
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_imc_VariantOption" PRIMARY KEY ("company_id","variantType_id","id")
);

-- CreateTable
CREATE TABLE "public"."imc_ProductVariantType" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "product_id" CHAR(20) NOT NULL,
    "variantType_id" CHAR(10) NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "seq" INTEGER DEFAULT 0,
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_imc_ProductVariantType" PRIMARY KEY ("company_id","product_id","variantType_id")
);

-- CreateTable
CREATE TABLE "public"."imc_ProductVariant" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(30) NOT NULL,
    "product_id" CHAR(20) NOT NULL,
    "sku" VARCHAR(50) NOT NULL,
    "barcode" VARCHAR(50),
    "name" VARCHAR(250),
    "additionalPrice" DECIMAL(21,4),
    "stockQty" DECIMAL(12,4),
    "weight" DECIMAL(10,2),
    "length" DECIMAL(10,2),
    "width" DECIMAL(10,2),
    "height" DECIMAL(10,2),
    "imageURL" VARCHAR(250),
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "isDefault" BOOLEAN DEFAULT false,
    "remarks" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_imc_ProductVariant" PRIMARY KEY ("company_id","product_id","id")
);

-- CreateTable
CREATE TABLE "public"."imc_ProductVariantOption" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "productVariant_id" CHAR(30) NOT NULL,
    "product_id" CHAR(20) NOT NULL,
    "variantType_id" CHAR(10) NOT NULL,
    "variantOption_id" CHAR(15) NOT NULL,

    CONSTRAINT "pk_imc_ProductVariantOption" PRIMARY KEY ("company_id","product_id","productVariant_id","variantType_id","variantOption_id")
);

-- CreateTable
CREATE TABLE "public"."imc_ProductVariantImage" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(150) NOT NULL,
    "productVariant_id" CHAR(30) NOT NULL,
    "product_id" CHAR(20) NOT NULL,
    "imageURL" VARCHAR(250) NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "seq" INTEGER DEFAULT 0,
    "isVideo" BOOLEAN DEFAULT false,
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_imc_ProductVariantImage" PRIMARY KEY ("company_id","product_id","productVariant_id","id")
);

-- CreateTable
CREATE TABLE "public"."cmf_Employee" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(20) NOT NULL,
    "employeeCode" VARCHAR(20) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "nickname" VARCHAR(50),
    "email" VARCHAR(100),
    "mobile" VARCHAR(20),
    "phone" VARCHAR(20),
    "birthDate" DATE,
    "gender" CHAR(1),
    "identityNumber" VARCHAR(30),
    "taxNumber" VARCHAR(30),
    "address" VARCHAR(250),
    "city" VARCHAR(50),
    "province" VARCHAR(50),
    "postalCode" CHAR(6),
    "joinDate" DATE,
    "resignDate" DATE,
    "employmentStatus" VARCHAR(20),
    "department" VARCHAR(50),
    "position" VARCHAR(50),
    "bankName" VARCHAR(50),
    "bankAccountNo" VARCHAR(30),
    "bankAccountName" VARCHAR(100),
    "photoURL" VARCHAR(250),
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "remarks" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_cmf_Employee" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."wks_VehicleType" (
    "id" CHAR(5) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "remarks" VARCHAR(250),
    "seq" INTEGER DEFAULT 0,
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_wks_VehicleType" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."wks_VehicleBrand" (
    "id" CHAR(10) NOT NULL,
    "vehicleType_id" CHAR(5) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "slug" VARCHAR(50),
    "logoURL" VARCHAR(250),
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "remarks" VARCHAR(250),
    "seq" INTEGER DEFAULT 0,
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_wks_VehicleBrand" PRIMARY KEY ("vehicleType_id","id")
);

-- CreateTable
CREATE TABLE "public"."wks_VehicleModel" (
    "id" CHAR(15) NOT NULL,
    "vehicleType_id" CHAR(5) NOT NULL,
    "brand_id" CHAR(10) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100),
    "imageURL" VARCHAR(250),
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "remarks" VARCHAR(250),
    "seq" INTEGER DEFAULT 0,
    "engineType" VARCHAR(50),
    "transmission" VARCHAR(30),
    "fuelType" VARCHAR(30),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_wks_VehicleModel" PRIMARY KEY ("vehicleType_id","brand_id","id")
);

-- CreateTable
CREATE TABLE "public"."cmf_Customer" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(20) NOT NULL,
    "customerType" "public"."CustomerTypeEnum" NOT NULL DEFAULT 'I',
    "name" VARCHAR(100) NOT NULL,
    "legalName" VARCHAR(150),
    "nickname" VARCHAR(50),
    "email" VARCHAR(100),
    "phone1" VARCHAR(20),
    "phone2" VARCHAR(20),
    "mobile1" VARCHAR(20) NOT NULL,
    "mobile2" VARCHAR(20),
    "website" VARCHAR(100),
    "companyRegistrationNumber" VARCHAR(50),
    "businessType" VARCHAR(50),
    "industryType" VARCHAR(50),
    "companySize" VARCHAR(20),
    "numberOfEmployees" SMALLINT,
    "numberOfVehicles" SMALLINT,
    "province" VARCHAR(50),
    "district" VARCHAR(50),
    "city" VARCHAR(50),
    "subDistrict" VARCHAR(50),
    "address1" VARCHAR(250),
    "address2" VARCHAR(250),
    "postalCode" CHAR(6),
    "billingProvince" VARCHAR(50),
    "billingDistrict" VARCHAR(50),
    "billingCity" VARCHAR(50),
    "billingSubDistrict" VARCHAR(50),
    "billingAddress1" VARCHAR(250),
    "billingAddress2" VARCHAR(250),
    "billingPostalCode" CHAR(6),
    "idCardType" VARCHAR(20),
    "idCardNumber" VARCHAR(30),
    "taxNumber" VARCHAR(30),
    "taxName" VARCHAR(150),
    "taxAddress" VARCHAR(250),
    "birthDate" DATE,
    "gender" "public"."GenderEnum",
    "occupation" VARCHAR(50),
    "customerSince" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "membershipLevel" VARCHAR(20),
    "loyaltyPoints" INTEGER DEFAULT 0,
    "totalTransaction" DECIMAL(21,4) DEFAULT 0,
    "lastVisitDate" TIMESTAMP(3),
    "paymentTermDays" SMALLINT,
    "creditLimit" DECIMAL(21,4),
    "currentDebt" DECIMAL(21,4) DEFAULT 0,
    "isCOD" BOOLEAN DEFAULT true,
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "isBlacklisted" BOOLEAN DEFAULT false,
    "blacklistReason" VARCHAR(250),
    "remarks" VARCHAR(250),
    "profileImageURL" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_cmf_Customer" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."cmf_CustomerContactPerson" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(20) NOT NULL,
    "customer_id" CHAR(20) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "position" VARCHAR(50),
    "department" VARCHAR(50),
    "email" VARCHAR(100),
    "phone" VARCHAR(20),
    "mobile" VARCHAR(20),
    "whatsapp" VARCHAR(20),
    "isPrimary" BOOLEAN DEFAULT false,
    "canApprove" BOOLEAN DEFAULT false,
    "canOrder" BOOLEAN DEFAULT false,
    "approvalLimit" DECIMAL(21,4),
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "remarks" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_cmf_CustomerContactPerson" PRIMARY KEY ("company_id","customer_id","id")
);

-- CreateTable
CREATE TABLE "public"."cmf_CustomerVehicle" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(20) NOT NULL,
    "customer_id" CHAR(20) NOT NULL,
    "vehicleType_id" CHAR(5) NOT NULL,
    "brand_id" CHAR(10) NOT NULL,
    "model_id" CHAR(15) NOT NULL,
    "licensePlate" VARCHAR(15) NOT NULL,
    "vehicleYear" SMALLINT,
    "color" VARCHAR(30),
    "chassisNumber" VARCHAR(30),
    "engineNumber" VARCHAR(30),
    "registrationNumber" VARCHAR(30),
    "ownershipDocument" VARCHAR(30),
    "registrationExpiry" DATE,
    "transmission" VARCHAR(30),
    "fuelType" VARCHAR(30),
    "engineCapacity" VARCHAR(20),
    "currentOdometer" INTEGER DEFAULT 0,
    "lastServiceDate" TIMESTAMP(3),
    "lastServiceOdometer" INTEGER,
    "nextServiceOdometer" INTEGER,
    "nextServiceDate" TIMESTAMP(3),
    "purchaseDate" DATE,
    "insuranceProvider" VARCHAR(50),
    "insurancePolicyNo" VARCHAR(30),
    "insuranceExpiry" DATE,
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "isPrimary" BOOLEAN DEFAULT false,
    "remarks" VARCHAR(250),
    "vehicleImageURL" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_cmf_CustomerVehicle" PRIMARY KEY ("company_id","customer_id","id")
);

-- CreateTable
CREATE TABLE "public"."wks_ServiceType" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(10) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "category" "public"."ServiceCategoryEnum",
    "description" VARCHAR(250),
    "estimatedTime" INTEGER,
    "defaultPrice" DECIMAL(21,4),
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "remarks" VARCHAR(250),
    "seq" INTEGER DEFAULT 0,
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_wks_ServiceType" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."cmf_Mechanic" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(10) NOT NULL,
    "employee_id" CHAR(20) NOT NULL,
    "specialization" VARCHAR(100),
    "level" "public"."MechanicLevelEnum" DEFAULT 'JR',
    "totalJobs" INTEGER DEFAULT 0,
    "averageRating" DECIMAL(3,2),
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "isAvailable" BOOLEAN DEFAULT true,
    "remarks" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_cmf_Mechanic" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."wks_ServiceBay" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(10) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "bayType" "public"."ServiceBayTypeEnum",
    "capacity" INTEGER DEFAULT 1,
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "isOccupied" BOOLEAN DEFAULT false,
    "remarks" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_wks_ServiceBay" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."wks_WorkshopCategory" (
    "id" CHAR(5) NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "description" VARCHAR(250),
    "specialization" "public"."wks_specializationEnum" NOT NULL,
    "seq" INTEGER DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wks_WorkshopCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."wks_WorkshopType" (
    "company_id" CHAR(10),
    "branch_id" CHAR(10),
    "id" CHAR(10) NOT NULL,
    "category_id" CHAR(5) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "iconName" VARCHAR(100),
    "seq" INTEGER DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wks_WorkshopType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."wks_WaitingListType" (
    "id" SERIAL NOT NULL,
    "waitingList_id" CHAR(10) NOT NULL,
    "workshopType_id" CHAR(10) NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wks_WaitingListType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."wks_BranchWorkingHour" (
    "company_id" CHAR(10) NOT NULL,
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
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10),
    "id" CHAR(20) NOT NULL,
    "date" DATE NOT NULL,
    "name" VARCHAR(100),
    "isClosed" BOOLEAN NOT NULL DEFAULT true,
    "remarks" VARCHAR(250),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pk_wks_BranchHoliday" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."wks_MechanicAvailability" (
    "company_id" CHAR(10) NOT NULL,
    "id" CHAR(20) NOT NULL,
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
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(20) NOT NULL,
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
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(20) NOT NULL,
    "bay_id" CHAR(10),
    "date" DATE NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 1,
    "bookedCount" INTEGER NOT NULL DEFAULT 0,
    "slotStatus" "public"."SlotStatusEnum" NOT NULL DEFAULT 'OPEN',
    "remarks" VARCHAR(250),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" CHAR(10),
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" CHAR(10),

    CONSTRAINT "pk_wks_BookingSlot" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."wks_ServiceBooking" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(30) NOT NULL,
    "bookingNumber" VARCHAR(30) NOT NULL,
    "bookingDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
    "transactionStatus" "public"."TransactionStatusEnum" NOT NULL DEFAULT 'E',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" CHAR(10),
    "remarks" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "pk_wks_ServiceBooking" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."wks_ServiceOrder" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(30) NOT NULL,
    "orderNumber" VARCHAR(30) NOT NULL,
    "orderDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "customer_id" CHAR(20) NOT NULL,
    "customerVehicle_id" CHAR(20) NOT NULL,
    "vehicle_customer_id" CHAR(20) NOT NULL,
    "odometerIn" INTEGER,
    "fuelLevel" "public"."FuelLevelEnum" DEFAULT 'E',
    "vehicleConditionNotes" TEXT,
    "mechanic_id" CHAR(10),
    "serviceBay_id" CHAR(10),
    "scheduledStartDate" TIMESTAMP(3),
    "scheduledEndDate" TIMESTAMP(3),
    "actualStartDate" TIMESTAMP(3),
    "actualEndDate" TIMESTAMP(3),
    "estimatedDuration" INTEGER,
    "actualDuration" INTEGER,
    "customerComplaint" TEXT,
    "serviceRequest" TEXT,
    "mechanicDiagnosis" TEXT,
    "mechanicRecommendation" TEXT,
    "serviceCost" DECIMAL(21,4) DEFAULT 0,
    "partsCost" DECIMAL(21,4) DEFAULT 0,
    "discountAmount" DECIMAL(21,4) DEFAULT 0,
    "taxAmount" DECIMAL(21,4) DEFAULT 0,
    "totalAmount" DECIMAL(21,4) DEFAULT 0,
    "orderStatus" "public"."ServiceOrderStatusEnum" NOT NULL DEFAULT '0',
    "paymentStatus" "public"."PaymentStatusEnum" DEFAULT '0',
    "priority" "public"."PriorityEnum" DEFAULT 'N',
    "qcCheckedBy" CHAR(10),
    "qcCheckedDate" TIMESTAMP(3),
    "qcNotes" TEXT,
    "qcApproved" BOOLEAN DEFAULT false,
    "customerRating" SMALLINT,
    "customerFeedback" TEXT,
    "customerSignature" VARCHAR(250),
    "transactionStatus" "public"."TransactionStatusEnum" NOT NULL DEFAULT 'E',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" CHAR(10),
    "remarks" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_wks_ServiceOrder" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."wks_ServiceOrderDetail" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(30) NOT NULL,
    "serviceOrder_id" CHAR(20) NOT NULL,
    "lineNumber" SMALLINT NOT NULL,
    "detailType" "public"."DetailTypeEnum" NOT NULL,
    "serviceType_id" CHAR(10),
    "serviceName" VARCHAR(100),
    "serviceDescription" TEXT,
    "product_id" CHAR(20),
    "productVariant_id" CHAR(30),
    "partName" VARCHAR(250),
    "partNumber" VARCHAR(50),
    "mechanic_id" CHAR(10),
    "quantity" DECIMAL(12,4) NOT NULL DEFAULT 1,
    "unitPrice" DECIMAL(21,4) NOT NULL,
    "discountPercent" DECIMAL(5,2) DEFAULT 0,
    "discountAmount" DECIMAL(21,4) DEFAULT 0,
    "taxPercent" DECIMAL(5,2) DEFAULT 0,
    "taxAmount" DECIMAL(21,4) DEFAULT 0,
    "subtotal" DECIMAL(21,4) NOT NULL,
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "duration" INTEGER,
    "detailStatus" "public"."DetailStatusEnum" DEFAULT '0',
    "transactionStatus" "public"."TransactionStatusEnum" NOT NULL DEFAULT 'E',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" CHAR(10),
    "remarks" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_wks_ServiceOrderDetail" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."wks_ServiceHistory" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(30) NOT NULL,
    "serviceOrder_id" CHAR(20) NOT NULL,
    "customer_id" CHAR(20) NOT NULL,
    "customerVehicle_id" CHAR(20) NOT NULL,
    "vehicle_customer_id" CHAR(20) NOT NULL,
    "serviceDate" TIMESTAMP(3) NOT NULL,
    "orderNumber" VARCHAR(30) NOT NULL,
    "serviceSummary" TEXT,
    "partsReplaced" TEXT,
    "odometerReading" INTEGER,
    "totalServiceCost" DECIMAL(21,4),
    "totalPartsCost" DECIMAL(21,4),
    "totalAmount" DECIMAL(21,4),
    "nextServiceDate" TIMESTAMP(3),
    "nextServiceOdometer" INTEGER,
    "mechanicName" VARCHAR(100),
    "customerRating" SMALLINT,
    "customerFeedback" TEXT,
    "transactionStatus" "public"."TransactionStatusEnum" NOT NULL DEFAULT 'E',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" CHAR(10),
    "remarks" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_wks_ServiceHistory" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."sys_Reminder" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(30) NOT NULL,
    "reminderNumber" VARCHAR(30) NOT NULL,
    "entityType" "public"."ReminderEntityTypeEnum" NOT NULL,
    "entity_id" CHAR(30) NOT NULL,
    "reminderType" "public"."ReminderTypeEnum" NOT NULL DEFAULT 'SCH',
    "title" VARCHAR(250) NOT NULL,
    "message" TEXT,
    "scheduledDate" TIMESTAMP(3),
    "scheduledTime" VARCHAR(10),
    "sendBeforeDays" SMALLINT,
    "sendBeforeHours" SMALLINT,
    "customer_id" CHAR(20),
    "recipientPhone" VARCHAR(20),
    "recipientEmail" VARCHAR(100),
    "channels" VARCHAR(50),
    "status" "public"."ReminderStatusEnum" NOT NULL DEFAULT 'P',
    "lastAttemptAt" TIMESTAMP(3),
    "lastSentAt" TIMESTAMP(3),
    "sentCount" SMALLINT NOT NULL DEFAULT 0,
    "maxRetries" SMALLINT NOT NULL DEFAULT 3,
    "retryCount" SMALLINT NOT NULL DEFAULT 0,
    "failureReason" VARCHAR(250),
    "isRead" BOOLEAN DEFAULT false,
    "readAt" TIMESTAMP(3),
    "actionTaken" BOOLEAN DEFAULT false,
    "actionTakenAt" TIMESTAMP(3),
    "actionNotes" TEXT,
    "metadata" JSONB,
    "isRecurring" BOOLEAN DEFAULT false,
    "recurringInterval" SMALLINT,
    "recurringEndDate" TIMESTAMP(3),
    "nextRecurringDate" TIMESTAMP(3),
    "parentReminder_id" CHAR(30),
    "transactionStatus" "public"."TransactionStatusEnum" NOT NULL DEFAULT 'E',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" CHAR(10),
    "remarks" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_sys_Reminder" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."sys_ReminderLog" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(30) NOT NULL,
    "reminder_id" CHAR(30) NOT NULL,
    "logType" "public"."ReminderLogTypeEnum" NOT NULL DEFAULT 'S',
    "channel" "public"."ReminderChannelEnum" NOT NULL,
    "sentAt" TIMESTAMP(3),
    "message" TEXT,
    "recipient" VARCHAR(100),
    "status" VARCHAR(50),
    "responseCode" VARCHAR(20),
    "responseMessage" TEXT,
    "errorMessage" TEXT,
    "externalId" VARCHAR(100),
    "transactionStatus" "public"."TransactionStatusEnum" NOT NULL DEFAULT 'E',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" CHAR(10),
    "remarks" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pk_sys_ReminderLog" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."wks_CustomerComplaint" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(30) NOT NULL,
    "complaintNumber" VARCHAR(30) NOT NULL,
    "complaintDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "serviceOrder_id" CHAR(20),
    "customer_id" CHAR(20) NOT NULL,
    "customerVehicle_id" CHAR(20),
    "vehicle_customer_id" CHAR(20),
    "complaintType" "public"."ComplaintTypeEnum",
    "complaintCategory" VARCHAR(50),
    "subject" VARCHAR(250) NOT NULL,
    "description" TEXT NOT NULL,
    "severity" "public"."SeverityEnum" DEFAULT 'M',
    "customerName" VARCHAR(100),
    "customerPhone" VARCHAR(20),
    "customerEmail" VARCHAR(100),
    "preferredContactMethod" VARCHAR(20),
    "complaintSource" "public"."ComplaintSourceEnum",
    "occurredDate" TIMESTAMP(3),
    "reportedBy" VARCHAR(100),
    "attachments" TEXT,
    "witnessName" VARCHAR(100),
    "witnessContact" VARCHAR(50),
    "assignedTo" CHAR(10),
    "assignedDate" TIMESTAMP(3),
    "department" VARCHAR(50),
    "investigationNotes" TEXT,
    "rootCause" TEXT,
    "resolutionDescription" TEXT,
    "resolutionDate" TIMESTAMP(3),
    "resolvedBy" CHAR(10),
    "compensationType" VARCHAR(50),
    "compensationAmount" DECIMAL(21,4),
    "compensationNotes" TEXT,
    "followUpRequired" BOOLEAN DEFAULT false,
    "followUpDate" TIMESTAMP(3),
    "followUpBy" CHAR(10),
    "followUpNotes" TEXT,
    "resolutionRating" SMALLINT,
    "customerFeedback" TEXT,
    "isSatisfied" BOOLEAN,
    "complaintStatus" "public"."ComplaintStatusEnum" NOT NULL DEFAULT '0',
    "priority" "public"."PriorityEnum" DEFAULT 'N',
    "targetResolutionDate" TIMESTAMP(3),
    "isOverdue" BOOLEAN DEFAULT false,
    "isEscalated" BOOLEAN DEFAULT false,
    "escalatedTo" CHAR(10),
    "escalatedDate" TIMESTAMP(3),
    "escalationReason" VARCHAR(250),
    "preventiveAction" TEXT,
    "implementedBy" CHAR(10),
    "implementedDate" TIMESTAMP(3),
    "transactionStatus" "public"."TransactionStatusEnum" NOT NULL DEFAULT 'E',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" CHAR(10),
    "remarks" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_cmf_CustomerComplaint" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."wks_ComplaintLog" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(30) NOT NULL,
    "complaint_id" CHAR(30) NOT NULL,
    "logDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "logType" "public"."ComplaintLogTypeEnum" NOT NULL,
    "oldStatus" "public"."ComplaintStatusEnum",
    "newStatus" "public"."ComplaintStatusEnum",
    "action" VARCHAR(100),
    "description" TEXT,
    "actionBy" CHAR(10),
    "isInternal" BOOLEAN DEFAULT false,
    "attachments" TEXT,
    "transactionStatus" "public"."TransactionStatusEnum" NOT NULL DEFAULT 'E',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" CHAR(10),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pk_wks_ComplaintLog" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."wks_ServiceRework" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(30) NOT NULL,
    "reworkNumber" VARCHAR(30) NOT NULL,
    "reworkDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "transaction_type" CHAR(5) NOT NULL,
    "transaction_class" CHAR(10) NOT NULL,
    "originalServiceOrder_id" CHAR(20) NOT NULL,
    "originalOrderNumber" VARCHAR(30),
    "complaint_id" CHAR(30),
    "customer_id" CHAR(20) NOT NULL,
    "customerVehicle_id" CHAR(20) NOT NULL,
    "vehicle_customer_id" CHAR(20) NOT NULL,
    "reworkReason" "public"."ReworkReasonEnum",
    "reworkReasonDesc" TEXT,
    "issueDescription" TEXT,
    "mechanic_id" CHAR(10),
    "serviceBay_id" CHAR(10),
    "scheduledDate" TIMESTAMP(3),
    "actualStartDate" TIMESTAMP(3),
    "actualEndDate" TIMESTAMP(3),
    "isWarrantyWork" BOOLEAN DEFAULT true,
    "isFreeService" BOOLEAN DEFAULT true,
    "chargeToCustomer" BOOLEAN DEFAULT false,
    "additionalCost" DECIMAL(21,4) DEFAULT 0,
    "qcCheckedBy" CHAR(10),
    "qcCheckedDate" TIMESTAMP(3),
    "qcApproved" BOOLEAN DEFAULT false,
    "customerRating" SMALLINT,
    "customerFeedback" TEXT,
    "isSatisfied" BOOLEAN,
    "reworkStatus" "public"."ReworkStatusEnum" NOT NULL DEFAULT '0',
    "notes" TEXT,
    "internalNotes" TEXT,
    "transactionStatus" "public"."TransactionStatusEnum" NOT NULL DEFAULT 'E',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" CHAR(10),
    "remarks" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_wks_ServiceRework" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."wks_ServiceReworkItem" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(30) NOT NULL,
    "serviceRework_id" CHAR(30) NOT NULL,
    "lineNumber" SMALLINT NOT NULL,
    "itemType" "public"."DetailTypeEnum" NOT NULL,
    "originalItem_id" CHAR(30),
    "serviceType_id" CHAR(10),
    "serviceName" VARCHAR(100),
    "serviceDescription" TEXT,
    "product_id" CHAR(20),
    "productVariant_id" CHAR(30),
    "partName" VARCHAR(250),
    "reworkAction" "public"."ReworkActionEnum",
    "actionDescription" TEXT,
    "quantity" DECIMAL(12,4) DEFAULT 0,
    "originalCost" DECIMAL(21,4) DEFAULT 0,
    "additionalCost" DECIMAL(21,4) DEFAULT 0,
    "itemStatus" "public"."DetailStatusEnum" DEFAULT '0',
    "transactionStatus" "public"."TransactionStatusEnum" NOT NULL DEFAULT 'E',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" CHAR(10),
    "remarks" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pk_wks_ServiceReworkItem" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."arm_CreditNote" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(30) NOT NULL,
    "creditNoteNumber" VARCHAR(30) NOT NULL,
    "creditNoteDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "transaction_type" CHAR(5) NOT NULL,
    "transaction_class" CHAR(10) NOT NULL,
    "source_module" VARCHAR(20),
    "invoice_id" CHAR(30),
    "invoiceNumber" VARCHAR(30),
    "serviceOrder_id" CHAR(20),
    "complaint_id" CHAR(30),
    "serviceRework_id" CHAR(30),
    "customer_id" CHAR(20) NOT NULL,
    "customerName" VARCHAR(100) NOT NULL,
    "customerVehicle_id" CHAR(20),
    "vehicle_customer_id" CHAR(20),
    "vehicleInfo" VARCHAR(250),
    "creditReason" "public"."CreditReasonEnum",
    "creditReasonDesc" TEXT,
    "originalAmount" DECIMAL(21,4),
    "creditAmount" DECIMAL(21,4) NOT NULL,
    "taxAmount" DECIMAL(21,4) DEFAULT 0,
    "totalCreditAmount" DECIMAL(21,4) NOT NULL,
    "refundMethod" "public"."RefundMethodEnum",
    "refundBankAccount_id" CHAR(10),
    "refundReferenceNumber" VARCHAR(50),
    "refundDate" TIMESTAMP(3),
    "approvedBy" CHAR(10),
    "approvedDate" TIMESTAMP(3),
    "approvalNotes" TEXT,
    "creditNoteStatus" "public"."CreditNoteStatusEnum" NOT NULL DEFAULT '0',
    "isPosted" BOOLEAN DEFAULT false,
    "postedDate" TIMESTAMP(3),
    "isRefunded" BOOLEAN DEFAULT false,
    "notes" TEXT,
    "internalNotes" TEXT,
    "transactionStatus" "public"."TransactionStatusEnum" NOT NULL DEFAULT 'E',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" CHAR(10),
    "remarks" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_arm_CreditNote" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."arm_CreditNoteDetail" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(30) NOT NULL,
    "creditNote_id" CHAR(30) NOT NULL,
    "lineNumber" SMALLINT NOT NULL,
    "itemType" "public"."InvoiceItemTypeEnum" NOT NULL,
    "item_id" CHAR(30),
    "itemCode" VARCHAR(50),
    "itemName" VARCHAR(250) NOT NULL,
    "description" TEXT,
    "originalQuantity" DECIMAL(12,4),
    "originalUnitPrice" DECIMAL(21,4),
    "originalAmount" DECIMAL(21,4),
    "creditQuantity" DECIMAL(12,4),
    "creditUnitPrice" DECIMAL(21,4),
    "creditAmount" DECIMAL(21,4) NOT NULL,
    "taxAmount" DECIMAL(21,4) DEFAULT 0,
    "totalCredit" DECIMAL(21,4) NOT NULL,
    "creditReason" VARCHAR(250),
    "transactionStatus" "public"."TransactionStatusEnum" NOT NULL DEFAULT 'E',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" CHAR(10),
    "remarks" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pk_arm_CreditNoteDetail" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."prc_Supplier" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(20) NOT NULL,
    "supplierCode" CHAR(20),
    "supplierType" "public"."SupplierTypeEnum" NOT NULL DEFAULT 'V',
    "name" VARCHAR(150) NOT NULL,
    "legalName" VARCHAR(150),
    "nickname" VARCHAR(50),
    "contactPerson" VARCHAR(100),
    "contactPosition" VARCHAR(50),
    "phone1" VARCHAR(20),
    "phone2" VARCHAR(20),
    "mobile1" VARCHAR(20),
    "mobile2" VARCHAR(20),
    "email" VARCHAR(100),
    "website" VARCHAR(100),
    "province" VARCHAR(50),
    "district" VARCHAR(50),
    "city" VARCHAR(50),
    "subDistrict" VARCHAR(50),
    "address1" VARCHAR(250),
    "address2" VARCHAR(250),
    "postalCode" CHAR(6),
    "taxNumber" VARCHAR(30),
    "taxName" VARCHAR(150),
    "taxAddress" VARCHAR(250),
    "bankName" VARCHAR(50),
    "bankBranch" VARCHAR(50),
    "accountNumber" VARCHAR(30),
    "accountName" VARCHAR(100),
    "paymentTermDays" SMALLINT DEFAULT 30,
    "creditLimit" DECIMAL(21,4),
    "currentDebt" DECIMAL(21,4) DEFAULT 0,
    "supplierRating" DECIMAL(3,2),
    "totalPurchase" DECIMAL(21,4) DEFAULT 0,
    "totalTransaction" INTEGER DEFAULT 0,
    "lastPurchaseDate" TIMESTAMP(3),
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "isPreferred" BOOLEAN DEFAULT false,
    "isBlacklisted" BOOLEAN DEFAULT false,
    "blacklistReason" VARCHAR(250),
    "remarks" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_prc_Supplier" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."prc_PurchaseOrder" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(20) NOT NULL,
    "poNumber" VARCHAR(30) NOT NULL,
    "poDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "supplier_id" CHAR(20) NOT NULL,
    "requisitionNumber" VARCHAR(30),
    "quotationNumber" VARCHAR(30),
    "requestedDeliveryDate" DATE,
    "expectedDeliveryDate" DATE,
    "warehouse_id" CHAR(4),
    "deliveryAddress" VARCHAR(250),
    "buyerName" VARCHAR(100),
    "supplierContactPerson" VARCHAR(100),
    "supplierPhone" VARCHAR(20),
    "paymentTermDays" SMALLINT,
    "paymentMethod" VARCHAR(30),
    "downPaymentPercent" DECIMAL(5,2) DEFAULT 0,
    "downPaymentAmount" DECIMAL(21,4) DEFAULT 0,
    "subtotalAmount" DECIMAL(21,4) DEFAULT 0,
    "discountPercent" DECIMAL(5,2) DEFAULT 0,
    "discountAmount" DECIMAL(21,4) DEFAULT 0,
    "taxPercent" DECIMAL(5,2) DEFAULT 0,
    "taxAmount" DECIMAL(21,4) DEFAULT 0,
    "shippingCost" DECIMAL(21,4) DEFAULT 0,
    "otherCost" DECIMAL(21,4) DEFAULT 0,
    "totalAmount" DECIMAL(21,4) DEFAULT 0,
    "poStatus" "public"."PurchaseOrderStatusEnum" NOT NULL DEFAULT '0',
    "approvalStatus" "public"."ApprovalStatusEnum" DEFAULT '0',
    "receiveStatus" "public"."ReceiveStatusEnum" DEFAULT '0',
    "paymentStatus" "public"."PaymentStatusEnum" DEFAULT '0',
    "approvedBy" CHAR(10),
    "approvedDate" TIMESTAMP(3),
    "approvalNotes" TEXT,
    "cancelledBy" CHAR(10),
    "cancelledDate" TIMESTAMP(3),
    "cancelReason" VARCHAR(250),
    "notes" TEXT,
    "internalNotes" TEXT,
    "transactionStatus" "public"."TransactionStatusEnum" NOT NULL DEFAULT 'E',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" CHAR(10),
    "remarks" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_prc_PurchaseOrder" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."prc_PurchaseOrderDetail" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(30) NOT NULL,
    "purchaseOrder_id" CHAR(20) NOT NULL,
    "lineNumber" SMALLINT NOT NULL,
    "product_id" CHAR(20) NOT NULL,
    "productVariant_id" CHAR(30),
    "productName" VARCHAR(250) NOT NULL,
    "productCode" VARCHAR(50),
    "productDescription" TEXT,
    "supplierPartNumber" VARCHAR(50),
    "supplierProductName" VARCHAR(250),
    "orderedQty" DECIMAL(12,4) NOT NULL,
    "receivedQty" DECIMAL(12,4) DEFAULT 0,
    "outstandingQty" DECIMAL(12,4),
    "uom" VARCHAR(10) NOT NULL,
    "unitPrice" DECIMAL(21,4) NOT NULL,
    "discountPercent" DECIMAL(5,2) DEFAULT 0,
    "discountAmount" DECIMAL(21,4) DEFAULT 0,
    "taxPercent" DECIMAL(5,2) DEFAULT 0,
    "taxAmount" DECIMAL(21,4) DEFAULT 0,
    "subtotal" DECIMAL(21,4) NOT NULL,
    "requestedDate" DATE,
    "expectedDate" DATE,
    "lineStatus" "public"."PODetailStatusEnum" DEFAULT '0',
    "transactionStatus" "public"."TransactionStatusEnum" NOT NULL DEFAULT 'E',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" CHAR(10),
    "remarks" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_prc_PurchaseOrderDetail" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."prc_PurchaseReceive" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(20) NOT NULL,
    "receiveNumber" VARCHAR(30) NOT NULL,
    "receiveDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "purchaseOrder_id" CHAR(20) NOT NULL,
    "supplier_id" CHAR(20) NOT NULL,
    "supplierInvoiceNumber" VARCHAR(30),
    "supplierInvoiceDate" DATE,
    "deliveryNoteNumber" VARCHAR(30),
    "warehouse_id" CHAR(4),
    "receivedBy" CHAR(10),
    "vehicleNumber" VARCHAR(15),
    "driverName" VARCHAR(100),
    "driverPhone" VARCHAR(20),
    "inspectedBy" CHAR(10),
    "inspectionDate" TIMESTAMP(3),
    "inspectionNotes" TEXT,
    "qualityStatus" "public"."QualityStatusEnum" DEFAULT '0',
    "subtotalAmount" DECIMAL(21,4) DEFAULT 0,
    "discountAmount" DECIMAL(21,4) DEFAULT 0,
    "taxAmount" DECIMAL(21,4) DEFAULT 0,
    "shippingCost" DECIMAL(21,4) DEFAULT 0,
    "otherCost" DECIMAL(21,4) DEFAULT 0,
    "totalAmount" DECIMAL(21,4) DEFAULT 0,
    "receiveStatus" "public"."ReceiveStatusEnum" NOT NULL DEFAULT '1',
    "postingStatus" "public"."PostingStatusEnum" DEFAULT '0',
    "postedBy" CHAR(10),
    "postedDate" TIMESTAMP(3),
    "hasReturn" BOOLEAN DEFAULT false,
    "returnReason" VARCHAR(250),
    "notes" TEXT,
    "internalNotes" TEXT,
    "transactionStatus" "public"."TransactionStatusEnum" NOT NULL DEFAULT 'E',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" CHAR(10),
    "remarks" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_prc_PurchaseReceive" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."prc_PurchaseReceiveDetail" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(30) NOT NULL,
    "purchaseReceive_id" CHAR(20) NOT NULL,
    "purchaseOrderDetail_id" CHAR(30) NOT NULL,
    "lineNumber" SMALLINT NOT NULL,
    "product_id" CHAR(20) NOT NULL,
    "productVariant_id" CHAR(30),
    "productName" VARCHAR(250) NOT NULL,
    "productCode" VARCHAR(50),
    "orderedQty" DECIMAL(12,4) NOT NULL,
    "receivedQty" DECIMAL(12,4) NOT NULL,
    "acceptedQty" DECIMAL(12,4),
    "rejectedQty" DECIMAL(12,4) DEFAULT 0,
    "damagedQty" DECIMAL(12,4) DEFAULT 0,
    "uom" VARCHAR(10) NOT NULL,
    "warehouse_id" CHAR(4),
    "floor_id" CHAR(5),
    "shelf_id" CHAR(15),
    "row_id" CHAR(15),
    "batchNumber" VARCHAR(30),
    "manufactureDate" DATE,
    "expiryDate" DATE,
    "unitPrice" DECIMAL(21,4) NOT NULL,
    "discountAmount" DECIMAL(21,4) DEFAULT 0,
    "taxAmount" DECIMAL(21,4) DEFAULT 0,
    "subtotal" DECIMAL(21,4) NOT NULL,
    "qualityStatus" "public"."QualityStatusEnum" DEFAULT '0',
    "rejectionReason" VARCHAR(250),
    "qualityNotes" TEXT,
    "lineStatus" "public"."ReceiveDetailStatusEnum" DEFAULT '0',
    "transactionStatus" "public"."TransactionStatusEnum" NOT NULL DEFAULT 'E',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" CHAR(10),
    "remarks" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_prc_PurchaseReceiveDetail" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."inv_InternalMovement" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(30) NOT NULL,
    "movementNumber" VARCHAR(30) NOT NULL,
    "movementDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "movementType" "public"."InternalMovementTypeEnum" NOT NULL,
    "transactionType" "public"."TransactionTypeEnum" NOT NULL,
    "sourceWarehouse_id" CHAR(4),
    "destWarehouse_id" CHAR(4),
    "sourceLocation" VARCHAR(100),
    "destLocation" VARCHAR(100),
    "referenceNumber" VARCHAR(30),
    "referenceType" VARCHAR(20),
    "requestedBy" CHAR(10),
    "requestDate" TIMESTAMP(3),
    "approvedBy" CHAR(10),
    "approvedDate" TIMESTAMP(3),
    "executedBy" CHAR(10),
    "executedDate" TIMESTAMP(3),
    "vehicleNumber" VARCHAR(15),
    "driverName" VARCHAR(100),
    "movementStatus" "public"."MovementStatusEnum" NOT NULL DEFAULT '0',
    "postingStatus" "public"."PostingStatusEnum" DEFAULT '0',
    "postedBy" CHAR(10),
    "postedDate" TIMESTAMP(3),
    "reason" TEXT,
    "notes" TEXT,
    "internalNotes" TEXT,
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "remarks" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_inv_InternalMovement" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."inv_InternalMovementDetail" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(30) NOT NULL,
    "internalMovement_id" CHAR(30) NOT NULL,
    "lineNumber" SMALLINT NOT NULL,
    "product_id" CHAR(20) NOT NULL,
    "productVariant_id" CHAR(30),
    "productName" VARCHAR(250) NOT NULL,
    "productCode" VARCHAR(50),
    "requestedQty" DECIMAL(12,4) NOT NULL,
    "movedQty" DECIMAL(12,4) NOT NULL,
    "receivedQty" DECIMAL(12,4) DEFAULT 0,
    "uom" VARCHAR(10) NOT NULL,
    "sourceWarehouse_id" CHAR(4),
    "sourceFloor_id" CHAR(5),
    "sourceShelf_id" CHAR(15),
    "sourceRow_id" CHAR(15),
    "destWarehouse_id" CHAR(4),
    "destFloor_id" CHAR(5),
    "destShelf_id" CHAR(15),
    "destRow_id" CHAR(15),
    "batchNumber" VARCHAR(30),
    "serialNumber" VARCHAR(50),
    "expiryDate" DATE,
    "unitCost" DECIMAL(21,4),
    "totalCost" DECIMAL(21,4),
    "adjustmentValue" DECIMAL(21,4),
    "lineStatus" "public"."MovementDetailStatusEnum" DEFAULT '0',
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "remarks" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_inv_InternalMovementDetail" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."cmf_TransactionType" (
    "id" CHAR(5) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "category" VARCHAR(20),
    "module" VARCHAR(20),
    "affectGL" BOOLEAN NOT NULL DEFAULT true,
    "requireApproval" BOOLEAN NOT NULL DEFAULT false,
    "seq" INTEGER DEFAULT 0,
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "remarks" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_cmf_TransactionType" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cmf_TransactionClass" (
    "id" CHAR(10) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "seq" INTEGER DEFAULT 0,
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "remarks" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_cmf_TransactionClass" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cmf_PaymentMethod" (
    "id" CHAR(10) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "methodType" "public"."PaymentMethodTypeEnum",
    "requireBankAccount" BOOLEAN NOT NULL DEFAULT false,
    "requireReference" BOOLEAN NOT NULL DEFAULT false,
    "processingFee" DECIMAL(5,2),
    "fixedFee" DECIMAL(21,4),
    "seq" INTEGER DEFAULT 0,
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "remarks" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_cmf_PaymentMethod" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."acc_COA" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(15) NOT NULL,
    "accountCode" VARCHAR(20) NOT NULL,
    "accountName" VARCHAR(150) NOT NULL,
    "accountName_en" VARCHAR(150),
    "accountType" "public"."COATypeEnum" NOT NULL,
    "accountGroup" VARCHAR(50),
    "normalBalance" "public"."BalanceTypeEnum" NOT NULL,
    "parent_id" CHAR(15),
    "level" SMALLINT NOT NULL,
    "isHeader" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isCash" BOOLEAN NOT NULL DEFAULT false,
    "isBank" BOOLEAN NOT NULL DEFAULT false,
    "isAP" BOOLEAN NOT NULL DEFAULT false,
    "isAR" BOOLEAN NOT NULL DEFAULT false,
    "isInventory" BOOLEAN NOT NULL DEFAULT false,
    "openingBalance" DECIMAL(21,4) DEFAULT 0,
    "openingBalanceDate" DATE,
    "currentDebit" DECIMAL(21,4) DEFAULT 0,
    "currentCredit" DECIMAL(21,4) DEFAULT 0,
    "currentBalance" DECIMAL(21,4) DEFAULT 0,
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "remarks" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_acc_COA" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."acc_BankAccount" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(10) NOT NULL,
    "coa_id" CHAR(15) NOT NULL,
    "bankName" VARCHAR(100) NOT NULL,
    "branchName" VARCHAR(100),
    "accountNumber" VARCHAR(30) NOT NULL,
    "accountName" VARCHAR(100) NOT NULL,
    "currency" CHAR(3) NOT NULL DEFAULT 'IDR',
    "swiftCode" VARCHAR(20),
    "openingBalance" DECIMAL(21,4) DEFAULT 0,
    "currentBalance" DECIMAL(21,4) DEFAULT 0,
    "isDefault" BOOLEAN DEFAULT false,
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "remarks" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_acc_BankAccount" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."cmf_TaxScheme" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(5) NOT NULL,
    "schemeCode" VARCHAR(10) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "taxType" "public"."TaxTypeEnum" NOT NULL,
    "category" VARCHAR(50),
    "isInclusive" BOOLEAN NOT NULL DEFAULT false,
    "defaultRate" DECIMAL(5,2) NOT NULL,
    "isCompound" BOOLEAN NOT NULL DEFAULT false,
    "taxAccount_id" CHAR(15),
    "isDefault" BOOLEAN DEFAULT false,
    "effectiveFrom" DATE,
    "effectiveTo" DATE,
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "remarks" VARCHAR(250),
    "seq" INTEGER DEFAULT 0,
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_cmf_TaxScheme" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."cmf_TaxSchemeDetail" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(10) NOT NULL,
    "taxScheme_id" CHAR(5) NOT NULL,
    "lineNumber" SMALLINT NOT NULL,
    "componentName" VARCHAR(100) NOT NULL,
    "componentName_en" VARCHAR(100),
    "taxRate" DECIMAL(5,2) NOT NULL,
    "taxAccount_id" CHAR(15) NOT NULL,
    "calculationBase" VARCHAR(20),
    "isAdditive" BOOLEAN NOT NULL DEFAULT true,
    "seq" SMALLINT NOT NULL,
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "remarks" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_cmf_TaxSchemeDetail" PRIMARY KEY ("company_id","taxScheme_id","id")
);

-- CreateTable
CREATE TABLE "public"."arm_Invoice" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(30) NOT NULL,
    "invoiceNumber" VARCHAR(30) NOT NULL,
    "invoiceDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" DATE,
    "transaction_type" CHAR(5) NOT NULL,
    "transaction_class" CHAR(10) NOT NULL,
    "taxScheme_id" CHAR(5),
    "source_module" VARCHAR(20),
    "source_document_id" CHAR(30),
    "source_document_number" VARCHAR(30),
    "customer_id" CHAR(20) NOT NULL,
    "customerName" VARCHAR(100) NOT NULL,
    "customerAddress" TEXT,
    "customerPhone" VARCHAR(20),
    "customerEmail" VARCHAR(100),
    "customerVehicle_id" CHAR(20),
    "vehicle_customer_id" CHAR(20),
    "vehicleInfo" VARCHAR(250),
    "subtotalAmount" DECIMAL(21,4) NOT NULL DEFAULT 0,
    "discountPercent" DECIMAL(5,2) DEFAULT 0,
    "discountAmount" DECIMAL(21,4) DEFAULT 0,
    "taxPercent" DECIMAL(5,2) DEFAULT 0,
    "taxAmount" DECIMAL(21,4) DEFAULT 0,
    "otherCharges" DECIMAL(21,4) DEFAULT 0,
    "totalAmount" DECIMAL(21,4) NOT NULL,
    "paidAmount" DECIMAL(21,4) DEFAULT 0,
    "outstandingAmount" DECIMAL(21,4),
    "paymentTermDays" SMALLINT,
    "invoiceStatus" "public"."InvoiceStatusEnum" NOT NULL DEFAULT '0',
    "paymentStatus" "public"."InvoicePaymentStatusEnum" NOT NULL DEFAULT '0',
    "isPosted" BOOLEAN DEFAULT false,
    "postedDate" TIMESTAMP(3),
    "notes" TEXT,
    "internalNotes" TEXT,
    "transactionStatus" "public"."TransactionStatusEnum" NOT NULL DEFAULT 'E',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" CHAR(10),
    "remarks" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_arm_Invoice" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."arm_InvoiceDetail" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(30) NOT NULL,
    "invoice_id" CHAR(30) NOT NULL,
    "lineNumber" SMALLINT NOT NULL,
    "itemType" "public"."InvoiceItemTypeEnum" NOT NULL,
    "item_id" CHAR(30),
    "itemCode" VARCHAR(50),
    "itemName" VARCHAR(250) NOT NULL,
    "itemDescription" TEXT,
    "quantity" DECIMAL(12,4) NOT NULL,
    "uom" VARCHAR(10),
    "unitPrice" DECIMAL(21,4) NOT NULL,
    "discountPercent" DECIMAL(5,2) DEFAULT 0,
    "discountAmount" DECIMAL(21,4) DEFAULT 0,
    "taxPercent" DECIMAL(5,2) DEFAULT 0,
    "taxAmount" DECIMAL(21,4) DEFAULT 0,
    "subtotal" DECIMAL(21,4) NOT NULL,
    "revenue_coa_id" CHAR(15),
    "transactionStatus" "public"."TransactionStatusEnum" NOT NULL DEFAULT 'E',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" CHAR(10),
    "remarks" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_arm_InvoiceDetail" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."arm_Payment" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(30) NOT NULL,
    "paymentNumber" VARCHAR(30) NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "transaction_type" CHAR(5) NOT NULL,
    "transaction_class" CHAR(10) NOT NULL,
    "invoice_id" CHAR(30) NOT NULL,
    "invoiceNumber" VARCHAR(30),
    "customer_id" CHAR(20) NOT NULL,
    "customerName" VARCHAR(100),
    "paymentMethod_id" CHAR(10) NOT NULL,
    "bankAccount_id" CHAR(10),
    "referenceNumber" VARCHAR(50),
    "paymentAmount" DECIMAL(21,4) NOT NULL,
    "processingFee" DECIMAL(21,4) DEFAULT 0,
    "netAmount" DECIMAL(21,4) NOT NULL,
    "paymentStatus" "public"."PaymentConfirmStatusEnum" NOT NULL DEFAULT '0',
    "verifiedBy" CHAR(10),
    "verifiedDate" TIMESTAMP(3),
    "isPosted" BOOLEAN DEFAULT false,
    "postedDate" TIMESTAMP(3),
    "notes" TEXT,
    "internalNotes" TEXT,
    "proofImageURL" VARCHAR(250),
    "transactionStatus" "public"."TransactionStatusEnum" NOT NULL DEFAULT 'E',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" CHAR(10),
    "remarks" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_arm_Payment" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."arm_PaymentDetail" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(30) NOT NULL,
    "payment_id" CHAR(30) NOT NULL,
    "lineNumber" SMALLINT NOT NULL,
    "description" VARCHAR(250),
    "paymentMethod_id" CHAR(10) NOT NULL,
    "amount" DECIMAL(21,4) NOT NULL,
    "referenceNumber" VARCHAR(50),
    "transactionStatus" "public"."TransactionStatusEnum" NOT NULL DEFAULT 'E',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" CHAR(10),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pk_arm_PaymentDetail" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."arm_CashReceipt" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(30) NOT NULL,
    "receiptNumber" VARCHAR(30) NOT NULL,
    "receiptDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "transaction_type" CHAR(5) NOT NULL,
    "transaction_class" CHAR(10) NOT NULL,
    "receivedFrom" VARCHAR(150) NOT NULL,
    "receivedFromType" VARCHAR(20),
    "receivedFrom_id" CHAR(20),
    "totalAmount" DECIMAL(21,4) NOT NULL,
    "receiptStatus" "public"."CashReceiptStatusEnum" NOT NULL DEFAULT '0',
    "isPosted" BOOLEAN DEFAULT false,
    "postedDate" TIMESTAMP(3),
    "description" TEXT,
    "notes" TEXT,
    "transactionStatus" "public"."TransactionStatusEnum" NOT NULL DEFAULT 'E',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" CHAR(10),
    "remarks" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_arm_CashReceipt" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."arm_CashReceiptDetail" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(30) NOT NULL,
    "cashReceipt_id" CHAR(30) NOT NULL,
    "lineNumber" SMALLINT NOT NULL,
    "coa_id" CHAR(15) NOT NULL,
    "description" VARCHAR(250),
    "amount" DECIMAL(21,4) NOT NULL,
    "transactionStatus" "public"."TransactionStatusEnum" NOT NULL DEFAULT 'E',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" CHAR(10),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pk_arm_CashReceiptDetail" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."apm_Invoice" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(30) NOT NULL,
    "invoiceNumber" VARCHAR(30) NOT NULL,
    "invoiceDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" DATE,
    "transaction_type" CHAR(5) NOT NULL,
    "transaction_class" CHAR(10) NOT NULL,
    "taxScheme_id" CHAR(5),
    "source_module" VARCHAR(20),
    "purchaseReceive_id" CHAR(20),
    "purchaseOrder_id" CHAR(20),
    "receiveNumber" VARCHAR(30),
    "poNumber" VARCHAR(30),
    "supplier_id" CHAR(20) NOT NULL,
    "supplierName" VARCHAR(150) NOT NULL,
    "supplierAddress" TEXT,
    "supplierPhone" VARCHAR(20),
    "supplierEmail" VARCHAR(100),
    "supplierInvoiceNumber" VARCHAR(30),
    "supplierInvoiceDate" DATE,
    "taxInvoiceNumber" VARCHAR(30),
    "subtotalAmount" DECIMAL(21,4) NOT NULL DEFAULT 0,
    "discountPercent" DECIMAL(5,2) DEFAULT 0,
    "discountAmount" DECIMAL(21,4) DEFAULT 0,
    "taxPercent" DECIMAL(5,2) DEFAULT 0,
    "taxAmount" DECIMAL(21,4) DEFAULT 0,
    "shippingCost" DECIMAL(21,4) DEFAULT 0,
    "otherCharges" DECIMAL(21,4) DEFAULT 0,
    "totalAmount" DECIMAL(21,4) NOT NULL,
    "paidAmount" DECIMAL(21,4) DEFAULT 0,
    "outstandingAmount" DECIMAL(21,4),
    "paymentTermDays" SMALLINT,
    "paymentDueDate" DATE,
    "invoiceStatus" "public"."APInvoiceStatusEnum" NOT NULL DEFAULT '0',
    "paymentStatus" "public"."APPaymentStatusEnum" NOT NULL DEFAULT '0',
    "isPosted" BOOLEAN DEFAULT false,
    "postedDate" TIMESTAMP(3),
    "notes" TEXT,
    "internalNotes" TEXT,
    "transactionStatus" "public"."TransactionStatusEnum" NOT NULL DEFAULT 'E',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" CHAR(10),
    "remarks" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_apm_Invoice" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."apm_InvoiceDetail" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(30) NOT NULL,
    "apInvoice_id" CHAR(30) NOT NULL,
    "lineNumber" SMALLINT NOT NULL,
    "product_id" CHAR(20),
    "productVariant_id" CHAR(30),
    "productName" VARCHAR(250) NOT NULL,
    "productCode" VARCHAR(50),
    "description" TEXT,
    "quantity" DECIMAL(12,4) NOT NULL,
    "uom" VARCHAR(10),
    "unitPrice" DECIMAL(21,4) NOT NULL,
    "discountPercent" DECIMAL(5,2) DEFAULT 0,
    "discountAmount" DECIMAL(21,4) DEFAULT 0,
    "taxPercent" DECIMAL(5,2) DEFAULT 0,
    "taxAmount" DECIMAL(21,4) DEFAULT 0,
    "subtotal" DECIMAL(21,4) NOT NULL,
    "expense_coa_id" CHAR(15),
    "transactionStatus" "public"."TransactionStatusEnum" NOT NULL DEFAULT 'E',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" CHAR(10),
    "remarks" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_apm_InvoiceDetail" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."apm_Payment" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(30) NOT NULL,
    "paymentNumber" VARCHAR(30) NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "transaction_type" CHAR(5) NOT NULL,
    "transaction_class" CHAR(10) NOT NULL,
    "apInvoice_id" CHAR(30) NOT NULL,
    "invoiceNumber" VARCHAR(30),
    "supplier_id" CHAR(20) NOT NULL,
    "supplierName" VARCHAR(150),
    "paymentMethod_id" CHAR(10) NOT NULL,
    "bankAccount_id" CHAR(10),
    "referenceNumber" VARCHAR(50),
    "paymentAmount" DECIMAL(21,4) NOT NULL,
    "processingFee" DECIMAL(21,4) DEFAULT 0,
    "netAmount" DECIMAL(21,4) NOT NULL,
    "paymentStatus" "public"."APPaymentConfirmStatusEnum" NOT NULL DEFAULT '0',
    "verifiedBy" CHAR(10),
    "verifiedDate" TIMESTAMP(3),
    "isPosted" BOOLEAN DEFAULT false,
    "postedDate" TIMESTAMP(3),
    "notes" TEXT,
    "internalNotes" TEXT,
    "proofImageURL" VARCHAR(250),
    "transactionStatus" "public"."TransactionStatusEnum" NOT NULL DEFAULT 'E',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" CHAR(10),
    "remarks" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_apm_Payment" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."apm_PaymentDetail" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(30) NOT NULL,
    "apPayment_id" CHAR(30) NOT NULL,
    "lineNumber" SMALLINT NOT NULL,
    "description" VARCHAR(250),
    "paymentMethod_id" CHAR(10) NOT NULL,
    "amount" DECIMAL(21,4) NOT NULL,
    "referenceNumber" VARCHAR(50),
    "transactionStatus" "public"."TransactionStatusEnum" NOT NULL DEFAULT 'E',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" CHAR(10),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pk_apm_PaymentDetail" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."prc_PurchaseReturn" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(30) NOT NULL,
    "returnNumber" VARCHAR(30) NOT NULL,
    "returnDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "transaction_type" CHAR(5) NOT NULL,
    "transaction_class" CHAR(10) NOT NULL,
    "purchaseReceive_id" CHAR(20) NOT NULL,
    "purchaseOrder_id" CHAR(20),
    "supplier_id" CHAR(20) NOT NULL,
    "receiveNumber" VARCHAR(30),
    "poNumber" VARCHAR(30),
    "supplierReturnNumber" VARCHAR(30),
    "returnReason" "public"."ReturnReasonEnum",
    "returnReasonDesc" TEXT,
    "warehouse_id" CHAR(4),
    "subtotalAmount" DECIMAL(21,4) NOT NULL DEFAULT 0,
    "taxAmount" DECIMAL(21,4) DEFAULT 0,
    "totalAmount" DECIMAL(21,4) NOT NULL,
    "returnStatus" "public"."ReturnStatusEnum" NOT NULL DEFAULT '0',
    "approvalStatus" "public"."ApprovalStatusEnum" DEFAULT '0',
    "approvedBy" CHAR(10),
    "approvedDate" TIMESTAMP(3),
    "isPosted" BOOLEAN DEFAULT false,
    "postedDate" TIMESTAMP(3),
    "notes" TEXT,
    "internalNotes" TEXT,
    "transactionStatus" "public"."TransactionStatusEnum" NOT NULL DEFAULT 'E',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" CHAR(10),
    "remarks" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_prc_PurchaseReturn" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."prc_PurchaseReturnDetail" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(30) NOT NULL,
    "purchaseReturn_id" CHAR(30) NOT NULL,
    "lineNumber" SMALLINT NOT NULL,
    "product_id" CHAR(20) NOT NULL,
    "productVariant_id" CHAR(30),
    "productName" VARCHAR(250) NOT NULL,
    "productCode" VARCHAR(50),
    "returnedQty" DECIMAL(12,4) NOT NULL,
    "acceptedQty" DECIMAL(12,4),
    "rejectedQty" DECIMAL(12,4) DEFAULT 0,
    "uom" VARCHAR(10) NOT NULL,
    "unitPrice" DECIMAL(21,4) NOT NULL,
    "discountAmount" DECIMAL(21,4) DEFAULT 0,
    "taxAmount" DECIMAL(21,4) DEFAULT 0,
    "subtotal" DECIMAL(21,4) NOT NULL,
    "returnReason" VARCHAR(250),
    "warehouse_id" CHAR(4),
    "floor_id" CHAR(5),
    "shelf_id" CHAR(15),
    "row_id" CHAR(15),
    "batchNumber" VARCHAR(30),
    "lineStatus" "public"."ReturnDetailStatusEnum" DEFAULT '0',
    "transactionStatus" "public"."TransactionStatusEnum" NOT NULL DEFAULT 'E',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" CHAR(10),
    "remarks" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_prc_PurchaseReturnDetail" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."acc_GLTrans" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(30) NOT NULL,
    "journalNumber" VARCHAR(30) NOT NULL,
    "journalDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "transaction_type" CHAR(5) NOT NULL,
    "transaction_class" CHAR(10) NOT NULL,
    "source_module" VARCHAR(20),
    "source_document_id" CHAR(30),
    "source_document_number" VARCHAR(30),
    "invoice_id" CHAR(30),
    "payment_id" CHAR(30),
    "cashReceipt_id" CHAR(30),
    "apInvoice_id" CHAR(30),
    "apPayment_id" CHAR(30),
    "purchaseOrder_id" CHAR(20),
    "purchaseReturn_id" CHAR(30),
    "creditNote_id" CHAR(30),
    "description" VARCHAR(250) NOT NULL,
    "notes" TEXT,
    "totalDebit" DECIMAL(21,4) NOT NULL DEFAULT 0,
    "totalCredit" DECIMAL(21,4) NOT NULL DEFAULT 0,
    "journalStatus" "public"."JournalStatusEnum" NOT NULL DEFAULT '0',
    "isPosted" BOOLEAN DEFAULT false,
    "postedBy" CHAR(10),
    "postedDate" TIMESTAMP(3),
    "isReversed" BOOLEAN DEFAULT false,
    "reversedBy" CHAR(10),
    "reversedDate" TIMESTAMP(3),
    "reversalJournal_id" CHAR(30),
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "remarks" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pk_acc_GLTrans" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."acc_GLTransDetail" (
    "company_id" CHAR(10) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "id" CHAR(30) NOT NULL,
    "glTrans_id" CHAR(30) NOT NULL,
    "lineNumber" SMALLINT NOT NULL,
    "coa_id" CHAR(15) NOT NULL,
    "description" VARCHAR(250),
    "debitAmount" DECIMAL(21,4) DEFAULT 0,
    "creditAmount" DECIMAL(21,4) DEFAULT 0,
    "costCenter" VARCHAR(20),
    "department" VARCHAR(20),
    "project" VARCHAR(20),
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pk_acc_GLTransDetail" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."tmp_sys_Company" (
    "seq_no" SMALLINT NOT NULL,
    "id" CHAR(5) NOT NULL,
    "name" VARCHAR(50),
    "logo" VARCHAR(255),
    "isMain" BOOLEAN DEFAULT false,
    "email1" VARCHAR(100),
    "email2" VARCHAR(100),
    "email3" VARCHAR(100),
    "officialWebsite" VARCHAR(100),
    "companyLogo" VARCHAR(255),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tmp_sys_Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tmp_sys_Branch" (
    "company_id" CHAR(10) NOT NULL,
    "id" CHAR(10) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "isMain" BOOLEAN DEFAULT false,
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

    CONSTRAINT "tmp_sys_Branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."wks_waitingList" (
    "id" CHAR(10) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "specialization" "public"."wks_specializationEnum" NOT NULL DEFAULT 'MC',
    "logo" VARCHAR(255),
    "address" VARCHAR(250) NOT NULL,
    "province" CHAR(5) NOT NULL,
    "city" CHAR(15) NOT NULL,
    "district" CHAR(15) NOT NULL,
    "subdistrict" CHAR(20) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "mobile" VARCHAR(20) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" CHAR(10),
    "updatedBy" CHAR(10),

    CONSTRAINT "wks_waitingList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tmp_customer" (
    "id" CHAR(10) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100),
    "phone" VARCHAR(20),
    "vehicle" VARCHAR(50),
    "plateNumber" VARCHAR(20),
    "vehicleType" VARCHAR(50),
    "vehicleYear" VARCHAR(4),
    "vehicleColor" VARCHAR(50),
    "vehicleEngine" VARCHAR(50),
    "vehicleTransmission" VARCHAR(50),
    "vehicleFuel" VARCHAR(50),
    "mobile" VARCHAR(20),

    CONSTRAINT "tmp_customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sys_Province" (
    "company_id" CHAR(10) NOT NULL,
    "id" CHAR(5) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" CHAR(10),
    "updatedBy" CHAR(10),

    CONSTRAINT "sys_Province_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sys_City" (
    "company_id" CHAR(10) NOT NULL,
    "id" CHAR(15) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "province_id" CHAR(5) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" CHAR(10),
    "updatedBy" CHAR(10),

    CONSTRAINT "sys_City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sys_District" (
    "company_id" CHAR(10) NOT NULL,
    "id" CHAR(15) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "city_id" CHAR(15) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" CHAR(10),
    "updatedBy" CHAR(10),

    CONSTRAINT "sys_District_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sys_SubDistrict" (
    "company_id" CHAR(10) NOT NULL,
    "id" CHAR(20) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "district_id" CHAR(15) NOT NULL,
    "city_id" CHAR(15) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" CHAR(10),
    "updatedBy" CHAR(10),

    CONSTRAINT "sys_SubDistrict_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "unique_plan_code" ON "public"."saas_SubscriptionPlan"("planCode");

-- CreateIndex
CREATE INDEX "idx_subscription_company" ON "public"."saas_CompanySubscription"("company_id");

-- CreateIndex
CREATE INDEX "idx_subscription_plan" ON "public"."saas_CompanySubscription"("plan_id");

-- CreateIndex
CREATE INDEX "idx_subscription_status" ON "public"."saas_CompanySubscription"("subscriptionStatus");

-- CreateIndex
CREATE UNIQUE INDEX "unique_subscription_number" ON "public"."saas_CompanySubscription"("subscriptionNumber");

-- CreateIndex
CREATE INDEX "idx_plan_feature" ON "public"."saas_PlanFeature"("plan_id");

-- CreateIndex
CREATE INDEX "idx_billing_subscription" ON "public"."saas_SubscriptionBilling"("subscription_id");

-- CreateIndex
CREATE INDEX "idx_billing_company" ON "public"."saas_SubscriptionBilling"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_billing_number" ON "public"."saas_SubscriptionBilling"("billingNumber");

-- CreateIndex
CREATE INDEX "idx_usage_subscription" ON "public"."saas_UsageTracking"("subscription_id");

-- CreateIndex
CREATE INDEX "idx_usage_company" ON "public"."saas_UsageTracking"("company_id");

-- CreateIndex
CREATE INDEX "idx_usage_date" ON "public"."saas_UsageTracking"("trackingDate");

-- CreateIndex
CREATE UNIQUE INDEX "unique_addon_code" ON "public"."saas_AddonFeature"("addonCode");

-- CreateIndex
CREATE INDEX "idx_company_addon_subscription" ON "public"."saas_CompanyAddon"("subscription_id");

-- CreateIndex
CREATE INDEX "idx_company_addon_company" ON "public"."saas_CompanyAddon"("company_id");

-- CreateIndex
CREATE INDEX "idx_company_addon_addon" ON "public"."saas_CompanyAddon"("addon_id");

-- CreateIndex
CREATE INDEX "idx_sys_Company_seq_no" ON "public"."sys_Company"("seq_no");

-- CreateIndex
CREATE INDEX "idx_sys_Branch_company_id" ON "public"."sys_Branch"("company_id");

-- CreateIndex
CREATE INDEX "idx_sys_branch_province" ON "public"."sys_Branch"("province_id");

-- CreateIndex
CREATE INDEX "idx_sys_branch_city" ON "public"."sys_Branch"("city_id");

-- CreateIndex
CREATE INDEX "idx_sys_branch_district" ON "public"."sys_Branch"("district_id");

-- CreateIndex
CREATE INDEX "idx_sys_branch_subdistrict" ON "public"."sys_Branch"("subdistrict_id");

-- CreateIndex
CREATE UNIQUE INDEX "sys_WhiteListEmail_email_key" ON "public"."sys_WhiteListEmail"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sys_User_email_key" ON "public"."sys_User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "unique_user_employee" ON "public"."sys_User"("company_id", "employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "sys_EmailVerification_token_key" ON "public"."sys_EmailVerification"("token");

-- CreateIndex
CREATE INDEX "sys_EmailVerification_user_id_idx" ON "public"."sys_EmailVerification"("user_id");

-- CreateIndex
CREATE INDEX "sys_TwoFactorToken_user_id_idx" ON "public"."sys_TwoFactorToken"("user_id");

-- CreateIndex
CREATE INDEX "sys_TwoFactorToken_code_idx" ON "public"."sys_TwoFactorToken"("code");

-- CreateIndex
CREATE UNIQUE INDEX "sys_PasswordReset_token_key" ON "public"."sys_PasswordReset"("token");

-- CreateIndex
CREATE INDEX "sys_PasswordReset_token_idx" ON "public"."sys_PasswordReset"("token");

-- CreateIndex
CREATE INDEX "sys_PasswordReset_user_id_idx" ON "public"."sys_PasswordReset"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "sys_Session_refreshToken_key" ON "public"."sys_Session"("refreshToken");

-- CreateIndex
CREATE INDEX "sys_Session_user_id_idx" ON "public"."sys_Session"("user_id");

-- CreateIndex
CREATE INDEX "sys_Session_refreshToken_idx" ON "public"."sys_Session"("refreshToken");

-- CreateIndex
CREATE INDEX "sys_Session_isActive_idx" ON "public"."sys_Session"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "unique_user_role" ON "public"."sys_UserRole"("user_id", "role_id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_userRole_company" ON "public"."sys_UserCompanyRole"("userRole_id", "company_id");

-- CreateIndex
CREATE UNIQUE INDEX "sys_Menu_Permission_userCompanyRole_id_menu_id_key" ON "public"."sys_Menu_Permission"("userCompanyRole_id", "menu_id");

-- CreateIndex
CREATE INDEX "idx_numbering_module" ON "public"."sys_Numbering"("company_id", "branch_id", "module_id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_numbering" ON "public"."sys_Numbering"("company_id", "branch_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_floor_id_shelf_id" ON "public"."imc_Shelf"("floor_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_floor_id_shelf_id_row_id" ON "public"."imc_Row"("floor_id", "shelf_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "company_id_id" ON "public"."imc_Category"("company_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_company_id_id" ON "public"."imc_Product"("company_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_sku" ON "public"."imc_ProductVariant"("company_id", "sku");

-- CreateIndex
CREATE UNIQUE INDEX "cmf_Employee_email_key" ON "public"."cmf_Employee"("email");

-- CreateIndex
CREATE INDEX "idx_employee_name" ON "public"."cmf_Employee"("company_id", "name");

-- CreateIndex
CREATE INDEX "idx_employee_department" ON "public"."cmf_Employee"("company_id", "department");

-- CreateIndex
CREATE UNIQUE INDEX "unique_employee_code" ON "public"."cmf_Employee"("company_id", "employeeCode");

-- CreateIndex
CREATE INDEX "idx_customer_name" ON "public"."cmf_Customer"("company_id", "name");

-- CreateIndex
CREATE INDEX "idx_customer_email" ON "public"."cmf_Customer"("company_id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "unique_customer_mobile" ON "public"."cmf_Customer"("company_id", "mobile1");

-- CreateIndex
CREATE INDEX "idx_contact_person" ON "public"."cmf_CustomerContactPerson"("company_id", "customer_id");

-- CreateIndex
CREATE INDEX "idx_customer_vehicles" ON "public"."cmf_CustomerVehicle"("company_id", "customer_id");

-- CreateIndex
CREATE INDEX "idx_license_plate" ON "public"."cmf_CustomerVehicle"("company_id", "licensePlate");

-- CreateIndex
CREATE UNIQUE INDEX "unique_license_plate" ON "public"."cmf_CustomerVehicle"("company_id", "licensePlate");

-- CreateIndex
CREATE INDEX "idx_mechanic_specialization" ON "public"."cmf_Mechanic"("company_id", "specialization");

-- CreateIndex
CREATE UNIQUE INDEX "unique_mechanic_employee" ON "public"."cmf_Mechanic"("company_id", "employee_id");

-- CreateIndex
CREATE INDEX "idx_workshop_category_specialization" ON "public"."wks_WorkshopCategory"("specialization");

-- CreateIndex
CREATE UNIQUE INDEX "unique_workshop_category_code" ON "public"."wks_WorkshopCategory"("code");

-- CreateIndex
CREATE INDEX "idx_workshop_type_category" ON "public"."wks_WorkshopType"("category_id");

-- CreateIndex
CREATE INDEX "idx_workshop_type_branch" ON "public"."wks_WorkshopType"("branch_id");

-- CreateIndex
CREATE INDEX "idx_workshop_type_active_seq" ON "public"."wks_WorkshopType"("isActive", "seq");

-- CreateIndex
CREATE INDEX "idx_waitinglist_type_type" ON "public"."wks_WaitingListType"("workshopType_id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_waitinglist_type" ON "public"."wks_WaitingListType"("waitingList_id", "workshopType_id");

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

-- CreateIndex
CREATE INDEX "idx_service_order_customer" ON "public"."wks_ServiceOrder"("company_id", "customer_id");

-- CreateIndex
CREATE INDEX "idx_service_order_date" ON "public"."wks_ServiceOrder"("company_id", "orderDate");

-- CreateIndex
CREATE INDEX "idx_service_order_status" ON "public"."wks_ServiceOrder"("company_id", "orderStatus");

-- CreateIndex
CREATE UNIQUE INDEX "unique_order_number" ON "public"."wks_ServiceOrder"("company_id", "orderNumber");

-- CreateIndex
CREATE INDEX "idx_service_order_detail" ON "public"."wks_ServiceOrderDetail"("company_id", "serviceOrder_id");

-- CreateIndex
CREATE INDEX "idx_service_history_customer" ON "public"."wks_ServiceHistory"("company_id", "customer_id");

-- CreateIndex
CREATE INDEX "idx_service_history_vehicle" ON "public"."wks_ServiceHistory"("company_id", "customerVehicle_id");

-- CreateIndex
CREATE INDEX "idx_service_history_date" ON "public"."wks_ServiceHistory"("company_id", "serviceDate");

-- CreateIndex
CREATE INDEX "idx_reminder_entity" ON "public"."sys_Reminder"("company_id", "entityType", "entity_id");

-- CreateIndex
CREATE INDEX "idx_reminder_customer" ON "public"."sys_Reminder"("company_id", "customer_id");

-- CreateIndex
CREATE INDEX "idx_reminder_status" ON "public"."sys_Reminder"("company_id", "status");

-- CreateIndex
CREATE INDEX "idx_reminder_scheduled" ON "public"."sys_Reminder"("company_id", "scheduledDate");

-- CreateIndex
CREATE INDEX "idx_reminder_pending" ON "public"."sys_Reminder"("company_id", "status", "scheduledDate");

-- CreateIndex
CREATE UNIQUE INDEX "unique_reminder_number" ON "public"."sys_Reminder"("company_id", "reminderNumber");

-- CreateIndex
CREATE INDEX "idx_reminder_log_reminder" ON "public"."sys_ReminderLog"("company_id", "reminder_id");

-- CreateIndex
CREATE INDEX "idx_reminder_log_date" ON "public"."sys_ReminderLog"("company_id", "sentAt");

-- CreateIndex
CREATE INDEX "idx_complaint_customer" ON "public"."wks_CustomerComplaint"("company_id", "customer_id");

-- CreateIndex
CREATE INDEX "idx_complaint_service" ON "public"."wks_CustomerComplaint"("company_id", "serviceOrder_id");

-- CreateIndex
CREATE INDEX "idx_complaint_date" ON "public"."wks_CustomerComplaint"("company_id", "complaintDate");

-- CreateIndex
CREATE INDEX "idx_complaint_status" ON "public"."wks_CustomerComplaint"("company_id", "complaintStatus");

-- CreateIndex
CREATE UNIQUE INDEX "unique_complaint_number" ON "public"."wks_CustomerComplaint"("company_id", "complaintNumber");

-- CreateIndex
CREATE INDEX "idx_complaint_log" ON "public"."wks_ComplaintLog"("company_id", "complaint_id");

-- CreateIndex
CREATE INDEX "idx_rework_service" ON "public"."wks_ServiceRework"("company_id", "originalServiceOrder_id");

-- CreateIndex
CREATE INDEX "idx_rework_customer" ON "public"."wks_ServiceRework"("company_id", "customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_rework_number" ON "public"."wks_ServiceRework"("company_id", "reworkNumber");

-- CreateIndex
CREATE INDEX "idx_rework_item" ON "public"."wks_ServiceReworkItem"("company_id", "serviceRework_id");

-- CreateIndex
CREATE INDEX "idx_credit_note_customer" ON "public"."arm_CreditNote"("company_id", "customer_id");

-- CreateIndex
CREATE INDEX "idx_credit_note_invoice" ON "public"."arm_CreditNote"("company_id", "invoice_id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_credit_note_number" ON "public"."arm_CreditNote"("company_id", "creditNoteNumber");

-- CreateIndex
CREATE INDEX "idx_credit_note_detail" ON "public"."arm_CreditNoteDetail"("company_id", "creditNote_id");

-- CreateIndex
CREATE INDEX "idx_supplier_name" ON "public"."prc_Supplier"("company_id", "name");

-- CreateIndex
CREATE INDEX "idx_supplier_type" ON "public"."prc_Supplier"("company_id", "supplierType");

-- CreateIndex
CREATE UNIQUE INDEX "unique_supplier_code" ON "public"."prc_Supplier"("company_id", "supplierCode");

-- CreateIndex
CREATE INDEX "idx_po_supplier" ON "public"."prc_PurchaseOrder"("company_id", "supplier_id");

-- CreateIndex
CREATE INDEX "idx_po_date" ON "public"."prc_PurchaseOrder"("company_id", "poDate");

-- CreateIndex
CREATE INDEX "idx_po_status" ON "public"."prc_PurchaseOrder"("company_id", "poStatus");

-- CreateIndex
CREATE UNIQUE INDEX "unique_po_number" ON "public"."prc_PurchaseOrder"("company_id", "poNumber");

-- CreateIndex
CREATE INDEX "idx_po_detail" ON "public"."prc_PurchaseOrderDetail"("company_id", "purchaseOrder_id");

-- CreateIndex
CREATE INDEX "idx_receive_po" ON "public"."prc_PurchaseReceive"("company_id", "purchaseOrder_id");

-- CreateIndex
CREATE INDEX "idx_receive_supplier" ON "public"."prc_PurchaseReceive"("company_id", "supplier_id");

-- CreateIndex
CREATE INDEX "idx_receive_date" ON "public"."prc_PurchaseReceive"("company_id", "receiveDate");

-- CreateIndex
CREATE UNIQUE INDEX "unique_receive_number" ON "public"."prc_PurchaseReceive"("company_id", "receiveNumber");

-- CreateIndex
CREATE INDEX "idx_receive_detail" ON "public"."prc_PurchaseReceiveDetail"("company_id", "purchaseReceive_id");

-- CreateIndex
CREATE INDEX "idx_movement_date" ON "public"."inv_InternalMovement"("company_id", "movementDate");

-- CreateIndex
CREATE INDEX "idx_movement_type" ON "public"."inv_InternalMovement"("company_id", "movementType");

-- CreateIndex
CREATE INDEX "idx_movement_status" ON "public"."inv_InternalMovement"("company_id", "movementStatus");

-- CreateIndex
CREATE UNIQUE INDEX "unique_movement_number" ON "public"."inv_InternalMovement"("company_id", "movementNumber");

-- CreateIndex
CREATE INDEX "idx_movement_detail" ON "public"."inv_InternalMovementDetail"("company_id", "internalMovement_id");

-- CreateIndex
CREATE INDEX "idx_coa_type" ON "public"."acc_COA"("company_id", "accountType");

-- CreateIndex
CREATE INDEX "idx_coa_parent" ON "public"."acc_COA"("company_id", "parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_account_code" ON "public"."acc_COA"("company_id", "accountCode");

-- CreateIndex
CREATE UNIQUE INDEX "unique_bank_account" ON "public"."acc_BankAccount"("company_id", "accountNumber");

-- CreateIndex
CREATE INDEX "idx_tax_scheme_type" ON "public"."cmf_TaxScheme"("company_id", "taxType");

-- CreateIndex
CREATE UNIQUE INDEX "unique_tax_scheme_code" ON "public"."cmf_TaxScheme"("company_id", "schemeCode");

-- CreateIndex
CREATE INDEX "idx_tax_detail" ON "public"."cmf_TaxSchemeDetail"("company_id", "taxScheme_id");

-- CreateIndex
CREATE INDEX "idx_invoice_customer" ON "public"."arm_Invoice"("company_id", "customer_id");

-- CreateIndex
CREATE INDEX "idx_invoice_date" ON "public"."arm_Invoice"("company_id", "invoiceDate");

-- CreateIndex
CREATE INDEX "idx_invoice_status" ON "public"."arm_Invoice"("company_id", "invoiceStatus");

-- CreateIndex
CREATE UNIQUE INDEX "unique_invoice_number" ON "public"."arm_Invoice"("company_id", "invoiceNumber");

-- CreateIndex
CREATE INDEX "idx_invoice_detail" ON "public"."arm_InvoiceDetail"("company_id", "invoice_id");

-- CreateIndex
CREATE INDEX "idx_payment_invoice" ON "public"."arm_Payment"("company_id", "invoice_id");

-- CreateIndex
CREATE INDEX "idx_payment_customer" ON "public"."arm_Payment"("company_id", "customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_payment_number" ON "public"."arm_Payment"("company_id", "paymentNumber");

-- CreateIndex
CREATE INDEX "idx_payment_detail" ON "public"."arm_PaymentDetail"("company_id", "payment_id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_receipt_number" ON "public"."arm_CashReceipt"("company_id", "receiptNumber");

-- CreateIndex
CREATE INDEX "idx_cash_receipt_detail" ON "public"."arm_CashReceiptDetail"("company_id", "cashReceipt_id");

-- CreateIndex
CREATE INDEX "idx_ap_invoice_supplier" ON "public"."apm_Invoice"("company_id", "supplier_id");

-- CreateIndex
CREATE INDEX "idx_ap_invoice_date" ON "public"."apm_Invoice"("company_id", "invoiceDate");

-- CreateIndex
CREATE INDEX "idx_ap_invoice_status" ON "public"."apm_Invoice"("company_id", "invoiceStatus");

-- CreateIndex
CREATE UNIQUE INDEX "unique_ap_invoice_number" ON "public"."apm_Invoice"("company_id", "invoiceNumber");

-- CreateIndex
CREATE INDEX "idx_ap_invoice_detail" ON "public"."apm_InvoiceDetail"("company_id", "apInvoice_id");

-- CreateIndex
CREATE INDEX "idx_ap_payment_invoice" ON "public"."apm_Payment"("company_id", "apInvoice_id");

-- CreateIndex
CREATE INDEX "idx_ap_payment_supplier" ON "public"."apm_Payment"("company_id", "supplier_id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_ap_payment_number" ON "public"."apm_Payment"("company_id", "paymentNumber");

-- CreateIndex
CREATE INDEX "idx_ap_payment_detail" ON "public"."apm_PaymentDetail"("company_id", "apPayment_id");

-- CreateIndex
CREATE INDEX "idx_return_supplier" ON "public"."prc_PurchaseReturn"("company_id", "supplier_id");

-- CreateIndex
CREATE INDEX "idx_return_date" ON "public"."prc_PurchaseReturn"("company_id", "returnDate");

-- CreateIndex
CREATE UNIQUE INDEX "unique_return_number" ON "public"."prc_PurchaseReturn"("company_id", "returnNumber");

-- CreateIndex
CREATE INDEX "idx_return_detail" ON "public"."prc_PurchaseReturnDetail"("company_id", "purchaseReturn_id");

-- CreateIndex
CREATE INDEX "idx_gl_date" ON "public"."acc_GLTrans"("company_id", "journalDate");

-- CreateIndex
CREATE INDEX "idx_gl_trx_type" ON "public"."acc_GLTrans"("company_id", "transaction_type");

-- CreateIndex
CREATE UNIQUE INDEX "unique_journal_number" ON "public"."acc_GLTrans"("company_id", "journalNumber");

-- CreateIndex
CREATE INDEX "idx_gl_detail" ON "public"."acc_GLTransDetail"("company_id", "glTrans_id");

-- CreateIndex
CREATE INDEX "idx_gl_detail_coa" ON "public"."acc_GLTransDetail"("company_id", "coa_id");

-- CreateIndex
CREATE INDEX "idx_tmp_sys_Company_seq_no" ON "public"."tmp_sys_Company"("seq_no");

-- CreateIndex
CREATE INDEX "idx_tmp_sys_Branch_company_id" ON "public"."tmp_sys_Branch"("company_id");

-- CreateIndex
CREATE INDEX "sys_City_province_id_idx" ON "public"."sys_City"("province_id");

-- CreateIndex
CREATE INDEX "sys_District_city_id_idx" ON "public"."sys_District"("city_id");

-- CreateIndex
CREATE INDEX "sys_SubDistrict_district_id_idx" ON "public"."sys_SubDistrict"("district_id");

-- CreateIndex
CREATE INDEX "sys_SubDistrict_city_id_idx" ON "public"."sys_SubDistrict"("city_id");

-- AddForeignKey
ALTER TABLE "public"."saas_CompanySubscription" ADD CONSTRAINT "saas_CompanySubscription_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."sys_Company"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."saas_CompanySubscription" ADD CONSTRAINT "saas_CompanySubscription_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "public"."saas_SubscriptionPlan"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."saas_PlanFeature" ADD CONSTRAINT "saas_PlanFeature_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "public"."saas_SubscriptionPlan"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."saas_SubscriptionBilling" ADD CONSTRAINT "saas_SubscriptionBilling_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "public"."saas_CompanySubscription"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."saas_SubscriptionBilling" ADD CONSTRAINT "saas_SubscriptionBilling_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."sys_Company"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."saas_UsageTracking" ADD CONSTRAINT "saas_UsageTracking_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "public"."saas_CompanySubscription"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."saas_UsageTracking" ADD CONSTRAINT "saas_UsageTracking_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."sys_Company"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."saas_CompanyAddon" ADD CONSTRAINT "saas_CompanyAddon_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "public"."saas_CompanySubscription"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."saas_CompanyAddon" ADD CONSTRAINT "saas_CompanyAddon_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."sys_Company"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."saas_CompanyAddon" ADD CONSTRAINT "saas_CompanyAddon_addon_id_fkey" FOREIGN KEY ("addon_id") REFERENCES "public"."saas_AddonFeature"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."sys_Branch" ADD CONSTRAINT "sys_Branch_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."sys_Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sys_Branch" ADD CONSTRAINT "sys_Branch_province_id_fkey" FOREIGN KEY ("province_id") REFERENCES "public"."sys_Province"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."sys_Branch" ADD CONSTRAINT "sys_Branch_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "public"."sys_City"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."sys_Branch" ADD CONSTRAINT "sys_Branch_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "public"."sys_District"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."sys_Branch" ADD CONSTRAINT "sys_Branch_subdistrict_id_fkey" FOREIGN KEY ("subdistrict_id") REFERENCES "public"."sys_SubDistrict"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."sys_User" ADD CONSTRAINT "sys_User_company_id_employee_id_fkey" FOREIGN KEY ("company_id", "employee_id") REFERENCES "public"."cmf_Employee"("company_id", "id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."sys_EmailVerification" ADD CONSTRAINT "sys_EmailVerification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."sys_User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sys_TwoFactorToken" ADD CONSTRAINT "sys_TwoFactorToken_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."sys_User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sys_PasswordReset" ADD CONSTRAINT "sys_PasswordReset_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."sys_User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sys_Session" ADD CONSTRAINT "sys_Session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."sys_User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sys_UserRole" ADD CONSTRAINT "sys_UserRole_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."sys_Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sys_UserRole" ADD CONSTRAINT "sys_UserRole_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."sys_User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sys_UserCompanyRole" ADD CONSTRAINT "sys_UserCompanyRole_userRole_id_fkey" FOREIGN KEY ("userRole_id") REFERENCES "public"."sys_UserRole"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sys_UserCompanyRole" ADD CONSTRAINT "sys_UserCompanyRole_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."sys_Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sys_Menu" ADD CONSTRAINT "sys_Menu_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."sys_Menu"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sys_Menu_Permission" ADD CONSTRAINT "sys_Menu_Permission_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "public"."sys_Menu"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sys_Menu_Permission" ADD CONSTRAINT "sys_Menu_Permission_userCompanyRole_id_fkey" FOREIGN KEY ("userCompanyRole_id") REFERENCES "public"."sys_UserCompanyRole"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sys_Numbering" ADD CONSTRAINT "sys_Numbering_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "public"."sys_Module"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."imc_Floor" ADD CONSTRAINT "imc_Floor_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "public"."imc_Warehouse"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."imc_Shelf" ADD CONSTRAINT "imc_Shelf_floor_id_fkey" FOREIGN KEY ("floor_id") REFERENCES "public"."imc_Floor"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."imc_Row" ADD CONSTRAINT "imc_Row_floor_id_fkey" FOREIGN KEY ("floor_id") REFERENCES "public"."imc_Floor"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."imc_Row" ADD CONSTRAINT "imc_Row_floor_id_shelf_id_fkey" FOREIGN KEY ("floor_id", "shelf_id") REFERENCES "public"."imc_Shelf"("floor_id", "id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."imc_Category" ADD CONSTRAINT "imc_Category_type_fkey" FOREIGN KEY ("type") REFERENCES "public"."imc_CategoryType"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

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
ALTER TABLE "public"."wks_VehicleBrand" ADD CONSTRAINT "wks_VehicleBrand_vehicleType_id_fkey" FOREIGN KEY ("vehicleType_id") REFERENCES "public"."wks_VehicleType"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."wks_VehicleModel" ADD CONSTRAINT "wks_VehicleModel_vehicleType_id_brand_id_fkey" FOREIGN KEY ("vehicleType_id", "brand_id") REFERENCES "public"."wks_VehicleBrand"("vehicleType_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."cmf_CustomerContactPerson" ADD CONSTRAINT "cmf_CustomerContactPerson_company_id_customer_id_fkey" FOREIGN KEY ("company_id", "customer_id") REFERENCES "public"."cmf_Customer"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."cmf_CustomerVehicle" ADD CONSTRAINT "cmf_CustomerVehicle_company_id_customer_id_fkey" FOREIGN KEY ("company_id", "customer_id") REFERENCES "public"."cmf_Customer"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."cmf_CustomerVehicle" ADD CONSTRAINT "cmf_CustomerVehicle_vehicleType_id_brand_id_fkey" FOREIGN KEY ("vehicleType_id", "brand_id") REFERENCES "public"."wks_VehicleBrand"("vehicleType_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."cmf_CustomerVehicle" ADD CONSTRAINT "cmf_CustomerVehicle_vehicleType_id_brand_id_model_id_fkey" FOREIGN KEY ("vehicleType_id", "brand_id", "model_id") REFERENCES "public"."wks_VehicleModel"("vehicleType_id", "brand_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."cmf_Mechanic" ADD CONSTRAINT "cmf_Mechanic_company_id_employee_id_fkey" FOREIGN KEY ("company_id", "employee_id") REFERENCES "public"."cmf_Employee"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."wks_WorkshopType" ADD CONSTRAINT "wks_WorkshopType_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."wks_WorkshopCategory"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."wks_WorkshopType" ADD CONSTRAINT "wks_WorkshopType_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."sys_Branch"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."wks_WaitingListType" ADD CONSTRAINT "wks_WaitingListType_waitingList_id_fkey" FOREIGN KEY ("waitingList_id") REFERENCES "public"."wks_waitingList"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."wks_WaitingListType" ADD CONSTRAINT "wks_WaitingListType_workshopType_id_fkey" FOREIGN KEY ("workshopType_id") REFERENCES "public"."wks_WorkshopType"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

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
ALTER TABLE "public"."prc_PurchaseOrder" ADD CONSTRAINT "prc_PurchaseOrder_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "public"."imc_Warehouse"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."prc_PurchaseOrderDetail" ADD CONSTRAINT "prc_PurchaseOrderDetail_company_id_purchaseOrder_id_fkey" FOREIGN KEY ("company_id", "purchaseOrder_id") REFERENCES "public"."prc_PurchaseOrder"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."prc_PurchaseOrderDetail" ADD CONSTRAINT "prc_PurchaseOrderDetail_company_id_product_id_fkey" FOREIGN KEY ("company_id", "product_id") REFERENCES "public"."imc_Product"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."prc_PurchaseReceive" ADD CONSTRAINT "prc_PurchaseReceive_company_id_purchaseOrder_id_fkey" FOREIGN KEY ("company_id", "purchaseOrder_id") REFERENCES "public"."prc_PurchaseOrder"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."prc_PurchaseReceive" ADD CONSTRAINT "prc_PurchaseReceive_company_id_supplier_id_fkey" FOREIGN KEY ("company_id", "supplier_id") REFERENCES "public"."prc_Supplier"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."prc_PurchaseReceive" ADD CONSTRAINT "prc_PurchaseReceive_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "public"."imc_Warehouse"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."prc_PurchaseReceiveDetail" ADD CONSTRAINT "prc_PurchaseReceiveDetail_company_id_purchaseReceive_id_fkey" FOREIGN KEY ("company_id", "purchaseReceive_id") REFERENCES "public"."prc_PurchaseReceive"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."prc_PurchaseReceiveDetail" ADD CONSTRAINT "prc_PurchaseReceiveDetail_company_id_purchaseOrderDetail_i_fkey" FOREIGN KEY ("company_id", "purchaseOrderDetail_id") REFERENCES "public"."prc_PurchaseOrderDetail"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."prc_PurchaseReceiveDetail" ADD CONSTRAINT "prc_PurchaseReceiveDetail_company_id_product_id_fkey" FOREIGN KEY ("company_id", "product_id") REFERENCES "public"."imc_Product"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."inv_InternalMovement" ADD CONSTRAINT "inv_InternalMovement_sourceWarehouse_id_fkey" FOREIGN KEY ("sourceWarehouse_id") REFERENCES "public"."imc_Warehouse"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."inv_InternalMovement" ADD CONSTRAINT "inv_InternalMovement_destWarehouse_id_fkey" FOREIGN KEY ("destWarehouse_id") REFERENCES "public"."imc_Warehouse"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

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
ALTER TABLE "public"."arm_Payment" ADD CONSTRAINT "arm_Payment_paymentMethod_id_fkey" FOREIGN KEY ("paymentMethod_id") REFERENCES "public"."cmf_PaymentMethod"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."arm_Payment" ADD CONSTRAINT "arm_Payment_company_id_bankAccount_id_fkey" FOREIGN KEY ("company_id", "bankAccount_id") REFERENCES "public"."acc_BankAccount"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."arm_PaymentDetail" ADD CONSTRAINT "arm_PaymentDetail_company_id_payment_id_fkey" FOREIGN KEY ("company_id", "payment_id") REFERENCES "public"."arm_Payment"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."arm_PaymentDetail" ADD CONSTRAINT "arm_PaymentDetail_paymentMethod_id_fkey" FOREIGN KEY ("paymentMethod_id") REFERENCES "public"."cmf_PaymentMethod"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

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
ALTER TABLE "public"."apm_Payment" ADD CONSTRAINT "apm_Payment_paymentMethod_id_fkey" FOREIGN KEY ("paymentMethod_id") REFERENCES "public"."cmf_PaymentMethod"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."apm_Payment" ADD CONSTRAINT "apm_Payment_company_id_bankAccount_id_fkey" FOREIGN KEY ("company_id", "bankAccount_id") REFERENCES "public"."acc_BankAccount"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."apm_PaymentDetail" ADD CONSTRAINT "apm_PaymentDetail_company_id_apPayment_id_fkey" FOREIGN KEY ("company_id", "apPayment_id") REFERENCES "public"."apm_Payment"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."apm_PaymentDetail" ADD CONSTRAINT "apm_PaymentDetail_paymentMethod_id_fkey" FOREIGN KEY ("paymentMethod_id") REFERENCES "public"."cmf_PaymentMethod"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."prc_PurchaseReturn" ADD CONSTRAINT "prc_PurchaseReturn_company_id_purchaseReceive_id_fkey" FOREIGN KEY ("company_id", "purchaseReceive_id") REFERENCES "public"."prc_PurchaseReceive"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."prc_PurchaseReturn" ADD CONSTRAINT "prc_PurchaseReturn_company_id_purchaseOrder_id_fkey" FOREIGN KEY ("company_id", "purchaseOrder_id") REFERENCES "public"."prc_PurchaseOrder"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."prc_PurchaseReturn" ADD CONSTRAINT "prc_PurchaseReturn_company_id_supplier_id_fkey" FOREIGN KEY ("company_id", "supplier_id") REFERENCES "public"."prc_Supplier"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."prc_PurchaseReturn" ADD CONSTRAINT "prc_PurchaseReturn_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "public"."imc_Warehouse"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

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

-- AddForeignKey
ALTER TABLE "public"."sys_City" ADD CONSTRAINT "sys_City_province_id_fkey" FOREIGN KEY ("province_id") REFERENCES "public"."sys_Province"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sys_District" ADD CONSTRAINT "sys_District_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "public"."sys_City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sys_SubDistrict" ADD CONSTRAINT "sys_SubDistrict_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "public"."sys_District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
