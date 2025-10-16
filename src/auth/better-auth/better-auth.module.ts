import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { BetterAuthController } from './better-auth.controller';
import { BetterAuthService } from './better-auth.service';
import { BetterJwtAuthGuard } from './guards/better-jwt-auth.guard';
import { BetterRolesGuard } from './guards/better-roles.guard';
import { BetterRefreshGuard } from './guards/better-refresh.guard';

// Import new services
import { AuthTokenService } from './services/auth-token.service';
import { PasswordService } from './services/password.service';
import { EmailVerificationService } from './services/email-verification.service';
import { OAuthProviderService } from './services/oauth-provider.service';
import { UserCompanyService } from './services/user-company.service';

// Import strategies
import { EmailLoginStrategy } from './strategies/email-login.strategy';
import { OAuthLoginStrategy } from './strategies/oauth-login.strategy';
import { TwoFactorLoginStrategy } from './strategies/two-factor-login.strategy';

import { PrismaService } from '../../prisma.service';
import jwtConfig from '../config/jwt.config';
import refreshConfig from '../config/refresh.config';
import googleOAuthConfig from '../config/google-oauth.config';
import { SessionModule } from '../session/session.module';
import { EmailModule } from '../../email/email.module';
import { TwoFactorModule } from '../two-factor/two-factor.module';

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshConfig),
    ConfigModule.forFeature(googleOAuthConfig),
    SessionModule,
    EmailModule,
    TwoFactorModule,
  ],
  controllers: [BetterAuthController],
  providers: [
    // Main service
    BetterAuthService,
    PrismaService,
    BetterRefreshGuard,
    // New services
    AuthTokenService,
    PasswordService,
    EmailVerificationService,
    OAuthProviderService,
    UserCompanyService,
    // Strategies
    EmailLoginStrategy,
    OAuthLoginStrategy,
    TwoFactorLoginStrategy,
    // Guards
    {
      provide: APP_GUARD,
      useClass: BetterJwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: BetterRolesGuard,
    },
  ],
  exports: [BetterAuthService],
})
export class BetterAuthModule {}
