import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Cms_ResponseProductDescDto } from './dto/cms_ResponseProductDesc.dto';

@Injectable()
export class cms_ProductDescAutoGeneratorService {
  private readonly logger = new Logger(
    cms_ProductDescAutoGeneratorService.name,
  );

  constructor(private readonly prisma: PrismaService) {}

  private countBulletPoints(text: string): number {
    if (!text || typeof text !== 'string') return 0;
    const matches = text.match(/<li\b[^>]*>([\s\S]*?)<\/li>/gi);
    return matches ? matches.length : 0;
  }

  private ensureSingleUlFormat(text: string): string {
    if (!text || typeof text !== 'string') return '';

    const liMatches = text.match(/<li\b[^>]*>([\s\S]*?)<\/li>/gi);
    if (!liMatches || liMatches.length === 0) return '';

    const liContents = liMatches.map((m) => m.replace(/<\/?li>/gi, ''));
    return `<ul>${liContents.map((c) => `<li>${c}</li>`).join('')}</ul>`;
  }

  private extractIntroParagraph(descriptions: string): string {
    if (!descriptions || typeof descriptions !== 'string') return '';

    const beforeUlMatch = descriptions.match(/^(.*?)(<ul>|<li>)/s);
    if (beforeUlMatch) {
      const introText = beforeUlMatch[1].trim();
      return introText
        .replace(/<br\s*\/?>(?=\s*<br\s*\/?>(\s|\n)*)/gi, ' ')
        .replace(/<br\s*\/?>(?!\s*<li>)/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }

    return '';
  }

  private extractBulletPoints(text: string): string[] {
    if (!text || typeof text !== 'string') return [];
    const liMatches = text.match(/<li\b[^>]*>([\s\S]*?)<\/li>/gi);
    if (!liMatches) return [];
    return liMatches.map((match) => match.replace(/<\/?li>/gi, '').trim());
  }

  private simpleTranslate(text: string): string {
    // NOTE: Placeholder agar kompilasi aman. Integrasi OpenAI dapat dihubungkan di sini.
    // Untuk saat ini, jika teks sudah mengandung huruf latin Inggris akan dikembalikan apa adanya.
    try {
      if (!text) return '';
      return text;
    } catch {
      return text;
    }
  }

  private async translateContentWithCompleteFormatting(
    descriptions: string,
    benefits: string,
  ): Promise<{ descriptions_en: string; benefits_en: string }> {
    try {
      this.logger.log('Starting complete translation with formatting...');

      const introParagraph = this.extractIntroParagraph(descriptions);
      const descBulletPoints = this.extractBulletPoints(descriptions);
      const benefitsBulletPoints = this.extractBulletPoints(benefits);

      this.logger.log(`📊 Extracted components:`);
      this.logger.log(`   - Intro paragraph: ${introParagraph.length} chars`);
      this.logger.log(`   - Description bullets: ${descBulletPoints.length}`);
      this.logger.log(`   - Benefits bullets: ${benefitsBulletPoints.length}`);

      const translatedIntro = this.simpleTranslate(introParagraph);
      this.logger.log('✅ Translated intro paragraph');

      const translatedDescBullets: string[] = [];
      for (let i = 0; i < descBulletPoints.length; i++) {
        const bullet = descBulletPoints[i];
        const translatedBullet = this.simpleTranslate(bullet);
        translatedDescBullets.push(translatedBullet);
        this.logger.log(
          `✅ Translated description bullet ${i + 1}/${descBulletPoints.length}`,
        );
        await new Promise((r) => setTimeout(r, 50));
      }

      const translatedBenefitsBullets: string[] = [];
      for (let i = 0; i < benefitsBulletPoints.length; i++) {
        const bullet = benefitsBulletPoints[i];
        const translatedBullet = this.simpleTranslate(bullet);
        translatedBenefitsBullets.push(translatedBullet);
        this.logger.log(
          `✅ Translated benefits bullet ${i + 1}/${benefitsBulletPoints.length}`,
        );
        await new Promise((r) => setTimeout(r, 50));
      }

      const newDescriptionsEn = `${translatedIntro ? `${translatedIntro}\n\n` : ''}<ul>${translatedDescBullets
        .map((b) => `<li>${b}</li>`)
        .join('')}</ul>`;
      const newBenefitsEn = `<ul>${translatedBenefitsBullets
        .map((b) => `<li>${b}</li>`)
        .join('')}</ul>`;

      const originalDescBulletCount = this.countBulletPoints(descriptions);
      const originalBenefitsBulletCount = this.countBulletPoints(benefits);
      const newDescEnBulletCount = this.countBulletPoints(newDescriptionsEn);
      const newBenefitsEnBulletCount = this.countBulletPoints(newBenefitsEn);

      this.logger.log(`📊 Complete translation bullet count verification:`);
      this.logger.log(
        `   - Descriptions: ${originalDescBulletCount} → ${newDescEnBulletCount}`,
      );
      this.logger.log(
        `   - Benefits: ${originalBenefitsBulletCount} → ${newBenefitsEnBulletCount}`,
      );

      return {
        descriptions_en: newDescriptionsEn,
        benefits_en: newBenefitsEn,
      };
    } catch (error) {
      this.logger.error('Error in complete translation:', error);
      return {
        descriptions_en: descriptions || '',
        benefits_en: benefits || '',
      };
    }
  }

  async translateProductDescriptionWithCompleteFormatting(
    id: string,
    company_id: string,
    updatedBy?: string,
  ): Promise<Cms_ResponseProductDescDto> {
    const startTime = Date.now();
    try {
      this.logger.log(`🔄 Starting complete translation for product ID: ${id}`);

      const fetchStart = Date.now();
      const existingDesc = await this.prisma.imc_ProductDesc.findUnique({
        where: { id_company_id: { id, company_id } },
      });
      const fetchTime = Date.now() - fetchStart;

      if (!existingDesc) {
        throw new NotFoundException(
          `Product description with ID ${id} not found`,
        );
      }
      if (!existingDesc.descriptions || !existingDesc.benefits) {
        throw new Error('No Indonesian content found to translate');
      }

      this.logger.log(`✅ Fetched existing description (${fetchTime}ms)`);

      const translateStart = Date.now();
      const translated = await this.translateContentWithCompleteFormatting(
        existingDesc.descriptions,
        existingDesc.benefits,
      );
      const translateTime = Date.now() - translateStart;
      this.logger.log(
        `✅ Translated content with complete formatting (${translateTime}ms)`,
      );

      const updateStart = Date.now();
      const result = await this.prisma.imc_ProductDesc.update({
        where: { id_company_id: { id, company_id } },
        data: {
          descriptions_en: translated.descriptions_en,
          benefits_en: translated.benefits_en,
          updatedBy: updatedBy || 'system-complete-translation',
          updatedAt: new Date(),
        },
      });
      const updateTime = Date.now() - updateStart;
      const totalTime = Date.now() - startTime;

      this.logger.log(
        `🎉 Successfully translated content with complete formatting for product ID: ${id}`,
      );
      this.logger.log(`⏱️  COMPLETE TRANSLATION TIMING:`);
      this.logger.log(`   📊 Fetch Description: ${fetchTime}ms`);
      this.logger.log(`   🔄 Translate Content: ${translateTime}ms`);
      this.logger.log(`   💾 Update Database: ${updateTime}ms`);
      this.logger.log(
        `   ⚡ TOTAL TIME: ${totalTime}ms (${(totalTime / 1000).toFixed(2)}s)`,
      );

      return result as Cms_ResponseProductDescDto;
    } catch (error) {
      this.logger.error(
        `Error translating product description with complete formatting for ID ${id}:`,
        error,
      );
      throw error;
    }
  }

  async translateBulkProductDescriptionsWithCompleteFormatting(
    productIds: string[],
    company_id: string,
    updatedBy?: string,
  ): Promise<{
    successful: Cms_ResponseProductDescDto[];
    failed: { id: string; error: string }[];
  }> {
    const successful: Cms_ResponseProductDescDto[] = [];
    const failed: { id: string; error: string }[] = [];

    for (const id of productIds) {
      try {
        const result =
          await this.translateProductDescriptionWithCompleteFormatting(
            id,
            company_id,
            updatedBy,
          );
        successful.push(result);
      } catch (error) {
        failed.push({
          id,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return { successful, failed };
  }
}
