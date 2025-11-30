/**
 * Script untuk menjalankan migration full-text search untuk pain points
 * 
 * Usage:
 *   npx ts-node scripts/run-pain-point-migration.ts
 * 
 * Atau via npm script:
 *   npm run migrate:pain-point-search
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function runMigration() {
  try {
    console.log('🚀 Starting pain point full-text search migration...');

    // Read migration SQL file
    const migrationPath = path.join(
      __dirname,
      '..',
      'prisma',
      'migrations',
      'add_pain_point_fulltext_search.sql',
    );

    if (!fs.existsSync(migrationPath)) {
      throw new Error(`Migration file not found: ${migrationPath}`);
    }

    const sql = fs.readFileSync(migrationPath, 'utf-8');

    // Split SQL into individual statements
    // Remove comments and empty lines
    const statements = sql
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith('--'));

    console.log(`📝 Found ${statements.length} SQL statements to execute`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim().length === 0) continue;

      try {
        console.log(`\n[${i + 1}/${statements.length}] Executing statement...`);
        await prisma.$executeRawUnsafe(statement);
        console.log('✅ Statement executed successfully');
      } catch (error) {
        // Ignore "already exists" errors
        if (
          error instanceof Error &&
          (error.message.includes('already exists') ||
            error.message.includes('duplicate') ||
            error.message.includes('IF NOT EXISTS'))
        ) {
          console.log('⚠️  Statement already applied (skipping)');
        } else {
          console.error(`❌ Error executing statement:`, error);
          throw error;
        }
      }
    }

    console.log('\n✅ Migration completed successfully!');
    console.log('\n📊 Verifying migration...');

    // Verify migration
    const checkColumn = await prisma.$queryRaw<Array<{ column_name: string }>>`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'wks_PainPoint' 
        AND column_name = 'search_tsvector'
    `;

    if (checkColumn.length > 0) {
      console.log('✅ Column search_tsvector exists');
    } else {
      console.log('⚠️  Column search_tsvector not found (may need manual migration)');
    }

    const checkIndex = await prisma.$queryRaw<Array<{ indexname: string }>>`
      SELECT indexname 
      FROM pg_indexes 
      WHERE tablename = 'wks_PainPoint' 
        AND indexname = 'idx_painpoint_search_fulltext'
    `;

    if (checkIndex.length > 0) {
      console.log('✅ Index idx_painpoint_search_fulltext exists');
    } else {
      console.log('⚠️  Index idx_painpoint_search_fulltext not found');
    }
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runMigration();


