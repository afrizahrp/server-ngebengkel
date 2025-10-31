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
  ) {}

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
      });
      return payload;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  /**
   * Verify JWT refresh token dan return user payload
   */
  async verifyRefreshToken(token: string): Promise<UserPayload> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.refreshTokenConfig.secret,
      });
      return payload;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Generate access token
   */
  private async generateAccessToken(payload: UserPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.jwtConfiguration.secret,
      expiresIn: this.jwtConfiguration.signOptions?.expiresIn || '1h',
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



