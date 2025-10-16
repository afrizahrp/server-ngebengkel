import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { sys_UserModule } from './sys/sys_user/sys_User.module';
import { Sys_UserRoleModule } from './sys/sys_userRole/sys_UserRole.module';
import { Sys_UserCompanyRoleModule } from './sys/sys_userCompanyRole/sys_UserCompanyRole.module';

import { BetterAuthModule } from './auth/better-auth/better-auth.module';
import { PrismaService } from './prisma.service';

import { sys_CompanyModule } from './sys/sys_company/sys_Company.module';
import { sys_BranchModule } from './sys/sys_branch/sys_Branch.module';
import { sys_MenuModule } from './sys/sys_menu/sys_Menu.module';
import { sys_MenuPermissionModule } from './sys/sys_menu_permission/sys_Menu_Permission.module';
import { EmailModule } from './email/email.module';
import { CleanupModule } from './auth/cleanup/cleanup.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    EmailModule,
    BetterAuthModule,
    CleanupModule,
    sys_CompanyModule,
    sys_BranchModule,
    sys_UserModule,
    Sys_UserRoleModule,
    Sys_UserCompanyRoleModule,
    sys_MenuModule,
    sys_MenuPermissionModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
