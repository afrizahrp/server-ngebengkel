/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { OpenAIService } from '../cms_productdesc/openai.service';

interface SubCategoryHeaderData {
  H1: string;
  H1_en: string;
  H2: string;
  H2_en: string;
  H3: Array<{ title: string; desc: string }>;
  H3_en: Array<{ title: string; desc: string }>;
}

interface OpenAIResponse {
  H2: string;
  H2_en: string;
  H3: Array<{ title: string; desc: string }>;
  H3_en?: Array<{ title: string; desc: string }>; // Optional karena OpenAI mungkin tidak mengembalikan H3_en
}

interface OpenAIAPIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface PrismaSubCategoryHeader {
  H1: string | null;
  H1_en: string | null;
  H2: string;
  H2_en: string;
  H3: unknown;
  H3_en: unknown;
}

interface SubCategoryForGeneration {
  id: string;
  category_id: string;
  name: string;
  name_en: string | null;
  descriptions: string | null;
  descriptions_en: string | null;
  iShowedStatus: string;
}

@Injectable()
export class cms_subCategoryHeaderService {
  private readonly logger = new Logger(cms_subCategoryHeaderService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly openAIService: OpenAIService,
  ) {}

  /**
   * Generate headers (H1, H1_en, H2, H2_en, H3, H3_en) for a subcategory
   * @param subCategoryId SubCategory ID
   * @param categoryId Category ID
   * @param companyId Company ID
   * @returns Generated headers data
   */
  async generateHeaders(
    subCategoryId: string,
    categoryId: string,
    companyId: string,
  ): Promise<SubCategoryHeaderData> {
    try {
      this.logger.log(
        `🔄 Starting header generation for subcategory ID: ${subCategoryId}, category ID: ${categoryId}`,
      );
      this.logger.log(
        `Input parameters: subCategoryId="${subCategoryId}", categoryId="${categoryId}", companyId="${companyId}"`,
      );

      // Fetch subcategory data
      this.logger.log(
        `Querying subcategory with: company_id="${companyId}", category_id="${categoryId}", id="${subCategoryId.trim()}"`,
      );
      const subCategory = await this.prisma.imc_SubCategory.findUnique({
        where: {
          company_id_category_id_id: {
            company_id: companyId,
            category_id: categoryId,
            id: subCategoryId.trim(),
          },
        },
        select: {
          id: true,
          category_id: true,
          name: true,
          name_en: true,
          descriptions: true,
          descriptions_en: true,
          iShowedStatus: true,
        },
      });
      this.logger.log(`Query result:`, subCategory);

      if (!subCategory) {
        this.logger.warn(
          `⚠️ SubCategory with ID ${subCategoryId.trim()} and Category ID ${categoryId} not found`,
        );
        throw new NotFoundException(
          `SubCategory with ID ${subCategoryId.trim()} and Category ID ${categoryId} not found`,
        );
      }

      // Check if subcategory has SHOW status
      if (subCategory.iShowedStatus !== 'SHOW') {
        this.logger.warn(
          `⚠️ SubCategory with ID ${subCategoryId.trim()} is not in SHOW status (current status: ${subCategory.iShowedStatus})`,
        );
        throw new NotFoundException(
          `SubCategory with ID ${subCategoryId.trim()} is not in SHOW status (current status: ${subCategory.iShowedStatus})`,
        );
      }

      this.logger.log(`✅ Fetched subcategory data for: ${subCategory.name}`);

      // Generate headers using OpenAI
      this.logger.log(`🔄 Starting OpenAI generation...`);
      this.logger.log(`SubCategory data for OpenAI:`, {
        name: subCategory.name,
        name_en: subCategory.name_en,
        descriptions: subCategory.descriptions,
        descriptions_en: subCategory.descriptions_en,
      });

      let generatedHeaders;
      try {
        generatedHeaders = await this.generateHeadersWithOpenAI(
          subCategory,
          subCategory.descriptions || '',
          subCategory.descriptions_en || '',
        );
        this.logger.log(`✅ OpenAI generation completed:`, generatedHeaders);
      } catch (openAIError) {
        this.logger.error(`❌ OpenAI generation failed:`, openAIError);
        throw openAIError;
      }

      // Save to database
      this.logger.log(`🔄 Starting database save operation...`);
      const savedHeader = await this.saveHeadersToDatabase(
        subCategoryId,
        categoryId,
        companyId,
        generatedHeaders,
      );
      this.logger.log(`✅ Database save completed:`, savedHeader);

      this.logger.log(
        `🎉 Successfully generated and saved headers for subcategory ID: ${subCategoryId}`,
      );

      return savedHeader;
    } catch (error) {
      this.logger.error(
        `Error generating headers for subcategory ID ${subCategoryId}:`,
        error,
      );
      this.logger.error('Error details:', {
        message: error.message,
        stack: error.stack,
        subCategoryId,
        categoryId,
        companyId,
      });
      throw error;
    }
  }

  /**
   * Generate headers using OpenAI GPT-4o mini
   */
  private async generateHeadersWithOpenAI(
    subCategory: SubCategoryForGeneration,
    descriptionsId: string,
    descriptionsEn: string,
  ): Promise<SubCategoryHeaderData> {
    const prompt = `
You are an SEO assistant for healthcare subcategories (hospital furniture, medical devices, laboratory equipment).

SubCategory Glossary:
- SubCategory Name: ${subCategory.name}
- SubCategory Name (EN): ${subCategory.name_en || 'Not specified'}
- Category ID: ${subCategory.category_id}

Task:
1. Generate H2 heading that SUMMARIZES the main benefits and value proposition from the description:
   - Extract key benefits and advantages mentioned in the description
   - Create a compelling summary that highlights why this subcategory is valuable
   - Focus on benefits, not just features
   - Make it SEO-friendly and engaging (1-2 sentences)
   - DO NOT include category codes or IDs in the H2 text
   - AVOID words: "Solusi", "inovatif", "inovation", "solution", "innovative", "innovation"
   - H2 must be in INDONESIAN language ONLY (no English words)

2. Generate H3 headings in JSON format:
   - Take only the first **max 5 bullet points** from the subcategory description (ignore features/benefits).
   - Provide both Indonesian and English versions.

Rules:
- Return ONLY valid JSON.
- H2: "H2" (ID) - MUST be in INDONESIAN ONLY, summarize benefits from description without category codes, avoid "Solusi/inovatif/inovation"
- H2_en: "H2_en" (EN) - English version of H2
- H3: "H3" (ID) and "H3_en" (EN) as arrays of objects { "title": "...", "desc": "..." }
- No markdown, explanations, or extra text.

Description (ID): ${descriptionsId || '-'}
Description (EN): ${descriptionsEn || '-'}
`;

    try {
      this.logger.log(
        `🔄 Calling OpenAI API with prompt length: ${prompt.length}`,
      );
      this.logger.log(
        `Environment check: OPENAI_BASE_URL=${process.env.OPENAI_BASE_URL}, OPENAI_API_KEY=${process.env.OPENAI_API_KEY ? 'SET' : 'NOT SET'}`,
      );

      const response = await this.callOpenAIAPI(prompt);
      this.logger.log(
        `✅ OpenAI API response received, length: ${response.length}`,
      );

      // Parse JSON response
      this.logger.log(`🔄 Parsing JSON response...`);
      const parsedResponse = JSON.parse(response) as OpenAIResponse;
      this.logger.log(`✅ JSON parsing completed:`, parsedResponse);

      // Validate response structure
      if (!parsedResponse.H2 || !parsedResponse.H2_en || !parsedResponse.H3) {
        throw new Error('Invalid response structure from OpenAI');
      }

      // Extract H3_en from H3 items if not provided separately
      const H3_en =
        parsedResponse.H3_en ||
        parsedResponse.H3.map((item: any) => ({
          title: item.desc || item.title,
          desc: item.desc || item.title,
        }));

      return {
        H1: subCategory.name, // H1 is the subcategory name
        H1_en: subCategory.name_en || subCategory.name, // H1_en is the English name or fallback to name
        H2: parsedResponse.H2,
        H2_en: parsedResponse.H2_en,
        H3: parsedResponse.H3,
        H3_en: H3_en,
      };
    } catch (error) {
      this.logger.error('Error generating headers with OpenAI:', error);
      throw new Error('Failed to generate headers with OpenAI');
    }
  }

  /**
   * Call OpenAI API with custom prompt
   */
  private async callOpenAIAPI(prompt: string): Promise<string> {
    try {
      this.logger.log(`🔄 Making fetch request to OpenAI API...`);
      this.logger.log(
        `Environment check: OPENAI_BASE_URL=${process.env.OPENAI_BASE_URL}, OPENAI_API_KEY=${process.env.OPENAI_API_KEY ? 'SET' : 'NOT SET'}`,
      );
      const response = await fetch(
        `${process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'}/chat/completions`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'user',
                content: prompt,
              },
            ],
            max_tokens: 2000,
            temperature: 0.7,
          }),
        },
      );
      this.logger.log(`✅ Fetch request completed, status: ${response.status}`);

      if (!response.ok) {
        const errorData = (await response.json()) as {
          error?: { message?: string };
        };
        throw new Error(
          `OpenAI API error: ${response.statusText} - ${errorData.error?.message || ''}`,
        );
      }

      const data = (await response.json()) as OpenAIAPIResponse;
      return data.choices[0].message.content;
    } catch (error) {
      this.logger.error('OpenAI API call failed:', error);
      this.logger.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
      throw error;
    }
  }

  /**
   * Save generated headers to database
   */
  private async saveHeadersToDatabase(
    subCategoryId: string,
    categoryId: string,
    companyId: string,
    headersData: SubCategoryHeaderData,
  ): Promise<SubCategoryHeaderData> {
    try {
      this.logger.log(
        `🔄 Starting database save operation for subcategory: ${subCategoryId}`,
      );
      this.logger.log(`Headers data to save:`, headersData);

      // Check if header already exists
      this.logger.log(`Checking for existing header...`);
      const existingHeader = (await this.prisma.cms_subCategoryHeader.findFirst(
        {
          where: {
            subCategory_id: subCategoryId.trim(),
            category_id: categoryId,
            company_id: companyId,
          },
        },
      )) as any;
      this.logger.log(`Existing header check result:`, existingHeader);

      let savedHeader;

      if (existingHeader) {
        // Update existing header
        this.logger.log(
          `Updating existing header with ID: ${existingHeader.id}`,
        );
        savedHeader = (await this.prisma.cms_subCategoryHeader.update({
          where: { id: existingHeader.id },
          data: {
            H1: headersData.H1,
            H1_en: headersData.H1_en,
            H2: headersData.H2,
            H2_en: headersData.H2_en,
            H3: headersData.H3,
            H3_en: headersData.H3_en,
            updatedAt: new Date(),
          },
        })) as any;
        this.logger.log(`✅ Header updated successfully`);
      } else {
        // Create new header
        this.logger.log(
          `Creating new header for subcategory: ${subCategoryId}`,
        );
        savedHeader = (await this.prisma.cms_subCategoryHeader.create({
          data: {
            subCategory_id: subCategoryId.trim(),
            category_id: categoryId,
            company_id: companyId,
            H1: headersData.H1,
            H1_en: headersData.H1_en,
            H2: headersData.H2,
            H2_en: headersData.H2_en,
            H3: headersData.H3,
            H3_en: headersData.H3_en,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        })) as any;
        this.logger.log(`✅ Header created successfully`);
      }

      const typedHeader = savedHeader as PrismaSubCategoryHeader;
      return {
        H1: typedHeader.H1 || '',
        H1_en: typedHeader.H1_en || '',
        H2: typedHeader.H2,
        H2_en: typedHeader.H2_en,
        H3: typedHeader.H3 as Array<{ title: string; desc: string }>,
        H3_en: typedHeader.H3_en as Array<{ title: string; desc: string }>,
      };
    } catch (error) {
      this.logger.error('Error saving headers to database:', error);
      throw error;
    }
  }

  /**
   * Get existing headers for a subcategory
   */
  async getHeaders(
    subCategoryId: string,
    categoryId: string,
    companyId: string,
  ): Promise<SubCategoryHeaderData | null> {
    try {
      const header = (await this.prisma.cms_subCategoryHeader.findFirst({
        where: {
          subCategory_id: subCategoryId,
          category_id: categoryId,
          company_id: companyId,
        },
        include: {
          subCategory: {
            select: {
              id: true,
              name: true,
              name_en: true,
              company_id: true,
            },
          },
        },
      })) as any;

      if (!header) {
        return null;
      }

      const typedHeader = header as PrismaSubCategoryHeader;
      return {
        H1: typedHeader.H1 || '',
        H1_en: typedHeader.H1_en || '',
        H2: typedHeader.H2,
        H2_en: typedHeader.H2_en,
        H3: typedHeader.H3 as Array<{ title: string; desc: string }>,
        H3_en: typedHeader.H3_en as Array<{ title: string; desc: string }>,
      };
    } catch (error) {
      this.logger.error('Error getting headers:', error);
      throw error;
    }
  }

  /**
   * Get all headers with subcategory information
   */
  async getAllHeaders(
    companyId: string,
    limit: number = 50,
    offset: number = 0,
  ): Promise<{
    headers: Array<
      SubCategoryHeaderData & {
        subCategory: {
          id: string;
          category_id: string;
          name: string;
          name_en: string | null;
        };
      }
    >;
    total: number;
  }> {
    try {
      const [headers, total] = await Promise.all([
        this.prisma.cms_subCategoryHeader.findMany({
          where: {
            company_id: companyId,
            subCategory: {
              iShowedStatus: 'SHOW' as const, // Only show headers for SHOW subcategories
            },
          },
          include: {
            subCategory: {
              select: {
                id: true,
                name: true,
                name_en: true,
                company_id: true,
                iShowedStatus: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: limit,
          skip: offset,
        }) as any,
        this.prisma.cms_subCategoryHeader.count({
          where: {
            company_id: companyId,
            subCategory: {
              iShowedStatus: 'SHOW' as const, // Only count headers for SHOW subcategories
            },
          },
        }) as any,
      ]);

      return {
        headers: headers.map((header) => {
          const typedHeader = header as PrismaSubCategoryHeader & {
            subCategory: {
              id: string;
              name: string;
              name_en: string | null;
              company_id: string;
            };
            category_id: string;
          };
          return {
            H1: typedHeader.H1 || '',
            H1_en: typedHeader.H1_en || '',
            H2: typedHeader.H2,
            H2_en: typedHeader.H2_en,
            H3: typedHeader.H3 as Array<{ title: string; desc: string }>,
            H3_en: typedHeader.H3_en as Array<{ title: string; desc: string }>,
            subCategory: {
              id: typedHeader.subCategory.id,
              category_id: typedHeader.category_id,
              name: typedHeader.subCategory.name.trim(),
              name_en: typedHeader.subCategory.name_en,
            },
          };
        }),
        total,
      };
    } catch (error) {
      this.logger.error('Error getting all headers:', error);
      throw error;
    }
  }

  /**
   * Generate headers for multiple subcategories (bulk generation)
   * Automatically excludes subcategories that already have headers
   */
  async generateBulkHeaders(
    subCategoryIds: Array<{ subCategoryId: string; categoryId: string }>,
    companyId: string,
  ): Promise<{
    successful: Array<{
      subCategoryId: string;
      categoryId: string;
      headers: SubCategoryHeaderData;
    }>;
    failed: Array<{ subCategoryId: string; categoryId: string; error: string }>;
    skipped: Array<{
      subCategoryId: string;
      categoryId: string;
      reason: string;
    }>;
    summary: {
      total: number;
      successful: number;
      failed: number;
      skipped: number;
    };
  }> {
    const successful: Array<{
      subCategoryId: string;
      categoryId: string;
      headers: SubCategoryHeaderData;
    }> = [];
    const failed: Array<{
      subCategoryId: string;
      categoryId: string;
      error: string;
    }> = [];
    const skipped: Array<{
      subCategoryId: string;
      categoryId: string;
      reason: string;
    }> = [];

    this.logger.log(
      `🔄 Starting bulk header generation for ${subCategoryIds.length} subcategories`,
    );

    // Check which subcategories already have headers
    const existingHeaders = (await this.prisma.cms_subCategoryHeader.findMany({
      where: {
        company_id: companyId,
        OR: subCategoryIds.map(({ subCategoryId, categoryId }) => ({
          subCategory_id: subCategoryId,
          category_id: categoryId,
        })),
      },
      select: {
        subCategory_id: true,
        category_id: true,
      },
    })) as any;

    const existingKeys = new Set(
      existingHeaders.map((h) => `${h.category_id}_${h.subCategory_id.trim()}`),
    );

    const subCategoriesToProcess = subCategoryIds.filter(
      ({ subCategoryId, categoryId }) =>
        !existingKeys.has(`${categoryId}_${subCategoryId.trim()}`),
    );

    const subCategoriesToSkip = subCategoryIds.filter(
      ({ subCategoryId, categoryId }) =>
        existingKeys.has(`${categoryId}_${subCategoryId.trim()}`),
    );

    // Add skipped subcategories to results
    subCategoriesToSkip.forEach(({ subCategoryId, categoryId }) => {
      skipped.push({
        subCategoryId,
        categoryId,
        reason: 'Headers already exist for this subcategory',
      });
    });

    this.logger.log(
      `📊 Found ${subCategoriesToSkip.length} subcategories with existing headers, processing ${subCategoriesToProcess.length} subcategories`,
    );

    if (subCategoriesToProcess.length === 0) {
      return {
        successful,
        failed,
        skipped,
        summary: {
          total: subCategoryIds.length,
          successful: 0,
          failed: 0,
          skipped: subCategoriesToSkip.length,
        },
      };
    }

    // Process subcategories in batches to avoid overwhelming the system
    const batchSize = 5;
    for (let i = 0; i < subCategoriesToProcess.length; i += batchSize) {
      const batch = subCategoriesToProcess.slice(i, i + batchSize);

      this.logger.log(
        `📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(subCategoriesToProcess.length / batchSize)} (${batch.length} subcategories)`,
      );

      // Process batch in parallel
      const batchPromises = batch.map(async ({ subCategoryId, categoryId }) => {
        try {
          const headers = await this.generateHeaders(
            subCategoryId,
            categoryId,
            companyId,
          );
          return { subCategoryId, categoryId, headers, success: true } as const;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
          return {
            subCategoryId,
            categoryId,
            error: errorMessage,
            success: false,
          } as const;
        }
      });

      const batchResults = await Promise.all(batchPromises);

      // Categorize results
      batchResults.forEach((result) => {
        if (result.success) {
          successful.push({
            subCategoryId: result.subCategoryId,
            categoryId: result.categoryId,
            headers: result.headers,
          });
        } else {
          failed.push({
            subCategoryId: result.subCategoryId,
            categoryId: result.categoryId,
            error: result.error,
          });
        }
      });

      // Add delay between batches to avoid rate limiting
      if (i + batchSize < subCategoriesToProcess.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    const summary = {
      total: subCategoryIds.length,
      successful: successful.length,
      failed: failed.length,
      skipped: skipped.length,
    };

    this.logger.log(
      `🎉 Bulk header generation completed: ${summary.successful}/${summary.total} successful`,
    );

    return {
      successful,
      failed,
      skipped,
      summary,
    };
  }

  /**
   * Simple auto bulk generate - langsung cari subcategory SHOW dan generate
   */
  async simpleAutoBulkGenerate(
    companyId: string,
    limit: number = 10,
  ): Promise<{
    successful: Array<{
      subCategoryId: string;
      categoryId: string;
      headers: SubCategoryHeaderData;
    }>;
    failed: Array<{ subCategoryId: string; categoryId: string; error: string }>;
    summary: {
      total: number;
      successful: number;
      failed: number;
    };
  }> {
    const successful: Array<{
      subCategoryId: string;
      categoryId: string;
      headers: SubCategoryHeaderData;
    }> = [];
    const failed: Array<{
      subCategoryId: string;
      categoryId: string;
      error: string;
    }> = [];

    this.logger.log(
      `🔄 Starting simple auto bulk generate for ${limit} subcategories`,
    );

    // Cari subcategory SHOW yang ada descriptions
    const subCategories = (await this.prisma.imc_SubCategory.findMany({
      where: {
        company_id: companyId,
        iShowedStatus: 'SHOW' as const,
        descriptions: {
          not: null,
        },
      },
      select: {
        id: true,
        category_id: true,
        name: true,
      },
      take: limit,
    })) as any;

    this.logger.log(
      `📋 Found ${subCategories.length} SHOW subcategories with descriptions`,
    );

    if (subCategories.length === 0) {
      return {
        successful,
        failed,
        summary: {
          total: 0,
          successful: 0,
          failed: 0,
        },
      };
    }

    // Process each subcategory
    for (const subCategory of subCategories) {
      try {
        const headers = await this.generateHeaders(
          subCategory.id,
          subCategory.category_id,
          companyId,
        );
        successful.push({
          subCategoryId: subCategory.id,
          categoryId: subCategory.category_id,
          headers,
        });
        this.logger.log(`✅ Generated headers for ${subCategory.name}`);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        failed.push({
          subCategoryId: subCategory.id,
          categoryId: subCategory.category_id,
          error: errorMessage,
        });
        this.logger.warn(
          `⚠️ Failed to generate headers for ${subCategory.name}: ${errorMessage}`,
        );
      }

      // Small delay between requests
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    const summary = {
      total: subCategories.length,
      successful: successful.length,
      failed: failed.length,
    };

    this.logger.log(
      `🎉 Simple auto bulk generate completed: ${summary.successful}/${summary.total} successful`,
    );

    return {
      successful,
      failed,
      summary,
    };
  }

  /**
   * Get subcategories that don't have headers yet
   */
  async getSubCategoriesWithoutHeaders(
    companyId: string,
    limit: number = 50,
    offset: number = 0,
    excludeIds: Array<{ subCategoryId: string; categoryId: string }> = [],
  ): Promise<{
    subCategories: Array<{
      id: string;
      category_id: string;
      name: string;
      name_en: string | null;
    }>;
    total: number;
  }> {
    try {
      // Build where condition with exclusions
      const whereCondition = {
        company_id: companyId,
        descriptions: {
          not: null,
        },
        iShowedStatus: 'SHOW' as const, // Only show subcategories with SHOW status
        ...(excludeIds.length > 0 && {
          NOT: {
            OR: excludeIds.map(({ subCategoryId, categoryId }) => ({
              id: subCategoryId,
              category_id: categoryId,
            })),
          },
        }),
      };

      // Get all subcategories with descriptions
      const [subCategoriesWithDesc, allSubCategories] = await Promise.all([
        this.prisma.imc_SubCategory.findMany({
          where: whereCondition,
          select: {
            id: true,
            category_id: true,
            name: true,
            name_en: true,
          },
          take: limit,
          skip: offset,
        }) as any,
        this.prisma.imc_SubCategory.count({
          where: whereCondition,
        }) as any,
      ]);

      this.logger.log(
        `📊 Found ${subCategoriesWithDesc.length} subcategories with SHOW status and descriptions`,
      );

      // Get existing headers
      const existingHeaders = (await this.prisma.cms_subCategoryHeader.findMany(
        {
          where: {
            company_id: companyId,
          },
          select: {
            subCategory_id: true,
            category_id: true,
          },
        },
      )) as any;

      const existingKeys = new Set(
        existingHeaders.map(
          (h) => `${h.category_id}_${h.subCategory_id.trim()}`,
        ),
      );

      // Filter out subcategories that already have headers
      const subCategoriesWithoutHeaders = subCategoriesWithDesc
        .filter(
          (subCategory) =>
            !existingKeys.has(
              `${subCategory.category_id}_${subCategory.id.trim()}`,
            ),
        )
        .map((subCategory) => ({
          id: subCategory.id.trim(),
          category_id: subCategory.category_id,
          name: subCategory.name,
          name_en: subCategory.name_en,
        }));

      this.logger.log(
        `📋 Final result: ${subCategoriesWithoutHeaders.length} subcategories without headers (${existingHeaders.length} subcategories already have headers)`,
      );

      return {
        subCategories: subCategoriesWithoutHeaders,
        total: allSubCategories,
      };
    } catch (error) {
      this.logger.error('Error getting subcategories without headers:', error);
      throw error;
    }
  }

  /**
   * Delete headers for a subcategory
   */
  async deleteHeaders(
    subCategoryId: string,
    categoryId: string,
    companyId: string,
  ): Promise<void> {
    try {
      (await this.prisma.cms_subCategoryHeader.deleteMany({
        where: {
          subCategory_id: subCategoryId,
          category_id: categoryId,
          company_id: companyId,
        },
      })) as any;

      this.logger.log(
        `✅ Deleted headers for subcategory ID: ${subCategoryId}, category ID: ${categoryId}`,
      );
    } catch (error) {
      this.logger.error('Error deleting headers:', error);
      throw error;
    }
  }

  /**
   * Direct insert headers without generation
   */
  async directInsertHeaders(
    subCategoryId: string,
    categoryId: string,
    companyId: string,
    headersData: SubCategoryHeaderData,
  ): Promise<SubCategoryHeaderData> {
    try {
      this.logger.log(
        `🔄 Direct inserting headers for subcategory: ${subCategoryId}`,
      );

      const savedHeader = await this.saveHeadersToDatabase(
        subCategoryId,
        categoryId,
        companyId,
        headersData,
      );

      this.logger.log(
        `✅ Headers inserted successfully for subcategory: ${subCategoryId}`,
      );
      return savedHeader;
    } catch (error) {
      this.logger.error('Error direct inserting headers:', error);
      throw error;
    }
  }

  /**
   * Count total headers in cms_subCategoryHeader table
   */
  async countTotalHeaders(companyId: string): Promise<number> {
    try {
      const count = (await this.prisma.cms_subCategoryHeader.count({
        where: {
          company_id: companyId,
        },
      })) as any;

      this.logger.log(`📊 Total headers in cms_subCategoryHeader: ${count}`);
      return count;
    } catch (error) {
      this.logger.error('Error counting headers:', error);
      throw error;
    }
  }
}
