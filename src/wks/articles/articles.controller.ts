import { Controller, Post, Get, Patch, Query, Param, Body, UseGuards } from '@nestjs/common';
import { Public } from '../../auth/decorators/public.decorator';
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
  async generateArticles(
    @Body()
    body: {
      generationType?: 'painPoint' | 'seasonal';
      painPointIds?: string[];
      seasonalTopicId?: string;
      prompt?: string | null;
    },
  ) {
    return this.articlesService.generateArticles(body);
  }

  /**
   * Get articles dengan filter status dan pagination
   * GET /api/wks/articles?status=DRAFT&page=1&limit=20
   * 
   * Public endpoint - untuk website listing
   * Limit defaults to 20 (set in service), max 100
   */
  @Get()
  @Public()
  async getArticles(
    @Query('status') status?: ArticleStatusEnum,
    @Query('page') page: string = '1',
    @Query('limit') limit?: string,
  ) {
    return this.articlesService.getArticles(
      status,
      parseInt(page) || 1,
      limit ? parseInt(limit) : undefined,
    );
  }

  /**
   * Get article by slug (for public pages)
   * GET /api/wks/articles/slug/:slug
   * 
   * Public endpoint - untuk website listing
   * 
   * IMPORTANT: Route ini harus SEBELUM @Get(':id') agar tidak ditangkap sebagai parameter
   */
  @Get('slug/:slug')
  @Public()
  async getArticleBySlug(@Param('slug') slug: string) {
    return this.articlesService.getArticleBySlug(slug);
  }

  /**
   * Get article by ID dengan pain point details
   * GET /api/wks/articles/:id
   * 
   * Public endpoint - untuk website listing
   */
  @Get(':id')
  @Public()
  async getArticleById(@Param('id') id: string) {
    return this.articlesService.getArticleById(id);
  }

  /**
   * Get recommended workshops untuk sebuah article
   * GET /api/wks/articles/:id/recommended-workshops
   * 
   * Public endpoint - untuk website listing
   */
  @Get(':id/recommended-workshops')
  @Public()
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
