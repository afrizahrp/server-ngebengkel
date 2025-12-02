/**
 * Script untuk trigger auto-mapping pain points ke workshop types
 *
 * Gunakan script ini setelah insert manual pain points via SQL
 * untuk memastikan semua pain points ter-map ke workshop types yang relevan
 *
 * Usage:
 *   npx tsx scripts/trigger-pain-point-automapping.ts
 */

import { PrismaClient } from '@prisma/client';
import { PainPointWorkshopTypeMapperService } from '../src/wks/pain-point/services/pain-point-workshop-type-mapper.service';

// Extend PrismaClient to match PrismaService interface
class PrismaServiceMock extends PrismaClient {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async enableShutdownHooks(app: any) {
    // Not needed for standalone script
    process.on('SIGTERM', async () => {
      await this.$disconnect();
      if (app) await app.close();
    });

    process.on('SIGINT', async () => {
      await this.$disconnect();
      if (app) await app.close();
    });
  }
}

const prisma = new PrismaServiceMock();

async function main() {
  console.log('🚀 Starting auto-mapping for all pain points...\n');

  const mapperService = new PainPointWorkshopTypeMapperService(prisma);

  try {
    // Get all active pain points
    const painPoints = await prisma.wks_PainPoint.findMany({
      where: {
        isActive: true,
        isDeleted: false,
      },
      select: {
        id: true,
        title: true,
        category: true,
        keywords: true,
        workshopTypes: {
          select: {
            id: true,
          },
        },
      },
    });

    console.log(`📊 Found ${painPoints.length} active pain points\n`);

    let processed = 0;
    let skipped = 0;
    let errors = 0;

    for (const painPoint of painPoints) {
      try {
        // Check if already has mappings
        const existingMappings = painPoint.workshopTypes.length;

        console.log(`\n📍 Processing: "${painPoint.title}" (${painPoint.id})`);
        console.log(`   Category: ${painPoint.category}`);
        console.log(`   Existing mappings: ${existingMappings}`);

        // Parse keywords
        const keywords =
          typeof painPoint.keywords === 'string'
            ? JSON.parse(painPoint.keywords)
            : painPoint.keywords;

        if (!Array.isArray(keywords)) {
          console.log(`   ⚠️  Invalid keywords format, skipping...`);
          skipped++;
          continue;
        }

        // Delete existing mappings if you want to re-map
        // Uncomment this if you want to re-map all pain points
        /*
        if (existingMappings > 0) {
          await prisma.wks_PainPointWorkshopType.deleteMany({
            where: { painPoint_id: painPoint.id },
          });
          console.log(`   🗑️  Deleted ${existingMappings} existing mappings`);
        }
        */

        // Skip if already has mappings (comment this to force re-map)
        if (existingMappings > 0) {
          console.log(`   ⏭️  Already has mappings, skipping...`);
          skipped++;
          continue;
        }

        // Trigger auto-mapping
        const result = await mapperService.autoMapPainPointToWorkshopTypes(
          painPoint.id,
          painPoint.category,
          keywords,
        );

        console.log(`   ✅ Mapped: ${result.mapped} workshop types`);
        console.log(`   ⏭️  Skipped: ${result.skipped} (low relevance)`);

        processed++;
      } catch (error: any) {
        console.error(`   ❌ Error: ${error.message}`);
        errors++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 Summary:');
    console.log(`   ✅ Processed: ${processed}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log(`   📦 Total: ${painPoints.length}`);
    console.log('='.repeat(60));
  } catch (error: any) {
    console.error('❌ Fatal error:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    console.log('\n✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Failed:', error);
    process.exit(1);
  });
