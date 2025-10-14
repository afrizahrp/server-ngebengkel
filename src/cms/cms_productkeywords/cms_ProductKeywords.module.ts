import { Module } from '@nestjs/common';
import { CmsProductKeywordsController } from './cms_ProductKeywords.controller';
import { CmsProductKeywordsService } from './cms_ProductKeywords.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CmsProductKeywordsController],
  providers: [CmsProductKeywordsService],
  exports: [CmsProductKeywordsService],
})
export class CmsProductKeywordsModule {}
