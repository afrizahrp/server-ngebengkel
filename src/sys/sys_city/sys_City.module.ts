import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Sys_CityService } from './sys_City.service';
import { sys_CityController } from './sys_City.controller';

@Module({
  controllers: [sys_CityController],
  providers: [Sys_CityService, PrismaService],
  exports: [Sys_CityService],
})
export class sys_CityModule {}
