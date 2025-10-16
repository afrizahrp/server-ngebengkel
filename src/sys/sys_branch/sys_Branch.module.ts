import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Sys_BranchService } from './sys_Branch.service';
import { sys_BranchController } from './sys_Branch.controller';

@Module({
  controllers: [sys_BranchController],
  providers: [Sys_BranchService, PrismaService],
  exports: [Sys_BranchService],
})
export class sys_BranchModule {}
