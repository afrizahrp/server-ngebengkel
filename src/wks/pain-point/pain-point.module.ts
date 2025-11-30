import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { PainPointController } from './pain-point.controller';
import { PainPointService } from './pain-point.service';
import { PainPointCacheService } from './services/pain-point-cache.service';
import { PainPointSeedService } from './services/pain-point-seed.service';
import { OpenAIPainPointService } from './services/openai-pain-point.service';
import { PainPointWorkshopTypeMapperService } from './services/pain-point-workshop-type-mapper.service';
import { PainPointCompanyMigratorService } from './services/pain-point-company-migrator.service';

@Module({
  imports: [PrismaModule],
  controllers: [PainPointController],
  providers: [
    PainPointService,
    PainPointCacheService,
    PainPointSeedService,
    OpenAIPainPointService,
    PainPointWorkshopTypeMapperService,
    PainPointCompanyMigratorService,
  ],
  exports: [PainPointService], // Export untuk digunakan di module lain jika perlu
})
export class PainPointModule {}

