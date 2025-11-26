import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { WaitingListController } from './waiting-list.controller';
import { WaitingListService } from './waiting-list.service';
import { EmailModule } from '../../email/email.module';
import { WhatsAppModule } from '../../whatsapp/whatsapp.module';
import { UploadNotificationService } from './services/upload-notification.service';

@Module({
  imports: [PrismaModule, EmailModule, WhatsAppModule],
  controllers: [WaitingListController],
  providers: [WaitingListService, UploadNotificationService],
  exports: [UploadNotificationService], // Export untuk digunakan di module lain
})
export class WaitingListModule {}
