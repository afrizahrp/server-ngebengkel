import { Module } from '@nestjs/common';
import { Sys_WhiteListEmailService } from './sys_WhiteListEmail.service';
import { Sys_WhiteListEmailController } from './sys_WhiteListEmail.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [Sys_WhiteListEmailController],
  providers: [Sys_WhiteListEmailService],
  exports: [Sys_WhiteListEmailService], // Export service agar bisa digunakan di module lain
})
export class Sys_WhiteListEmailModule {}
