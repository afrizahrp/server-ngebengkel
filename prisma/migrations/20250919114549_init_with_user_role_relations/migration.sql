-- CreateEnum
CREATE TYPE "public"."MasterRecordStatusEnum" AS ENUM ('0', '1');

-- CreateEnum
CREATE TYPE "public"."TransactionRecordStatusEnum" AS ENUM ('0', '1', '2', '3');

-- CreateEnum
CREATE TYPE "public"."InvoicePaidStatusEnum" AS ENUM ('0', '1', '4');

-- CreateEnum
CREATE TYPE "public"."InvoiceDueDateStatusEnum" AS ENUM ('0', '1');

-- CreateEnum
CREATE TYPE "public"."WebsiteDisplayStatus" AS ENUM ('0', '1');

-- CreateEnum
CREATE TYPE "public"."ContactStatus" AS ENUM ('0', '1', '2', '3');

-- CreateTable
CREATE TABLE "public"."sys_Company" (
    "seq_no" SMALLINT NOT NULL,
    "id" CHAR(5) NOT NULL,
    "name" VARCHAR(50),
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
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
CREATE TABLE "public"."sys_Role" (
    "id" CHAR(20) NOT NULL,
    "name" VARCHAR(20) NOT NULL,
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
    "id" SMALLINT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "image" VARCHAR(255),
    "password" VARCHAR(255) NOT NULL,
    "hashedRefreshToken" VARCHAR(255),

    CONSTRAINT "sys_User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sys_UserRole" (
    "id" SMALLSERIAL NOT NULL,
    "user_id" SMALLINT NOT NULL,
    "role_id" CHAR(20) NOT NULL,
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "isDefault" BOOLEAN DEFAULT false,

    CONSTRAINT "sys_UserRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sys_User_Bak" (
    "id" SMALLINT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "image" VARCHAR(255),
    "password" VARCHAR(255) NOT NULL,
    "hashedRefreshToken" VARCHAR(255),

    CONSTRAINT "sys_User_Bak_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sys_UserCompanyRole" (
    "id" SMALLSERIAL NOT NULL,
    "userRole_id" SMALLINT NOT NULL,
    "company_id" CHAR(5) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
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
    "company_id" CHAR(5) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,

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
    "company_id" CHAR(5) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,

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
CREATE TABLE "public"."imc_Warehouse" (
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
    "company_id" CHAR(5) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,

    CONSTRAINT "imc_Warehouse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."imc_Floor" (
    "warehouse_id" CHAR(4) NOT NULL,
    "id" CHAR(5) NOT NULL,
    "name" CHAR(35),
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "company_id" CHAR(5) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,

    CONSTRAINT "pk_ic_floor" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."imc_Shelf" (
    "floor_id" CHAR(5) NOT NULL,
    "id" CHAR(15) NOT NULL,
    "name" CHAR(35),
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "company_id" CHAR(5) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,

    CONSTRAINT "pk_ic_shelf" PRIMARY KEY ("floor_id","id")
);

-- CreateTable
CREATE TABLE "public"."imc_Row" (
    "floor_id" CHAR(5) NOT NULL,
    "shelf_id" CHAR(15) NOT NULL,
    "id" CHAR(15) NOT NULL,
    "name" CHAR(35),
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "company_id" CHAR(5) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "storages" CHAR(15),

    CONSTRAINT "pk_ic_row" PRIMARY KEY ("floor_id","shelf_id","id")
);

-- CreateTable
CREATE TABLE "public"."imc_Uom" (
    "id" CHAR(10) NOT NULL,
    "name" VARCHAR(50),
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "remarks" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "company_id" CHAR(5) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,

    CONSTRAINT "pk_imc_Uoms" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."imc_CategoryType" (
    "id" SMALLSERIAL NOT NULL,
    "name" VARCHAR(20),
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "remarks" VARCHAR(250),
    "stock_acct" CHAR(10),
    "sales_acct" CHAR(10),
    "cogs_acct" CHAR(10),
    "expense_acct" CHAR(10),
    "asset_acct" CHAR(10),
    "company_id" CHAR(5) NOT NULL,
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3),
    "branch_id" CHAR(10),

    CONSTRAINT "imc_CategoryType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."imc_Category" (
    "type" SMALLINT NOT NULL,
    "id" CHAR(10) NOT NULL,
    "name" VARCHAR(80),
    "seq" INTEGER DEFAULT 0,
    "slug" VARCHAR(50),
    "remarks" VARCHAR(250),
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "iShowedStatus" "public"."WebsiteDisplayStatus" NOT NULL DEFAULT '0',
    "imageURL" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "company_id" CHAR(5) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,
    "href" VARCHAR(150),
    "icon" VARCHAR(50),

    CONSTRAINT "pk_imc_Categories" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."imc_SubCategory" (
    "id" CHAR(10) NOT NULL,
    "seq" INTEGER DEFAULT 0,
    "imageURL" VARCHAR(250),
    "category_id" CHAR(10) NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "name_en" VARCHAR(80),
    "slug" VARCHAR(50) NOT NULL,
    "slug_en" VARCHAR(50),
    "descriptions" VARCHAR(250),
    "descriptions_en" VARCHAR(250),
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "iShowedStatus" "public"."WebsiteDisplayStatus" NOT NULL DEFAULT '0',
    "remarks" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "company_id" CHAR(5) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,

    CONSTRAINT "pk_imc_SubCategories" PRIMARY KEY ("company_id","category_id","id")
);

-- CreateTable
CREATE TABLE "public"."imc_SubCategory_web" (
    "seq" INTEGER DEFAULT 0,
    "id" CHAR(10) NOT NULL,
    "imageURL" VARCHAR(250),
    "category_id" CHAR(10) NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "name_en" VARCHAR(80),
    "slug" VARCHAR(50) NOT NULL,
    "slug_en" VARCHAR(50),
    "descriptions" VARCHAR(250),
    "descriptions_en" VARCHAR(250),

    CONSTRAINT "imc_SubCategory_web_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."imc_Brand" (
    "id" CHAR(10) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "slug" VARCHAR(50),
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "remarks" VARCHAR(250),
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "company_id" CHAR(5) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,

    CONSTRAINT "pk_imc_Brands" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."imc_Product" (
    "id" CHAR(20) NOT NULL,
    "register_id" CHAR(20),
    "catalog_id" CHAR(20),
    "name" VARCHAR(250) NOT NULL,
    "name_en" VARCHAR(250),
    "slug" VARCHAR(250),
    "slug_en" VARCHAR(250),
    "subcategory_slug" VARCHAR(100),
    "subcategory_slug_en" VARCHAR(100),
    "has_3d_model" BOOLEAN DEFAULT false,
    "category_id" CHAR(10) NOT NULL,
    "subCategory_id" CHAR(10) NOT NULL,
    "brand_id" CHAR(10) NOT NULL,
    "uom_id" CHAR(10) NOT NULL,
    "eCatalogURL" VARCHAR(250),
    "remarks" VARCHAR(250),
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "iShowedStatus" "public"."WebsiteDisplayStatus" NOT NULL DEFAULT '0',
    "isMaterial" BOOLEAN NOT NULL DEFAULT false,
    "isService" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN DEFAULT false,
    "isFinishing" BOOLEAN NOT NULL DEFAULT false,
    "isAccessories" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" CHAR(50),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(50),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "company_id" CHAR(5) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,

    CONSTRAINT "pk_imc_Products" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."imc_Product_web" (
    "id" CHAR(20) NOT NULL,
    "catalog_id" CHAR(20),
    "name" VARCHAR(250) NOT NULL,
    "category_id" CHAR(10) NOT NULL,
    "subCategory_id" CHAR(10) NOT NULL,
    "slug" VARCHAR(250),
    "subcategory_slug" VARCHAR(100),
    "subcategory_slug_en" VARCHAR(100),

    CONSTRAINT "pk_imc_Product_Old" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."imc_ProductStock" (
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
    "company_id" CHAR(5) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,

    CONSTRAINT "imc_ProductStock_pkey" PRIMARY KEY ("id","floor_id","shelf_id","row_id","mExpired_dt","yExpired_dt","warehouse_id","company_id")
);

-- CreateTable
CREATE TABLE "public"."imc_ProductStockCard" (
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
    "company_id" CHAR(5) NOT NULL,
    "branch_id" CHAR(10) NOT NULL,

    CONSTRAINT "imc_ProductStockCard_pkey" PRIMARY KEY ("product_id","floor_id","shelf_id","row_id","mExpired_dt","yExpired_dt","doc_id","mutation_id","srn_seq","batch_no_item","warehouse_id","company_id")
);

-- CreateTable
CREATE TABLE "public"."imc_ProductDesc" (
    "id" CHAR(20) NOT NULL,
    "descriptions" TEXT,
    "benefits" TEXT,
    "descriptions_en" TEXT,
    "benefits_en" TEXT,
    "createdBy" CHAR(50),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(50),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "company_id" CHAR(5) NOT NULL,
    "branch_id" CHAR(10),

    CONSTRAINT "imc_ProductDesc_pkey" PRIMARY KEY ("id","company_id")
);

-- CreateTable
CREATE TABLE "public"."imc_ProductDesc_web" (
    "id" CHAR(20) NOT NULL,
    "descriptions" TEXT,
    "benefits" TEXT,
    "descriptions_en" TEXT,
    "benefits_en" TEXT,

    CONSTRAINT "imc_ProductDesc_web_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."imc_ProductSpec" (
    "id" CHAR(20) NOT NULL,
    "itemFunctions" VARCHAR(250),
    "item_type" VARCHAR(100),
    "item_model" VARCHAR(100),
    "construction" TEXT,
    "mattress" VARCHAR(250),
    "mattressSize" VARCHAR(250),
    "mattressThickness" VARCHAR(250),
    "finishing" VARCHAR(250),
    "dimension" VARCHAR(250),
    "powerSupply" VARCHAR(150),
    "loadCapacity" VARCHAR(150),
    "systemFilter" VARCHAR(180),
    "accessories" VARCHAR(250),
    "sideRail" VARCHAR(180),
    "ivStand" VARCHAR(180),
    "wheels" VARCHAR(150),
    "maxLoad" VARCHAR(150),
    "size" VARCHAR(150),
    "weight" VARCHAR(150),
    "standSize" VARCHAR(150),
    "position" VARCHAR(150),
    "base" VARCHAR(150),
    "basePlate" VARCHAR(180),
    "cover" VARCHAR(150),
    "material" VARCHAR(150),
    "coverMaterial" VARCHAR(150),
    "typeScreen" VARCHAR(150),
    "powerConsumption" VARCHAR(150),
    "lamp" VARCHAR(150),
    "movers" VARCHAR(200),
    "rim" VARCHAR(200),
    "custodyFeet" VARCHAR(200),
    "foot" VARCHAR(200),
    "footWear" VARCHAR(200),
    "pole" VARCHAR(200),
    "inputVoltage" VARCHAR(150),
    "outputVoltage" VARCHAR(150),
    "sideGuard" VARCHAR(250),
    "footandheadPanel" VARCHAR(250),
    "temperatureControl" VARCHAR(250),
    "top" VARCHAR(150),
    "foodTray" VARCHAR(250),
    "traycorpse" VARCHAR(250),
    "pillowthecorpse" VARCHAR(250),
    "lightPole" VARCHAR(250),
    "sterilizing" VARCHAR(250),
    "filter" VARCHAR(250),
    "bodyFrame" VARCHAR(250),
    "underPressure" VARCHAR(250),
    "foundationTray" VARCHAR(250),
    "door" VARCHAR(250),
    "handle" VARCHAR(250),
    "medicineBox" VARCHAR(250),
    "handleTrolley" VARCHAR(250),
    "drawer" VARCHAR(250),
    "systemControl" VARCHAR(250),
    "bodyFrameWork" VARCHAR(250),
    "remarks" VARCHAR(250),
    "createdBy" CHAR(50),
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(50),
    "updatedAt" TIMESTAMP(3),
    "company_id" CHAR(5) NOT NULL,
    "branch_id" CHAR(10),

    CONSTRAINT "pk_productSpecs" PRIMARY KEY ("id","company_id")
);

-- CreateTable
CREATE TABLE "public"."imc_ProductImage" (
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
    "company_id" CHAR(5) NOT NULL,

    CONSTRAINT "pk_imc_ProductImages" PRIMARY KEY ("product_id","company_id","id")
);

-- CreateTable
CREATE TABLE "public"."imc_ProductVideo" (
    "id" CHAR(150) NOT NULL,
    "product_id" CHAR(20) NOT NULL,
    "videoURL" VARCHAR(250) NOT NULL,
    "isPrimary" BOOLEAN NOT NULL,
    "seq" INTEGER,
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "company_id" CHAR(5) NOT NULL,

    CONSTRAINT "pk_imc_ProductVideos" PRIMARY KEY ("product_id","company_id","id")
);

-- CreateTable
CREATE TABLE "public"."cms_Billboard" (
    "id" SMALLSERIAL NOT NULL,
    "name" VARCHAR(250) NOT NULL,
    "section" SMALLINT,
    "contentURL" VARCHAR(250),
    "content_id" VARCHAR(50),
    "isImage" BOOLEAN,
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',
    "iShowedStatus" "public"."WebsiteDisplayStatus" NOT NULL DEFAULT '0',
    "remarks" VARCHAR(250),
    "company_id" CHAR(5) NOT NULL,
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3),
    "branch_id" CHAR(10),

    CONSTRAINT "pk_cms_Billboards" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."sls_SalesPerson" (
    "id" CHAR(10) NOT NULL,
    "name" VARCHAR(50),
    "company_id" CHAR(5) NOT NULL,

    CONSTRAINT "pk_sls_SalesPerson" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."sls_CustomerType" (
    "id" CHAR(4) NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "isGovernment" SMALLINT NOT NULL,

    CONSTRAINT "sls_CustomerType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sls_Customer" (
    "id" CHAR(20) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "address1" VARCHAR(250) NOT NULL,
    "address2" VARCHAR(250) NOT NULL,
    "address3" VARCHAR(250) NOT NULL,
    "city" VARCHAR(50) NOT NULL,
    "district" VARCHAR(50) NOT NULL,
    "province" VARCHAR(50) NOT NULL,
    "creditTerms" SMALLINT NOT NULL,
    "company_id" CHAR(5) NOT NULL,

    CONSTRAINT "pk_sls_Customer" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."sls_InvoiceDt" (
    "po_id" CHAR(80),
    "ecatalog_id" CHAR(30),
    "so_id" CHAR(20),
    "spk_id" CHAR(20),
    "delivery_id" CHAR(20) NOT NULL,
    "trxType" CHAR(3) NOT NULL,
    "invoice_id" CHAR(20) NOT NULL,
    "line_no" SMALLINT NOT NULL,
    "acct_id" CHAR(20) NOT NULL,
    "description" VARCHAR(250) NOT NULL,
    "product_id" CHAR(20) NOT NULL,
    "productName" VARCHAR(250) NOT NULL,
    "uom_id" CHAR(10) NOT NULL,
    "brand_id" CHAR(10) NOT NULL,
    "brandName" VARCHAR(50) NOT NULL,
    "unitPrice" DECIMAL(21,4) NOT NULL,
    "qty" DECIMAL(12,4) NOT NULL,
    "sellingPrice" DECIMAL(21,4) NOT NULL,
    "base_amount" DECIMAL(21,4) NOT NULL,
    "discount_amount" DECIMAL(21,4) NOT NULL,
    "tax_amount" DECIMAL(21,4) NOT NULL,
    "delivery_amount" DECIMAL(21,4) NOT NULL,
    "dpp_amount" DECIMAL(21,4) NOT NULL,
    "company_id" CHAR(5) NOT NULL,
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3),
    "branch_id" CHAR(10),

    CONSTRAINT "pk_sls_Invoicedt" PRIMARY KEY ("company_id","invoice_id","delivery_id","product_id","acct_id","line_no")
);

-- CreateTable
CREATE TABLE "public"."sls_InvoiceHd" (
    "po_id" CHAR(80),
    "ecatalog_id" CHAR(60),
    "so_id" CHAR(20),
    "trxType" CHAR(3),
    "invoiceType_id" SMALLINT NOT NULL,
    "poType_id" SMALLINT NOT NULL,
    "invoice_id" CHAR(20) NOT NULL,
    "invoiceDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ref_id" CHAR(100),
    "tax_id" CHAR(10),
    "taxRate" SMALLINT,
    "debtor_id" CHAR(20) NOT NULL,
    "debtorName" VARCHAR(150),
    "customer_id" CHAR(20) NOT NULL,
    "customerName" VARCHAR(150),
    "creditTerms" SMALLINT,
    "dueDate" DATE,
    "salesPerson_id" CHAR(10) NOT NULL,
    "salesPersonName" VARCHAR(50) NOT NULL,
    "base_amount" DECIMAL(21,4),
    "dp_amount" DECIMAL(21,4),
    "discount_amount" DECIMAL(21,4),
    "totalDiscount_amount" DECIMAL(21,4),
    "tax_amount" DECIMAL(21,4),
    "totalDelivery_amount" DECIMAL(21,4),
    "dpp_amount" DECIMAL(21,4),
    "dpp_amount" DECIMAL(21,4),
    "trxStatus" "public"."TransactionRecordStatusEnum" NOT NULL DEFAULT '1',
    "paidStatus_id" SMALLINT NOT NULL,
    "company_id" CHAR(5) NOT NULL,
    "createdBy" CHAR(10),
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" CHAR(10),
    "updatedAt" TIMESTAMP(3),
    "branch_id" CHAR(10),

    CONSTRAINT "pk_sls_InvoiceHd" PRIMARY KEY ("company_id","invoice_id")
);

-- CreateTable
CREATE TABLE "public"."sys_PaidStatus" (
    "id" SMALLINT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "company_id" CHAR(5) NOT NULL,

    CONSTRAINT "pk_sys_PaidStatus" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."sls_InvoiceType" (
    "id" SMALLINT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "company_id" CHAR(5) NOT NULL,

    CONSTRAINT "sls_InvoiceType_pkey" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."sls_InvoicePoType" (
    "id" SMALLINT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "company_id" CHAR(5) NOT NULL,

    CONSTRAINT "sls_InvoicePoType_pkey" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."sys_TaxScheme" (
    "id" CHAR(10) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "taxRate" SMALLINT NOT NULL,
    "includeOrExclude" INTEGER NOT NULL,
    "company_id" CHAR(5) NOT NULL,

    CONSTRAINT "pk_sys_TaxScheme" PRIMARY KEY ("company_id","id")
);

-- CreateTable
CREATE TABLE "public"."ContactMessage" (
    "id" VARCHAR(30) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20),
    "company" VARCHAR(100),
    "message" TEXT NOT NULL,
    "status" "public"."ContactStatus" NOT NULL DEFAULT '0',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "company_id" CHAR(5) NOT NULL,
    "branch_id" CHAR(10),
    "createdBy" CHAR(10),
    "updatedBy" CHAR(10),

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_sys_Company_seq_no" ON "public"."sys_Company"("seq_no");

-- CreateIndex
CREATE UNIQUE INDEX "sys_WhiteListEmail_email_key" ON "public"."sys_WhiteListEmail"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sys_User_email_key" ON "public"."sys_User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "unique_user_role" ON "public"."sys_UserRole"("user_id", "role_id");

-- CreateIndex
CREATE UNIQUE INDEX "sys_User_Bak_email_key" ON "public"."sys_User_Bak"("email");

-- CreateIndex
CREATE UNIQUE INDEX "unique_userRole_company" ON "public"."sys_UserCompanyRole"("userRole_id", "company_id");

-- CreateIndex
CREATE UNIQUE INDEX "sys_Menu_Permission_userCompanyRole_id_menu_id_key" ON "public"."sys_Menu_Permission"("userCompanyRole_id", "menu_id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_floor_id_shelf_id" ON "public"."imc_Shelf"("floor_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_floor_id_shelf_id_row_id" ON "public"."imc_Row"("floor_id", "shelf_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "imc_Category_slug_key" ON "public"."imc_Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "company_id_id" ON "public"."imc_Category"("company_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_company_id_id" ON "public"."imc_Product"("company_id", "id");

-- CreateIndex
CREATE INDEX "ContactMessage_email_idx" ON "public"."ContactMessage"("email");

-- CreateIndex
CREATE INDEX "ContactMessage_createdAt_idx" ON "public"."ContactMessage"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."sys_UserRole" ADD CONSTRAINT "sys_UserRole_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."sys_Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sys_UserRole" ADD CONSTRAINT "sys_UserRole_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."sys_User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sys_UserCompanyRole" ADD CONSTRAINT "sys_UserCompanyRole_userRole_id_fkey" FOREIGN KEY ("userRole_id") REFERENCES "public"."sys_UserRole"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sys_UserCompanyRole" ADD CONSTRAINT "sys_UserCompanyRole_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."sys_Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sys_Menu" ADD CONSTRAINT "sys_Menu_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."sys_Menu"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sys_Menu_Permission" ADD CONSTRAINT "sys_Menu_Permission_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "public"."sys_Menu"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sys_Menu_Permission" ADD CONSTRAINT "sys_Menu_Permission_userCompanyRole_id_fkey" FOREIGN KEY ("userCompanyRole_id") REFERENCES "public"."sys_UserCompanyRole"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

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
ALTER TABLE "public"."imc_Product" ADD CONSTRAINT "imc_Product_company_id_brand_id_fkey" FOREIGN KEY ("company_id", "brand_id") REFERENCES "public"."imc_Brand"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."imc_Product" ADD CONSTRAINT "imc_Product_company_id_category_id_fkey" FOREIGN KEY ("company_id", "category_id") REFERENCES "public"."imc_Category"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."imc_Product" ADD CONSTRAINT "imc_Product_company_id_uom_id_fkey" FOREIGN KEY ("company_id", "uom_id") REFERENCES "public"."imc_Uom"("company_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."imc_Product" ADD CONSTRAINT "imc_Product_company_id_category_id_subCategory_id_fkey" FOREIGN KEY ("company_id", "category_id", "subCategory_id") REFERENCES "public"."imc_SubCategory"("company_id", "category_id", "id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."imc_ProductStock" ADD CONSTRAINT "imc_ProductStock_id_company_id_fkey" FOREIGN KEY ("id", "company_id") REFERENCES "public"."imc_Product"("id", "company_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."imc_ProductDesc" ADD CONSTRAINT "imc_ProductDesc_id_company_id_fkey" FOREIGN KEY ("id", "company_id") REFERENCES "public"."imc_Product"("id", "company_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."imc_ProductSpec" ADD CONSTRAINT "imc_ProductSpec_id_company_id_fkey" FOREIGN KEY ("id", "company_id") REFERENCES "public"."imc_Product"("id", "company_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."imc_ProductImage" ADD CONSTRAINT "imc_ProductImage_product_id_company_id_fkey" FOREIGN KEY ("product_id", "company_id") REFERENCES "public"."imc_Product"("id", "company_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."imc_ProductVideo" ADD CONSTRAINT "imc_ProductVideo_product_id_company_id_fkey" FOREIGN KEY ("product_id", "company_id") REFERENCES "public"."imc_Product"("id", "company_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."sls_InvoiceDt" ADD CONSTRAINT "sls_InvoiceDt_company_id_invoice_id_fkey" FOREIGN KEY ("company_id", "invoice_id") REFERENCES "public"."sls_InvoiceHd"("company_id", "invoice_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sls_InvoiceHd" ADD CONSTRAINT "sls_InvoiceHd_company_id_customer_id_fkey" FOREIGN KEY ("company_id", "customer_id") REFERENCES "public"."sls_Customer"("company_id", "id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sls_InvoiceHd" ADD CONSTRAINT "sls_InvoiceHd_company_id_salesPerson_id_fkey" FOREIGN KEY ("company_id", "salesPerson_id") REFERENCES "public"."sls_SalesPerson"("company_id", "id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sls_InvoiceHd" ADD CONSTRAINT "sls_InvoiceHd_company_id_paidStatus_id_fkey" FOREIGN KEY ("company_id", "paidStatus_id") REFERENCES "public"."sys_PaidStatus"("company_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sls_InvoiceHd" ADD CONSTRAINT "sls_InvoiceHd_company_id_invoiceType_id_fkey" FOREIGN KEY ("company_id", "invoiceType_id") REFERENCES "public"."sls_InvoiceType"("company_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sls_InvoiceHd" ADD CONSTRAINT "sls_InvoiceHd_company_id_poType_id_fkey" FOREIGN KEY ("company_id", "poType_id") REFERENCES "public"."sls_InvoicePoType"("company_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
