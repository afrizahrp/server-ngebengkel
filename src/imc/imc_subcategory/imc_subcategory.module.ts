import { Module } from '@nestjs/common';
import { ImcSubCategoryService } from './imc_subcategory.service';
import { ImcSubCategoryController } from './imc_subcategory.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ImcSubCategoryController],
  providers: [ImcSubCategoryService],
  exports: [ImcSubCategoryService],
})
export class ImcSubCategoryModule {}
