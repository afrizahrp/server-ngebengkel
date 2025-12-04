import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import jwtConfig from '../../config/jwt.config';
import refreshConfig from '../../config/refresh.config';
import { UserPayload, TokenPair } from '../types/auth.types';

@Injectable()
export class AuthTokenService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private jwtConfiguration: ConfigType<typeof jwtConfig>,
    @Inject(refreshConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshConfig>,
  ) {
    this.validateConfiguration();
  }

  /**
   * Validate that JWT secrets and expiry configuration are properly set
   */
  private validateConfiguration(): void {
    if (!this.jwtConfiguration.secret) {
      throw new Error('JWT_SECRET not configured');
    }

    if (!this.refreshTokenConfig.secret) {
      throw new Error('REFRESH_JWT_SECRET not configured');
    }
  }

  /**
   * Generate JWT access & refresh tokens
   */
  async generateTokens(
    userId: number,
    roleId: string,
    companyId: string,
    branchId: string,
  ): Promise<TokenPair> {
    const payload: UserPayload = {
      sub: userId,
      role_id: roleId,
      company_id: companyId,
      branch_id: branchId,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(payload),
      this.generateRefreshToken(payload),
    ]);

    return { accessToken, refreshToken };
  }

  /**
   * Verify JWT access token dan return user payload
   */
  async verifyAccessToken(token: string): Promise<UserPayload> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.jwtConfiguration.secret,
        ignoreExpiration: false,
        clockTolerance: 5, // 5 second tolerance for clock skew
      });

      return payload;
    } catch (error) {
      const errorName = (error as any)?.name;

      if (errorName === 'TokenExpiredError') {
        throw new UnauthorizedException('Access token expired');
      } else if (errorName === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid access token (signature/format)');
      } else if (errorName === 'NotBeforeError') {
        throw new UnauthorizedException('Token not yet valid');
      } else {
        throw new UnauthorizedException('Invalid token');
      }
    }
  }

  /**
   * Verify JWT refresh token dan return user payload
   */
  async verifyRefreshToken(token: string): Promise<UserPayload> {
    try {
      console.log('[AuthTokenService] Verifying refresh token (first 30 chars):', token.substring(0, 30));

      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.refreshTokenConfig.secret,
        ignoreExpiration: false,
        clockTolerance: 5, // 5 second tolerance for clock skew
      });

      console.log('[AuthTokenService] ✅ Refresh token valid for user:', payload.sub);
      return payload;
    } catch (error) {
      const errorName = (error as any)?.name;
      const errorMessage = (error as any)?.message;

      console.error('[AuthTokenService] ❌ Refresh token verification failed:', {
        errorName,
        errorMessage,
        secretConfigured: !!this.refreshTokenConfig.secret,
        expiresIn: this.refreshTokenConfig.expiresIn,
      });

      if (errorName === 'TokenExpiredError') {
        console.error('[AuthTokenService] ⏰ Refresh token expired');
        throw new UnauthorizedException('Refresh token expired');
      } else if (errorName === 'JsonWebTokenError') {
        console.error('[AuthTokenService] 🔒 Invalid refresh token format or signature');
        throw new UnauthorizedException('Invalid refresh token (signature/format)');
      } else if (errorName === 'NotBeforeError') {
        console.error('[AuthTokenService] ⚠️ Token not yet valid (clock skew?)');
        throw new UnauthorizedException('Token not yet valid');
      } else {
        console.error('[AuthTokenService] ⚠️ Unknown JWT error:', error);
        throw new UnauthorizedException('Invalid refresh token');
      }
    }
  }

  /**
   * Generate access token
   */
  private async generateAccessToken(payload: UserPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.jwtConfiguration.secret,
      expiresIn: this.jwtConfiguration.signOptions?.expiresIn || '1d',
    });
  }

  /**
   * Generate refresh token
   */
  private async generateRefreshToken(payload: UserPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.refreshTokenConfig.secret,
      expiresIn: this.refreshTokenConfig.expiresIn || '7d',
    });
  }
}
