import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
// import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
// import { APP_GUARD } from '@nestjs/core';
// import { CustomThrottlerGuard } from './common/guards/custom-throttler.guard';
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
import { AnonymousSessionModule } from './auth/anonymous-session/anonymous-session.module';
import { BookingModule } from './wks/booking/booking.module';
import { BookingSlotModule } from './wks/booking-slot/booking-slot.module';
import { ServiceOrderModule } from './wks/service-order/service-order.module';
import { ReminderModule } from './wks/reminder/reminder.module';
import { WaitingListModule } from './wks/waiting-list/waiting-list.module';
import { PainPointModule } from './wks/pain-point/pain-point.module';
import { ImagesModule } from './wks/images/images.module';
import { VideosModule } from './wks/videos/videos.module';
import { WorkingHourModule } from './wks/working-hour/working-hour.module';
import { WhatsAppModule } from './whatsapp/whatsapp.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CommonModule, // Global module untuk shared services dan guards
    // TEMPORARY DISABLED FOR DEVELOPMENT PURPOSE - Afriza
    // Rate limiting dinonaktifkan sementara untuk development
    // TODO: Re-enable setelah optimasi request selesai
    // ThrottlerModule.forRoot([
    //   {
    //     name: 'default',
    //     ttl: 60, // 1 minute
    //     limit: 100, // 100 requests per minute
    //   },
    //   {
    //     name: 'strict',
    //     ttl: 60, // 1 minute
    //     limit: 10, // 10 requests per minute
    //   },
    //   {
    //     name: 'auth',
    //     ttl: 900, // 15 minutes
    //     limit: 10, // 10 requests per 15 minutes
    //   },
    //   {
    //     name: 'auth-strict',
    //     ttl: 3600, // 1 hour
    //     limit: 5, // 5 requests per hour
    //   },
    //   {
    //     name: 'auth-very-strict',
    //     ttl: 3600, // 1 hour
    //     limit: 3, // 3 requests per hour
    //   },
    //   {
    //     name: 'form-submission',
    //     ttl: 3600, // 1 hour
    //     limit: 10, // 10 requests per hour
    //   },
    //   {
    //     name: 'get-endpoints',
    //     ttl: 60, // 1 minute
    //     limit: 5000, // 5000 requests per minute (ditingkatkan untuk handle listing page dengan banyak request paralel)
    //   },
    //   {
    //     name: 'batch-endpoints',
    //     ttl: 60, // 1 minute
    //     limit: 10000, // 10000 requests per minute (untuk batch endpoints yang sering dipanggil paralel)
    //   },
    //   {
    //     name: 'check-availability',
    //     ttl: 60, // 1 minute
    //     limit: 30, // 30 requests per minute
    //   },
    //   {
    //     name: 'working-hours',
    //     ttl: 60, // 1 minute
    //     limit: 5000, // 5000 requests per minute (ditingkatkan untuk handle listing page dengan banyak request paralel saat reload/sorting)
    //   },
    // ]),
    ScheduleModule.forRoot(),
    EmailModule,
    WhatsAppModule,
    BetterAuthModule,
    CleanupModule,
    AnonymousSessionModule,
    BookingModule,
    BookingSlotModule,
    ServiceOrderModule,
    ReminderModule,
    WaitingListModule,
    PainPointModule,
    ImagesModule,
    VideosModule,
    WorkingHourModule,
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
  providers: [
    AppService,
    PrismaService,
    // TEMPORARY DISABLED FOR DEVELOPMENT PURPOSE - Afriza
    // Rate limiting dinonaktifkan sementara untuk development
    // TODO: Re-enable setelah optimasi request selesai
    // {
    //   provide: APP_GUARD,
    //   useClass: CustomThrottlerGuard,
    // },
  ],
})
export class AppModule {}
