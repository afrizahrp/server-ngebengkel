import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { OpenAIService } from '../cms_productdesc/openai.service';

interface ProductHeaderData {
  H1: string;
  H2: string;
  H2_en: string;
  H3: Array<{ title: string; desc: string }>;
  H3_en: Array<{ title: string; desc: string }>;
}

interface OpenAIResponse {
  H2: string;
  H2_en: string;
  H3: Array<{ title: string; desc: string }>;
  H3_en: Array<{ title: string; desc: string }>;
}

interface OpenAIAPIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface PrismaProductHeader {
  H1: string;
  H2: string;
  H2_en: string;
  H3: unknown;
  H3_en: unknown;
}

interface ProductForGeneration {
  id: string;
  name: string;
  catalog_id?: string | null;
  iShowedStatus: string;
  descriptions?: {
    descriptions: string | null;
    descriptions_en: string | null;
  } | null;
}

@Injectable()
export class cms_ProductHeaderService {
  private readonly logger = new Logger(cms_ProductHeaderService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly openAIService: OpenAIService,
  ) {}

  /**
   * Generate headers (H1, H2, H2_en, H3, H3_en) for a product
   * @param productId Product ID
   * @param companyId Company ID
   * @returns Generated headers data
   */
  async generateHeaders(
    productId: string,
    companyId: string,
  ): Promise<ProductHeaderData> {
    try {
      this.logger.log(
        `🔄 Starting header generation for product ID: ${productId}`,
      );

      // Fetch product data with descriptions
      const product = await this.prisma.imc_Product.findUnique({
        where: {
          company_id_id: { company_id: companyId, id: productId.trim() },
        },
        select: {
          id: true,
          name: true,
          catalog_id: true,
          iShowedStatus: true,
          descriptions: {
            select: {
              descriptions: true,
              descriptions_en: true,
            },
          },
        },
      });

      if (!product) {
        this.logger.warn(`⚠️ Product with ID ${productId.trim()} not found`);
        throw new NotFoundException(
          `Product with ID ${productId.trim()} not found`,
        );
      }

      if (!product.descriptions) {
        this.logger.warn(
          `⚠️ Product description not found for ID ${productId.trim()}`,
        );
        throw new NotFoundException(
          `Product description not found for ID ${productId.trim()}`,
        );
      }

      // Check if product has SHOW status
      if (product.iShowedStatus !== 'SHOW') {
        this.logger.warn(
          `⚠️ Product with ID ${productId.trim()} is not in SHOW status (current status: ${product.iShowedStatus})`,
        );
        throw new NotFoundException(
          `Product with ID ${productId.trim()} is not in SHOW status (current status: ${product.iShowedStatus})`,
        );
      }

      this.logger.log(`✅ Fetched product data for: ${product.name}`);

      // Generate headers using OpenAI
      const generatedHeaders = await this.generateHeadersWithOpenAI(
        product,
        product.descriptions.descriptions || '',
        product.descriptions.descriptions_en || '',
      );

      // Save to database
      const savedHeader = await this.saveHeadersToDatabase(
        productId,
        companyId,
        generatedHeaders,
      );

      this.logger.log(
        `🎉 Successfully generated and saved headers for product ID: ${productId}`,
      );

      return savedHeader;
    } catch (error) {
      this.logger.error(
        `Error generating headers for product ID ${productId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Generate headers using OpenAI GPT-4o mini
   */
  private async generateHeadersWithOpenAI(
    product: ProductForGeneration,
    descriptionsId: string,
    descriptionsEn: string,
  ): Promise<ProductHeaderData> {
    const prompt = `
You are an SEO assistant for healthcare products (hospital furniture, medical devices, laboratory equipment).

Product Glossary:
- Product Name: ${product.name}
- Catalog ID: ${product.catalog_id ?? 'Not specified'}

Task:
1. Generate H2 heading that SUMMARIZES the main benefits and value proposition from the FIRST PARAGRAPH of the description:
   - Extract key benefits and advantages mentioned in the first paragraph
   - Create a compelling summary that highlights why this product is valuable
   - Focus on benefits, not just features
   - Make it SEO-friendly and engaging (1-2 sentences)
   - DO NOT include product codes, model numbers, or catalog IDs in the H2 text
   - AVOID words: "Solusi", "inovatif", "inovation", "solution", "innovative", "innovation"
   - H2 must be in INDONESIAN language ONLY (no English words)

2. Generate H3 headings in JSON format:
   - Take only the first **max 5 bullet points** from the product description (ignore features/benefits).
   - Provide both Indonesian and English versions.

Rules:
- Return ONLY valid JSON.
- H2: "H2" (ID) - MUST be in INDONESIAN ONLY, summarize benefits from first paragraph without catalog codes, avoid "Solusi/inovatif/inovation"
- H2_en: "H2_en" (EN) - English version of H2
- H3: "H3" (ID) and "H3_en" (EN) as arrays of objects { "title": "...", "desc": "..." }
- No markdown, explanations, or extra text.

Description (ID): ${descriptionsId || '-'}
Description (EN): ${descriptionsEn || '-'}
`;

    try {
      const response = await this.callOpenAIAPI(prompt);

      // Parse JSON response
      const parsedResponse = JSON.parse(response) as OpenAIResponse;

      // Validate response structure
      if (
        !parsedResponse.H2 ||
        !parsedResponse.H2_en ||
        !parsedResponse.H3 ||
        !parsedResponse.H3_en
      ) {
        throw new Error('Invalid response structure from OpenAI');
      }

      return {
        H1: product.name, // H1 is the product name
        H2: parsedResponse.H2,
        H2_en: parsedResponse.H2_en,
        H3: parsedResponse.H3,
        H3_en: parsedResponse.H3_en,
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
      throw error;
    }
  }

  /**
   * Save generated headers to database
   */
  private async saveHeadersToDatabase(
    productId: string,
    companyId: string,
    headersData: ProductHeaderData,
  ): Promise<ProductHeaderData> {
    try {
      // Check if header already exists
      const existingHeader = await this.prisma.cms_ProductHeader.findFirst({
        where: {
          product_id: productId.trim(),
          company_id: companyId,
        },
      });

      let savedHeader;

      if (existingHeader) {
        // Update existing header
        savedHeader = await this.prisma.cms_ProductHeader.update({
          where: { id: existingHeader.id },
          data: {
            H1: headersData.H1,
            H2: headersData.H2,
            H2_en: headersData.H2_en,
            H3: headersData.H3,
            H3_en: headersData.H3_en,
            updatedAt: new Date(),
          },
        });
      } else {
        // Create new header
        savedHeader = await this.prisma.cms_ProductHeader.create({
          data: {
            product_id: productId.trim(),
            company_id: companyId,
            H1: headersData.H1,
            H2: headersData.H2,
            H2_en: headersData.H2_en,
            H3: headersData.H3,
            H3_en: headersData.H3_en,
            updatedAt: new Date(),
          },
        });
      }

      const typedHeader = savedHeader as PrismaProductHeader;
      return {
        H1: typedHeader.H1,
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
   * Get existing headers for a product with product relation
   */
  async getHeaders(
    productId: string,
    companyId: string,
  ): Promise<ProductHeaderData | null> {
    try {
      const header = await this.prisma.cms_ProductHeader.findFirst({
        where: {
          product_id: productId,
          company_id: companyId,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              company_id: true,
            },
          },
        },
      });

      if (!header) {
        return null;
      }

      const typedHeader = header as PrismaProductHeader;
      return {
        H1: typedHeader.H1,
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
   * Get all headers with product information
   */
  async getAllHeaders(
    companyId: string,
    limit: number = 50,
    offset: number = 0,
  ): Promise<{
    headers: Array<
      ProductHeaderData & { product: { id: string; name: string } }
    >;
    total: number;
  }> {
    try {
      const [headers, total] = await Promise.all([
        this.prisma.cms_ProductHeader.findMany({
          where: {
            company_id: companyId,
            product: {
              iShowedStatus: 'SHOW' as const, // Only show headers for SHOW products
            },
          },
          include: {
            product: {
              select: {
                id: true,
                name: true,
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
        }),
        this.prisma.cms_ProductHeader.count({
          where: {
            company_id: companyId,
            product: {
              iShowedStatus: 'SHOW' as const, // Only count headers for SHOW products
            },
          },
        }),
      ]);

      return {
        headers: headers.map((header) => {
          const typedHeader = header as PrismaProductHeader & {
            product: { id: string; name: string; company_id: string };
          };
          return {
            H1: typedHeader.H1,
            H2: typedHeader.H2,
            H2_en: typedHeader.H2_en,
            H3: typedHeader.H3 as Array<{ title: string; desc: string }>,
            H3_en: typedHeader.H3_en as Array<{ title: string; desc: string }>,
            product: {
              id: typedHeader.product.id,
              name: typedHeader.product.name.trim(),
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
   * Direct bulk generate headers - no validation, just try to generate and insert
   */
  async directBulkGenerateHeaders(
    productIds: string[],
    companyId: string,
  ): Promise<{
    successful: Array<{ productId: string; headers: ProductHeaderData }>;
    failed: Array<{ productId: string; error: string }>;
    summary: {
      total: number;
      successful: number;
      failed: number;
    };
  }> {
    const successful: Array<{ productId: string; headers: ProductHeaderData }> =
      [];
    const failed: Array<{ productId: string; error: string }> = [];

    this.logger.log(
      `🔄 Starting direct bulk header generation for ${productIds.length} products`,
    );

    // Process products in batches to avoid overwhelming the system
    const batchSize = 5;
    for (let i = 0; i < productIds.length; i += batchSize) {
      const batch = productIds.slice(i, i + batchSize);

      this.logger.log(
        `📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(productIds.length / batchSize)} (${batch.length} products)`,
      );

      // Process batch in parallel
      const batchPromises = batch.map(async (productId) => {
        try {
          const headers = await this.generateHeaders(productId, companyId);
          return { productId, headers, success: true } as const;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
          return { productId, error: errorMessage, success: false } as const;
        }
      });

      const batchResults = await Promise.all(batchPromises);

      // Categorize results
      batchResults.forEach((result) => {
        if (result.success) {
          successful.push({
            productId: result.productId,
            headers: result.headers,
          });
        } else {
          failed.push({
            productId: result.productId,
            error: result.error,
          });
        }
      });

      // Add delay between batches to avoid rate limiting
      if (i + batchSize < productIds.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    const summary = {
      total: productIds.length,
      successful: successful.length,
      failed: failed.length,
    };

    this.logger.log(
      `🎉 Direct bulk header generation completed: ${summary.successful}/${summary.total} successful`,
    );

    return {
      successful,
      failed,
      summary,
    };
  }

  /**
   * Generate headers for multiple products (bulk generation)
   * Automatically excludes products that already have headers
   */
  async generateBulkHeaders(
    productIds: string[],
    companyId: string,
  ): Promise<{
    successful: Array<{ productId: string; headers: ProductHeaderData }>;
    failed: Array<{ productId: string; error: string }>;
    skipped: Array<{ productId: string; reason: string }>;
    summary: {
      total: number;
      successful: number;
      failed: number;
      skipped: number;
    };
  }> {
    const successful: Array<{ productId: string; headers: ProductHeaderData }> =
      [];
    const failed: Array<{ productId: string; error: string }> = [];
    const skipped: Array<{ productId: string; reason: string }> = [];

    this.logger.log(
      `🔄 Starting bulk header generation for ${productIds.length} products`,
    );

    // Check which products already have headers
    const existingHeaders = await this.prisma.cms_ProductHeader.findMany({
      where: {
        company_id: companyId,
        product_id: {
          in: productIds,
        },
      },
      select: {
        product_id: true,
      },
    });

    const existingProductIds = new Set(
      existingHeaders.map((h) => h.product_id.trim()),
    );
    const productsToProcess = productIds
      .map((id) => id.trim())
      .filter((id) => !existingProductIds.has(id));
    const productsToSkip = productIds
      .map((id) => id.trim())
      .filter((id) => existingProductIds.has(id));

    // Add skipped products to results
    productsToSkip.forEach((productId) => {
      skipped.push({
        productId,
        reason: 'Headers already exist for this product',
      });
    });

    this.logger.log(
      `📊 Found ${productsToSkip.length} products with existing headers, processing ${productsToProcess.length} products`,
    );

    if (productsToProcess.length === 0) {
      return {
        successful,
        failed,
        skipped,
        summary: {
          total: productIds.length,
          successful: 0,
          failed: 0,
          skipped: productsToSkip.length,
        },
      };
    }

    // Process products in batches to avoid overwhelming the system
    const batchSize = 5;
    for (let i = 0; i < productsToProcess.length; i += batchSize) {
      const batch = productsToProcess.slice(i, i + batchSize);

      this.logger.log(
        `📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(productsToProcess.length / batchSize)} (${batch.length} products)`,
      );

      // Process batch in parallel
      const batchPromises = batch.map(async (productId) => {
        try {
          const headers = await this.generateHeaders(productId, companyId);
          return { productId, headers, success: true } as const;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
          return { productId, error: errorMessage, success: false } as const;
        }
      });

      const batchResults = await Promise.all(batchPromises);

      // Categorize results
      batchResults.forEach((result) => {
        if (result.success) {
          successful.push({
            productId: result.productId,
            headers: result.headers,
          });
        } else {
          failed.push({
            productId: result.productId,
            error: result.error,
          });
        }
      });

      // Add delay between batches to avoid rate limiting
      if (i + batchSize < productsToProcess.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    const summary = {
      total: productIds.length,
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
   * Simple auto bulk generate - langsung cari produk SHOW dan generate
   */
  async simpleAutoBulkGenerate(
    companyId: string,
    limit: number = 10,
  ): Promise<{
    successful: Array<{ productId: string; headers: ProductHeaderData }>;
    failed: Array<{ productId: string; error: string }>;
    summary: {
      total: number;
      successful: number;
      failed: number;
    };
  }> {
    const successful: Array<{
      productId: string;
      headers: ProductHeaderData;
    }> = [];
    const failed: Array<{ productId: string; error: string }> = [];

    this.logger.log(
      `🔄 Starting simple auto bulk generate for ${limit} products`,
    );

    // Cari produk SHOW yang ada descriptions
    const products = await this.prisma.imc_Product.findMany({
      where: {
        company_id: companyId,
        iShowedStatus: 'SHOW' as const,
        descriptions: {
          isNot: null,
        },
      },
      select: {
        id: true,
        name: true,
      },
      take: limit,
    });

    this.logger.log(
      `📋 Found ${products.length} SHOW products with descriptions`,
    );

    if (products.length === 0) {
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

    // Process each product
    for (const product of products) {
      try {
        const headers = await this.generateHeaders(product.id, companyId);
        successful.push({
          productId: product.id,
          headers,
        });
        this.logger.log(`✅ Generated headers for ${product.name}`);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        failed.push({
          productId: product.id,
          error: errorMessage,
        });
        this.logger.warn(
          `⚠️ Failed to generate headers for ${product.name}: ${errorMessage}`,
        );
      }

      // Small delay between requests
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    const summary = {
      total: products.length,
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
   * Debug method to check SHOW products
   */
  async debugShowProducts(
    companyId: string,
    limit: number = 10,
  ): Promise<{
    products: Array<{ id: string; name: string; descriptions: any }>;
    total: number;
  }> {
    try {
      const whereCondition = {
        company_id: companyId,
        iShowedStatus: 'SHOW' as const,
      };

      const [products, total] = await Promise.all([
        this.prisma.imc_Product.findMany({
          where: whereCondition,
          select: {
            id: true,
            name: true,
            descriptions: {
              select: {
                id: true,
                descriptions: true,
                descriptions_en: true,
              },
            },
          },
          take: limit,
        }),
        this.prisma.imc_Product.count({
          where: whereCondition,
        }),
      ]);

      this.logger.log(
        `🔍 Debug: Found ${products.length} SHOW products (total: ${total})`,
      );

      return {
        products: products.map((product) => ({
          id: product.id.trim(),
          name: product.name,
          descriptions: product.descriptions,
        })),
        total,
      };
    } catch (error) {
      this.logger.error('Error in debug show products:', error);
      throw error;
    }
  }

  /**
   * Count total headers in cms_ProductHeader table
   */
  async countTotalHeaders(companyId: string): Promise<number> {
    try {
      const count = await this.prisma.cms_ProductHeader.count({
        where: {
          company_id: companyId,
        },
      });

      this.logger.log(`📊 Total headers in cms_ProductHeader: ${count}`);
      return count;
    } catch (error) {
      this.logger.error('Error counting headers:', error);
      throw error;
    }
  }

  /**
   * Get products that don't have headers yet
   */
  async getProductsWithoutHeaders(
    companyId: string,
    limit: number = 50,
    offset: number = 0,
    excludeIds: string[] = [],
  ): Promise<{
    products: Array<{ id: string; name: string }>;
    total: number;
  }> {
    try {
      // Build where condition with exclusions
      const whereCondition = {
        company_id: companyId,
        descriptions: {
          isNot: null,
        },
        iShowedStatus: 'SHOW' as const, // Only show products with SHOW status
        ...(excludeIds.length > 0 && {
          id: {
            notIn: excludeIds,
          },
        }),
      };

      // Get all products with descriptions
      const [productsWithDesc, allProducts] = await Promise.all([
        this.prisma.imc_Product.findMany({
          where: whereCondition,
          select: {
            id: true,
            name: true,
            descriptions: {
              select: {
                id: true,
              },
            },
          },
          take: limit,
          skip: offset,
        }),
        this.prisma.imc_Product.count({
          where: whereCondition,
        }),
      ]);

      this.logger.log(
        `📊 Found ${productsWithDesc.length} products with SHOW status and descriptions`,
      );

      // Get existing headers
      const existingHeaders = await this.prisma.cms_ProductHeader.findMany({
        where: {
          company_id: companyId,
        },
        select: {
          product_id: true,
        },
      });

      const existingProductIds = new Set(
        existingHeaders.map((h) => h.product_id.trim()),
      );

      // Filter out products that already have headers and trim product IDs
      const productsWithoutHeaders = productsWithDesc
        .filter((product) => !existingProductIds.has(product.id.trim()))
        .map((product) => ({
          id: product.id.trim(),
          name: product.name,
        }));

      this.logger.log(
        `📋 Final result: ${productsWithoutHeaders.length} products without headers (${existingHeaders.length} products already have headers)`,
      );

      return {
        products: productsWithoutHeaders,
        total: allProducts,
      };
    } catch (error) {
      this.logger.error('Error getting products without headers:', error);
      throw error;
    }
  }

  /**
   * Delete headers for a product
   */
  async deleteHeaders(productId: string, companyId: string): Promise<void> {
    try {
      await this.prisma.cms_ProductHeader.deleteMany({
        where: {
          product_id: productId,
          company_id: companyId,
        },
      });

      this.logger.log(`✅ Deleted headers for product ID: ${productId}`);
    } catch (error) {
      this.logger.error('Error deleting headers:', error);
      throw error;
    }
  }
}
