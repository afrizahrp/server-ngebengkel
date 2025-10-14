import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { BetterAuthService } from './better-auth.service';
import { Public } from '../decorators/public.decorator';
import { Roles } from '../decorators/roles.decorator';
import { BetterRefreshGuard } from './guards/better-refresh.guard';
import { Response } from 'express';

interface AuthRequest {
  user: {
    id: number;
    role_id: string;
  };
  refreshToken?: string;
}

@Controller('auth')
export class BetterAuthController {
  constructor(private readonly betterAuthService: BetterAuthService) {}

  /**
   * Register user baru
   */
  @Public()
  @Post('register')
  async register(
    @Body()
    body: {
      name: string;
      email: string;
      password: string;
      image?: string;
    },
  ) {
    return await this.betterAuthService.register(body);
  }

  /**
   * Login dengan email & password
   */
  @Public()
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;

    if (!email || !password) {
      throw new UnauthorizedException('Email and password are required');
    }

    return await this.betterAuthService.login(email, password);
  }

  /**
   * Refresh access token
   */
  @Public()
  @UseGuards(BetterRefreshGuard)
  @Post('refresh')
  async refreshToken(@Request() req: AuthRequest) {
    if (!req.refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    return await this.betterAuthService.refreshToken(
      req.user.id,
      req.refreshToken,
    );
  }

  /**
   * Logout
   */
  @Post('logout')
  async logout(@Request() req: AuthRequest) {
    return await this.betterAuthService.logout(req.user.id);
  }

  /**
   * Reset password
   */
  @Public()
  @Post('reset-password')
  async resetPassword(@Body() body: { email: string; password: string }) {
    const { email, password } = body;

    if (!email || !password) {
      throw new UnauthorizedException('Email and password are required');
    }

    return await this.betterAuthService.resetPassword(email, password);
  }

  /**
   * Get current user
   */
  @Get('me')
  async getCurrentUser(@Request() req: AuthRequest) {
    return await this.betterAuthService.getUserById(req.user.id);
  }

  /**
   * Protected route untuk testing
   */
  @Roles('ADMIN', 'MANAGER', 'USER')
  @Get('protected')
  getProtected(@Request() req: AuthRequest): any {
    return {
      message: 'Now you can access this protected API',
      user: req.user,
    };
  }

  /**
   * Google OAuth Login - Initiate
   */
  @Public()
  @Get('google/login')
  async googleLogin(@Res() res: Response) {
    const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_CALLBACK_URL}&response_type=code&scope=email%20profile&access_type=offline&prompt=consent`;
    res.redirect(googleOAuthUrl);
  }

  /**
   * Google OAuth Callback
   */
  @Public()
  @Get('google/callback')
  async googleCallback(@Request() req: any, @Res() res: Response) {
    try {
      // Ambil code dari query params
      const code = req.query.code;

      if (!code) {
        throw new UnauthorizedException('No authorization code provided');
      }

      // Exchange code untuk access token
      const googleAccessToken =
        await this.betterAuthService.exchangeGoogleCode(code);

      // Get user info dari Google
      const googleUser =
        await this.betterAuthService.getGoogleUserInfo(googleAccessToken);

      // Login atau register user
      const loginResult = await this.betterAuthService.loginWithGoogle({
        email: googleUser.email,
        name: googleUser.name,
        image: googleUser.picture,
      });

      // Redirect ke frontend dengan tokens
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const redirectUrl = `${frontendUrl}/auth/google/callback?accessToken=${loginResult.accessToken}&refreshToken=${loginResult.refreshToken}`;

      res.redirect(redirectUrl);
    } catch (error) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      res.redirect(
        `${frontendUrl}/auth/error?message=${encodeURIComponent(errorMessage)}`,
      );
    }
  }

  /**
   * Google Logout
   */
  @Get('google/logout')
  googleLogout(@Res() res: Response) {
    const logoutUrl = 'https://accounts.google.com/logout';
    res.redirect(logoutUrl);
  }
}
