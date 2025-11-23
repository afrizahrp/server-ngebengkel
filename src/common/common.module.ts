import { Module, Global } from '@nestjs/common';
import { RecaptchaService } from './services/recaptcha.service';
import { RecaptchaGuard } from './guards/recaptcha.guard';
import { AnonymousIdInterceptor } from './interceptors/anonymous-id.interceptor';
import { AnonymousSessionModule } from '../auth/anonymous-session/anonymous-session.module';

/**
 * Common Module untuk shared services, guards, dan interceptors
 * Marked as @Global() agar bisa digunakan di semua modules
 */
@Global()
@Module({
  imports: [AnonymousSessionModule], // Import untuk AnonymousSessionService
  providers: [RecaptchaService, RecaptchaGuard, AnonymousIdInterceptor],
  exports: [
    RecaptchaService,
    RecaptchaGuard,
    AnonymousIdInterceptor,
    AnonymousSessionModule, // Export module agar service-nya tersedia secara global
  ],
})
export class CommonModule {}














