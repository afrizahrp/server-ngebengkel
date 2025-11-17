import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { RecaptchaService } from '../services/recaptcha.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../../auth/decorators/public.decorator';

/**
 * Guard untuk verify reCAPTCHA token
 * Extract token dari request body atau header
 */
@Injectable()
export class RecaptchaGuard implements CanActivate {
  constructor(
    private readonly recaptchaService: RecaptchaService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Skip untuk public endpoints yang tidak perlu CAPTCHA
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Skip jika CAPTCHA tidak enabled
    if (!this.recaptchaService.isEnabled()) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { body, headers, ip } = request;

    // Extract CAPTCHA token dari body atau header
    const captchaToken =
      body?.recaptchaToken ||
      body?.captchaToken ||
      body?.recaptcha ||
      headers['x-recaptcha-token'] ||
      headers['x-captcha-token'];

    if (!captchaToken) {
      throw new BadRequestException('CAPTCHA token is required');
    }

    // Extract expected action dari body (untuk reCAPTCHA v3)
    const expectedAction = body?.recaptchaAction || 'submit';

    // Get remote IP
    const remoteIp =
      ip ||
      headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      headers['x-real-ip'] ||
      request.connection.remoteAddress;

    // Verify CAPTCHA token
    await this.recaptchaService.verifyToken(
      captchaToken,
      remoteIp,
      expectedAction,
    );

    return true;
  }
}













