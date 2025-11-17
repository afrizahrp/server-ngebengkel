import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import axios from 'axios';

export interface RecaptchaVerificationResult {
  success: boolean;
  score?: number;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
}

/**
 * Service untuk verify Google reCAPTCHA tokens
 * Support untuk reCAPTCHA v2 dan v3
 */
@Injectable()
export class RecaptchaService {
  private readonly logger = new Logger(RecaptchaService.name);
  private readonly secretKey: string;
  private readonly verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
  private readonly minScore = 0.5; // Minimum score untuk reCAPTCHA v3 (0.0 - 1.0)

  constructor() {
    this.secretKey = process.env.RECAPTCHA_SECRET_KEY || '';
    if (!this.secretKey) {
      this.logger.warn(
        'RECAPTCHA_SECRET_KEY not set. CAPTCHA verification will be disabled.',
      );
    }
  }

  /**
   * Verify reCAPTCHA token
   * @param token - reCAPTCHA token dari frontend
   * @param remoteIp - IP address dari user (optional, untuk reCAPTCHA v3)
   * @param expectedAction - Expected action untuk reCAPTCHA v3 (optional)
   * @returns Promise<boolean> - true jika verification berhasil
   */
  async verifyToken(
    token: string,
    remoteIp?: string,
    expectedAction?: string,
  ): Promise<boolean> {
    // Skip verification jika secret key tidak di-set (untuk development)
    if (!this.secretKey) {
      this.logger.warn('Skipping CAPTCHA verification - secret key not configured');
      return true; // Allow request untuk development
    }

    if (!token || token.trim().length === 0) {
      this.logger.warn('CAPTCHA token is missing or empty');
      throw new BadRequestException('CAPTCHA token is required');
    }

    try {
      const params = new URLSearchParams();
      params.append('secret', this.secretKey);
      params.append('response', token);
      if (remoteIp) {
        params.append('remoteip', remoteIp);
      }

      const response = await axios.post<RecaptchaVerificationResult>(
        this.verifyUrl,
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          timeout: 5000, // 5 seconds timeout
        },
      );

      const result = response.data;

      if (!result.success) {
        const errorCodes = result['error-codes'] || [];
        this.logger.warn(
          `CAPTCHA verification failed: ${errorCodes.join(', ')}`,
        );
        throw new BadRequestException(
          `CAPTCHA verification failed: ${errorCodes.join(', ')}`,
        );
      }

      // Untuk reCAPTCHA v3, check score dan action
      if (result.score !== undefined) {
        // reCAPTCHA v3
        if (result.score < this.minScore) {
          this.logger.warn(
            `CAPTCHA score too low: ${result.score} (minimum: ${this.minScore})`,
          );
          throw new BadRequestException('CAPTCHA verification failed: Low score');
        }

        // Check action jika expectedAction diberikan
        if (expectedAction && result.action !== expectedAction) {
          this.logger.warn(
            `CAPTCHA action mismatch: expected ${expectedAction}, got ${result.action}`,
          );
          throw new BadRequestException('CAPTCHA verification failed: Action mismatch');
        }

        this.logger.debug(
          `CAPTCHA verified successfully: score=${result.score}, action=${result.action}`,
        );
      } else {
        // reCAPTCHA v2
        this.logger.debug('CAPTCHA v2 verified successfully');
      }

      return true;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      this.logger.error(
        `Error verifying CAPTCHA: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new BadRequestException('Failed to verify CAPTCHA');
    }
  }

  /**
   * Check if CAPTCHA is enabled
   */
  isEnabled(): boolean {
    return !!this.secretKey;
  }

  /**
   * Get minimum score untuk reCAPTCHA v3
   */
  getMinScore(): number {
    return this.minScore;
  }
}













