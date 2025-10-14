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
import { CmsProductKeywordsService } from './cms_ProductKeywords.service';
import {
  GenerateProductKeywordsDto,
  BulkGenerateProductKeywordsDto,
  ProductKeywordGenerationResultDto,
  BulkProductKeywordResultDto,
  ProductKeywordStatsDto,
} from './dto/generateProductKeywords.dto';

@Controller('cms/product-keywords')
export class CmsProductKeywordsController {
  private readonly logger = new Logger(CmsProductKeywordsController.name);

  constructor(
    private readonly productKeywordsService: CmsProductKeywordsService,
  ) {}

  /**
   * Generate keywords for a single product
   */
  @Post('generate')
  async generateKeywords(
    @Body() generateProductKeywordsDto: GenerateProductKeywordsDto,
  ): Promise<ProductKeywordGenerationResultDto> {
    try {
      this.logger.log(
        `Generating keywords for product: ${generateProductKeywordsDto.productId}`,
      );

      const result =
        await this.productKeywordsService.generateKeywordsForProduct(
          generateProductKeywordsDto.productId,
          generateProductKeywordsDto.companyId,
        );

      if (!result.success) {
        throw new HttpException(
          {
            message: 'Failed to generate keywords',
            error: result.error,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      return result;
    } catch (error) {
      this.logger.error('Error in generateKeywords endpoint:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          message: 'Internal server error',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Generate and save keywords for a single product
   */
  @Public()
  @Post('generate-and-save')
  async generateAndSaveKeywords(
    @Body() generateProductKeywordsDto: GenerateProductKeywordsDto,
  ): Promise<ProductKeywordGenerationResultDto> {
    try {
      this.logger.log(
        `Generating and saving keywords for product: ${generateProductKeywordsDto.productId}`,
      );

      const result = await this.productKeywordsService.generateAndSaveKeywords(
        generateProductKeywordsDto.productId,
        generateProductKeywordsDto.companyId,
      );

      if (!result.success) {
        throw new HttpException(
          {
            message: 'Failed to generate and save keywords',
            error: result.error,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      return result;
    } catch (error) {
      this.logger.error('Error in generateAndSaveKeywords endpoint:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          message: 'Internal server error',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Generate keywords for all products (bulk operation)
   */
  @Public()
  @Post('bulk-generate')
  async bulkGenerateKeywords(
    @Body() bulkGenerateProductKeywordsDto: BulkGenerateProductKeywordsDto,
  ): Promise<BulkProductKeywordResultDto> {
    try {
      this.logger.log('Starting bulk keyword generation...');

      const result =
        await this.productKeywordsService.generateKeywordsForAllProducts(
          bulkGenerateProductKeywordsDto.companyId,
          bulkGenerateProductKeywordsDto.excludeIds,
        );

      this.logger.log(
        `Bulk keyword generation completed. Processed: ${result.totalProcessed}, Success: ${result.successCount}, Errors: ${result.errorCount}`,
      );

      return result;
    } catch (error) {
      this.logger.error('Error in bulkGenerateKeywords endpoint:', error);
      throw new HttpException(
        {
          message: 'Failed to perform bulk keyword generation',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get products that need keyword generation
   */
  @Get('products')
  async getProductsForKeywordGeneration(
    @Query('companyId') companyId?: string,
  ) {
    try {
      this.logger.log('Fetching products for keyword generation...');

      const products =
        await this.productKeywordsService.getProductsForKeywordGeneration(
          companyId,
        );

      return {
        success: true,
        data: products,
        count: products.length,
      };
    } catch (error) {
      this.logger.error(
        'Error in getProductsForKeywordGeneration endpoint:',
        error,
      );
      throw new HttpException(
        {
          message: 'Failed to fetch products for keyword generation',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get keyword generation statistics
   */
  @Get('stats')
  async getKeywordStats(
    @Query('companyId') companyId?: string,
  ): Promise<ProductKeywordStatsDto> {
    try {
      this.logger.log('Fetching keyword generation statistics...');

      const stats =
        await this.productKeywordsService.getKeywordStats(companyId);

      return stats;
    } catch (error) {
      this.logger.error('Error in getKeywordStats endpoint:', error);
      throw new HttpException(
        {
          message: 'Failed to fetch keyword statistics',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get keywords for a specific product
   */
  @Get('product/:productId')
  async getProductKeywords(
    @Param('productId') productId: string,
    @Query('companyId') companyId: string,
  ) {
    try {
      this.logger.log(`Fetching keywords for product: ${productId}`);

      const keywords = await (
        this.productKeywordsService as any
      ).prisma.cms_ProductKeywords.findFirst({
        where: {
          product_id: productId,
          company_id: companyId,
        },
      });

      if (!keywords) {
        throw new HttpException(
          {
            message: 'Keywords not found for this product',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        data: keywords,
      };
    } catch (error) {
      this.logger.error('Error in getProductKeywords endpoint:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          message: 'Failed to fetch product keywords',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
