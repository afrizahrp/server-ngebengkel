import { Module, Global } from '@nestjs/common';
import { RecaptchaService } from './services/recaptcha.service';
import { RecaptchaGuard } from './guards/recaptcha.guard';

/**
 * Common Module untuk shared services dan guards
 * Marked as @Global() agar bisa digunakan di semua modules
 */
@Global()
@Module({
  providers: [RecaptchaService, RecaptchaGuard],
  exports: [RecaptchaService, RecaptchaGuard],
})
export class CommonModule {}


