import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

import { hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { Inject } from '@nestjs/common';
import jwtConfig from '../config/jwt.config';
import refreshConfig from '../config/refresh.config';
import { generateIncrementId } from '../../utils/generateIncrementId';

interface UserPayload {
  sub: number;
  role_id: string;
}

@Injectable()
export class BetterAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private jwtConfiguration: ConfigType<typeof jwtConfig>,
    @Inject(refreshConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshConfig>,
  ) {}

  /**
   * Register user baru
   */
  async register(data: {
    name: string;
    email: string;
    password: string;
    image?: string;
  }) {
    // Cek apakah user sudah ada
    const existingUser = await this.prisma.sys_User.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    // Hash password
    const hashedPassword = await hash(data.password);

    // Generate manual ID untuk sys_User
    const newId = await generateIncrementId(this.prisma, 'sys_User');

    // Buat user baru
    const newUser = await this.prisma.sys_User.create({
      data: {
        id: newId,
        name: data.name,
        email: data.email,
        password: hashedPassword,
        image: data.image,
        iStatus: 'Active',
        isAdmin: false,
      },
    });

    // Assign default company & role
    await this.assignDefaultCompanyRole(newUser.id);

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      image: newUser.image,
    };
  }

  /**
   * Login dengan email & password
   */
  async login(email: string, password: string) {
    // Cari user
    const user = await this.prisma.sys_User.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await verify(user.password, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Get user companies & roles
    const userCompanies = await this.getUserCompaniesWithRoles(user.id);

    if (userCompanies.length === 0) {
      // Assign default jika belum ada
      await this.assignDefaultCompanyRole(user.id);
      const refreshedCompanies = await this.getUserCompaniesWithRoles(user.id);
      if (refreshedCompanies.length > 0) {
        userCompanies.push(refreshedCompanies[0]);
      }
    }

    const selectedCompany = userCompanies[0];

    // Generate tokens
    const tokens = await this.generateTokens(
      user.id,
      selectedCompany.userRole.role_id,
    );

    // Save hashed refresh token
    const hashedRefreshToken = await hash(tokens.refreshToken);
    await this.prisma.sys_User.update({
      where: { id: user.id },
      data: { hashedRefreshToken },
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        company: {
          company_id: selectedCompany.company_id.trim(),
          branch_id: selectedCompany.branch_id.trim(),
          role_id: selectedCompany.userRole.role_id.trim(),
          role_name: selectedCompany.userRole.role.name,
        },
        companies: userCompanies.map((c) => ({
          company_id: c.company_id.trim(),
          branch_id: c.branch_id.trim(),
          role_id: c.userRole.role_id.trim(),
          role_name: c.userRole.role.name,
        })),
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      message: 'Login successful',
    };
  }

  /**
   * Login dengan Google OAuth
   */
  async loginWithGoogle(googleUser: {
    email: string;
    name: string;
    image?: string;
  }) {
    let user = await this.prisma.sys_User.findUnique({
      where: { email: googleUser.email },
    });

    // Jika user belum ada, buat baru
    if (!user) {
      const newId = await generateIncrementId(this.prisma, 'sys_User');

      user = await this.prisma.sys_User.create({
        data: {
          id: newId,
          name: googleUser.name,
          email: googleUser.email,
          image: googleUser.image,
          password: '', // Google user tidak perlu password
          iStatus: 'Active',
          isAdmin: false,
        },
      });

      await this.assignDefaultCompanyRole(user.id);
    }

    // Get companies & roles
    const userCompanies = await this.getUserCompaniesWithRoles(user.id);
    const selectedCompany = userCompanies[0];

    // Generate tokens
    const tokens = await this.generateTokens(
      user.id,
      selectedCompany?.userRole?.role_id || 'ADMIN',
    );

    // Save hashed refresh token
    const hashedRefreshToken = await hash(tokens.refreshToken);
    await this.prisma.sys_User.update({
      where: { id: user.id },
      data: { hashedRefreshToken },
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        company: selectedCompany
          ? {
              company_id: selectedCompany.company_id.trim(),
              branch_id: selectedCompany.branch_id.trim(),
              role_id: selectedCompany.userRole.role_id.trim(),
              role_name: selectedCompany.userRole.role.name,
            }
          : null,
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  /**
   * Refresh access token
   */
  async refreshToken(userId: number, refreshToken: string) {
    const user = await this.prisma.sys_User.findUnique({
      where: { id: userId },
    });

    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Verify refresh token
    const isValid = await verify(user.hashedRefreshToken, refreshToken);
    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Get user role
    const userCompanies = await this.getUserCompaniesWithRoles(userId);
    const selectedCompany = userCompanies[0];

    // Generate new tokens
    const tokens = await this.generateTokens(
      userId,
      selectedCompany?.userRole?.role_id || 'USER',
    );

    // Update hashed refresh token
    const hashedRefreshToken = await hash(tokens.refreshToken);
    await this.prisma.sys_User.update({
      where: { id: userId },
      data: { hashedRefreshToken },
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  /**
   * Logout
   */
  async logout(userId: number) {
    await this.prisma.sys_User.update({
      where: { id: userId },
      data: { hashedRefreshToken: null },
    });

    return { message: 'Logout successful' };
  }

  /**
   * Reset password
   */
  async resetPassword(email: string, newPassword: string) {
    const user = await this.prisma.sys_User.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const hashedPassword = await hash(newPassword);

    await this.prisma.sys_User.update({
      where: { email },
      data: { password: hashedPassword },
    });

    return { message: 'Password reset successful' };
  }

  /**
   * Verify JWT token dan return user
   */
  async verifyToken(token: string): Promise<UserPayload> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.jwtConfiguration.secret,
      });
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  /**
   * Get user by ID dengan role info
   */
  async getUserById(userId: number) {
    const user = await this.prisma.sys_User.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const userCompanies = await this.getUserCompaniesWithRoles(userId);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      companies: userCompanies.map((c) => ({
        company_id: c.company_id.trim(),
        branch_id: c.branch_id.trim(),
        role_id: c.userRole.role_id.trim(),
        role_name: c.userRole.role.name,
      })),
    };
  }

  // ============== PRIVATE HELPER METHODS ==============

  /**
   * Generate JWT access & refresh tokens
   */
  private async generateTokens(userId: number, roleId: string) {
    const payload: UserPayload = {
      sub: userId,
      role_id: roleId,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.signOptions?.expiresIn || '1h',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.refreshTokenConfig.secret,
        expiresIn: this.refreshTokenConfig.expiresIn || '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  /**
   * Get user companies dengan role info
   */
  private async getUserCompaniesWithRoles(userId: number) {
    return await this.prisma.sys_UserCompanyRole.findMany({
      where: {
        userRole: {
          user_id: userId,
        },
      },
      include: {
        userRole: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  /**
   * Assign default company & role ke user baru
   */
  private async assignDefaultCompanyRole(userId: number) {
    // Get default company
    const defaultCompany = await this.prisma.sys_Company.findFirst({
      where: { iStatus: 'Active' },
    });

    if (!defaultCompany) {
      throw new ConflictException('No active company found');
    }

    // Get default role (MANAGER)
    const defaultRole = await this.prisma.sys_Role.findFirst({
      where: { iStatus: 'Active' },
    });

    if (!defaultRole) {
      throw new ConflictException('No active role found');
    }

    // Create or get user role
    let userRole = await this.prisma.sys_UserRole.findFirst({
      where: {
        user_id: userId,
        role_id: defaultRole.id.trim(),
      },
    });

    if (!userRole) {
      userRole = await this.prisma.sys_UserRole.create({
        data: {
          user_id: userId,
          role_id: defaultRole.id.trim(),
          iStatus: 'Active',
          isDefault: true,
        },
      });
    }

    // Assign to default company
    const userCompanyRoleId = await generateIncrementId(
      this.prisma,
      'sys_UserCompanyRole',
    );

    await this.prisma.sys_UserCompanyRole.create({
      data: {
        id: userCompanyRoleId,
        userRole_id: userRole.id,
        company_id: defaultCompany.id,
        branch_id: 'MAIN',
        iStatus: 'Active',
        isDefault: true,
      },
    });
  }
}
