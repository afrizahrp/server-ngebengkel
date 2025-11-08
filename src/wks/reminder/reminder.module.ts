import { Module } from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { ReminderController } from './reminder.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { WhatsAppModule } from '../../whatsapp/whatsapp.module';
import { BetterAuthModule } from '../../auth/better-auth/better-auth.module';

@Module({
  imports: [PrismaModule, WhatsAppModule, BetterAuthModule],
  controllers: [ReminderController],
  providers: [ReminderService],
  exports: [ReminderService],
})
export class ReminderModule {}
