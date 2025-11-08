import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Sys_ProvinceService } from './sys_Province.service';
import { sys_ProvinceController } from './sys_Province.controller';

@Module({
  controllers: [sys_ProvinceController],
  providers: [Sys_ProvinceService, PrismaService],
  exports: [Sys_ProvinceService],
})
export class sys_ProvinceModule {}
