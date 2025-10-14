import { Module } from '@nestjs/common';
import { cms_ProductHeaderController } from './cms_ProductHeader.controller';
import { cms_ProductHeaderService } from './cms_ProductHeader.service';
import { PrismaService } from 'src/prisma.service';
import { OpenAIService } from '../cms_productdesc/openai.service';

@Module({
  controllers: [cms_ProductHeaderController],
  providers: [cms_ProductHeaderService, PrismaService, OpenAIService],
  exports: [cms_ProductHeaderService],
})
export class cms_ProductHeaderModule {}











