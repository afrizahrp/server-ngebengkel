import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OpenAIService {
  private readonly logger = new Logger(OpenAIService.name);
  private readonly apiKey: string;
  private readonly baseURL: string;
  private readonly model: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('OPENAI_API_KEY') || '';
    this.baseURL =
      this.configService.get<string>('OPENAI_BASE_URL') ||
      'https://api.openai.com/v1';
    this.model =
      this.configService.get<string>('OPENAI_MODEL') || 'gpt-3.5-turbo';
  }

  async generateProductDescription(
    productSpecs: Record<string, string>,
    productName?: string,
    category?: string,
    language: string = 'id',
    isMedicalProduct: boolean = true,
    targetAudience: string = 'healthcare_professionals',
  ): Promise<string> {
    try {
      // Filter out empty specifications
      const filteredSpecs = Object.entries(productSpecs)
        .filter(([_, value]) => value && value.trim() !== '')
        .reduce(
          (acc, [key, value]) => {
            acc[key] = value;
            return acc;
          },
          {} as Record<string, string>,
        );

      if (Object.keys(filteredSpecs).length === 0) {
        throw new Error('No valid specifications provided');
      }

      const prompt = this.createDescriptionPrompt(
        filteredSpecs,
        productName,
        category,
        language,
        isMedicalProduct,
        targetAudience,
      );
      const response = await this.callOpenAIAPI(prompt);

      return response;
    } catch (error) {
      this.logger.error('Error generating product description:', error);
      throw new Error('Failed to generate product description');
    }
  }

  async translateText(
    text: string,
    targetLanguage: string = 'en',
  ): Promise<string> {
    try {
      if (!text || text.trim() === '') {
        throw new Error('No text provided for translation');
      }

      const prompt = this.createTranslationPrompt(text, targetLanguage);
      const response = await this.callOpenAIAPI(prompt);

      return response;
    } catch (error) {
      this.logger.error('Error translating text:', error);
      throw new Error('Failed to translate text');
    }
  }

  private createDescriptionPrompt(
    specs: Record<string, string>,
    productName?: string,
    category?: string,
    language: string = 'id',
    isMedicalProduct: boolean = true,
    targetAudience: string = 'healthcare_professionals',
  ): string {
    const specsText = Object.entries(specs)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

    const languageInstruction =
      language === 'id'
        ? 'in Indonesian'
        : language === 'en'
          ? 'in English'
          : `in ${language}`;

    const productType = isMedicalProduct
      ? 'medical/healthcare product'
      : 'product';
    const audienceContext = this.getAudienceContext(targetAudience);

    return `Generate a professional product description ${languageInstruction} for a ${productType}${productName ? ` named "${productName}"` : ''} based on the following specifications:

${specsText}

${audienceContext}

Please create a compelling, informative description specifically for the healthcare industry that highlights:
- Medical-grade quality and safety standards
- Clinical benefits and therapeutic applications
- Compliance with healthcare regulations (FDA, CE, ISO 13485)
- Patient safety features and risk mitigation
- Professional healthcare use cases and applications
- Technical specifications relevant to medical professionals
- Durability and reliability for healthcare environments
- Infection control and sterilization capabilities
- Ease of use for healthcare staff
- Maintenance and service requirements

The description should be suitable for medical equipment catalogs, hospital procurement systems, or healthcare e-commerce platforms. Use professional medical terminology and emphasize clinical value, patient outcomes, and healthcare professional benefits. Focus on how the product improves patient care, enhances clinical workflows, and meets regulatory requirements.`;
  }

  private createTranslationPrompt(
    text: string,
    targetLanguage: string = 'en',
  ): string {
    const languageMap: Record<string, string> = {
      en: 'English',
      id: 'Indonesian',
      es: 'Spanish',
      fr: 'French',
      de: 'German',
      ja: 'Japanese',
      ko: 'Korean',
      zh: 'Chinese',
    };

    const targetLangName = languageMap[targetLanguage] || targetLanguage;

    return `Translate the following Indonesian medical/healthcare product description to ${targetLangName}. Maintain the formatting and structure, but ensure the translation is natural and professional for healthcare industry use. Use appropriate medical terminology and maintain clinical accuracy:

${text}

Translation:`;
  }

  private async callOpenAIAPI(prompt: string): Promise<string> {
    if (!this.apiKey) {
      this.logger.warn('OpenAI API key not configured, using mock response');
      return this.getMockResponse(prompt);
    }

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `OpenAI API error: ${response.statusText} - ${errorData.error?.message || ''}`,
        );
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      this.logger.error('OpenAI API call failed:', error);
      // Fallback to mock response if API fails
      return this.getMockResponse(prompt);
    }
  }

  private getAudienceContext(targetAudience: string): string {
    switch (targetAudience) {
      case 'healthcare_professionals':
        return 'Target audience: Healthcare professionals (doctors, nurses, technicians). Focus on clinical applications, technical specifications, and professional benefits.';
      case 'private_hospitals_indonesia':
        return 'Target audience: Private hospitals and clinics in Indonesia. Focus on clinical excellence, operational efficiency, cost-effectiveness, and compliance with Indonesian healthcare standards. Emphasize benefits for private healthcare facilities and their specific needs.';
      case 'procurement':
        return 'Target audience: Hospital procurement and purchasing departments. Focus on cost-effectiveness, compliance, maintenance requirements, and vendor support.';
      case 'patients':
        return 'Target audience: Patients and caregivers. Focus on patient safety, ease of use, comfort, and therapeutic benefits in simple, understandable language.';
      case 'administrators':
        return 'Target audience: Hospital administrators and management. Focus on operational efficiency, cost savings, regulatory compliance, and return on investment.';
      default:
        return 'Target audience: Private hospitals and clinics in Indonesia. Focus on clinical applications and professional benefits.';
    }
  }

  private getMockResponse(prompt: string): string {
    // Mock response for development/testing
    if (prompt.includes('Translate')) {
      return `Translated to English (Medical/Healthcare): ${prompt.split('\n').slice(2).join('\n')}`;
    } else {
      return `Deskripsi produk medis yang dihasilkan berdasarkan spesifikasi:

${prompt.split('\n').slice(2).join('\n')}

Produk medis ini dirancang dengan standar kualitas medis yang tinggi untuk memberikan performa optimal dalam lingkungan perawatan kesehatan. Dengan spesifikasi yang telah disebutkan di atas, produk ini memenuhi standar keamanan medis dan cocok untuk berbagai aplikasi klinis dan terapeutik. Produk ini telah dirancang khusus untuk memenuhi kebutuhan profesional kesehatan dan memberikan hasil yang dapat diandalkan dalam perawatan pasien. Produk ini mematuhi standar regulasi medis internasional dan dirancang untuk memberikan keamanan maksimal bagi pasien dan staf medis.`;
    }
  }
}
