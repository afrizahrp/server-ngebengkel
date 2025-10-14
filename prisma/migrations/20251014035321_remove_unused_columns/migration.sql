/*
  Warnings:

  - You are about to drop the column `slug` on the `imc_Category` table. All the data in the column will be lost.
  - You are about to drop the column `has_3d_model` on the `imc_Product` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `imc_Product` table. All the data in the column will be lost.
  - You are about to drop the column `slug_en` on the `imc_Product` table. All the data in the column will be lost.
  - You are about to drop the column `subcategory_slug` on the `imc_Product` table. All the data in the column will be lost.
  - You are about to drop the column `subcategory_slug_en` on the `imc_Product` table. All the data in the column will be lost.
  - You are about to drop the column `descriptions_en` on the `imc_SubCategory` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `imc_SubCategory` table. All the data in the column will be lost.
  - You are about to drop the column `slug_en` on the `imc_SubCategory` table. All the data in the column will be lost.
  - You are about to drop the `cms_subCategoryHeader` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cms_subCategoryKeywords` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `imc_SubCategory_web` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."cms_subCategoryHeader" DROP CONSTRAINT "cms_subCategoryHeader_company_id_category_id_subCategory_i_fkey";

-- DropForeignKey
ALTER TABLE "public"."cms_subCategoryKeywords" DROP CONSTRAINT "cms_subCategoryKeywords_company_id_category_id_subCategory_fkey";

-- DropIndex
DROP INDEX "public"."imc_Category_slug_key";

-- AlterTable
ALTER TABLE "imc_Category" DROP COLUMN "slug";

-- AlterTable
ALTER TABLE "imc_Product" DROP COLUMN "has_3d_model",
DROP COLUMN "slug",
DROP COLUMN "slug_en",
DROP COLUMN "subcategory_slug",
DROP COLUMN "subcategory_slug_en";

-- AlterTable
ALTER TABLE "imc_SubCategory" DROP COLUMN "descriptions_en",
DROP COLUMN "slug",
DROP COLUMN "slug_en";

-- DropTable
DROP TABLE "public"."cms_subCategoryHeader";

-- DropTable
DROP TABLE "public"."cms_subCategoryKeywords";

-- DropTable
DROP TABLE "public"."imc_SubCategory_web";
