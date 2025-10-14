import { Module } from '@nestjs/common';
import { ImcUomService } from './imc_uom.service';
import { ImcUomController } from './imc_uom.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ImcUomController],
  providers: [ImcUomService],
  exports: [ImcUomService],
})
export class ImcUomModule {}
