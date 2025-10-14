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
import { Sys_CreateUserDto } from 'src/sys/sys_user/dto/sys_CreateUser.dto';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { Response } from 'express';

import { Public } from './decorators/public.decorator';
import { Roles } from './decorators/roles.decorator';

import { PrismaService } from 'src/prisma.service';

interface AuthenticatedRequest {
  user: {
    id: number;
    name: string;
    email: string;
    image?: string;
    role_id: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private prisma: PrismaService,
  ) {}

  @Public()
  @Post('register')
  async registerUser(@Body() sys_CreateUserDto: Sys_CreateUserDto) {
    return await this.authService.registerUser(sys_CreateUserDto);
  }

  // @Public()
  // @UseGuards(LocalAuthGuard)
  // @Post('login')
  // async login(@Request() req) {
  //   return this.authService.login(
  //     req.user.id,
  //     req.user.name,
  //     req.user.company_id,
  //     req.user.role_id,
  //     req.user.email,
  //     req.user.image,
  //   );
  // }

  @Public()
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;

    if (!email || !password) {
      throw new UnauthorizedException('Email and password are required');
    }

    return this.authService.login(email, password);
  }

  @Roles('ADMIN', 'MANAGER', 'USER')
  @Get('protected')
  getAll(): string {
    return 'Now you can access this protected API';
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  refreshTokens(@Request() req: AuthenticatedRequest) {
    return this.authService.refreshToken(req.user.id, req.user.role_id);
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin() {}

  @Get('google/logout')
  googleLogout(@Res() res: Response) {
    const logoutUrl = 'https://accounts.google.com/logout';
    res.redirect(logoutUrl);
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(
    @Request() req: AuthenticatedRequest,
    @Res() res: Response,
  ) {
    // async googleCallback(@Request() req) {
    // console.log('Google User', req.user);

    // console.log('Initiating Google login, request:', req.url); // Tambahkan log

    const user = req.user;
    if (!user) {
      throw new UnauthorizedException('Google authentication failed');
    }

    // const userCompanyRole = await this.authService.getUserCompanyRole(user.id);

    // if (!userCompanyRole) {
    //   throw new UnauthorizedException('User has no company access');
    // }

    const response = await this.authService.loginGoogle(
      req.user.id,
      req.user.name,
      'ADMIN',
    );

    // Redirect ke frontend
    res.redirect(
      `http://localhost:3000/auth/google/callback?userId=${response.id}&name=${encodeURIComponent(response.name)}&email=${encodeURIComponent(req.user.email || '')}&image=${encodeURIComponent(req.user.image || '')}&accessToken=${response.accessToken}&refreshToken=${response.refreshToken}&role_id=${response.role_id}`,
    );
  }

  @Post('logout')
  signOut(@Request() req: AuthenticatedRequest) {
    return this.authService.signOut(req.user.id);
  }

  @Public()
  @Post('reset-password')
  async resetPassword(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    if (!email || !password) {
      throw new UnauthorizedException('Email and new password are required');
    }
    return this.authService.resetPasswordByEmail(email, password);
  }
}
