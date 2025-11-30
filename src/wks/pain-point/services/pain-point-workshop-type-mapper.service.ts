import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { init } from '@paralleldrive/cuid2';

const createPainPointWorkshopTypeId = init({ length: 21 });

/**
 * Service untuk mapping pain points ke workshop types
 * 
 * Digunakan untuk:
 * - Auto-map pain points ke workshop types saat seed
 * - Mapping berdasarkan category dan keywords matching
 */
@Injectable()
export class PainPointWorkshopTypeMapperService {
  private readonly logger = new Logger(PainPointWorkshopTypeMapperService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Auto-map pain point ke workshop types berdasarkan:
   * 1. Category matching (pain point category -> workshop category)
   * 2. Keywords matching (pain point keywords -> workshop type name)
   * 3. Manual mapping rules
   */
  async autoMapPainPointToWorkshopTypes(
    painPointId: string,
    painPointCategory: string,
    painPointKeywords: string[],
  ): Promise<{
    mapped: number;
    skipped: number;
    mappings: Array<{ workshopTypeId: string; relevance: number }>;
  }> {
    this.logger.log(
      `Auto-mapping pain point ${painPointId} to workshop types`,
    );

    // Get all active workshop types
    const workshopTypes = await this.prisma.wks_WorkshopType.findMany({
      where: {
        isActive: true,
      },
      include: {
        category: true,
      },
    });

    const mappings: Array<{ workshopTypeId: string; relevance: number }> = [];
    let skipped = 0;

    for (const workshopType of workshopTypes) {
      const relevance = this.calculateRelevance(
        painPointCategory,
        painPointKeywords,
        workshopType,
      );

      if (relevance >= 5) {
        // Only map if relevance >= 5
        mappings.push({
          workshopTypeId: workshopType.id,
          relevance,
        });
      } else {
        skipped++;
      }
    }

    // Create mappings in database
    if (mappings.length > 0) {
      await this.createMappings(painPointId, mappings);
    }

    this.logger.log(
      `Mapped ${mappings.length} workshop types, skipped ${skipped}`,
    );

    return {
      mapped: mappings.length,
      skipped,
      mappings,
    };
  }

  /**
   * Calculate relevance score (1-10) between pain point and workshop type
   */
  private calculateRelevance(
    painPointCategory: string,
    painPointKeywords: string[],
    workshopType: any,
  ): number {
    let score = 0;

    // 1. Category matching (30 points max)
    const categoryMapping: Record<string, string[]> = {
      URGENT: ['MOBIL', 'MOTOR'], // Urgent issues apply to all
      GENERAL: ['MOBIL', 'MOTOR'],
      MAINTENANCE: ['MOBIL', 'MOTOR'],
      BODYWORK: ['MOBIL', 'MOTOR'],
      ELECTRICAL: ['MOBIL', 'MOTOR'],
    };

    if (workshopType.category) {
      const mappedCategories = categoryMapping[painPointCategory] || [];
      if (mappedCategories.includes(workshopType.category.code)) {
        score += 30;
      }
    }

    // 2. Keywords matching (50 points max)
    const lowerKeywords = painPointKeywords.map((k) => k.toLowerCase());
    const lowerWorkshopName = workshopType.name.toLowerCase();

    for (const keyword of lowerKeywords) {
      if (lowerWorkshopName.includes(keyword)) {
        score += 10; // Exact match
      } else if (this.fuzzyMatch(keyword, lowerWorkshopName)) {
        score += 5; // Fuzzy match
      }
    }

    // Cap at 50 points for keywords
    if (score > 30) {
      score = 30 + Math.min(50, score - 30);
    }

    // 3. Name similarity (20 points max)
    const similarity = this.calculateNameSimilarity(
      painPointKeywords.join(' '),
      workshopType.name,
    );
    score += similarity * 20;

    // Normalize to 1-10 scale
    return Math.min(10, Math.max(1, Math.round(score / 10)));
  }

  /**
   * Fuzzy match keywords
   */
  private fuzzyMatch(keyword: string, text: string): boolean {
    // Simple fuzzy matching
    const keywordWords = keyword.split(/\s+/);
    for (const word of keywordWords) {
      if (word.length > 3 && text.includes(word.substring(0, 3))) {
        return true;
      }
    }
    return false;
  }

  /**
   * Calculate name similarity (0-1)
   */
  private calculateNameSimilarity(text1: string, text2: string): number {
    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);

    let matches = 0;
    for (const word1 of words1) {
      for (const word2 of words2) {
        if (word1 === word2 || word1.includes(word2) || word2.includes(word1)) {
          matches++;
          break;
        }
      }
    }

    return matches / Math.max(words1.length, words2.length);
  }

  /**
   * Create mappings in database
   */
  private async createMappings(
    painPointId: string,
    mappings: Array<{ workshopTypeId: string; relevance: number }>,
  ): Promise<void> {
    for (const mapping of mappings) {
      // Check if mapping already exists
      const existing = await this.prisma.wks_PainPointWorkshopType.findFirst({
        where: {
          painPoint_id: painPointId,
          workshopType_id: mapping.workshopTypeId,
        },
      });

      if (!existing) {
        await this.prisma.wks_PainPointWorkshopType.create({
          data: {
            id: createPainPointWorkshopTypeId(),
            painPoint_id: painPointId,
            workshopType_id: mapping.workshopTypeId,
            relevance: mapping.relevance,
          },
        });
      }
    }
  }

  /**
   * Get workshop types for a pain point
   */
  async getWorkshopTypesByPainPoint(painPointId: string): Promise<
    Array<{
      id: string;
      name: string;
      category: string;
      relevance: number;
    }>
  > {
    const mappings = await this.prisma.wks_PainPointWorkshopType.findMany({
      where: {
        painPoint_id: painPointId,
      },
      include: {
        workshopType: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        relevance: 'desc',
      },
    });

    return mappings.map((m) => ({
      id: m.workshopType.id,
      name: m.workshopType.name,
      category: m.workshopType.category.name,
      relevance: m.relevance,
    }));
  }
}



