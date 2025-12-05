import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { OpenAIArticleService } from './openai-article.service';
import { PrismaService } from '../../prisma.service';

@Module({
  controllers: [ArticlesController],
  providers: [ArticlesService, OpenAIArticleService, PrismaService],
  exports: [ArticlesService, OpenAIArticleService],
})
export class ArticlesModule {}
