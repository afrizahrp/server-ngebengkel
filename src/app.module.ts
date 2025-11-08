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
import { sys_ProvinceModule } from './sys/sys_province/sys_Province.module';
import { sys_CityModule } from './sys/sys_city/sys_City.module';
import { sys_DistrictModule } from './sys/sys_district/sys_District.module';
import { sys_SubDistrictModule } from './sys/sys_subdistrict/sys_SubDistrict.module';
import { EmailModule } from './email/email.module';
import { CleanupModule } from './auth/cleanup/cleanup.module';
import { BookingModule } from './wks/booking/booking.module';
import { BookingSlotModule } from './wks/booking-slot/booking-slot.module';
import { ServiceOrderModule } from './wks/service-order/service-order.module';
import { ReminderModule } from './wks/reminder/reminder.module';
import { WaitingListModule } from './srv/wks/waiting-list/waiting-list.module';
import { WhatsAppModule } from './whatsapp/whatsapp.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    EmailModule,
    WhatsAppModule,
    BetterAuthModule,
    CleanupModule,
    BookingModule,
    BookingSlotModule,
    ServiceOrderModule,
    ReminderModule,
    WaitingListModule,
    sys_CompanyModule,
    sys_BranchModule,
    sys_UserModule,
    Sys_UserRoleModule,
    Sys_UserCompanyRoleModule,
    sys_MenuModule,
    sys_MenuPermissionModule,
    sys_ProvinceModule,
    sys_CityModule,
    sys_DistrictModule,
    sys_SubDistrictModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
