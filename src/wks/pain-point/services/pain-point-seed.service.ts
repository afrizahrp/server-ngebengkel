import {
  Injectable,
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { OpenAIPainPointService } from './openai-pain-point.service';
import { PainPointWorkshopTypeMapperService } from './pain-point-workshop-type-mapper.service';
import { init } from '@paralleldrive/cuid2';
import { Prisma } from '@prisma/client';

const createPainPointId = init({ length: 21 });
const createPainPointServiceTypeId = init({ length: 21 });
const createPainPointWorkshopTypeId = init({ length: 21 });

/**
 * Service untuk seed pain points ke database
 * 
 * Features:
 * - Generate pain points dengan OpenAI
 * - Validasi data sebelum save
 * - Transaction rollback jika ada error
 * - Support dry run mode
 * - Support overwrite mode
 */
@Injectable()
export class PainPointSeedService {
  private readonly logger = new Logger(PainPointSeedService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly openaiService: OpenAIPainPointService,
    private readonly workshopTypeMapper: PainPointWorkshopTypeMapperService,
  ) {}

  /**
   * Seed pain points ke database
   * 
   * @param count Jumlah pain points yang akan di-generate
   * @param dryRun Jika true, hanya return hasil tanpa save
   * @param overwrite Jika true, overwrite pain points yang sudah ada
   * @returns Result dengan statistik
   */
  async seed(
    count: number = 10,
    dryRun: boolean = false,
    overwrite: boolean = false,
  ): Promise<{
    success: boolean;
    message: string;
    stats: {
      generated: number;
      created: number;
      updated: number;
      skipped: number;
      errors: number;
    };
    painPoints: Array<{
      id?: string;
      slug: string;
      title: string;
      category: string;
      status: 'created' | 'updated' | 'skipped' | 'error';
      error?: string;
    }>;
  }> {
    this.logger.log(`Starting seed process: count=${count}, dryRun=${dryRun}, overwrite=${overwrite}`);

    // Generate pain points dengan OpenAI
    let generatedPainPoints;
    try {
      generatedPainPoints = await this.openaiService.generatePainPoints(count);
    } catch (error: any) {
      throw new InternalServerErrorException(
        `Failed to generate pain points: ${error.message}`,
      );
    }

    const stats = {
      generated: generatedPainPoints.length,
      created: 0,
      updated: 0,
      skipped: 0,
      errors: 0,
    };

    const results: Array<{
      id?: string;
      slug: string;
      title: string;
      category: string;
      status: 'created' | 'updated' | 'skipped' | 'error';
      error?: string;
    }> = [];

    if (dryRun) {
      this.logger.log('DRY RUN MODE: No data will be saved to database');
      
      for (const pp of generatedPainPoints) {
        results.push({
          slug: pp.slug,
          title: pp.title,
          category: pp.category,
          status: 'skipped',
        });
        stats.skipped++;
      }

      return {
        success: true,
        message: `Dry run completed. ${stats.generated} pain points generated (not saved)`,
        stats,
        painPoints: results,
      };
    }

    // Validate service types exist before transaction
    await this.validateServiceTypes(generatedPainPoints);

    // Start transaction
    try {
      for (const pp of generatedPainPoints) {
        try {
          // Validate data
          this.validatePainPoint(pp);

          // Check if pain point already exists
          const existing = await this.prisma.wks_PainPoint.findUnique({
            where: { slug: pp.slug },
          });

          if (existing) {
            if (overwrite) {
              // Update existing pain point
              const updated = await this.updatePainPoint(existing.id, pp);
              results.push({
                id: updated.id,
                slug: updated.slug,
                title: updated.title,
                category: updated.category,
                status: 'updated',
              });
              stats.updated++;
            } else {
              // Skip existing pain point
              results.push({
                id: existing.id,
                slug: existing.slug,
                title: existing.title,
                category: existing.category,
                status: 'skipped',
              });
              stats.skipped++;
            }
          } else {
            // Create new pain point
            const created = await this.createPainPoint(pp);
            
            // Auto-map workshop types jika tidak ada mappings dari OpenAI
            if (!pp.workshopTypeMappings || pp.workshopTypeMappings.length === 0) {
              try {
                const keywords = Array.isArray(pp.keywords)
                  ? pp.keywords
                  : typeof pp.keywords === 'string'
                    ? JSON.parse(pp.keywords)
                    : [];
                await this.workshopTypeMapper.autoMapPainPointToWorkshopTypes(
                  created.id,
                  pp.category,
                  keywords,
                );
              } catch (error: any) {
                this.logger.warn(
                  `Failed to auto-map workshop types for ${created.id}: ${error.message}`,
                );
              }
            }
            
            results.push({
              id: created.id,
              slug: created.slug,
              title: created.title,
              category: created.category,
              status: 'created',
            });
            stats.created++;
          }
        } catch (error: any) {
          this.logger.error(`Error processing pain point ${pp.slug}: ${error.message}`);
          results.push({
            slug: pp.slug,
            title: pp.title,
            category: pp.category,
            status: 'error',
            error: error.message,
          });
          stats.errors++;
        }
      }

      this.logger.log(`Seed completed: ${stats.created} created, ${stats.updated} updated, ${stats.skipped} skipped, ${stats.errors} errors`);

      return {
        success: stats.errors === 0,
        message: `Seed completed: ${stats.created} created, ${stats.updated} updated, ${stats.skipped} skipped, ${stats.errors} errors`,
        stats,
        painPoints: results,
      };
    } catch (error: any) {
      this.logger.error(`Seed failed: ${error.message}`);
      throw new InternalServerErrorException(`Seed failed: ${error.message}`);
    }
  }

  /**
   * Create new pain point dengan service type mappings
   */
  private async createPainPoint(pp: any) {
    return await this.prisma.$transaction(async (tx) => {
      // Create pain point
      const painPoint = await tx.wks_PainPoint.create({
        data: {
          id: createPainPointId(),
          slug: pp.slug,
          title: pp.title,
          description: pp.description || null,
          category: pp.category,
          keywords: pp.keywords as Prisma.InputJsonValue,
          iconName: pp.iconName || null,
          imageUrl: null,
          popularityScore: 0,
          viewCount: 0,
          searchCount: 0,
          isUrgent: pp.isUrgent || false,
          priority: pp.priority || 0,
          isActive: true,
          isPopular: pp.isPopular || false,
          isDeleted: false,
          isDraft: false,
        },
      });

      // Create service type mappings (untuk company yang sudah subscribe)
      if (pp.serviceTypeMappings && pp.serviceTypeMappings.length > 0) {
        for (const mapping of pp.serviceTypeMappings) {
          // Verify service type exists
          const serviceType = await tx.wks_ServiceType.findFirst({
            where: {
              company_id: mapping.company_id,
              id: mapping.serviceType_id,
            },
          });

          if (!serviceType) {
            this.logger.warn(
              `Service type ${mapping.serviceType_id} not found for company ${mapping.company_id}, skipping mapping`,
            );
            continue;
          }

          await tx.wks_PainPointServiceType.create({
            data: {
              id: createPainPointServiceTypeId(),
              painPoint_id: painPoint.id,
              company_id: mapping.company_id,
              serviceType_id: mapping.serviceType_id,
              relevance: mapping.relevance || 5,
            },
          });
        }
      }

      // Create workshop type mappings (untuk waitingList yang belum subscribe) - WAJIB untuk MVP
      if (pp.workshopTypeMappings && pp.workshopTypeMappings.length > 0) {
        for (const mapping of pp.workshopTypeMappings) {
          // Verify workshop type exists
          const workshopType = await tx.wks_WorkshopType.findFirst({
            where: {
              id: mapping.workshopType_id,
              isActive: true,
            },
          });

          if (!workshopType) {
            this.logger.warn(
              `Workshop type ${mapping.workshopType_id} not found, skipping mapping`,
            );
            continue;
          }

          // Check if mapping already exists
          const existingMapping = await tx.wks_PainPointWorkshopType.findFirst({
            where: {
              painPoint_id: painPoint.id,
              workshopType_id: mapping.workshopType_id,
            },
          });

          if (existingMapping) {
            continue; // Skip if already exists
          }

          await tx.wks_PainPointWorkshopType.create({
            data: {
              id: createPainPointWorkshopTypeId(),
              painPoint_id: painPoint.id,
              workshopType_id: mapping.workshopType_id,
              relevance: mapping.relevance || 5,
            },
          });
        }
      }

      return painPoint;
    });
  }

  /**
   * Update existing pain point
   */
  private async updatePainPoint(id: string, pp: any) {
    return await this.prisma.$transaction(async (tx) => {
      // Update pain point
      const painPoint = await tx.wks_PainPoint.update({
        where: { id },
        data: {
          title: pp.title,
          description: pp.description || null,
          category: pp.category,
          keywords: pp.keywords as Prisma.InputJsonValue,
          iconName: pp.iconName || null,
          isUrgent: pp.isUrgent || false,
          priority: pp.priority || 0,
          isPopular: pp.isPopular || false,
        },
      });

      // Delete existing service type mappings
      await tx.wks_PainPointServiceType.deleteMany({
        where: { painPoint_id: id },
      });

      // Delete existing workshop type mappings
      await tx.wks_PainPointWorkshopType.deleteMany({
        where: { painPoint_id: id },
      });

      // Create new service type mappings
      if (pp.serviceTypeMappings && pp.serviceTypeMappings.length > 0) {
        for (const mapping of pp.serviceTypeMappings) {
          const serviceType = await tx.wks_ServiceType.findFirst({
            where: {
              company_id: mapping.company_id,
              id: mapping.serviceType_id,
            },
          });

          if (!serviceType) {
            this.logger.warn(
              `Service type ${mapping.serviceType_id} not found for company ${mapping.company_id}, skipping mapping`,
            );
            continue;
          }

          await tx.wks_PainPointServiceType.create({
            data: {
              id: createPainPointServiceTypeId(),
              painPoint_id: painPoint.id,
              company_id: mapping.company_id,
              serviceType_id: mapping.serviceType_id,
              relevance: mapping.relevance || 5,
            },
          });
        }
      }

      // Create new workshop type mappings
      if (pp.workshopTypeMappings && pp.workshopTypeMappings.length > 0) {
        for (const mapping of pp.workshopTypeMappings) {
          const workshopType = await tx.wks_WorkshopType.findFirst({
            where: {
              id: mapping.workshopType_id,
              isActive: true,
            },
          });

          if (!workshopType) {
            this.logger.warn(
              `Workshop type ${mapping.workshopType_id} not found, skipping mapping`,
            );
            continue;
          }

          await tx.wks_PainPointWorkshopType.create({
            data: {
              id: createPainPointWorkshopTypeId(),
              painPoint_id: painPoint.id,
              workshopType_id: mapping.workshopType_id,
              relevance: mapping.relevance || 5,
            },
          });
        }
      }

      return painPoint;
    });
  }

  /**
   * Validate pain point data
   */
  private validatePainPoint(pp: any): void {
    if (!pp.slug || typeof pp.slug !== 'string') {
      throw new BadRequestException('Pain point must have a slug');
    }

    if (!pp.title || typeof pp.title !== 'string') {
      throw new BadRequestException('Pain point must have a title');
    }

    if (!pp.category || !['URGENT', 'GENERAL', 'MAINTENANCE', 'BODYWORK', 'ELECTRICAL'].includes(pp.category)) {
      throw new BadRequestException('Pain point must have a valid category');
    }

    if (!pp.keywords || !Array.isArray(pp.keywords) || pp.keywords.length === 0) {
      throw new BadRequestException('Pain point must have at least one keyword');
    }

    // Validate slug format (URL-friendly)
    if (!/^[a-z0-9-]+$/.test(pp.slug)) {
      throw new BadRequestException(`Invalid slug format: ${pp.slug}. Must be lowercase alphanumeric with hyphens`);
    }
  }

  /**
   * Validate service types and workshop types exist before transaction
   */
  private async validateServiceTypes(painPoints: any[]): Promise<void> {
    const serviceTypeIds = new Set<string>();
    const workshopTypeIds = new Set<string>();

    for (const pp of painPoints) {
      if (pp.serviceTypeMappings && Array.isArray(pp.serviceTypeMappings)) {
        for (const mapping of pp.serviceTypeMappings) {
          serviceTypeIds.add(`${mapping.company_id}:${mapping.serviceType_id}`);
        }
      }

      if (pp.workshopTypeMappings && Array.isArray(pp.workshopTypeMappings)) {
        for (const mapping of pp.workshopTypeMappings) {
          workshopTypeIds.add(mapping.workshopType_id);
        }
      }
    }

    // Validate service types (opsional, karena mungkin belum ada company)
    if (serviceTypeIds.size > 0) {
      const missingServiceTypes: string[] = [];

      for (const id of serviceTypeIds) {
        const [company_id, serviceType_id] = id.split(':');
        const serviceType = await this.prisma.wks_ServiceType.findFirst({
          where: {
            company_id,
            id: serviceType_id,
          },
        });

        if (!serviceType) {
          missingServiceTypes.push(id);
        }
      }

      if (missingServiceTypes.length > 0) {
        this.logger.warn(
          `Some service types not found: ${missingServiceTypes.join(', ')}`,
        );
      }
    }

    // Validate workshop types (WAJIB untuk MVP)
    if (workshopTypeIds.size === 0) {
      this.logger.warn(
        'No workshop type mappings found in generated pain points. Workshop type mappings are required for MVP.',
      );
      return;
    }

    const missingWorkshopTypes: string[] = [];

    for (const workshopTypeId of workshopTypeIds) {
      const workshopType = await this.prisma.wks_WorkshopType.findFirst({
        where: {
          id: workshopTypeId,
          isActive: true,
        },
      });

      if (!workshopType) {
        missingWorkshopTypes.push(workshopTypeId);
      }
    }

    if (missingWorkshopTypes.length > 0) {
      this.logger.warn(
        `Some workshop types not found: ${missingWorkshopTypes.join(', ')}`,
      );
      // Don't throw error, just log warning (mappings will be skipped)
    }
  }
}

