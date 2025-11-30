import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { init } from '@paralleldrive/cuid2';

const createPainPointServiceTypeId = init({ length: 21 });

/**
 * Service untuk migrate mapping pain points dari workshop types ke service types
 * 
 * Digunakan saat company baru subscribe:
 * - Ambil mapping pain points dari workshop types (global)
 * - Migrate ke service types milik company tersebut
 * - Berdasarkan matching workshop type dengan service type
 */
@Injectable()
export class PainPointCompanyMigratorService {
  private readonly logger = new Logger(PainPointCompanyMigratorService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Migrate pain point mappings untuk company baru
   * 
   * Flow:
   * 1. Ambil semua pain points yang sudah di-map ke workshop types
   * 2. Untuk setiap pain point, cari service types company yang relevan
   * 3. Create mapping pain point ke service types
   */
  async migratePainPointMappingsForCompany(
    companyId: string,
  ): Promise<{
    migrated: number;
    skipped: number;
    errors: number;
  }> {
    this.logger.log(`Migrating pain point mappings for company ${companyId}`);

    // Get all pain points with workshop type mappings
    const painPointsWithWorkshopTypes =
      await this.prisma.wks_PainPoint.findMany({
        where: {
          isDeleted: false,
          isActive: true,
        },
        include: {
          workshopTypes: {
            include: {
              workshopType: true,
            },
          },
        },
      });

    let migrated = 0;
    let skipped = 0;
    let errors = 0;

    // Get company service types
    const companyServiceTypes = await this.prisma.wks_ServiceType.findMany({
      where: {
        company_id: companyId,
        iStatus: 'Active',
      },
    });

    if (companyServiceTypes.length === 0) {
      this.logger.warn(
        `No service types found for company ${companyId}, skipping migration`,
      );
      return { migrated: 0, skipped: 0, errors: 0 };
    }

    for (const painPoint of painPointsWithWorkshopTypes) {
      try {
        // Find matching service types based on workshop types
        const matchingServiceTypes = this.findMatchingServiceTypes(
          painPoint.workshopTypes.map((wt) => wt.workshopType),
          companyServiceTypes,
        );

        if (matchingServiceTypes.length === 0) {
          skipped++;
          continue;
        }

        // Create mappings
        for (const match of matchingServiceTypes) {
          // Check if mapping already exists
          const existing = await this.prisma.wks_PainPointServiceType.findFirst(
            {
              where: {
                painPoint_id: painPoint.id,
                company_id: companyId,
                serviceType_id: match.serviceTypeId,
              },
            },
          );

          if (!existing) {
            await this.prisma.wks_PainPointServiceType.create({
              data: {
                id: createPainPointServiceTypeId(),
                painPoint_id: painPoint.id,
                company_id: companyId,
                serviceType_id: match.serviceTypeId,
                relevance: match.relevance,
              },
            });
            migrated++;
          }
        }
      } catch (error: any) {
        this.logger.error(
          `Error migrating pain point ${painPoint.id}: ${error.message}`,
        );
        errors++;
      }
    }

    this.logger.log(
      `Migration completed: ${migrated} migrated, ${skipped} skipped, ${errors} errors`,
    );

    return { migrated, skipped, errors };
  }

  /**
   * Find matching service types based on workshop types
   */
  private findMatchingServiceTypes(
    workshopTypes: Array<{ id: string; name: string; category_id: string }>,
    serviceTypes: Array<{
      id: string;
      name: string;
      category: string | null;
    }>,
  ): Array<{ serviceTypeId: string; relevance: number }> {
    const matches: Array<{ serviceTypeId: string; relevance: number }> = [];

    for (const workshopType of workshopTypes) {
      for (const serviceType of serviceTypes) {
        const relevance = this.calculateRelevance(
          workshopType.name,
          serviceType.name,
          serviceType.category,
        );

        if (relevance >= 5) {
          matches.push({
            serviceTypeId: serviceType.id,
            relevance,
          });
        }
      }
    }

    // Remove duplicates and sort by relevance
    const uniqueMatches = matches.reduce(
      (acc, match) => {
        const existing = acc.find((m) => m.serviceTypeId === match.serviceTypeId);
        if (!existing || match.relevance > existing.relevance) {
          return [
            ...acc.filter((m) => m.serviceTypeId !== match.serviceTypeId),
            match,
          ];
        }
        return acc;
      },
      [] as Array<{ serviceTypeId: string; relevance: number }>,
    );

    return uniqueMatches.sort((a, b) => b.relevance - a.relevance);
  }

  /**
   * Calculate relevance between workshop type and service type
   */
  private calculateRelevance(
    workshopTypeName: string,
    serviceTypeName: string,
    serviceTypeCategory: string | null,
  ): number {
    let score = 0;

    // Name similarity (70 points max)
    const lowerWorkshop = workshopTypeName.toLowerCase();
    const lowerService = serviceTypeName.toLowerCase();

    if (lowerWorkshop === lowerService) {
      score += 70; // Exact match
    } else if (lowerWorkshop.includes(lowerService) || lowerService.includes(lowerWorkshop)) {
      score += 50; // Partial match
    } else {
      // Word matching
      const workshopWords = lowerWorkshop.split(/\s+/);
      const serviceWords = lowerService.split(/\s+/);
      let wordMatches = 0;

      for (const wWord of workshopWords) {
        for (const sWord of serviceWords) {
          if (wWord === sWord && wWord.length > 3) {
            wordMatches++;
            score += 10;
          } else if (
            wWord.includes(sWord) ||
            sWord.includes(wWord)
          ) {
            wordMatches++;
            score += 5;
          }
        }
      }

      if (wordMatches === 0) {
        return 0; // No match at all
      }
    }

    // Category matching (30 points max)
    // Note: Workshop types have category_id, but we don't have direct access here
    // This is a simplified version

    // Normalize to 1-10 scale
    return Math.min(10, Math.max(1, Math.round(score / 10)));
  }
}



