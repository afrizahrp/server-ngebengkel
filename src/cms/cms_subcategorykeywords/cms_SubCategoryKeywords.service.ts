/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import OpenAI from 'openai';
import {
  SubCategoryKeywordGenerationResultDto,
  BulkSubCategoryKeywordResultDto,
  SubCategoryKeywordStatsDto,
  SubCategoryKeywordsDto,
} from './dto/generateSubCategoryKeywords.dto';

@Injectable()
export class CmsSubCategoryKeywordsService {
  private readonly logger = new Logger(CmsSubCategoryKeywordsService.name);
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
   * Generate keywords for a single subcategory using OpenAI GPT-4o mini
   */
  async generateKeywordsForSubCategory(
    subCategoryId: string,
    categoryId: string,
    companyId: string,
  ): Promise<SubCategoryKeywordGenerationResultDto> {
    try {
      this.logger.log(`Generating keywords for subcategory: ${subCategoryId}`);

      // Get subcategory with descriptions
      const subCategory = await (this.prisma as any).imc_SubCategory.findFirst({
        where: {
          id: subCategoryId,
          category_id: categoryId,
          company_id: companyId,
        },
      });

      if (!subCategory) {
        return {
          success: false,
          error: 'SubCategory not found',
        };
      }

      if (!subCategory.descriptions && !subCategory.descriptions_en) {
        return {
          success: false,
          error: 'SubCategory description not found',
        };
      }

      // Prepare prompt for GPT-4o mini
      const prompt = `You are an SEO assistant.
Generate keywords for the following healthcare-related subcategory 
(hospital furniture, medical device, or laboratory equipment subcategory).
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

SubCategory name: ${subCategory.name.trim()}
SubCategory name EN: ${subCategory.name_en?.trim() ?? '-'}
Description: ${subCategory.descriptions ?? '-'}
Description EN: ${subCategory.descriptions_en ?? '-'}`;

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
      const cleanKeywords: SubCategoryKeywordsDto = {
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
        `Successfully generated keywords for subcategory: ${subCategoryId}`,
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
    subCategoryId: string,
    categoryId: string,
    companyId: string,
    keywords: SubCategoryKeywordsDto,
  ): Promise<boolean> {
    try {
      this.logger.log(
        `Saving keywords to database for subcategory: ${subCategoryId}`,
      );

      // Check if keywords already exist
      const existingKeywords = await (
        this.prisma as any
      ).cms_subCategoryKeywords.findFirst({
        where: {
          subCategory_id: subCategoryId,
          category_id: categoryId,
          company_id: companyId,
        },
      });

      if (existingKeywords) {
        // Update existing keywords
        await (this.prisma as any).cms_subCategoryKeywords.updateMany({
          where: {
            subCategory_id: subCategoryId,
            category_id: categoryId,
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
        await (this.prisma as any).cms_subCategoryKeywords.create({
          data: {
            subCategory_id: subCategoryId,
            category_id: categoryId,
            company_id: companyId,
            shortKeywords: keywords.indonesian?.short || [],
            longKeywords: keywords.indonesian?.long || [],
            shortKeywords_en: keywords.english?.short || [],
            longKeywords_en: keywords.english?.long || [],
          },
        });
      }

      this.logger.log(
        `Successfully saved keywords for subcategory: ${subCategoryId}`,
      );
      return true;
    } catch (error) {
      this.logger.error('Error saving keywords to database:', error);
      return false;
    }
  }

  /**
   * Generate and save keywords for a single subcategory
   */
  async generateAndSaveKeywords(
    subCategoryId: string,
    categoryId: string,
    companyId: string,
  ): Promise<SubCategoryKeywordGenerationResultDto> {
    try {
      // Generate keywords
      const result = await this.generateKeywordsForSubCategory(
        subCategoryId,
        categoryId,
        companyId,
      );

      if (!result.success || !result.keywords) {
        return result;
      }

      // Save to database
      const saveSuccess = await this.saveKeywordsToDatabase(
        subCategoryId,
        categoryId,
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
   * Get all subcategories that need keyword generation
   */
  async getSubCategoriesForKeywordGeneration(
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

      const subCategories = await (this.prisma as any).imc_SubCategory.findMany(
        {
          where: {
            ...whereClause,
            ...excludeFilter,
            iShowedStatus: 'SHOW',
            OR: [
              { descriptions: { not: null } },
              { descriptions_en: { not: null } },
            ],
          },
          include: {
            keywords: true,
          },
        },
      );

      return subCategories;
    } catch (error) {
      this.logger.error(
        'Error fetching subcategories for keyword generation:',
        error,
      );
      throw new Error('Failed to fetch subcategories for keyword generation');
    }
  }

  /**
   * Generate keywords for all subcategories (bulk operation)
   */
  async generateKeywordsForAllSubCategories(
    companyId?: string,
    excludeIds?: string[],
  ): Promise<BulkSubCategoryKeywordResultDto> {
    const result: BulkSubCategoryKeywordResultDto = {
      totalProcessed: 0,
      successCount: 0,
      errorCount: 0,
      errors: [],
    };

    try {
      this.logger.log('Starting bulk subcategory keyword generation...');

      // Get all subcategories that need keyword generation
      const subCategories = await this.getSubCategoriesForKeywordGeneration(
        companyId,
        excludeIds,
      );
      result.totalProcessed = subCategories?.length || 0;

      this.logger.log(
        `Found ${subCategories?.length || 0} subcategories for keyword generation`,
      );

      if (subCategories) {
        for (const subCategory of subCategories) {
          this.logger.log(
            `Processing subcategory: ${subCategory.name} (ID: ${subCategory.id})`,
          );

          try {
            // Generate and save keywords
            const keywordResult = await this.generateAndSaveKeywords(
              subCategory.id,
              subCategory.category_id,
              subCategory.company_id,
            );

            if (keywordResult.success) {
              result.successCount++;
              this.logger.log(
                `✓ Successfully generated keywords for subcategory: ${subCategory.name}`,
              );
            } else {
              result.errorCount++;
              result.errors.push({
                subCategoryId: subCategory.id,
                error: keywordResult.error || 'Unknown error',
              });
              this.logger.log(
                `✗ Failed to generate keywords for subcategory: ${subCategory.name} - ${keywordResult.error}`,
              );
            }
          } catch (error) {
            result.errorCount++;
            const errorMessage =
              error instanceof Error ? error.message : 'Unknown error';
            result.errors.push({
              subCategoryId: subCategory.id,
              error: errorMessage,
            });
            this.logger.log(
              `✗ Error processing subcategory: ${subCategory.name} - ${errorMessage}`,
            );
          }

          // Add delay to avoid rate limiting
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }

      this.logger.log('Bulk subcategory keyword generation completed!');
      this.logger.log(`Total processed: ${result.totalProcessed}`);
      this.logger.log(`Success: ${result.successCount}`);
      this.logger.log(`Errors: ${result.errorCount}`);

      return result;
    } catch (error) {
      this.logger.error('Error in generateKeywordsForAllSubCategories:', error);
      throw error;
    }
  }

  /**
   * Get subcategory keyword generation statistics
   */
  async getSubCategoryKeywordStats(
    companyId?: string,
  ): Promise<SubCategoryKeywordStatsDto> {
    try {
      const whereClause = companyId ? { company_id: companyId } : {};

      const totalSubCategories = await (
        this.prisma as any
      ).imc_SubCategory.count({
        where: {
          ...whereClause,
          iShowedStatus: 'SHOW',
          OR: [
            { descriptions: { not: null } },
            { descriptions_en: { not: null } },
          ],
        },
      });

      const subCategoriesWithKeywords = await (
        this.prisma as any
      ).cms_subCategoryKeywords.count({
        where: whereClause,
      });

      return {
        totalSubCategories,
        subCategoriesWithKeywords,
        pending: totalSubCategories - subCategoriesWithKeywords,
      };
    } catch (error) {
      this.logger.error('Error getting subcategory keyword stats:', error);
      throw new Error('Failed to get subcategory keyword statistics');
    }
  }
}


