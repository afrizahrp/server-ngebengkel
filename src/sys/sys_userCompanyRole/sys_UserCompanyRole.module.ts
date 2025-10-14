import { Module } from '@nestjs/common';
import { Sys_UserCompanyRoleController } from './sys_UserCompanyRole.controller';
import { Sys_UserCompanyRoleService } from './sys_UserCompanyRole.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [Sys_UserCompanyRoleController],
  providers: [Sys_UserCompanyRoleService, PrismaService],
  exports: [Sys_UserCompanyRoleService],
})
export class Sys_UserCompanyRoleModule {}


