/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Public } from 'src/auth/decorators/public.decorator';

import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpException,
  Logger,
} from '@nestjs/common';
import { CmsSubCategoryKeywordsService } from './cms_SubCategoryKeywords.service';
import {
  GenerateSubCategoryKeywordsDto,
  BulkGenerateSubCategoryKeywordsDto,
  SubCategoryKeywordGenerationResultDto,
  SubCategoryKeywordStatsDto,
  BulkSubCategoryKeywordResultDto,
} from './dto/generateSubCategoryKeywords.dto';

@Public()
@Controller('cms/subcategory-keywords')
export class CmsSubCategoryKeywordsController {
  private readonly logger = new Logger(CmsSubCategoryKeywordsController.name);

  constructor(
    private readonly subCategoryKeywordsService: CmsSubCategoryKeywordsService,
  ) {}

  /**
   * Generate keywords for a single subcategory
   */
  @Post('generate')
  async generateKeywords(
    @Body() generateSubCategoryKeywordsDto: GenerateSubCategoryKeywordsDto,
  ): Promise<SubCategoryKeywordGenerationResultDto> {
    try {
      this.logger.log(
        `Generating keywords for subcategory: ${generateSubCategoryKeywordsDto.subCategoryId}`,
      );

      const result =
        await this.subCategoryKeywordsService.generateKeywordsForSubCategory(
          generateSubCategoryKeywordsDto.subCategoryId,
          generateSubCategoryKeywordsDto.categoryId,
          generateSubCategoryKeywordsDto.companyId,
        );

      return result;
    } catch (error) {
      this.logger.error('Error in generateKeywords endpoint:', error);
      throw new HttpException(
        {
          message: 'Failed to generate keywords',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Save keywords to database for a single subcategory
   */
  @Post('save')
  async saveKeywords(
    @Body() generateSubCategoryKeywordsDto: GenerateSubCategoryKeywordsDto,
  ): Promise<{ success: boolean; message: string }> {
    try {
      this.logger.log(
        `Saving keywords for subcategory: ${generateSubCategoryKeywordsDto.subCategoryId}`,
      );

      const result =
        await this.subCategoryKeywordsService.generateAndSaveKeywords(
          generateSubCategoryKeywordsDto.subCategoryId,
          generateSubCategoryKeywordsDto.categoryId,
          generateSubCategoryKeywordsDto.companyId,
        );

      if (result.success) {
        return {
          success: true,
          message: 'Keywords saved successfully',
        };
      } else {
        throw new HttpException(
          {
            message: 'Failed to save keywords',
            error: result.error || 'Unknown error',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } catch (error) {
      this.logger.error('Error in saveKeywords endpoint:', error);
      throw new HttpException(
        {
          message: 'Failed to save keywords',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Generate and save keywords for a single subcategory
   */
  @Post('generate-and-save')
  async generateAndSaveKeywords(
    @Body() generateSubCategoryKeywordsDto: GenerateSubCategoryKeywordsDto,
  ): Promise<SubCategoryKeywordGenerationResultDto> {
    try {
      this.logger.log(
        `Generating and saving keywords for subcategory: ${generateSubCategoryKeywordsDto.subCategoryId}`,
      );

      const result =
        await this.subCategoryKeywordsService.generateAndSaveKeywords(
          generateSubCategoryKeywordsDto.subCategoryId,
          generateSubCategoryKeywordsDto.categoryId,
          generateSubCategoryKeywordsDto.companyId,
        );

      return result;
    } catch (error) {
      this.logger.error('Error in generateAndSaveKeywords endpoint:', error);
      throw new HttpException(
        {
          message: 'Failed to generate and save keywords',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Bulk generate keywords for all subcategories
   */
  @Post('bulk-generate')
  async bulkGenerateKeywords(
    @Body()
    bulkGenerateSubCategoryKeywordsDto: BulkGenerateSubCategoryKeywordsDto,
  ): Promise<BulkSubCategoryKeywordResultDto> {
    try {
      this.logger.log('Starting bulk subcategory keyword generation...');

      const result =
        await this.subCategoryKeywordsService.generateKeywordsForAllSubCategories(
          bulkGenerateSubCategoryKeywordsDto.companyId,
          bulkGenerateSubCategoryKeywordsDto.excludeIds,
        );

      this.logger.log(
        `Bulk subcategory keyword generation completed. Processed: ${result.totalProcessed}, Success: ${result.successCount}, Errors: ${result.errorCount}`,
      );

      return result;
    } catch (error) {
      this.logger.error('Error in bulkGenerateKeywords endpoint:', error);
      throw new HttpException(
        {
          message: 'Failed to perform bulk subcategory keyword generation',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get subcategory keyword generation statistics
   */
  @Get('stats')
  async getKeywordStats(
    @Query('companyId') companyId?: string,
  ): Promise<SubCategoryKeywordStatsDto> {
    try {
      this.logger.log('Getting subcategory keyword statistics...');

      const stats =
        await this.subCategoryKeywordsService.getSubCategoryKeywordStats(
          companyId,
        );

      return stats;
    } catch (error) {
      this.logger.error('Error in getKeywordStats endpoint:', error);
      throw new HttpException(
        {
          message: 'Failed to get subcategory keyword statistics',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get subcategories that need keyword generation
   */
  @Get('subcategories')
  async getSubCategoriesForKeywordGeneration(
    @Query('companyId') companyId?: string,
    @Query('excludeIds') excludeIds?: string,
  ) {
    try {
      this.logger.log('Getting subcategories for keyword generation...');

      const excludeIdsArray = excludeIds ? excludeIds.split(',') : undefined;
      const subCategories =
        await this.subCategoryKeywordsService.getSubCategoriesForKeywordGeneration(
          companyId,
          excludeIdsArray,
        );

      return {
        count: subCategories?.length || 0,
        subCategories:
          subCategories?.map((subCategory: any) => ({
            id: subCategory.id,
            name: subCategory.name,
            name_en: subCategory.name_en,
            category_id: subCategory.category_id,
            company_id: subCategory.company_id,
            descriptions: subCategory.descriptions,
            descriptions_en: subCategory.descriptions_en,
            hasKeywords:
              subCategory.keywords && subCategory.keywords.length > 0,
          })) || [],
      };
    } catch (error) {
      this.logger.error(
        'Error in getSubCategoriesForKeywordGeneration endpoint:',
        error,
      );
      throw new HttpException(
        {
          message: 'Failed to get subcategories for keyword generation',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}


