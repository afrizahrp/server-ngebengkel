import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { BookingService } from './booking.service';

@Module({
  imports: [PrismaModule],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}



