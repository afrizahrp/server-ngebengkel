import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Query,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Public } from '../../auth/decorators/public.decorator';

import { cms_ProductHeaderService } from './cms_ProductHeader.service';

interface ProductHeaderResponse {
  H1: string;
  H2: string;
  H2_en: string;
  H3: Array<{ title: string; desc: string }>;
  H3_en: Array<{ title: string; desc: string }>;
}

@Controller('cms/product-headers')
export class cms_ProductHeaderController {
  private readonly logger = new Logger(cms_ProductHeaderController.name);

  constructor(
    private readonly productHeaderService: cms_ProductHeaderService,
  ) {}

  /**
   * Test generate headers for a specific product (with improved prompt)
   * POST /cms/product-headers/test-generate/:productId
   */
  @Public()
  @Post('test-generate/:productId')
  @HttpCode(HttpStatus.OK)
  async testGenerateHeaders(
    @Param('productId') productId: string,
    @Query('company_id') companyId: string = 'BIP',
  ): Promise<{
    success: boolean;
    message: string;
    data?: ProductHeaderResponse;
  }> {
    try {
      this.logger.log(
        `🧪 Testing improved header generation for product ID: ${productId}`,
      );

      const headers = await this.productHeaderService.generateHeaders(
        productId,
        companyId,
      );

      this.logger.log(
        `✅ Test header generation completed for product ID: ${productId}`,
      );

      return {
        success: true,
        message: 'Test header generation completed successfully',
        data: headers,
      };
    } catch (error) {
      this.logger.error(`❌ Error in test header generation:`, error);

      return {
        success: false,
        message: `Failed to test generate headers: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Generate headers for a product
   * POST /cms/product-headers/generate/:productId
   */
  @Public()
  @Post('generate/:productId')
  @HttpCode(HttpStatus.OK)
  async generateHeaders(
    @Param('productId') productId: string,
    @Query('company_id') companyId: string = 'BIP',
  ): Promise<{
    success: boolean;
    message: string;
    data?: ProductHeaderResponse;
  }> {
    try {
      this.logger.log(`🔄 Generating headers for product ID: ${productId}`);

      if (!productId) {
        return {
          success: false,
          message: 'Product ID is required',
        };
      }

      const headers = await this.productHeaderService.generateHeaders(
        productId,
        companyId,
      );

      this.logger.log(
        `✅ Successfully generated headers for product ID: ${productId}`,
      );

      return {
        success: true,
        message: 'Headers generated successfully',
        data: headers,
      };
    } catch (error) {
      this.logger.error(
        `❌ Error generating headers for product ID ${productId}:`,
        error,
      );

      return {
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to generate headers',
      };
    }
  }

  /**
   * Generate headers for multiple products (bulk generation)
   * POST /cms/product-headers/bulk-generate
   */
  @Public()
  @Post('bulk-generate')
  @HttpCode(HttpStatus.OK)
  async generateBulkHeaders(
    @Query('company_id') companyId: string = 'BIP',
    @Body() body: { productIds: string[] },
  ): Promise<{
    success: boolean;
    message: string;
    data?: {
      successful: Array<{ productId: string; headers: ProductHeaderResponse }>;
      failed: Array<{ productId: string; error: string }>;
      skipped: Array<{ productId: string; reason: string }>;
      summary: {
        total: number;
        successful: number;
        failed: number;
        skipped: number;
      };
    };
  }> {
    try {
      // Validate request body
      if (!body || !body.productIds || !Array.isArray(body.productIds)) {
        return {
          success: false,
          message: 'Invalid request body. Please provide productIds array.',
        };
      }

      if (body.productIds.length === 0) {
        return {
          success: false,
          message: 'ProductIds array cannot be empty.',
        };
      }

      this.logger.log(
        `🔄 Starting bulk header generation for ${body.productIds.length} products`,
      );

      if (body.productIds.length > 100) {
        return {
          success: false,
          message: 'Maximum 100 products can be processed at once',
        };
      }

      const result = await this.productHeaderService.generateBulkHeaders(
        body.productIds,
        companyId,
      );

      this.logger.log(
        `✅ Bulk header generation completed: ${result.summary.successful}/${result.summary.total} successful`,
      );

      return {
        success: true,
        message: `Bulk generation completed: ${result.summary.successful}/${result.summary.total} successful, ${result.summary.skipped} skipped`,
        data: result,
      };
    } catch (error) {
      this.logger.error(`❌ Error in bulk header generation:`, error);

      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to generate bulk headers',
      };
    }
  }

  /**
   * Direct bulk generate headers for specific products (no validation)
   * POST /cms/product-headers/direct-bulk-generate
   */
  @Public()
  @Post('direct-bulk-generate')
  @HttpCode(HttpStatus.OK)
  async directBulkGenerateHeaders(
    @Query('company_id') companyId: string = 'BIP',
    @Body() body: { productIds: string[] },
  ): Promise<{
    success: boolean;
    message: string;
    data?: {
      successful: Array<{ productId: string; headers: ProductHeaderResponse }>;
      failed: Array<{ productId: string; error: string }>;
      summary: {
        total: number;
        successful: number;
        failed: number;
      };
    };
  }> {
    try {
      // Validate request body
      if (!body || !body.productIds || !Array.isArray(body.productIds)) {
        return {
          success: false,
          message: 'Invalid request body. Please provide productIds array.',
        };
      }

      if (body.productIds.length === 0) {
        return {
          success: false,
          message: 'ProductIds array cannot be empty.',
        };
      }

      this.logger.log(
        `🔄 Starting direct bulk header generation for ${body.productIds.length} products`,
      );

      const result = (await this.productHeaderService.directBulkGenerateHeaders(
        body.productIds,
        companyId,
      )) as {
        successful: Array<{
          productId: string;
          headers: ProductHeaderResponse;
        }>;
        failed: Array<{ productId: string; error: string }>;
        summary: {
          total: number;
          successful: number;
          failed: number;
        };
      };

      this.logger.log(
        `✅ Direct bulk header generation completed: ${result.summary.successful}/${result.summary.total} successful`,
      );

      return {
        success: true,
        message: `Direct bulk generation completed: ${result.summary.successful}/${result.summary.total} successful`,
        data: result,
      };
    } catch (error) {
      this.logger.error(`❌ Error in direct bulk header generation:`, error);

      return {
        success: false,
        message: `Failed to direct bulk generate headers: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Simple auto bulk generate headers for all SHOW products
   * POST /cms/product-headers/auto-bulk-generate
   */
  @Public()
  @Post('auto-bulk-generate')
  @HttpCode(HttpStatus.OK)
  async autoBulkGenerateHeaders(
    @Query('company_id') companyId: string = 'BIP',
    @Query('limit') limit: string = '10',
  ): Promise<{
    success: boolean;
    message: string;
    data?: {
      successful: Array<{ productId: string; headers: ProductHeaderResponse }>;
      failed: Array<{ productId: string; error: string }>;
      summary: {
        total: number;
        successful: number;
        failed: number;
      };
    };
  }> {
    try {
      this.logger.log(`🔄 Starting simple auto bulk header generation`);

      const result = (await this.productHeaderService.simpleAutoBulkGenerate(
        companyId,
        parseInt(limit, 10),
      )) as {
        successful: Array<{
          productId: string;
          headers: ProductHeaderResponse;
        }>;
        failed: Array<{ productId: string; error: string }>;
        summary: {
          total: number;
          successful: number;
          failed: number;
        };
      };

      this.logger.log(
        `✅ Auto bulk header generation completed: ${result.summary.successful}/${result.summary.total} successful`,
      );

      return {
        success: true,
        message: `Auto bulk generation completed: ${result.summary.successful}/${result.summary.total} successful`,
        data: result,
      };
    } catch (error) {
      this.logger.error(`❌ Error in auto bulk header generation:`, error);

      return {
        success: false,
        message: `Failed to auto bulk generate headers: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Debug endpoint to check SHOW products
   * GET /cms/product-headers/debug-show-products
   */
  @Public()
  @Get('debug-show-products')
  async debugShowProducts(
    @Query('company_id') companyId: string = 'BIP',
    @Query('limit') limit: string = '10',
  ): Promise<{
    success: boolean;
    message: string;
    data?: {
      products: Array<{ id: string; name: string; descriptions: any }>;
      total: number;
    };
  }> {
    try {
      const products = (await this.productHeaderService.debugShowProducts(
        companyId,
        parseInt(limit, 10),
      )) as {
        products: Array<{ id: string; name: string; descriptions: any }>;
        total: number;
      };

      return {
        success: true,
        message: `Found ${products.products.length} SHOW products`,
        data: products,
      };
    } catch (error) {
      this.logger.error(`❌ Error in debug show products:`, error);

      return {
        success: false,
        message: `Failed to debug show products: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  /**
   * Get products that don't have headers yet (only SHOW status)
   * GET /cms/product-headers/products-without-headers
   */
  @Get('products-without-headers')
  async getProductsWithoutHeaders(
    @Query('company_id') companyId: string = 'BIP',
    @Query('limit') limit: string = '50',
    @Query('offset') offset: string = '0',
    @Query('exclude_ids') excludeIds: string = '',
    @Query('status_only') statusOnly: string = 'SHOW',
  ): Promise<{
    success: boolean;
    message: string;
    data?: {
      products: Array<{ id: string; name: string }>;
      total: number;
    };
  }> {
    try {
      // Parse exclude IDs from comma-separated string
      const excludeIdsArray = excludeIds
        ? excludeIds
            .split(',')
            .map((id) => id.trim())
            .filter((id) => id.length > 0)
        : [];

      this.logger.log(
        `🔍 Getting products without headers for company: ${companyId} (status: ${statusOnly})${excludeIdsArray.length > 0 ? ` (excluding: ${excludeIdsArray.join(', ')})` : ''}`,
      );

      const result = await this.productHeaderService.getProductsWithoutHeaders(
        companyId,
        parseInt(limit),
        parseInt(offset),
        excludeIdsArray,
      );

      return {
        success: true,
        message: 'Products without headers retrieved successfully',
        data: result,
      };
    } catch (error) {
      this.logger.error(`❌ Error getting products without headers:`, error);

      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to get products without headers',
      };
    }
  }

  /**
   * Get all headers for a company with pagination
   * GET /cms/product-headers
   */
  @Get()
  async getAllHeaders(
    @Query('company_id') companyId: string = 'BIP',
    @Query('limit') limit: string = '50',
    @Query('offset') offset: string = '0',
  ): Promise<{
    success: boolean;
    message: string;
    data?: {
      headers: Array<
        ProductHeaderResponse & { product: { id: string; name: string } }
      >;
      total: number;
    };
  }> {
    try {
      this.logger.log(`🔍 Getting all headers for company: ${companyId}`);

      const result = await this.productHeaderService.getAllHeaders(
        companyId,
        parseInt(limit),
        parseInt(offset),
      );

      return {
        success: true,
        message: 'Headers retrieved successfully',
        data: result,
      };
    } catch (error) {
      this.logger.error(`❌ Error getting all headers:`, error);

      return {
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to get headers',
      };
    }
  }

  /**
   * Get existing headers for a product
   * GET /cms/product-headers/:productId
   */
  @Get(':productId')
  async getHeaders(
    @Param('productId') productId: string,
    @Query('company_id') companyId: string = 'BIP',
  ): Promise<{
    success: boolean;
    message: string;
    data?: ProductHeaderResponse;
  }> {
    try {
      this.logger.log(`🔍 Getting headers for product ID: ${productId}`);

      if (!productId) {
        return {
          success: false,
          message: 'Product ID is required',
        };
      }

      const headers = await this.productHeaderService.getHeaders(
        productId,
        companyId,
      );

      if (!headers) {
        return {
          success: false,
          message: 'Headers not found for this product',
        };
      }

      return {
        success: true,
        message: 'Headers retrieved successfully',
        data: headers,
      };
    } catch (error) {
      this.logger.error(
        `❌ Error getting headers for product ID ${productId}:`,
        error,
      );

      return {
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to get headers',
      };
    }
  }

  /**
   * Delete headers for a product
   * DELETE /cms/product-headers/:productId
   */
  @Delete(':productId')
  @HttpCode(HttpStatus.OK)
  async deleteHeaders(
    @Param('productId') productId: string,
    @Query('company_id') companyId: string = 'BIP',
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      this.logger.log(`🗑️ Deleting headers for product ID: ${productId}`);

      if (!productId) {
        return {
          success: false,
          message: 'Product ID is required',
        };
      }

      await this.productHeaderService.deleteHeaders(productId, companyId);

      this.logger.log(
        `✅ Successfully deleted headers for product ID: ${productId}`,
      );

      return {
        success: true,
        message: 'Headers deleted successfully',
      };
    } catch (error) {
      this.logger.error(
        `❌ Error deleting headers for product ID ${productId}:`,
        error,
      );

      return {
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to delete headers',
      };
    }
  }

  /**
   * Count total headers in cms_ProductHeader table
   */
  @Public()
  @Get('count-headers')
  async countHeaders(@Query('company_id') companyId: string = 'BIP'): Promise<{
    success: boolean;
    message: string;
    data?: {
      totalHeaders: number;
    };
  }> {
    try {
      const totalHeaders =
        await this.productHeaderService.countTotalHeaders(companyId);

      return {
        success: true,
        message: `Found ${totalHeaders} headers in cms_ProductHeader`,
        data: {
          totalHeaders,
        },
      };
    } catch (error) {
      this.logger.error(`❌ Error counting headers:`, error);

      return {
        success: false,
        message: `Failed to count headers: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }
}
