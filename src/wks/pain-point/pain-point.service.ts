import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { PainPointCacheService } from './services/pain-point-cache.service';
import { QueryPainPointDto } from './dto/query-pain-point.dto';
import {
  PainPointResponseDto,
  PainPointDetailResponseDto,
  PainPointSearchResultDto,
  PainPointMatchResultDto,
} from './dto/response-pain-point.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PainPointService {
  private readonly logger = new Logger(PainPointService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: PainPointCacheService,
  ) {}

  /**
   * GET /api/pain-points
   * List pain points dengan pagination, filtering, sorting
   */
  async findAll(query: QueryPainPointDto): Promise<{
    data: PainPointResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;
    const skip = (page - 1) * limit;

    // Build cache key
    const cacheKey = `pain-points:list:${JSON.stringify(query)}`;
    const cached = this.cache.get<{
      data: PainPointResponseDto[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>(cacheKey);

    if (cached) {
      return cached;
    }

    // Build where clause
    const where: Prisma.wks_PainPointWhereInput = {
      isDeleted: false,
      isActive: query.isActive ?? true,
    };

    if (query.category) {
      where.category = query.category;
    }

    if (query.isPopular !== undefined) {
      where.isPopular = query.isPopular;
    }

    if (query.search) {
      // Full-text search menggunakan Prisma raw query
      // Note: Prisma tidak support full-text search langsung, jadi kita skip filter ini
      // dan akan handle di raw query nanti jika perlu
      // Untuk sekarang, kita gunakan simple LIKE search sebagai fallback
      where.OR = [{ title: { contains: query.search, mode: 'insensitive' } }];
    }

    // Build orderBy
    const orderBy: Prisma.wks_PainPointOrderByWithRelationInput[] = [];
    if (query.orderBy === 'name') {
      orderBy.push({ title: query.orderDir ?? 'asc' });
    } else {
      // Default: popularity
      orderBy.push(
        { isPopular: 'desc' },
        { popularityScore: query.orderDir ?? 'desc' },
        { createdAt: 'desc' },
      );
    }

    // Execute query
    const [data, total] = await Promise.all([
      this.prisma.wks_PainPoint.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        select: this.getPainPointSelect(),
      }),
      this.prisma.wks_PainPoint.count({ where }),
    ]);

    const result = {
      data: data.map((item) => this.toResponse(item)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };

    // Cache result
    this.cache.set(cacheKey, result);

    return result;
  }

  /**
   * GET /api/pain-points/:id
   * Get pain point detail dengan related data
   * Support lookup by ID atau slug
   */
  async findOne(idOrSlug: string): Promise<PainPointDetailResponseDto> {
    const cacheKey = `pain-points:detail:${idOrSlug}`;
    const cached = this.cache.get<PainPointDetailResponseDto>(cacheKey);

    if (cached) {
      return cached;
    }

    const painPoint = await this.prisma.wks_PainPoint.findFirst({
      where: {
        OR: [
          { id: idOrSlug },
          { slug: idOrSlug },
        ],
        isDeleted: false,
        isActive: true,
      },
      select: {
        ...this.getPainPointSelect(),
        serviceTypes: {
          select: {
            id: true,
            serviceType: {
              select: {
                id: true,
                name: true,
              },
            },
            relevance: true,
          },
        },
        workshopTypes: {
          select: {
            id: true,
            workshopType: {
              select: {
                id: true,
                name: true,
              },
            },
            relevance: true,
          },
        },
      },
    });

    if (!painPoint) {
      throw new NotFoundException(`Pain point dengan ID atau slug ${idOrSlug} tidak ditemukan`);
    }

    // Get branch count (bengkel yang bisa handle)
    // Note: Prisma tidak support distinct di count, jadi kita gunakan groupBy
    const branchCountResult =
      await this.prisma.wks_PainPointServiceType.groupBy({
        by: ['company_id'],
        where: {
          painPoint_id: painPoint.id,
        },
      });
    const branchCount = branchCountResult.length;

    // Get related pain points (same category, exclude current)
    const relatedPainPoints = await this.prisma.wks_PainPoint.findMany({
      where: {
        category: painPoint.category,
        id: { not: painPoint.id },
        isDeleted: false,
        isActive: true,
      },
      take:5,
      orderBy: [{ isPopular: 'desc' }, { popularityScore: 'desc' }],
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        imageUrl: true,
      },
    });

    const result: PainPointDetailResponseDto = {
      ...this.toResponse(painPoint),
      serviceTypes: painPoint.serviceTypes.map((st) => ({
        id: st.serviceType.id,
        name: st.serviceType.name,
        relevance: st.relevance,
      })),
      workshopTypes: painPoint.workshopTypes.map((wt) => ({
        id: wt.workshopType.id,
        name: wt.workshopType.name,
        relevance: wt.relevance,
      })),
      branchCount,
      relatedPainPoints: relatedPainPoints.map((pp) => ({
        id: pp.id,
        title: pp.title,
        slug: pp.slug,
        category: pp.category,
      })),
    };

    // Cache result
    this.cache.set(cacheKey, result);

    return result;
  }

  /**
   * GET /api/pain-points/search?q=...
   * Search pain points dengan full-text search
   */
  async search(query: string): Promise<PainPointSearchResultDto[]> {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const cacheKey = `pain-points:search:${query.toLowerCase().trim()}`;
    const cached = this.cache.get<PainPointSearchResultDto[]>(cacheKey);

    if (cached) {
      return cached;
    }

    // Escape untuk SQL string literal: escape backslash dan single quote
    // Menggunakan plainto_tsquery yang lebih aman untuk user input
    const escapedQuery = query
      .replace(/\\/g, '\\\\')  // Escape backslash untuk SQL
      .replace(/'/g, "''");     // Escape single quote untuk SQL

    // Execute full-text search dengan ranking
    // Menggunakan plainto_tsquery yang lebih aman - tidak perlu format tsquery yang ketat
    // plainto_tsquery otomatis mengkonversi plain text ke tsquery dengan aman
    const results = await this.prisma.$queryRaw<
      Array<{
        id: string;
        title: string;
        slug: string;
        category: string;
        keywords: string;
        popularityScore: number;
        isPopular: boolean;
        isUrgent: boolean;
        rank: number;
      }>
    >`
      SELECT 
        "id",
        "title",
        "slug",
        "category",
        "keywords",
        "popularityScore",
        "isPopular",
        "isUrgent",
        ts_rank("search_tsvector", plainto_tsquery('indonesian', ${Prisma.raw(`'${escapedQuery}'`)})) as "rank"
      FROM "wks_PainPoint"
      WHERE "search_tsvector" @@ plainto_tsquery('indonesian', ${Prisma.raw(`'${escapedQuery}'`)})
        AND "isDeleted" = false
        AND "isActive" = true
      ORDER BY 
        "isPopular" DESC,
        "rank" DESC,
        "popularityScore" DESC
      LIMIT 20
    `;

    // Parse keywords dari JSON
    const parsedResults: PainPointSearchResultDto[] = results.map((row) => {
      const keywords =
        typeof row.keywords === 'string'
          ? JSON.parse(row.keywords)
          : row.keywords;

      const matchedKeywords = this.findMatchedKeywords(
        query,
        keywords as string[],
      );

      return {
        painPoint: {
          id: row.id,
          slug: row.slug,
          title: row.title,
          description: null,
          category: row.category,
          keywords: keywords as string[],
          iconName: null,
          imageUrl: null,
          popularityScore: Number(row.popularityScore),
          viewCount: 0,
          searchCount: 0,
          isUrgent: row.isUrgent,
          priority: 0,
          isActive: true,
          isPopular: row.isPopular,
          createdAt: '',
          updatedAt: '',
        },
        confidence: Math.min(1, Number(row.rank) * 2), // Normalize to 0-1
        matchedKeywords,
      };
    });

    // Cache result
    this.cache.set(cacheKey, parsedResults);

    return parsedResults;
  }

  /**
   * POST /api/pain-points/match (internal)
   * Match query ke pain point dengan confidence score
   */
  async match(query: string): Promise<PainPointMatchResultDto | null> {
    if (!query || query.trim().length === 0) {
      return null;
    }

    const cacheKey = `pain-points:match:${query.toLowerCase().trim()}`;
    const cached = this.cache.get<PainPointMatchResultDto | null>(cacheKey);

    if (cached) {
      return cached;
    }

    // Search dengan full-text search
    const searchResults = await this.search(query);

    if (searchResults.length === 0) {
      return null;
    }

    // Ambil hasil terbaik (highest confidence)
    const bestMatch = searchResults[0];

    // Get service types untuk pain point ini
    const serviceTypes = await this.prisma.wks_PainPointServiceType.findMany({
      where: {
        painPoint_id: bestMatch.painPoint.id,
      },
      select: {
        serviceType: {
          select: {
            id: true,
            name: true,
          },
        },
        relevance: true,
      },
      orderBy: {
        relevance: 'desc',
      },
      take: 10,
    });

    const result: PainPointMatchResultDto = {
      ...bestMatch,
      serviceTypes: serviceTypes.map((st) => ({
        id: st.serviceType.id,
        name: st.serviceType.name,
        relevance: st.relevance,
      })),
    };

    // Cache result
    this.cache.set(cacheKey, result);

    return result;
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  private getPainPointSelect() {
    return {
      id: true,
      slug: true,
      title: true,
      description: true,
      category: true,
      keywords: true,
      iconName: true,
      imageUrl: true,
      popularityScore: true,
      viewCount: true,
      searchCount: true,
      isUrgent: true,
      priority: true,
      isActive: true,
      isPopular: true,
      createdAt: true,
      updatedAt: true,
      articles: {
        select: {
          id: true,
          slug: true,
          status: true,
        },
      },
    } satisfies Prisma.wks_PainPointSelect;
  }

  private toResponse(data: any): PainPointResponseDto {
    return {
      id: data.id,
      slug: data.slug,
      title: data.title,
      description: data.description,
      category: data.category,
      keywords:
        typeof data.keywords === 'string'
          ? JSON.parse(data.keywords)
          : data.keywords,
      iconName: data.iconName,
      imageUrl: data.imageUrl,
      popularityScore: data.popularityScore,
      viewCount: data.viewCount,
      searchCount: data.searchCount,
      isUrgent: data.isUrgent,
      priority: data.priority,
      isActive: data.isActive,
      isPopular: data.isPopular,
      createdAt: data.createdAt.toISOString(),
      updatedAt: data.updatedAt.toISOString(),
      articles: data.articles || [],
    };
  }

  /**
   * Build PostgreSQL tsquery dari search string
   *
   * Contoh:
   * - "bunyi gludak" -> "bunyi & gludak"
   * - "AC tidak dingin" -> "AC & tidak & dingin"
   */
  private buildTsQuery(search: string): string {
    if (!search || search.trim().length === 0) {
      return '';
    }

    // Sanitize dan escape karakter khusus untuk PostgreSQL tsquery
    // Karakter yang perlu di-escape untuk tsquery syntax: & | ! ( ) : *
    // Note: backslash dan single quote akan di-escape di level SQL string literal, bukan di sini
    const sanitizeTerm = (term: string): string => {
      // Escape karakter khusus PostgreSQL tsquery (untuk tsquery syntax)
      // Backslash dan single quote akan di-escape di level SQL string literal
      return term
        .replace(/&/g, '\\&')     // Escape AND operator
        .replace(/\|/g, '\\|')     // Escape OR operator
        .replace(/!/g, '\\!')     // Escape NOT operator
        .replace(/\(/g, '\\(')    // Escape opening parenthesis
        .replace(/\)/g, '\\)')    // Escape closing parenthesis
        .replace(/:/g, '\\:')     // Escape colon
        .replace(/\*/g, '\\*');   // Escape asterisk
    };

    // Split by space, filter empty, sanitize, dan lowercase
    const terms = search
      .trim()
      .split(/\s+/)
      .filter((t) => t.length > 0)
      .map((t) => sanitizeTerm(t.toLowerCase()));

    if (terms.length === 0) {
      return '';
    }

    // Join dengan & untuk AND operation
    return terms.join(' & ');
  }

  /**
   * Find matched keywords dari query
   */
  private findMatchedKeywords(query: string, keywords: string[]): string[] {
    const lowerQuery = query.toLowerCase();
    const matched: string[] = [];

    for (const keyword of keywords) {
      if (
        lowerQuery.includes(keyword.toLowerCase()) ||
        keyword.toLowerCase().includes(lowerQuery)
      ) {
        matched.push(keyword);
      }
    }

    return matched;
  }

  /**
   * Helper: Get service types untuk keperluan seed data
   * Menampilkan service types yang tersedia per company
   */
  async getServiceTypes(companyId?: string): Promise<
    Array<{
      company_id: string;
      id: string;
      name: string;
      category: string | null;
      description: string | null;
    }>
  > {
    const where: Prisma.wks_ServiceTypeWhereInput = {
      iStatus: 'Active',
    };

    if (companyId) {
      where.company_id = companyId;
    }

    const serviceTypes = await this.prisma.wks_ServiceType.findMany({
      where,
      select: {
        company_id: true,
        id: true,
        name: true,
        category: true,
        description: true,
      },
      orderBy: [{ company_id: 'asc' }, { category: 'asc' }, { name: 'asc' }],
    });

    return serviceTypes;
  }
}
