import { Module } from '@nestjs/common';
import { TwoFactorService } from './two-factor.service';
import { PrismaService } from '../../prisma.service';
import { EmailModule } from '../../email/email.module';

@Module({
  imports: [EmailModule],
  providers: [TwoFactorService, PrismaService],
  exports: [TwoFactorService],
})
export class TwoFactorModule {}
