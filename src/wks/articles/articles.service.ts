import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { OpenAIArticleService } from './openai-article.service';
import { ArticleGenerationTypeEnum, ArticleStatusEnum } from '@prisma/client';
import { getSeasonalTopicById, slugifyTopicTitle } from './seasonal-topics';

@Injectable()
export class ArticlesService {
  private readonly logger = new Logger(ArticlesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly openaiService: OpenAIArticleService,
  ) {}

  /**
   * Generate articles untuk pain points (batch atau single)
   * Menyimpan sebagai DRAFT dengan contentOriginal backup
   */
  async generateArticles(body: {
    generationType?: 'painPoint' | 'seasonal';
    painPointIds?: string[];
    seasonalTopicId?: string;
    prompt?: string | null;
  }) {
    const generationType = body.generationType || 'painPoint';

    if (generationType === 'seasonal') {
      const topicId = body.seasonalTopicId;
      if (!topicId) {
        throw new BadRequestException('seasonalTopicId diperlukan untuk seasonal generation');
      }

      const topic = getSeasonalTopicById(topicId);
      if (!topic) {
        throw new BadRequestException('Seasonal topic tidak ditemukan');
      }

      const results = {
        success: 0,
        failed: 0,
        errors: [] as Array<{ topicId: string; error: string }>,
      };

      try {
        const generatedContent = await this.openaiService.generateSeasonalArticle(topic);

        const baseSlugFromTitle = slugifyTopicTitle(topic.title) || topic.id.toLowerCase();
        const baseSlug = `seasonal-${baseSlugFromTitle}`.substring(0, 140);
        let slug = baseSlug;
        let counter = 1;

        while (
          await this.prisma.wks_Article.findUnique({
            where: { slug },
          })
        ) {
          slug = `${baseSlug}-v${counter}`;
          counter++;
        }

        const contentJson = JSON.parse(JSON.stringify({
          causes: generatedContent.causes || [],
          diagnosis: generatedContent.diagnosis || [],
          costEstimate: generatedContent.costEstimate || { minIDR: 0, maxIDR: 0, notes: '' },
          safety: generatedContent.safety || '',
          prevention: generatedContent.prevention || [],
          faq: generatedContent.faq || [],
        }));

        const truncatedSlug = slug.substring(0, 150);
        const truncatedTitle = (generatedContent.title || topic.title).substring(0, 200);
        const truncatedMetaTitle = (generatedContent.metaTitle || truncatedTitle).substring(0, 70);
        const truncatedMetaDescription = (generatedContent.metaDescription || '').substring(0, 160);

        this.logger.log(`Attempting to create seasonal article with slug: ${truncatedSlug}`);

        await this.prisma.wks_Article.create({
          data: {
            slug: truncatedSlug,
            painPoint_id: null,
            seasonalTopicId: topic.id,
            seasonalTopicTitle: topic.title,
            title: truncatedTitle,
            metaTitle: truncatedMetaTitle,
            metaDescription: truncatedMetaDescription,
            content: contentJson,
            contentOriginal: contentJson,
            status: ArticleStatusEnum.DRAFT,
            generationType: ArticleGenerationTypeEnum.SEASONAL,
            generatedAt: new Date(),
            createdBy: 'system',
          },
        });

        results.success++;
        this.logger.log(`✓ Seasonal article generated: ${topic.title}`);
      } catch (error) {
        results.failed++;
        const errorMessage = error instanceof Error ? error.message : String(error);
        results.errors.push({
          topicId: topicId,
          error: errorMessage,
        });
        this.logger.error(`✗ Failed to generate seasonal article: ${errorMessage}`);
      }

      return results;
    }

    // Default: pain point flow (backward compatible)
    const painPointIds = body.painPointIds;
    if (!painPointIds || painPointIds.length === 0) {
      throw new BadRequestException('Pain point IDs diperlukan');
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [] as Array<{ painPointId: string; error: string }>,
    };

    const painPoints = await this.prisma.wks_PainPoint.findMany({
      where: {
        id: { in: painPointIds },
        isActive: true,
        isDeleted: false,
      },
      include: {
        workshopTypes: {
          where: { relevance: { gte: 7 } },
          include: { workshopType: true },
        },
      },
    });

    if (painPoints.length === 0) {
      throw new BadRequestException('Tidak ada pain point aktif yang ditemukan');
    }

    this.logger.log(`Starting article generation for ${painPoints.length} pain points`);

    for (const painPoint of painPoints) {
      try {
        const workshopTypes = painPoint.workshopTypes.map((wt) => ({
          id: wt.workshopType.id,
          name: wt.workshopType.name,
          relevance: wt.relevance,
        }));

        const generatedContent = await this.openaiService.generateArticle({
          title: painPoint.title,
          description: painPoint.description,
          category: painPoint.category,
          keywords: (painPoint.keywords as string[]) || [],
          isUrgent: painPoint.isUrgent,
          priority: painPoint.priority,
          workshopTypes,
        });

        const baseSlug = painPoint.slug.substring(0, 140);
        let slug = baseSlug;
        let counter = 1;

        while (
          await this.prisma.wks_Article.findUnique({
            where: { slug },
          })
        ) {
          slug = `${baseSlug}-v${counter}`;
          counter++;
        }

        const contentJson = JSON.parse(JSON.stringify({
          causes: generatedContent.causes || [],
          diagnosis: generatedContent.diagnosis || [],
          costEstimate: generatedContent.costEstimate || { minIDR: 0, maxIDR: 0, notes: '' },
          safety: generatedContent.safety || '',
          prevention: generatedContent.prevention || [],
          faq: generatedContent.faq || [],
        }));

        const truncatedSlug = slug.substring(0, 150);
        const truncatedPainPointId = painPoint.id.substring(0, 25);
        const truncatedTitle = (generatedContent.title || '').substring(0, 200);
        const truncatedMetaTitle = (generatedContent.metaTitle || '').substring(0, 70);
        const truncatedMetaDescription = (generatedContent.metaDescription || '').substring(0, 160);

        this.logger.log(`Attempting to create article with slug: ${truncatedSlug}`);
        this.logger.debug('DATA SENT TO PRISMA:', JSON.stringify({
          slug: truncatedSlug,
          painPoint_id: truncatedPainPointId,
          title: truncatedTitle,
          metaTitle: truncatedMetaTitle,
          metaDescription: truncatedMetaDescription,
          content: contentJson,
          contentOriginal: contentJson,
          status: ArticleStatusEnum.DRAFT,
          generatedAt: new Date(),
          createdBy: 'system',
        }, null, 2));

        try {
          await this.prisma.wks_Article.create({
            data: {
              slug: truncatedSlug,
              painPoint_id: truncatedPainPointId,
              title: truncatedTitle,
              metaTitle: truncatedMetaTitle,
              metaDescription: truncatedMetaDescription,
              content: contentJson,
              contentOriginal: contentJson,
              status: ArticleStatusEnum.DRAFT,
              generationType: ArticleGenerationTypeEnum.PAIN_POINT,
              generatedAt: new Date(),
              createdBy: 'system',
            },
          });
        } catch (error: any) {
          this.logger.error('Prisma create error:', {
            message: error.message,
            code: error.code,
            meta: error.meta,
            clientVersion: error.clientVersion,
          });
          throw error;
        }

        results.success++;
        this.logger.log(`✓ Article generated for pain point: ${painPoint.title}`);
      } catch (error) {
        results.failed++;
        const errorMessage = error instanceof Error ? error.message : String(error);
        results.errors.push({
          painPointId: painPoint.id,
          error: errorMessage,
        });
        this.logger.error(
          `✗ Failed to generate article for ${painPoint.title}: ${errorMessage}`,
        );
      }
    }

    return results;
  }

  /**
   * Get articles dengan filter status dan pagination
   */
  async getArticles(status?: ArticleStatusEnum, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [articles, total] = await Promise.all([
      this.prisma.wks_Article.findMany({
        where: {
          ...(status && { status }),
        },
        include: {
          painPoint: {
            select: { id: true, title: true, slug: true, category: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.wks_Article.count({
        where: {
          ...(status && { status }),
        },
      }),
    ]);

    return {
      data: articles,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get article by slug (for public pages)
   */
  async getArticleBySlug(slug: string) {
    const article = await this.prisma.wks_Article.findFirst({
      where: { 
        slug,
        status: ArticleStatusEnum.PUBLISHED, // Only published articles
      },
      include: {
        painPoint: {
          include: {
            workshopTypes: {
              where: { relevance: { gte: 7 } },
              include: { workshopType: true },
            },
          },
        },
      },
    });

    if (!article) {
      throw new BadRequestException('Article tidak ditemukan');
    }

    // Increment view count
    await this.prisma.wks_Article.update({
      where: { id: article.id },
      data: { viewCount: { increment: 1 } },
    });

    return article;
  }

  /**
   * Get article by ID dengan pain point details
   */
  async getArticleById(id: string) {
    const article = await this.prisma.wks_Article.findUnique({
      where: { id },
      include: {
        painPoint: {
          include: {
            workshopTypes: {
              where: { relevance: { gte: 7 } },
              include: { workshopType: true },
            },
          },
        },
      },
    });

    if (!article) {
      throw new BadRequestException('Article tidak ditemukan');
    }

    return article;
  }

  /**
   * Update article content (manual edits sebelum publish)
   */
  async updateArticle(id: string, updateData: any) {
    const article = await this.prisma.wks_Article.findUnique({
      where: { id },
    });

    if (!article) {
      throw new BadRequestException('Article tidak ditemukan');
    }

    // Hanya bisa edit jika status DRAFT
    if (article.status !== ArticleStatusEnum.DRAFT) {
      throw new BadRequestException('Hanya bisa edit article yang status DRAFT');
    }

    return this.prisma.wks_Article.update({
      where: { id },
      data: {
        ...(updateData.title && { title: updateData.title }),
        ...(updateData.metaTitle && { metaTitle: updateData.metaTitle }),
        ...(updateData.metaDescription && { metaDescription: updateData.metaDescription }),
        ...(updateData.content && { content: updateData.content }),
        ...(updateData.imageUrl && { imageUrl: updateData.imageUrl }),
        ...(updateData.reviewNotes && { reviewNotes: updateData.reviewNotes }),
        updatedBy: updateData.updatedBy || 'system',
      },
    });
  }

  /**
   * Publish article (change status dari DRAFT ke PUBLISHED)
   */
  async publishArticle(id: string, publishedBy?: string) {
    const article = await this.prisma.wks_Article.findUnique({
      where: { id },
    });

    if (!article) {
      throw new BadRequestException('Article tidak ditemukan');
    }

    if (article.status !== ArticleStatusEnum.DRAFT) {
      throw new BadRequestException('Hanya bisa publish article yang status DRAFT');
    }

    return this.prisma.wks_Article.update({
      where: { id },
      data: {
        status: ArticleStatusEnum.PUBLISHED,
        publishedAt: new Date(),
        publishedBy: publishedBy || 'website', // Hardcoded untuk sementara
      },
    });
  }

  /**
   * Get recommended workshops untuk sebuah article
   * Menggunakan pain point's workshop types mapping
   * Prioritize subscribers (non-demo), fallback ke demo
   */
  async getRecommendedWorkshops(articleId: string) {
    const article = await this.prisma.wks_Article.findUnique({
      where: { id: articleId },
      include: {
        painPoint: {
          include: {
            workshopTypes: {
              select: { workshopType_id: true, relevance: true },
            },
          },
        },
      },
    });

    if (!article) {
      throw new BadRequestException('Article tidak ditemukan');
    }

    // Seasonal articles might not have a linked pain point; return generic recommendations
    if (!article.painPoint) {
      const workshops = await this.prisma.wks_waitingList.findMany({
        where: {
          isDeleted: false,
        },
        take: 8,
      });

      return workshops.map((w) => ({
        id: w.id,
        name: w.name,
        slug: w.slug,
        address: w.address || '',
        logo: w.logo || null,
        city: w.city || 'N/A',
        isDemo: w.name.toLowerCase().includes('demo'),
        rating: w.gbp_rating ? parseFloat(w.gbp_rating.toString()) : 0,
        phone: w.phone || '',
        mobile: w.mobile || '',
      }));
    }

    // Get all workshop types (regardless of relevance) for fallback
    const allWorkshopTypes = article.painPoint.workshopTypes;
    this.logger.log(`Pain point ${article.painPoint.id} has ${allWorkshopTypes.length} workshop types total`);
    
    // Filter by relevance >= 7
    const highRelevanceTypes = allWorkshopTypes.filter((wt) => wt.relevance >= 7);
    this.logger.log(`High relevance (>= 7): ${highRelevanceTypes.length} types`);

    // Use high relevance types first, fallback to all if none found
    const workshopTypeIds = highRelevanceTypes.length > 0 
      ? highRelevanceTypes.map((wt) => wt.workshopType_id)
      : allWorkshopTypes.map((wt) => wt.workshopType_id);

    let workshops: any[] = [];

    // Try to fetch workshops with specific types first
    if (workshopTypeIds.length > 0) {
      this.logger.log(`Searching workshops for types: ${workshopTypeIds.join(', ')}`);
      workshops = await this.prisma.wks_waitingList.findMany({
        where: {
          isDeleted: false,
          type_id: { in: workshopTypeIds },
        },
        take: 8,
      });
    }

    // Fallback: if no workshops found for specific types, fetch any available workshops
    if (workshops.length === 0) {
      this.logger.log(`No workshops found for pain point types, fetching any available workshops...`);
      workshops = await this.prisma.wks_waitingList.findMany({
        where: {
          isDeleted: false,
        },
        take: 8,
      });
    }

    // Fetch city names for workshops
    const cityIds = [...new Set(workshops.map((w) => w.city).filter(Boolean))];
    const cities = await this.prisma.sys_City.findMany({
      where: {
        id: { in: cityIds },
      },
      select: {
        id: true,
        name: true,
      },
    });

    const cityMap = new Map(cities.map((c) => [c.id, c.name]));

    // Sort: subscribers first (non-demo), then demo
    const sorted = workshops.sort((a) => {
      const aIsDemo = a.name.toLowerCase().includes('demo');
      return aIsDemo ? 1 : 0;
    });

    return sorted.map((w) => ({
      id: w.id,
      name: w.name,
      slug: w.slug,
      address: w.address || '',
      logo: w.logo || null,
      city: cityMap.get(w.city) || 'N/A',
      isDemo: w.name.toLowerCase().includes('demo'),
      rating: w.gbp_rating ? parseFloat(w.gbp_rating.toString()) : 0,
      phone: w.phone || '',
      mobile: w.mobile || '',
    }));
  }
}
