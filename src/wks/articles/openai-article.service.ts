import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import type { SeasonalTopic } from './seasonal-topics';

interface CostEstimate {
  minIDR: number;
  maxIDR: number;
  notes: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

export interface GeneratedArticle {
  title: string;
  metaTitle: string;
  metaDescription: string;
  causes: string[];
  diagnosis: string[];
  costEstimate: CostEstimate;
  safety: string;
  prevention: string[];
  faq: FAQItem[];
}

/**
 * Service untuk generate articles menggunakan OpenAI
 * Mengikuti pattern dari OpenAIPainPointService
 */
@Injectable()
export class OpenAIArticleService {
  private readonly logger = new Logger(OpenAIArticleService.name);
  private readonly openai: OpenAI | null = null;

  // Cost range mapping berdasarkan kategori pain point
  private readonly costRanges = {
    URGENT: { min: 200000, max: 800000 },
    ELECTRICAL: { min: 150000, max: 600000 },
    GENERAL: { min: 100000, max: 500000 },
    MAINTENANCE: { min: 80000, max: 400000 },
    BODYWORK: { min: 150000, max: 1000000 },
  };

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');

    if (apiKey) {
      this.openai = new OpenAI({
        apiKey,
      });
      this.logger.log('OpenAI client initialized for article generation');
    } else {
      this.logger.warn('OPENAI_API_KEY not found in environment variables');
    }
  }

  /**
   * Generate article untuk sebuah pain point
   */
  async generateArticle(painPointData: {
    title: string;
    description: string | null;
    category: string;
    keywords: string[];
    isUrgent: boolean;
    priority: number;
    workshopTypes?: Array<{ id: string; name: string; relevance: number }>;
  }): Promise<GeneratedArticle> {
    if (!this.openai) {
      throw new Error('OpenAI client not initialized. Please set OPENAI_API_KEY in .env');
    }

    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        this.logger.log(
          `Generating article for pain point: ${painPointData.title} (attempt ${attempt}/${maxRetries})`,
        );

        const costRange = this.costRanges[painPointData.category] || this.costRanges.GENERAL;
        const prompt = this.buildPrompt(painPointData, costRange);

        const response = await this.openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
  role: "system",
  content: `
You are an Indonesian automotive mechanic and professional SEO content writer.
Your job is to generate a complete, accurate, SEO-friendly article about a specific vehicle problem (PainPoint).

Requirements:
- Write in clear Indonesian, easy for beginners.
- Technical accuracy is mandatory.
- Must follow the structure strictly.
- Deliver the output as valid JSON only.
- Do NOT include warnings, disclaimers, or explanations outside JSON.

JSON structure:
{
  "title": "",
  "slug": "",
  "metaDescription": "",
  "keywords": [],
  "summary": "",
  "contentSections": [
    {
      "heading": "",
      "body": ""
    }
  ],
  "faq": [
    {
      "question": "",
      "answer": ""
    }
  ],
  "recommendedActions": [],
  "causes": [],
  "symptoms": []
}
`
},
         {
  role: "user",
  content: `
Generate an article about the following PainPoint:
${prompt}
`
}
          ],
          temperature: 0.7,
          response_format: { type: 'json_object' },
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
          throw new Error('Empty response from OpenAI');
        }

        const parsed = JSON.parse(content);

        if (!parsed.article) {
          throw new Error('Invalid response format from OpenAI - missing article key');
        }

        this.logger.log(`Successfully generated article for: ${painPointData.title}`);
        return parsed.article;
      } catch (error: any) {
        lastError = error;
        this.logger.warn(`Attempt ${attempt} failed: ${error.message}`);

        // Handle rate limiting
        if (error.status === 429) {
          const retryAfter = error.response?.headers?.['retry-after'] || 60;
          this.logger.warn(`Rate limited. Waiting ${retryAfter} seconds before retry...`);
          await this.sleep(retryAfter * 1000);
          continue;
        }

        // Handle other errors
        if (attempt < maxRetries) {
          const backoffDelay = Math.pow(2, attempt) * 1000; // Exponential backoff
          this.logger.warn(`Retrying in ${backoffDelay}ms...`);
          await this.sleep(backoffDelay);
        }
      }
    }

    throw new Error(
      `Failed to generate article after ${maxRetries} attempts: ${lastError?.message}`,
    );
  }

  /**
   * Generate article untuk seasonal topic (predefined)
   */
  async generateSeasonalArticle(topic: SeasonalTopic): Promise<GeneratedArticle> {
    if (!this.openai) {
      throw new Error('OpenAI client not initialized. Please set OPENAI_API_KEY in .env');
    }

    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        this.logger.log(
          `Generating seasonal article: ${topic.title} (attempt ${attempt}/${maxRetries})`,
        );

        const userPrompt = this.buildSeasonalPrompt(topic);

        const response = await this.openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are a professional automotive mechanic and SEO content writer specializing in Indonesian vehicle problems.

Your responsibilities:
- Write highly SEO-optimized articles with natural keyword integration
- Use provided keywords (short + longtail) strategically throughout content
- Create compelling meta titles and descriptions for search engines
- Provide accurate technical information for Indonesian automotive context
- Write in clear, beginner-friendly Indonesian language
- Output must be valid JSON only, no additional text

SEO Best Practices:
- Include primary keyword in title, meta description, and first paragraph
- Distribute longtail keywords naturally across sections
- Create FAQ questions that target common search queries
- Use keywords in headings where appropriate`,
            },
            {
              role: 'user',
              content: userPrompt,
            },
          ],
          temperature: 0.7,
          response_format: { type: 'json_object' },
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
          throw new Error('Empty response from OpenAI');
        }

        const parsed = JSON.parse(content);

        if (!parsed.article) {
          throw new Error('Invalid response format from OpenAI - missing article key');
        }

        this.logger.log(`Successfully generated seasonal article: ${topic.title}`);
        return parsed.article;
      } catch (error: any) {
        lastError = error;
        this.logger.warn(`Seasonal attempt ${attempt} failed: ${error.message}`);

        if (error.status === 429) {
          const retryAfter = error.response?.headers?.['retry-after'] || 60;
          this.logger.warn(`Rate limited. Waiting ${retryAfter} seconds before retry...`);
          await this.sleep(retryAfter * 1000);
          continue;
        }

        if (attempt < maxRetries) {
          const backoffDelay = Math.pow(2, attempt) * 1000;
          this.logger.warn(`Retrying in ${backoffDelay}ms...`);
          await this.sleep(backoffDelay);
        }
      }
    }

    throw new Error(
      `Failed to generate seasonal article after ${maxRetries} attempts: ${lastError?.message}`,
    );
  }

  /**
   * Build structured prompt untuk OpenAI
   */
  private buildPrompt(
    painPointData: {
      title: string;
      description: string | null;
      category: string;
      keywords: string[];
      isUrgent: boolean;
      priority: number;
      workshopTypes?: Array<{ id: string; name: string; relevance: number }>;
    },
    costRange: { min: number; max: number },
  ): string {
    const workshopTypesText = painPointData.workshopTypes
      ? painPointData.workshopTypes.map((w) => `- ${w.name} (Relevansi: ${w.relevance}/10)`).join('\n')
      : 'Tidak ada informasi workshop type yang tersedia';

    const urgencyNote = painPointData.isUrgent
      ? 'Ini adalah masalah URGENT yang memerlukan penanganan segera karena keselamatan.'
      : '';

    return `Generate artikel lengkap dan informatif untuk masalah otomotif berikut:

**Judul Masalah:** ${painPointData.title}
**Deskripsi:** ${painPointData.description || 'Tidak ada deskripsi'}
**Kategori:** ${painPointData.category}
**Keywords:** ${painPointData.keywords.join(', ')}
**Priority Level:** ${painPointData.priority}/10
**Status:** ${painPointData.isUrgent ? 'URGENT - Berbahaya' : 'GENERAL - Umum'}
${urgencyNote}

**Workshop Types yang bisa menyelesaikan masalah ini:**
${workshopTypesText}

**Perkiraan Biaya Layanan:** Rp ${costRange.min.toLocaleString('id-ID')} - Rp ${costRange.max.toLocaleString('id-ID')}

Buatlah artikel dengan struktur JSON berikut:
{
  "article": {
    "title": "Judul artikel yang SEO-friendly dan menarik",
    "metaTitle": "Meta title untuk SEO (max 60 karakter)",
    "metaDescription": "Meta description untuk SEO (max 160 karakter)",
    "causes": ["Penyebab 1", "Penyebab 2", "Penyebab 3"],
    "diagnosis": ["Langkah diagnosa 1", "Langkah diagnosa 2", "Langkah diagnosa 3"],
    "costEstimate": {
      "minIDR": ${costRange.min},
      "maxIDR": ${costRange.max},
      "notes": "Catatan tambahan tentang biaya (misal: tergantung kondisi, brand spare part, dll)"
    },
    "safety": "Penjelasan tentang keselamatan, terutama jika urgent. Maksimal 2-3 baris.",
    "prevention": ["Pencegahan 1", "Pencegahan 2", "Pencegahan 3"],
    "faq": [
      {
        "question": "Pertanyaan 1 yang sering ditanya",
        "answer": "Jawaban yang jelas dan mudah dipahami"
      },
      {
        "question": "Pertanyaan 2",
        "answer": "Jawaban 2"
      },
      {
        "question": "Pertanyaan 3",
        "answer": "Jawaban 3"
      }
    ]
  }
}`;
  }

  /**
   * Build seasonal prompt according to required format with SEO keywords
   */
  private buildSeasonalPrompt(topic: SeasonalTopic): string {
    const jsonStructure = {
      article: {
        title: '',
        metaTitle: '',
        metaDescription: '',
        causes: [],
        diagnosis: [],
        costEstimate: { minIDR: 0, maxIDR: 0, notes: '' },
        safety: '',
        prevention: [],
        faq: [{ question: '', answer: '' }],
      },
    };

    const keywordsText = topic.keywords?.length
      ? `**SEO Keywords (must be integrated naturally):** ${topic.keywords.join(', ')}`
      : '';

    return `Write a full SEO-optimized automotive article about this topic for Indonesian readers:

**Topic:** ${topic.title}
**Category:** ${topic.category === 'RAINY' ? 'Musim Hujan' : 'Mudik / Perjalanan Jauh'}
${keywordsText}

Requirements:
- Write in clear, beginner-friendly Indonesian
- Technically accurate automotive information
- **MUST naturally integrate the provided SEO keywords throughout the article**
- Include causes, symptoms, diagnosis steps, prevention, and FAQs
- Meta title should be SEO-friendly (max 60 characters)
- Meta description should be compelling (max 160 characters)
- Cost estimates should be realistic and specific to Indonesia
- Output must be structured as valid JSON (response_format: json_object)

JSON structure:
${JSON.stringify(jsonStructure, null, 2)}

Return ONLY valid JSON, no additional text or markdown.`;
  };

  /**
   * Sleep helper untuk retry logic
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
