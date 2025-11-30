import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

/**
 * Service untuk generate pain points menggunakan OpenAI
 * 
 * Features:
 * - Generate pain points dengan keywords
 * - Map ke service types
 * - Retry logic untuk handle API errors
 * - Rate limiting handling
 */
@Injectable()
export class OpenAIPainPointService {
  private readonly logger = new Logger(OpenAIPainPointService.name);
  private readonly openai: OpenAI | null = null;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    
    if (apiKey) {
      this.openai = new OpenAI({
        apiKey,
      });
      this.logger.log('OpenAI client initialized');
    } else {
      this.logger.warn('OPENAI_API_KEY not found in environment variables');
    }
  }

  /**
   * Generate pain points menggunakan OpenAI
   * 
   * @param count Jumlah pain points yang akan di-generate
   * @returns Array of pain points dengan format sesuai schema
   */
  async generatePainPoints(count: number = 10): Promise<Array<{
    slug: string;
    title: string;
    description: string | null;
    category: 'URGENT' | 'GENERAL' | 'MAINTENANCE' | 'BODYWORK' | 'ELECTRICAL';
    keywords: string[];
    iconName: string | null;
    isUrgent: boolean;
    priority: number;
    isPopular: boolean;
    serviceTypeMappings: Array<{
      company_id: string;
      serviceType_id: string;
      relevance: number;
    }>;
  }>> {
    if (!this.openai) {
      throw new Error('OpenAI client not initialized. Please set OPENAI_API_KEY in .env');
    }

    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        this.logger.log(`Generating ${count} pain points (attempt ${attempt}/${maxRetries})`);

        const prompt = this.buildPrompt(count);

        const response = await this.openai.chat.completions.create({
          model: 'gpt-4o-mini', // Gunakan model yang lebih murah untuk seed data
          messages: [
            {
              role: 'system',
              content: `Kamu adalah ahli otomotif yang memahami masalah umum kendaraan (mobil dan motor) di Indonesia.
Tugasmu adalah generate daftar pain points (masalah kendaraan) yang sering dialami pelanggan bengkel.`,
            },
            {
              role: 'user',
              content: prompt,
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
        
        if (!parsed.painPoints || !Array.isArray(parsed.painPoints)) {
          throw new Error('Invalid response format from OpenAI');
        }

        this.logger.log(`Successfully generated ${parsed.painPoints.length} pain points`);
        return parsed.painPoints;

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

    throw new Error(`Failed to generate pain points after ${maxRetries} attempts: ${lastError?.message}`);
  }

  /**
   * Build prompt untuk OpenAI
   */
  private buildPrompt(count: number): string {
    return `Generate ${count} pain points (masalah kendaraan) yang sering dialami pelanggan bengkel di Indonesia.

Setiap pain point harus memiliki:
1. **slug**: URL-friendly (contoh: "ac-tidak-dingin", "rem-blong", "mesin-mati")
2. **title**: Judul masalah (contoh: "AC Tidak Dingin", "Rem Blong", "Mesin Mati Mendadak")
3. **description**: Deskripsi singkat masalah (opsional, bisa null)
4. **category**: Salah satu dari: URGENT, GENERAL, MAINTENANCE, BODYWORK, ELECTRICAL
   - URGENT: Masalah kritis (mesin mati, rem blong, ban bocor)
   - GENERAL: Masalah umum (AC rusak, rem bunyi, lampu mati)
   - MAINTENANCE: Perawatan rutin (service berkala, ganti oli, tune up)
   - BODYWORK: Masalah body (body repair, cat, dempul)
   - ELECTRICAL: Masalah kelistrikan (aki soak, starter rusak, lampu mati)
5. **keywords**: Array minimal 5 keywords untuk search (contoh: ["ac tidak dingin", "ac panas", "freon habis", "kompresor ac rusak", "bau ac"])
6. **iconName**: Nama icon dari lucide-react (opsional, bisa null, contoh: "Wind", "Wrench", "Car")
7. **isUrgent**: Boolean (true untuk masalah kritis)
8. **priority**: Number 0-10 (10 = paling prioritas)
9. **isPopular**: Boolean (true untuk masalah yang sering dicari)
10. **serviceTypeMappings**: Array mapping ke service types yang bisa menyelesaikan masalah ini (untuk company yang sudah subscribe)
    - company_id: "COMPANY01" (default company, opsional jika belum ada)
    - serviceType_id: ID service type (contoh: "SVC001", "SVC002")
    - relevance: Number 1-10 (10 = sangat cocok)
11. **workshopTypeMappings**: Array mapping ke workshop types yang bisa menyelesaikan masalah ini (untuk waitingList yang belum subscribe)
    - workshopType_id: ID workshop type (contoh: "TYPE01", "TYPE02") - WAJIB untuk MVP
    - relevance: Number 1-10 (10 = sangat cocok)

Contoh format JSON:
{
  "painPoints": [
    {
      "slug": "ac-tidak-dingin",
      "title": "AC Tidak Dingin",
      "description": "AC mobil/motor tidak mengeluarkan udara dingin atau kurang dingin",
      "category": "GENERAL",
      "keywords": ["ac tidak dingin", "ac panas", "freon habis", "kompresor ac rusak", "bau ac", "ac bocor"],
      "iconName": "Wind",
      "isUrgent": false,
      "priority": 7,
      "isPopular": true,
      "serviceTypeMappings": [
        {
          "company_id": "COMPANY01",
          "serviceType_id": "SVC001",
          "relevance": 10
        }
      ],
      "workshopTypeMappings": [
        {
          "workshopType_id": "TYPE01",
          "relevance": 10
        }
      ]
    }
  ]
}

Pastikan:
- Keywords dalam bahasa Indonesia (sesuai dengan cara pelanggan mencari)
- Variasi keywords (sinonim, ejaan berbeda)
- Workshop type mappings WAJIB (untuk waitingList yang belum subscribe)
- Service type mappings opsional (jika sudah ada company dengan service types)
- Mapping relevan dengan masalah (contoh: "AC Tidak Dingin" -> workshop type "Service AC")
- Mix antara kategori URGENT, GENERAL, MAINTENANCE, BODYWORK, ELECTRICAL
- Beberapa pain points dengan isPopular: true
- Beberapa pain points dengan isUrgent: true

Return dalam format JSON dengan key "painPoints" yang berisi array.`;
  }

  /**
   * Sleep helper untuk retry logic
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}


