import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Sys_UserCompanyRoleService } from './sys_UserCompanyRole.service';
import { Sys_UserCompanyRoleController } from './sys_UserCompanyRole.controller';

@Module({
  controllers: [Sys_UserCompanyRoleController],
  providers: [Sys_UserCompanyRoleService, PrismaService],
  exports: [Sys_UserCompanyRoleService], // Jika perlu digunakan di modul lain
})
export class sys_UserCompanyRoleModule {}
