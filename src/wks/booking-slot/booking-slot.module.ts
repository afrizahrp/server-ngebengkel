import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { BetterAuthModule } from '../../auth/better-auth/better-auth.module';
import { BookingSlotService } from './booking-slot.service';
import { BookingSlotController } from './booking-slot.controller';

@Module({
  imports: [PrismaModule, BetterAuthModule],
  controllers: [BookingSlotController],
  providers: [BookingSlotService],
  exports: [BookingSlotService],
})
export class BookingSlotModule {}
