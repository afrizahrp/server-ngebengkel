import { Controller, Post, Body, Param, Logger } from '@nestjs/common';
import { cms_ProductDescAutoGeneratorService } from './cms_ProductDescAutoGenerator.service';
import { Cms_ResponseProductDescDto } from './dto/cms_ResponseProductDesc.dto';
import { Public } from 'src/auth/decorators/public.decorator';

interface BulkTranslateContentDto {
  productIds: string[];
  company_id: string;
  updatedBy?: string;
}

@Controller('cms/product-desc/auto-generate')
export class cms_ProductDescAutoGeneratorController {
  private readonly logger = new Logger(
    cms_ProductDescAutoGeneratorController.name,
  );

  constructor(
    private readonly autoGeneratorService: cms_ProductDescAutoGeneratorService,
  ) {}

  /**
   * Translate product description with complete formatting (including paragraphs)
   */
  @Public()
  @Post(':id/translate-complete')
  async translateProductDescriptionWithCompleteFormatting(
    @Param('id') id: string,
    @Body()
    body: { company_id: string; updatedBy?: string },
  ): Promise<{
    success: boolean;
    data?: Cms_ResponseProductDescDto;
    error?: string;
  }> {
    try {
      this.logger.log(
        `Translating content with complete formatting for product ID: ${id}`,
      );

      const result =
        await this.autoGeneratorService.translateProductDescriptionWithCompleteFormatting(
          id,
          body.company_id,
          body.updatedBy,
        );

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      this.logger.error(
        `Error translating content with complete formatting for product ID ${id}:`,
        error,
      );

      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Unknown error occurred during complete translation',
      };
    }
  }

  /**
   * Translate multiple product descriptions with complete formatting
   */
  @Public()
  @Post('bulk-translate-complete')
  async translateBulkProductDescriptionsWithCompleteFormatting(
    @Body() bulkTranslateContentDto: BulkTranslateContentDto,
  ): Promise<{
    success: boolean;
    data?: {
      successful: Cms_ResponseProductDescDto[];
      failed: { id: string; error: string }[];
    };
    error?: string;
  }> {
    try {
      this.logger.log(
        `Translating content with complete formatting for ${bulkTranslateContentDto.productIds.length} products`,
      );

      const result =
        await this.autoGeneratorService.translateBulkProductDescriptionsWithCompleteFormatting(
          bulkTranslateContentDto.productIds,
          bulkTranslateContentDto.company_id,
          bulkTranslateContentDto.updatedBy,
        );

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      this.logger.error(
        'Error translating bulk content with complete formatting:',
        error,
      );

      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Unknown error occurred during bulk complete translation',
      };
    }
  }
}
