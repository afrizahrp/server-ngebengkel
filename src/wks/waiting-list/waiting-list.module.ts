import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../prisma/prisma.module';
import { WaitingListController } from './waiting-list.controller';
import { WaitingListService } from './waiting-list.service';
import { EmailModule } from '../../email/email.module';
import { WhatsAppModule } from '../../whatsapp/whatsapp.module';
import { UploadNotificationService } from './services/upload-notification.service';
import { ClaimService } from './services/claim.service';
import claimConfig from './config/claim.config';

@Module({
  imports: [
    PrismaModule,
    EmailModule,
    WhatsAppModule,
    ConfigModule.forFeature(claimConfig),
  ],
  controllers: [WaitingListController],
  providers: [WaitingListService, UploadNotificationService, ClaimService],
  exports: [UploadNotificationService, ClaimService], // Export untuk digunakan di module lain
})
export class WaitingListModule {}
