import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { cms_subCategoryHeaderService } from './cms_subcategoryHeader.service';
import {
  GenerateSubCategoryHeadersDto,
  BulkGenerateSubCategoryHeadersDto,
  GetSubCategoryHeadersResponseDto,
  GetAllSubCategoryHeadersResponseDto,
  BulkGenerateResponseDto,
  SimpleAutoBulkGenerateResponseDto,
  GetSubCategoriesWithoutHeadersResponseDto,
} from './dto';
import { Public } from '../../auth/decorators/public.decorator';

@Controller('cms/subcategory-headers')
export class cms_SubCategoryHeaderController {
  private readonly logger = new Logger(cms_SubCategoryHeaderController.name);

  constructor(
    private readonly subCategoryHeaderService: cms_subCategoryHeaderService,
  ) {}

  /**
   * Generate headers for a single subcategory
   * POST /cms/subcategory-headers/generate
   */
  @Public()
  @Post('generate')
  @HttpCode(HttpStatus.OK)
  async generateHeaders(
    @Body() generateDto: GenerateSubCategoryHeadersDto,
  ): Promise<GetSubCategoryHeadersResponseDto> {
    this.logger.log(
      `🔄 Generating headers for subcategory: ${generateDto.subCategoryId}, category: ${generateDto.categoryId}`,
    );

    try {
      const headers = await this.subCategoryHeaderService.generateHeaders(
        generateDto.subCategoryId,
        generateDto.categoryId,
        generateDto.companyId,
      );

      return {
        success: true,
        message: 'Headers generated successfully',
        data: headers,
      };
    } catch (error) {
      this.logger.error('Error in controller:', error);
      throw error;
    }
  }

  /**
   * Get existing headers for a subcategory
   * GET /cms/subcategory-headers/:companyId/:categoryId/:subCategoryId
   */
  @Public()
  @Get(':companyId/:categoryId/:subCategoryId')
  async getHeaders(
    @Param('companyId') companyId: string,
    @Param('categoryId') categoryId: string,
    @Param('subCategoryId') subCategoryId: string,
  ): Promise<GetSubCategoryHeadersResponseDto> {
    this.logger.log(
      `📋 Getting headers for subcategory: ${subCategoryId}, category: ${categoryId}`,
    );

    const headers = await this.subCategoryHeaderService.getHeaders(
      subCategoryId,
      categoryId,
      companyId,
    );

    if (!headers) {
      return {
        success: false,
        message: 'Headers not found for this subcategory',
        data: null,
      };
    }

    return {
      success: true,
      message: 'Headers retrieved successfully',
      data: headers,
    };
  }

  /**
   * Get all headers with pagination
   * GET /cms/subcategory-headers/:companyId/all
   */
  @Public()
  @Get(':companyId/all')
  async getAllHeaders(
    @Param('companyId') companyId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ): Promise<GetAllSubCategoryHeadersResponseDto> {
    this.logger.log(`📋 Getting all headers for company: ${companyId}`);

    const limitNum = limit ? parseInt(limit, 10) : 50;
    const offsetNum = offset ? parseInt(offset, 10) : 0;

    const result = await this.subCategoryHeaderService.getAllHeaders(
      companyId,
      limitNum,
      offsetNum,
    );

    return {
      success: true,
      message: 'Headers retrieved successfully',
      data: result.headers,
      pagination: {
        total: result.total,
        limit: limitNum,
        offset: offsetNum,
        hasMore: offsetNum + limitNum < result.total,
      },
    };
  }

  /**
   * Bulk generate headers for multiple subcategories
   * POST /cms/subcategory-headers/bulk-generate
   */
  @Public()
  @Post('bulk-generate')
  @HttpCode(HttpStatus.OK)
  async bulkGenerateHeaders(
    @Body() bulkGenerateDto: BulkGenerateSubCategoryHeadersDto,
  ): Promise<BulkGenerateResponseDto> {
    this.logger.log(
      `🔄 Bulk generating headers for ${bulkGenerateDto.subCategoryIds.length} subcategories`,
    );

    const result = await this.subCategoryHeaderService.generateBulkHeaders(
      bulkGenerateDto.subCategoryIds,
      bulkGenerateDto.companyId,
    );

    return {
      success: true,
      message: 'Bulk header generation completed',
      data: result,
    };
  }

  /**
   * Simple auto bulk generate - automatically find SHOW subcategories and generate headers
   * POST /cms/subcategory-headers/simple-auto-bulk-generate
   */
  @Public()
  @Post('simple-auto-bulk-generate')
  @HttpCode(HttpStatus.OK)
  async simpleAutoBulkGenerate(
    @Body('companyId') companyId: string,
    @Body('limit') limit?: number,
  ): Promise<SimpleAutoBulkGenerateResponseDto> {
    this.logger.log(
      `🔄 Starting simple auto bulk generate for company: ${companyId}, limit: ${limit || 10}`,
    );

    const result = await this.subCategoryHeaderService.simpleAutoBulkGenerate(
      companyId,
      limit || 10,
    );

    return {
      success: true,
      message: 'Simple auto bulk generation completed',
      data: result,
    };
  }

  /**
   * Get subcategories that don't have headers yet
   * GET /cms/subcategory-headers/:companyId/without-headers
   */
  @Public()
  @Get(':companyId/without-headers')
  async getSubCategoriesWithoutHeaders(
    @Param('companyId') companyId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ): Promise<GetSubCategoriesWithoutHeadersResponseDto> {
    this.logger.log(
      `📋 Getting subcategories without headers for company: ${companyId}`,
    );

    const limitNum = limit ? parseInt(limit, 10) : 50;
    const offsetNum = offset ? parseInt(offset, 10) : 0;

    const result =
      await this.subCategoryHeaderService.getSubCategoriesWithoutHeaders(
        companyId,
        limitNum,
        offsetNum,
      );

    return {
      success: true,
      message: 'Subcategories without headers retrieved successfully',
      data: result.subCategories,
      pagination: {
        total: result.total,
        limit: limitNum,
        offset: offsetNum,
        hasMore: offsetNum + limitNum < result.total,
      },
    };
  }

  /**
   * Delete headers for a subcategory
   * DELETE /cms/subcategory-headers/:companyId/:categoryId/:subCategoryId
   */
  @Delete(':companyId/:categoryId/:subCategoryId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteHeaders(
    @Param('companyId') companyId: string,
    @Param('categoryId') categoryId: string,
    @Param('subCategoryId') subCategoryId: string,
  ): Promise<void> {
    this.logger.log(
      `🗑️ Deleting headers for subcategory: ${subCategoryId}, category: ${categoryId}`,
    );

    await this.subCategoryHeaderService.deleteHeaders(
      subCategoryId,
      categoryId,
      companyId,
    );
  }

  /**
   * Direct insert headers without generation
   * POST /cms/subcategory-headers/direct-insert
   */
  @Public()
  @Post('direct-insert')
  @HttpCode(HttpStatus.OK)
  async directInsertHeaders(
    @Body()
    body: {
      subCategoryId: string;
      categoryId: string;
      companyId: string;
      H1: string;
      H1_en: string;
      H2: string;
      H2_en: string;
      H3: Array<{ title: string; desc: string }>;
      H3_en: Array<{ title: string; desc: string }>;
    },
  ): Promise<{ success: boolean; message: string; data: any }> {
    this.logger.log(
      `🔄 Direct inserting headers for subcategory: ${body.subCategoryId}`,
    );

    try {
      const headers = await this.subCategoryHeaderService.directInsertHeaders(
        body.subCategoryId,
        body.categoryId,
        body.companyId,
        {
          H1: body.H1,
          H1_en: body.H1_en,
          H2: body.H2,
          H2_en: body.H2_en,
          H3: body.H3,
          H3_en: body.H3_en,
        },
      );

      return {
        success: true,
        message: 'Headers inserted successfully',
        data: headers,
      };
    } catch (error) {
      this.logger.error('Error in controller:', error);
      throw error;
    }
  }

  /**
   * Count total headers
   * GET /cms/subcategory-headers/:companyId/count
   */
  @Public()
  @Get(':companyId/count')
  async countTotalHeaders(
    @Param('companyId') companyId: string,
  ): Promise<{ success: boolean; message: string; data: { total: number } }> {
    this.logger.log(`📊 Counting total headers for company: ${companyId}`);

    const total =
      await this.subCategoryHeaderService.countTotalHeaders(companyId);

    return {
      success: true,
      message: 'Total headers counted successfully',
      data: { total },
    };
  }
}
