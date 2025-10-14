/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import OpenAI from 'openai';
import {
  ProductKeywordGenerationResultDto,
  BulkProductKeywordResultDto,
  ProductKeywordStatsDto,
  ProductKeywordsDto,
} from './dto/generateProductKeywords.dto';

@Injectable()
export class CmsProductKeywordsService {
  private readonly logger = new Logger(CmsProductKeywordsService.name);
  private openai: OpenAI;

  constructor(private readonly prisma: PrismaService) {
    this.initializeOpenAI();
  }

  private initializeOpenAI(): void {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    }) as OpenAI;
  }

  /**
   * Generate keywords for a single product using OpenAI GPT-4o mini
   */
  async generateKeywordsForProduct(
    productId: string,
    companyId: string,
  ): Promise<ProductKeywordGenerationResultDto> {
    try {
      this.logger.log(`Generating keywords for product: ${productId}`);

      // Get product with description
      const product = await (this.prisma as any).imc_Product.findFirst({
        where: {
          id: productId,
          company_id: companyId,
        },
        include: {
          descriptions: true,
        },
      });

      if (!product) {
        return {
          success: false,
          error: 'Product not found',
        };
      }

      if (!product.descriptions) {
        return {
          success: false,
          error: 'Product description not found',
        };
      }

      // Prepare prompt for GPT-4o mini
      const prompt = `You are an SEO assistant.
Generate keywords for the following healthcare-related product 
(hospital furniture, medical device, or laboratory equipment).
Provide 5 short-tail keywords (1–3 words) and 5 long-tail keywords (4+ words) 
in **Indonesian** and **English**.
Return ONLY valid JSON format without any markdown code blocks or explanations.

Rules:
- Provide exactly 5 short-tail keywords (1–3 words) and 5 long-tail keywords (4+ words).
- Use both **Indonesian** and **English**.
- Translate carefully. Example: "Infant Warmer" must be translated as **"Penghangat Bayi"**, not "Pemanas Bayi".
- Always use medically correct and natural terms in Indonesian.
- Return ONLY valid JSON. Do not include explanations, markdown, or code blocks.

{
  "indonesian": { "short": [...], "long": [...] },
  "english": { "short": [...], "long": [...] }
}

Product name: ${product.name.trim()}
Description: ${product.descriptions.descriptions ?? '-'}
Benefits: ${product.descriptions.benefits ?? '-'}
Description EN: ${product.descriptions.descriptions_en ?? '-'}
Benefits EN: ${product.descriptions.benefits_en ?? '-'}`;

      // Call OpenAI GPT-4o mini API
      const completion = await (this.openai as any).chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are an SEO expert specializing in healthcare and medical equipment keywords. Always respond with ONLY valid JSON format without any markdown code blocks, explanations, or additional text.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        return {
          success: false,
          error: 'No response from OpenAI',
        };
      }

      // Parse JSON response
      let keywords: any;
      try {
        // Clean response from markdown code blocks
        let cleanResponse = response;
        if (cleanResponse.includes('```json')) {
          cleanResponse = cleanResponse
            .replace(/```json\s*/g, '')
            .replace(/```\s*$/g, '');
        }
        if (cleanResponse.includes('```')) {
          cleanResponse = cleanResponse.replace(/```\s*/g, '');
        }

        keywords = JSON.parse(cleanResponse.trim());
      } catch (parseError) {
        this.logger.error('Invalid JSON response from OpenAI:', parseError);
        this.logger.error('Raw response:', response);
        return {
          success: false,
          error: 'Invalid JSON response from OpenAI',
        };
      }

      // Validate response structure
      if (
        !keywords.indonesian ||
        !keywords.english ||
        !keywords.indonesian.short ||
        !keywords.indonesian.long ||
        !keywords.english.short ||
        !keywords.english.long
      ) {
        return {
          success: false,
          error: 'Invalid keyword structure from OpenAI',
        };
      }

      // Clean and trim keywords
      const cleanKeywords: ProductKeywordsDto = {
        indonesian: {
          short: (keywords.indonesian?.short || []).map((k: string) =>
            k.replace(/\s+/g, ' ').trim(),
          ),
          long: (keywords.indonesian?.long || []).map((k: string) =>
            k.replace(/\s+/g, ' ').trim(),
          ),
        },
        english: {
          short: (keywords.english?.short || []).map((k: string) =>
            k.replace(/\s+/g, ' ').trim(),
          ),
          long: (keywords.english?.long || []).map((k: string) =>
            k.replace(/\s+/g, ' ').trim(),
          ),
        },
      };

      this.logger.log(
        `Successfully generated keywords for product: ${productId}`,
      );
      return {
        success: true,
        keywords: cleanKeywords,
      };
    } catch (error) {
      this.logger.error('Error generating keywords:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Save keywords to database
   */
  async saveKeywordsToDatabase(
    productId: string,
    companyId: string,
    keywords: ProductKeywordsDto,
  ): Promise<boolean> {
    try {
      this.logger.log(`Saving keywords to database for product: ${productId}`);

      // Check if keywords already exist
      const existingKeywords = await (
        this.prisma as any
      ).cms_ProductKeywords.findFirst({
        where: {
          product_id: productId,
          company_id: companyId,
        },
      });

      if (existingKeywords) {
        // Update existing keywords
        await (this.prisma as any).cms_ProductKeywords.updateMany({
          where: {
            product_id: productId,
            company_id: companyId,
          },
          data: {
            shortKeywords: keywords.indonesian?.short || [],
            longKeywords: keywords.indonesian?.long || [],
            shortKeywords_en: keywords.english?.short || [],
            longKeywords_en: keywords.english?.long || [],
          },
        });
      } else {
        // Create new keywords
        await (this.prisma as any).cms_ProductKeywords.create({
          data: {
            product_id: productId,
            company_id: companyId,
            shortKeywords: keywords.indonesian?.short || [],
            longKeywords: keywords.indonesian?.long || [],
            shortKeywords_en: keywords.english?.short || [],
            longKeywords_en: keywords.english?.long || [],
          },
        });
      }

      this.logger.log(`Successfully saved keywords for product: ${productId}`);
      return true;
    } catch (error) {
      this.logger.error('Error saving keywords to database:', error);
      return false;
    }
  }

  /**
   * Generate and save keywords for a single product
   */
  async generateAndSaveKeywords(
    productId: string,
    companyId: string,
  ): Promise<ProductKeywordGenerationResultDto> {
    try {
      // Generate keywords
      const result = await this.generateKeywordsForProduct(
        productId,
        companyId,
      );

      if (!result.success || !result.keywords) {
        return result;
      }

      // Save to database
      const saveSuccess = await this.saveKeywordsToDatabase(
        productId,
        companyId,
        result.keywords,
      );

      if (!saveSuccess) {
        return {
          success: false,
          error: 'Failed to save keywords to database',
        };
      }

      return result;
    } catch (error) {
      this.logger.error('Error in generateAndSaveKeywords:', error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get all products that need keyword generation
   */
  async getProductsForKeywordGeneration(
    companyId?: string,
    excludeIds?: string[],
  ) {
    try {
      const whereClause = companyId ? { company_id: companyId } : {};

      // Add exclusion filter if excludeIds provided
      const excludeFilter =
        excludeIds && excludeIds.length > 0
          ? { id: { notIn: excludeIds } }
          : {};

      const products = await (this.prisma as any).imc_Product.findMany({
        where: {
          ...whereClause,
          ...excludeFilter,
          iShowedStatus: 'SHOW',
          descriptions: {
            isNot: null,
          },
        },
        include: {
          descriptions: true,
          keywords: true,
        },
      });

      return products;
    } catch (error) {
      this.logger.error(
        'Error fetching products for keyword generation:',
        error,
      );
      throw new Error('Failed to fetch products for keyword generation');
    }
  }

  /**
   * Generate keywords for all products (bulk operation)
   */
  async generateKeywordsForAllProducts(
    companyId?: string,
    excludeIds?: string[],
  ): Promise<BulkProductKeywordResultDto> {
    const result: BulkProductKeywordResultDto = {
      totalProcessed: 0,
      successCount: 0,
      errorCount: 0,
      errors: [],
    };

    try {
      this.logger.log('Starting bulk keyword generation...');

      // Get all products that need keyword generation
      const products = await this.getProductsForKeywordGeneration(
        companyId,
        excludeIds,
      );
      result.totalProcessed = products?.length || 0;

      this.logger.log(
        `Found ${products?.length || 0} products for keyword generation`,
      );

      if (products) {
        for (const product of products) {
          this.logger.log(
            `Processing product: ${product.name} (ID: ${product.id})`,
          );

          try {
            // Generate and save keywords
            const keywordResult = await this.generateAndSaveKeywords(
              product.id,
              product.company_id,
            );

            if (keywordResult.success) {
              result.successCount++;
              this.logger.log(
                `✓ Successfully generated keywords for product: ${product.name}`,
              );
            } else {
              result.errorCount++;
              result.errors.push({
                productId: product.id,
                error: keywordResult.error || 'Unknown error',
              });
              this.logger.log(
                `✗ Failed to generate keywords for product: ${product.name} - ${keywordResult.error}`,
              );
            }
          } catch (error) {
            result.errorCount++;
            const errorMessage =
              error instanceof Error ? error.message : 'Unknown error';
            result.errors.push({
              productId: product.id,
              error: errorMessage,
            });
            this.logger.log(
              `✗ Error processing product: ${product.name} - ${errorMessage}`,
            );
          }

          // Add delay to avoid rate limiting
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }

      this.logger.log('Bulk keyword generation completed!');
      this.logger.log(`Total processed: ${result.totalProcessed}`);
      this.logger.log(`Success: ${result.successCount}`);
      this.logger.log(`Errors: ${result.errorCount}`);

      return result;
    } catch (error) {
      this.logger.error('Error in generateKeywordsForAllProducts:', error);
      throw error;
    }
  }

  /**
   * Get keyword generation statistics
   */
  async getKeywordStats(companyId?: string): Promise<ProductKeywordStatsDto> {
    try {
      const whereClause = companyId ? { company_id: companyId } : {};

      const totalProducts = await (this.prisma as any).imc_Product.count({
        where: {
          ...whereClause,
          iShowedStatus: 'SHOW',
          descriptions: {
            isNot: null,
          },
        },
      });

      const productsWithKeywords = await (
        this.prisma as any
      ).cms_ProductKeywords.count({
        where: whereClause,
      });

      return {
        totalProducts,
        productsWithKeywords,
        pending: totalProducts - productsWithKeywords,
      };
    } catch (error) {
      this.logger.error('Error getting keyword stats:', error);
      throw new Error('Failed to get keyword statistics');
    }
  }
}
