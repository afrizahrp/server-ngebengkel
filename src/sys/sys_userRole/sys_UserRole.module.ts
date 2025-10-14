import { Module } from '@nestjs/common';
import { Sys_UserRoleController } from './sys_UserRole.controller';
import { Sys_UserRoleService } from './sys_UserRole.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [Sys_UserRoleController],
  providers: [Sys_UserRoleService, PrismaService],
  exports: [Sys_UserRoleService],
})
export class Sys_UserRoleModule {}


