import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Sys_SubDistrictService } from './sys_SubDistrict.service';
import { sys_SubDistrictController } from './sys_SubDistrict.controller';

@Module({
  controllers: [sys_SubDistrictController],
  providers: [Sys_SubDistrictService, PrismaService],
  exports: [Sys_SubDistrictService],
})
export class sys_SubDistrictModule {}
