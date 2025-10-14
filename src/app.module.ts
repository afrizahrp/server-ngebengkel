import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { sys_UserModule } from './sys/sys_user/sys_User.module';
import { sys_UserCompanyRoleModule } from './sys/sys_userCompanyRole/sys_UserCompaniesRole.module';
import { Sys_UserRoleModule } from './sys/sys_userRole/sys_UserRole.module';
import { Sys_UserCompanyRoleModule } from './sys/sys_userCompanyRole/sys_UserCompanyRole.module';

import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma.service';
import {
  cms_BillboardsModule,
  cms_ProductModule,
  cms_ProductDescModule,
  cms_ProductSpecModule,
} from './cms';
import { CmsProductKeywordsModule } from './cms/cms_productkeywords/cms_ProductKeywords.module';
import { CmsSubCategoryKeywordsModule } from './cms/cms_subcategorykeywords/cms_SubCategoryKeywords.module';
import { cms_ProductHeaderModule } from './cms/cms_productheader/cms_ProductHeader.module';
import { cms_SubCategoryHeaderModule } from './cms/cms_subcategoryheader/cms_subcategoryHeader.module';

import {
  imc_CategoryTypeModule,
  imc_CategoryModule,
  imc_ProductModule,
  imc_ProductStockCardModule,
  ImcUomModule,
  ImcBrandModule,
  ImcSubCategoryModule,
  imc_ProductImageModule,
} from './imc';

import { sys_CompanyModule } from './sys/sys_company/sys_Company.module';
import { sys_MenuModule } from './sys/sys_menu/sys_Menu.module';
import { sys_MenuPermissionModule } from './sys/sys_menu_permission/sys_Menu_Permission.module';
import { Sys_WhiteListEmailModule } from './sys/sys_whitelistemail/sys_WhiteListEmail.module';

import { salesInvoiceHdModule } from './sales/salesInvoice/salesInvoiceHd/salesInvoiceHd.module';
import { salesInvoiceItemModule } from './sales/salesInvoice/salesInvoiceItem/salesInvoiceItem.module';

import { salesInvoiceDashboardModule } from './dashboard/sales/salesInvoice/salesInvoiceDashboard.module';
import { salesPersonPerformaDashboardModule } from './dashboard/sales/salesPerson-performa/salesPersonPerformaDashboard.module';

import { salesInvoiceAnalyticsModule } from './analytics/sales/salesInvoice/salesInvoiceAnalytics.module';
import { salesPersonPerformaAnalyticsModule } from './analytics/sales/salesPerson-performa/salesPersonPerformaAnalytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    sys_CompanyModule,
    sys_UserModule,
    sys_UserCompanyRoleModule,
    Sys_UserRoleModule,
    Sys_UserCompanyRoleModule,
    sys_MenuModule,
    sys_MenuPermissionModule,
    Sys_WhiteListEmailModule,
    cms_ProductModule,
    cms_ProductDescModule,
    cms_ProductSpecModule,
    cms_BillboardsModule,
    CmsProductKeywordsModule,
    CmsSubCategoryKeywordsModule,
    cms_ProductHeaderModule,
    cms_SubCategoryHeaderModule,
    imc_CategoryTypeModule,
    imc_CategoryModule,
    imc_ProductModule,
    imc_ProductStockCardModule,
    ImcUomModule,
    ImcSubCategoryModule,
    ImcBrandModule,
    imc_ProductImageModule,

    salesInvoiceHdModule,
    salesInvoiceItemModule,
    salesInvoiceDashboardModule,
    salesPersonPerformaDashboardModule,
    salesInvoiceAnalyticsModule,
    salesPersonPerformaAnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
