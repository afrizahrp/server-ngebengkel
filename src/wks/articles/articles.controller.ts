import { Controller, Post, Get, Patch, Query, Param, Body, UseGuards } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticleStatusEnum } from '@prisma/client';

@Controller('wks/articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  /**
   * Generate articles untuk pain points dengan priority=10
   * POST /api/wks/articles/generate
   * Body: { painPointIds: string[] }
   */
  @Post('generate')
  async generateArticles(@Body() body: { painPointIds: string[] }) {
    return this.articlesService.generateArticles(body.painPointIds);
  }

  /**
   * Get articles dengan filter status dan pagination
   * GET /api/wks/articles?status=DRAFT&page=1&limit=20
   */
  @Get()
  async getArticles(
    @Query('status') status?: ArticleStatusEnum,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    return this.articlesService.getArticles(status, parseInt(page), parseInt(limit));
  }

  /**
   * Get article by slug (for public pages)
   * GET /api/wks/articles/slug/:slug
   */
  @Get('slug/:slug')
  async getArticleBySlug(@Param('slug') slug: string) {
    return this.articlesService.getArticleBySlug(slug);
  }

  /**
   * Get article by ID dengan pain point details
   * GET /api/wks/articles/:id
   */
  @Get(':id')
  async getArticleById(@Param('id') id: string) {
    return this.articlesService.getArticleById(id);
  }

  /**
   * Get recommended workshops untuk sebuah article
   * GET /api/wks/articles/:id/recommended-workshops
   */
  @Get(':id/recommended-workshops')
  async getRecommendedWorkshops(@Param('id') id: string) {
    return this.articlesService.getRecommendedWorkshops(id);
  }

  /**
   * Update article content (manual edits sebelum publish)
   * PATCH /api/wks/articles/:id
   */
  @Patch(':id')
  async updateArticle(@Param('id') id: string, @Body() body: any) {
    return this.articlesService.updateArticle(id, body);
  }

  /**
   * Publish article (change status dari DRAFT ke PUBLISHED)
   * POST /api/wks/articles/:id/publish
   */
  @Post(':id/publish')
  async publishArticle(@Param('id') id: string, @Body() body?: { publishedBy?: string }) {
    return this.articlesService.publishArticle(id, body?.publishedBy);
  }
}
