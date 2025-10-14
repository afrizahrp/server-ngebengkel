import { Module } from '@nestjs/common';
import { ImcBrandService } from './imc_brand.service';
import { ImcBrandController } from './imc_brand.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ImcBrandController],
  providers: [ImcBrandService],
  exports: [ImcBrandService],
})
export class ImcBrandModule {}
