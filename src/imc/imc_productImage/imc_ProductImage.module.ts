import { Module } from '@nestjs/common';
import { imc_ProductImageService } from './imc_ProductImage.service';
import { imc_ProductImageController } from './imc_ProductImage.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [imc_ProductImageController],
  providers: [imc_ProductImageService],
  exports: [imc_ProductImageService],
})
export class imc_ProductImageModule {}












