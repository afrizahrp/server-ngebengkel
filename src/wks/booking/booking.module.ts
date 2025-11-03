import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { WhatsAppModule } from '../../whatsapp/whatsapp.module';
import { BetterAuthModule } from '../../auth/better-auth/better-auth.module';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';

@Module({
  imports: [PrismaModule, WhatsAppModule, BetterAuthModule],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}


