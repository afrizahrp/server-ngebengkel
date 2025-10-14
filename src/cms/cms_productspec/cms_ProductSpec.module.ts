import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { cms_ProductSpecService } from './cms_ProductSpec.service';
import { cms_ProductSpecController } from './cms_ProductSpec.controller';

@Module({
  controllers: [cms_ProductSpecController],

  providers: [cms_ProductSpecService, PrismaService],
  exports: [cms_ProductSpecService],
})
export class cms_ProductSpecModule {}
