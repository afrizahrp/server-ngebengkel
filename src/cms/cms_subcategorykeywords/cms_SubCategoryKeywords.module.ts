import { Module } from '@nestjs/common';
import { CmsSubCategoryKeywordsController } from './cms_SubCategoryKeywords.controller';
import { CmsSubCategoryKeywordsService } from './cms_SubCategoryKeywords.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CmsSubCategoryKeywordsController],
  providers: [CmsSubCategoryKeywordsService],
  exports: [CmsSubCategoryKeywordsService],
})
export class CmsSubCategoryKeywordsModule {}


