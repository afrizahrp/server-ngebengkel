import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Sys_DistrictService } from './sys_District.service';
import { sys_DistrictController } from './sys_District.controller';

@Module({
  controllers: [sys_DistrictController],
  providers: [Sys_DistrictService, PrismaService],
  exports: [Sys_DistrictService],
})
export class sys_DistrictModule {}
