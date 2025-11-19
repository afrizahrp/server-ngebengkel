import { Module, Global } from '@nestjs/common';
import { AnonymousSessionService } from './anonymous-session.service';
import { AnonymousSessionController } from './anonymous-session.controller';
import { PrismaService } from '../../prisma.service';

/**
 * Anonymous Session Module
 * Marked as @Global() agar AnonymousSessionService tersedia di semua modules
 * (dibutuhkan oleh AnonymousIdInterceptor yang digunakan di berbagai controller)
 */
@Global()
@Module({
  controllers: [AnonymousSessionController],
  providers: [AnonymousSessionService, PrismaService],
  exports: [AnonymousSessionService],
})
export class AnonymousSessionModule {}

