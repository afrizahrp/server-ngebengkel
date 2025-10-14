import { Module } from '@nestjs/common';
import { imc_ProductVideoService } from './imc_ProductVideo.service';
import { imc_ProductVideoController } from './imc_ProductVideo.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [imc_ProductVideoController],
  providers: [imc_ProductVideoService],
  exports: [imc_ProductVideoService],
})
export class imc_ProductVideoModule {}

