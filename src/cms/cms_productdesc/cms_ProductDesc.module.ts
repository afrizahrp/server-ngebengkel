import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { cms_ProductDescService } from './cms_ProductDesc.service';
import { cms_ProductDescAutoGeneratorService } from './cms_ProductDescAutoGenerator.service';
import { PrismaService } from 'src/prisma.service';
import { cms_ProductDescController } from './cms_ProductDesc.controller';
import { cms_ProductDescAutoGeneratorController } from './cms_ProductDescAutoGenerator.controller';
import { OpenAIService } from './openai.service';

@Module({
  imports: [ConfigModule],
  controllers: [
    cms_ProductDescController,
    cms_ProductDescAutoGeneratorController,
  ],
  providers: [
    cms_ProductDescService,
    cms_ProductDescAutoGeneratorService,
    PrismaService,
    OpenAIService,
  ],
  exports: [
    cms_ProductDescService,
    cms_ProductDescAutoGeneratorService,
    OpenAIService,
  ],
})
export class cms_ProductDescModule {}
