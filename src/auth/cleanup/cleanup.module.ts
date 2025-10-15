import { Module } from '@nestjs/common';
import { CleanupService } from './cleanup.service';
import { CleanupController } from './cleanup.controller';
import { PrismaService } from '../../prisma.service';

@Module({
  controllers: [CleanupController],
  providers: [CleanupService, PrismaService],
  exports: [CleanupService],
})
export class CleanupModule {}
