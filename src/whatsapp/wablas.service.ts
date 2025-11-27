import {
  Injectable,
  Inject,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import wablasConfig from './config/wablas.config';

interface SendMessageParams {
  phone: string;
  message: string;
  imageUrl?: string;
  documentUrl?: string;
  fileName?: string;
}

interface SendMessageResponse {
  status: boolean;
  message?: string;
  data?: any;
}

@Injectable()
export class WablasService {
  private readonly logger = new Logger(WablasService.name);
  private readonly httpClient: AxiosInstance;

  constructor(
    @Inject(wablasConfig.KEY)
    private wablasConfiguration: ConfigType<typeof wablasConfig>,
  ) {
    const headers: Record<string, string> = {
      Authorization: this.wablasConfiguration.apiKey,
      'Content-Type': 'application/json',
    };

    // Tambahkan secret key ke header jika ada
    if (this.wablasConfiguration.secretKey) {
      headers['X-Secret-Key'] = this.wablasConfiguration.secretKey;
      // Alternatif: beberapa implementasi Wablas menggunakan header ini
      headers['Secret-Key'] = this.wablasConfiguration.secretKey;
    }

    this.httpClient = axios.create({
      baseURL: this.wablasConfiguration.apiUrl,
      headers,
      timeout: 30000, // 30 seconds
    });
  }

  /**
   * Format nomor telepon ke format internasional (62xxxxxxxxxxx)
   */
  private formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, '');

    // If starts with 0, replace with 62
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.substring(1);
    }
    // If starts with 62, keep it
    else if (cleaned.startsWith('62')) {
      // Already correct
    }
    // If starts with +62, remove the +
    else if (cleaned.startsWith('+62')) {
      cleaned = cleaned.substring(1);
    }
    // Otherwise, assume it's local number and add 62
    else {
      cleaned = '62' + cleaned;
    }

    return cleaned;
  }

  /**
   * Kirim pesan teks via WhatsApp
   */
  async sendTextMessage(
    phone: string,
    message: string,
  ): Promise<SendMessageResponse> {
    if (!this.wablasConfiguration.enabled) {
      this.logger.warn('Wablas is disabled. Skipping message send.');
      return {
        status: false,
        message: 'Wablas is disabled',
      };
    }

    if (!this.wablasConfiguration.apiKey) {
      this.logger.error('Wablas API key is not configured');
      throw new InternalServerErrorException(
        'Wablas API key is not configured',
      );
    }

    const formattedPhone = this.formatPhoneNumber(phone);

    try {
      // Prepare request body
      const requestBody: any = {
        phone: formattedPhone,
        message: message,
      };

      // Tambahkan secret key ke body jika diperlukan (beberapa implementasi Wablas)
      if (this.wablasConfiguration.secretKey) {
        requestBody.secret_key = this.wablasConfiguration.secretKey;
      }

      const response = await this.httpClient.post('/send-message', requestBody);

      this.logger.log(`✅ WhatsApp message sent to ${formattedPhone}`);
      return {
        status: true,
        message: 'Message sent successfully',
        data: response.data,
      };
    } catch (error: any) {
      this.logger.error(
        `❌ Error sending WhatsApp message: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        `Failed to send WhatsApp message: ${error.message}`,
      );
    }
  }

  /**
   * Kirim pesan dengan gambar via WhatsApp
   */
  async sendImageMessage(
    phone: string,
    message: string,
    imageUrl: string,
  ): Promise<SendMessageResponse> {
    if (!this.wablasConfiguration.enabled) {
      this.logger.warn('Wablas is disabled. Skipping image message send.');
      return {
        status: false,
        message: 'Wablas is disabled',
      };
    }

    const formattedPhone = this.formatPhoneNumber(phone);

    try {
      const response = await this.httpClient.post('/send-image', {
        phone: formattedPhone,
        caption: message,
        image: imageUrl,
      });

      this.logger.log(`✅ WhatsApp image sent to ${formattedPhone}`);
      return {
        status: true,
        message: 'Image sent successfully',
        data: response.data,
      };
    } catch (error: any) {
      this.logger.error(
        `❌ Error sending WhatsApp image: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        `Failed to send WhatsApp image: ${error.message}`,
      );
    }
  }

  /**
   * Kirim dokumen (PDF/struk) via WhatsApp
   */
  async sendDocumentMessage(
    phone: string,
    message: string,
    documentUrl: string,
    fileName: string = 'document.pdf',
  ): Promise<SendMessageResponse> {
    if (!this.wablasConfiguration.enabled) {
      this.logger.warn('Wablas is disabled. Skipping document send.');
      return {
        status: false,
        message: 'Wablas is disabled',
      };
    }

    const formattedPhone = this.formatPhoneNumber(phone);

    try {
      const response = await this.httpClient.post('/send-document', {
        phone: formattedPhone,
        message: message,
        document: documentUrl,
        fileName: fileName,
      });

      this.logger.log(`✅ WhatsApp document sent to ${formattedPhone}`);
      return {
        status: true,
        message: 'Document sent successfully',
        data: response.data,
      };
    } catch (error: any) {
      this.logger.error(
        `❌ Error sending WhatsApp document: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        `Failed to send WhatsApp document: ${error.message}`,
      );
    }
  }

  /**
   * Kirim pesan dengan opsi lengkap
   */
  async sendMessage(params: SendMessageParams): Promise<SendMessageResponse> {
    const { phone, message, imageUrl, documentUrl, fileName } = params;

    if (documentUrl) {
      return this.sendDocumentMessage(phone, message, documentUrl, fileName);
    }

    if (imageUrl) {
      return this.sendImageMessage(phone, message, imageUrl);
    }

    return this.sendTextMessage(phone, message);
  }

  /**
   * Check apakah Wablas sudah dikonfigurasi dengan benar
   */
  isConfigured(): boolean {
    return (
      this.wablasConfiguration.enabled &&
      !!this.wablasConfiguration.apiKey &&
      !!this.wablasConfiguration.apiUrl
    );
  }
}
