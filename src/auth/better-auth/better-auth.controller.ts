import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UnauthorizedException,
  UseGuards,
  Query,
} from '@nestjs/common';
import { BetterAuthService } from './better-auth.service';
import { Public } from '../decorators/public.decorator';
import { Roles } from '../decorators/roles.decorator';
import { BetterRefreshGuard } from './guards/better-refresh.guard';
import { Response } from 'express';
import { AuthRequest } from '../types/auth-request.interface';
import { CurrentUser } from '../decorators/current-user.decorator';
import { AuthenticatedUser } from '../types/auth-request.interface';

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
  async login(
    @Body() body: { email: string; password: string; deviceName?: string },
    @Request() req: any,
  ) {
    const { email, password, deviceName } = body;

    if (!email || !password) {
      throw new UnauthorizedException('Email and password are required');
    }

    // Extract device info dari request
    const deviceInfo = {
      deviceName: deviceName || 'Unknown Device',
      ipAddress:
        req.ip ||
        req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress,
      userAgent: req.headers['user-agent'],
    };

    return await this.betterAuthService.login(email, password, deviceInfo);
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
  async logout(
    @Request() req: AuthRequest,
    @Body() body?: { sessionId?: string },
  ) {
    return await this.betterAuthService.logout(req.user.id, body?.sessionId);
  }

  /**
   * Forgot Password - Step 1: Request password reset
   * User input email, sistem kirim link reset password
   */
  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    const { email } = body;

    if (!email) {
      throw new UnauthorizedException('Email is required');
    }

    return await this.betterAuthService.forgotPassword(email);
  }

  /**
   * Reset Password - Step 2: Verify token dan set new password
   * User klik link dari email, input password baru
   */
  @Public()
  @Post('reset-password')
  async resetPasswordWithToken(
    @Body() body: { token: string; password: string },
  ) {
    const { token, password } = body;

    if (!token || !password) {
      throw new UnauthorizedException('Token and password are required');
    }

    return await this.betterAuthService.resetPasswordWithToken(token, password);
  }

  /**
   * @deprecated Legacy endpoint - INSECURE!
   * Reset password tanpa token verification
   * WARNING: Only for backward compatibility, will be removed!
   */
  @Public()
  @Post('reset-password-legacy')
  async resetPasswordLegacy(@Body() body: { email: string; password: string }) {
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
   * Test endpoint untuk company & branch dari JWT
   */
  @Get('test-company-branch')
  testCompanyBranch(@CurrentUser() user: AuthenticatedUser) {
    return {
      message: 'Company ID and Branch ID are available from JWT token',
      user: {
        id: user.id,
        role_id: user.role_id,
        company_id: user.company_id,
        branch_id: user.branch_id,
      },
    };
  }

  /**
   * Test endpoint - hanya ambil company_id
   */
  @Get('test-company-only')
  testCompanyOnly(@CurrentUser('company_id') companyId: string) {
    return {
      message: 'Get company_id only from decorator',
      company_id: companyId,
    };
  }

  /**
   * Test endpoint - hanya ambil branch_id
   */
  @Get('test-branch-only')
  testBranchOnly(@CurrentUser('branch_id') branchId: string) {
    return {
      message: 'Get branch_id only from decorator',
      branch_id: branchId,
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

      // Extract device info
      const deviceInfo = {
        deviceName: 'Google OAuth Device',
        ipAddress:
          req.ip ||
          req.headers['x-forwarded-for'] ||
          req.connection.remoteAddress,
        userAgent: req.headers['user-agent'],
      };

      // Login atau register user
      const loginResult = await this.betterAuthService.loginWithGoogle(
        {
          email: googleUser.email,
          name: googleUser.name,
          image: googleUser.picture,
        },
        deviceInfo,
      );

      // Redirect ke frontend dengan tokens
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

      // Build URL dengan semua parameter yang diperlukan
      const params = new URLSearchParams({
        accessToken: loginResult.accessToken,
        refreshToken: loginResult.refreshToken,
        sessionId: loginResult.sessionId,
        userId: loginResult.user.id.toString(),
        name: loginResult.user.name,
        email: loginResult.user.email,
        image: loginResult.user.image || '',
        company_id: loginResult.user.company?.company_id || 'BIS',
        role_id: loginResult.user.company?.role_id || 'ADMIN',
        role_name: loginResult.user.company?.role_name || 'ADMINISTRATOR',
      });

      const redirectUrl = `${frontendUrl}/auth/google/callback?${params.toString()}`;

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

  /**
   * Verify email dengan token
   */
  @Public()
  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    if (!token) {
      throw new UnauthorizedException('Verification token is required');
    }

    return await this.betterAuthService.verifyEmail(token);
  }

  /**
   * Resend verification email
   */
  @Public()
  @Post('resend-verification-email')
  async resendVerificationEmail(@Body() body: { email: string }) {
    const { email } = body;

    if (!email) {
      throw new UnauthorizedException('Email is required');
    }

    return await this.betterAuthService.resendVerificationEmail(email);
  }

  /**
   * Verify OTP dan complete login (Step 2 dari 2FA login)
   */
  @Public()
  @Post('verify-2fa')
  async verifyTwoFactor(
    @Body() body: { userId: number; otpCode: string; deviceName?: string },
    @Request() req: any,
  ) {
    const { userId, otpCode, deviceName } = body;

    if (!userId || !otpCode) {
      throw new UnauthorizedException('User ID and OTP code are required');
    }

    // Ensure otpCode is string
    const otpCodeString = String(otpCode);

    // Extract device info dari request
    const deviceInfo = {
      deviceName: deviceName || 'Unknown Device',
      ipAddress:
        req.ip ||
        req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress,
      userAgent: req.headers['user-agent'],
    };

    return await this.betterAuthService.verifyOtpAndLogin(
      userId,
      otpCodeString,
      deviceInfo,
    );
  }

  /**
   * Enable 2FA untuk user (Protected - harus login dulu)
   */
  @Post('enable-2fa')
  async enableTwoFactor(@Request() req: AuthRequest) {
    // Import TwoFactorService
    const twoFactorService = this.betterAuthService['twoFactorService'];
    await twoFactorService.enableTwoFactor(req.user.id);

    return {
      message: 'Two-factor authentication enabled successfully',
      twoFactorEnabled: true,
    };
  }

  /**
   * Disable 2FA untuk user (Protected - harus login dulu)
   */
  @Post('disable-2fa')
  async disableTwoFactor(@Request() req: AuthRequest) {
    // Import TwoFactorService
    const twoFactorService = this.betterAuthService['twoFactorService'];
    await twoFactorService.disableTwoFactor(req.user.id);

    return {
      message: 'Two-factor authentication disabled successfully',
      twoFactorEnabled: false,
    };
  }

  /**
   * Check 2FA status untuk current user
   */
  @Get('2fa-status')
  async getTwoFactorStatus(@Request() req: AuthRequest) {
    const user = await this.betterAuthService.getUserById(req.user.id);
    const twoFactorService = this.betterAuthService['twoFactorService'];
    const twoFactorEnabled = await twoFactorService.isTwoFactorEnabled(
      req.user.id,
    );

    return {
      userId: user.id,
      email: user.email,
      twoFactorEnabled,
    };
  }
}
