import { Module } from '@nestjs/common';
import { cms_subCategoryHeaderService } from './cms_subcategoryHeader.service';
import { cms_SubCategoryHeaderController } from './cms_subcategoryHeader.controller';
import { PrismaService } from '../../prisma.service';
import { OpenAIService } from '../cms_productdesc/openai.service';

@Module({
  controllers: [cms_SubCategoryHeaderController],
  providers: [cms_subCategoryHeaderService, PrismaService, OpenAIService],
  exports: [cms_subCategoryHeaderService],
})
export class cms_SubCategoryHeaderModule {}
