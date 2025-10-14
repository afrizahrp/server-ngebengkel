import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { BetterAuthController } from './better-auth.controller';
import { BetterAuthService } from './better-auth.service';
import { BetterJwtAuthGuard } from './guards/better-jwt-auth.guard';
import { BetterRolesGuard } from './guards/better-roles.guard';
import { BetterRefreshGuard } from './guards/better-refresh.guard';

import { PrismaService } from '../../prisma.service';
import jwtConfig from '../config/jwt.config';
import refreshConfig from '../config/refresh.config';

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshConfig),
  ],
  controllers: [BetterAuthController],
  providers: [
    BetterAuthService,
    PrismaService,
    BetterRefreshGuard,
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

