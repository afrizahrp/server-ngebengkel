import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { sys_UserService } from 'src/sys/sys_user/sys_User.service';
import { Sys_CreateUserDto } from 'src/sys/sys_user/dto/sys_CreateUser.dto';
import { hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { ConfigType } from '@nestjs/config';
import refreshConfig from './config/refresh.config';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import { Sys_CreateGoogleUserDto } from 'src/sys/sys_user/dto/sys_CreateGoogleUser.dto';
import { Sys_WhiteListEmailService } from 'src/sys/sys_whitelistemail/sys_WhiteListEmail.service';
import { generateIncrementId } from 'src/utils/generateIncrementId';

@Injectable()
export class AuthService {
  constructor(
    private readonly sys_userService: sys_UserService,
    private readonly jwtService: JwtService,
    private prisma: PrismaService,
    private readonly whiteListEmailService: Sys_WhiteListEmailService,
    @Inject(refreshConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshConfig>,
  ) {}

  // async registerUser(sys_CreateUserDto: Sys_CreateUserDto) {
  //   const user = await this.sys_userService.findByName(sys_CreateUserDto.name);
  //   if (user) {
  //     throw new ConflictException('User already exists');
  //   }
  //   return this.sys_userService.create(sys_CreateUserDto);
  // }

  async registerUser(createUserDto: Sys_CreateUserDto) {
    // Cek apakah email ada dalam whitelist
    await this.whiteListEmailService.validateEmailForAuth(createUserDto.email);

    const user = await this.sys_userService.findByEmail(createUserDto.email);
    if (user) throw new ConflictException('User already exists!');

    // Buat user baru
    const newUser = await this.sys_userService.create(createUserDto);

    // Otomatis assign ke company default
    const defaultCompany = await this.prisma.sys_Company.findFirst({
      where: { iStatus: 'Active' },
    });

    if (!defaultCompany) {
      throw new ConflictException('No active company found in system');
    }

    // Buat default role jika belum ada
    const defaultRole = await this.prisma.sys_Role.findFirst({
      where: { iStatus: 'Active' },
    });

    if (!defaultRole) {
      throw new ConflictException('No active role found in system');
    }

    // Cek apakah UserRole sudah ada, jika tidak buat baru
    let userRole = await this.prisma.sys_UserRole.findFirst({
      where: {
        user_id: newUser.id,
        role_id: 'MANAGER             ', // 20 characters with trailing spaces
      },
    });

    if (!userRole) {
      userRole = await this.prisma.sys_UserRole.create({
        data: {
          user_id: newUser.id,
          role_id: 'MANAGER             ', // 20 characters with trailing spaces
          iStatus: 'Active',
          isDefault: true,
        },
      });
    }

    // Assign userRole ke company default dengan branch default
    const userCompanyRoleId = await generateIncrementId(
      this.prisma,
      'sys_UserCompanyRole',
    );
    await this.prisma.sys_UserCompanyRole.create({
      data: {
        id: userCompanyRoleId, // Menggunakan increment ID
        userRole_id: userRole.id,
        company_id: defaultCompany.id,
        branch_id: 'MAIN', // Default branch ID
        iStatus: 'Active',
        isDefault: true,
      },
    });

    return newUser;
  }

  async validateLocalUser(email: string, password: string) {
    // Cek apakah email ada dalam whitelist
    await this.whiteListEmailService.validateEmailForAuth(email);

    const user = await this.sys_userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('User has not been registered');
    }

    const isPasswordMatch = await verify(user.password, password);

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Password is incorrect');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      iStatus: 'Active',
    };
  }

  async login(email: string, password: string) {
    const validatedUser = await this.validateLocalUser(email, password);

    const userCompanies = await this.prisma.sys_UserCompanyRole.findMany({
      where: {
        userRole: {
          user_id: validatedUser.id,
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

    if (userCompanies.length === 0) {
      // Jika user belum memiliki company, buat default company assignment
      const defaultCompany = await this.prisma.sys_Company.findFirst({
        where: { iStatus: 'Active' },
      });

      if (!defaultCompany) {
        throw new UnauthorizedException('No active company found in system');
      }

      // Buat default role jika belum ada
      const defaultRole = await this.prisma.sys_Role.findFirst({
        where: { iStatus: 'Active' },
      });

      if (!defaultRole) {
        throw new UnauthorizedException('No active role found in system');
      }

      // Cek apakah UserRole sudah ada, jika tidak buat baru
      let userRole = await this.prisma.sys_UserRole.findFirst({
        where: {
          user_id: validatedUser.id,
          role_id: defaultRole.id.trim(), // Use the actual role ID from database
        },
      });

      if (!userRole) {
        userRole = await this.prisma.sys_UserRole.create({
          data: {
            user_id: validatedUser.id,
            role_id: defaultRole.id.trim(), // Use the actual role ID from database
            iStatus: 'Active',
            isDefault: true,
          },
        });
      }

      // Assign userRole ke company default
      const userCompanyRoleId = await generateIncrementId(
        this.prisma,
        'sys_UserCompanyRole',
      );
      const newUserCompanyRole = await this.prisma.sys_UserCompanyRole.create({
        data: {
          id: userCompanyRoleId, // Menggunakan increment ID
          userRole_id: userRole.id,
          company_id: defaultCompany.id,
          branch_id: 'MAIN', // Default branch ID
          iStatus: 'Active',
          isDefault: true,
        },
        include: {
          userRole: {
            include: {
              role: true,
            },
          },
        },
      });

      userCompanies.push(newUserCompanyRole);
    }

    // Ambil company pertama sebagai default
    const selectedCompany = userCompanies[0];

    // Generate tokens
    const tokens = await this.generateTokens(
      validatedUser.id,
      selectedCompany.userRole.role_id,
    );

    return {
      user: {
        id: validatedUser.id,
        name: validatedUser.name,
        email: validatedUser.email,
        image: validatedUser.image,
        company: {
          company_id: selectedCompany.company_id.trim(),
          branch_id: selectedCompany.branch_id.trim(),
          role_id: selectedCompany.userRole.role_id.trim(),
          role_name: selectedCompany.userRole.role.name,
        },
        companies: userCompanies.map((c) => ({
          company_id: c.company_id.trim(),
          branch_id: c.branch_id.trim(),
          role_id: c.userRole.role_id,
          role_name: c.userRole.role.name,
        })),
      },
      id: validatedUser.id,
      name: validatedUser.name,
      role_id: selectedCompany.userRole.role_id,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      message: 'Login successful',
    };
  }

  // auth/auth.service.ts
  async loginGoogle(userId: number, name: string, role_id: string) {
    // Ambil data pengguna dari database berdasarkan userId
    const user = await this.sys_userService.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const { accessToken, refreshToken } = await this.generateTokens(
      userId,
      'ADMIN',
    );
    const hashedRT = await hash(refreshToken);
    await this.sys_userService.updateHashedRefreshToken(userId, hashedRT);

    return {
      id: userId,
      name: user.name || name, // Gunakan name dari database jika tersedia
      email: user.email || '', // Ambil email dari database
      image: user.image || '', // Ambil image dari database
      role_id: role_id,
      accessToken,
      refreshToken,
    };
  }

  async generateTokens(id: number, role_id: string) {
    const payload: AuthJwtPayload = { sub: id, role_id };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateJwtUser(id: number) {
    const user = await this.sys_userService.findOne(id);
    if (!user) throw new UnauthorizedException('User not found!');

    const userCompaniesRole = await this.prisma.sys_UserCompanyRole.findFirst({
      where: {
        userRole: {
          user_id: user.id,
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

    if (!userCompaniesRole) {
      throw new UnauthorizedException('User role not found!');
    }

    const currentUser = {
      id: user.id,
      role_id: userCompaniesRole.userRole.role_id,
    };
    return currentUser;
  }

  async validateRefreshToken(id: number, refreshToken: string) {
    const user = await this.sys_userService.findById(id);
    if (!user) throw new UnauthorizedException('User not found!');

    if (!user.hashedRefreshToken) {
      throw new UnauthorizedException('Invalid Refresh Token!');
    }

    const refreshTokenMatched = await verify(
      user.hashedRefreshToken,
      refreshToken,
    );

    if (!refreshTokenMatched)
      throw new UnauthorizedException('Invalid Refresh Token!');

    const userCompaniesRole = await this.prisma.sys_UserCompanyRole.findFirst({
      where: {
        userRole: {
          user_id: user.id,
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

    if (!userCompaniesRole) {
      throw new UnauthorizedException('User role not found!');
    }

    const currentUser = {
      id: user.id,
      role_id: userCompaniesRole.userRole.role_id,
    };
    return currentUser;
  }

  async refreshToken(id: number, role_id: string) {
    const { accessToken, refreshToken } = await this.generateTokens(
      id,
      role_id,
    );
    const hashedRT = await hash(refreshToken);
    await this.sys_userService.updateHashedRefreshToken(id, hashedRT);
    return {
      id: id,
      accessToken,
      refreshToken,
    };
  }

  async getUserCompanyRole(userId: number) {
    const userCompanyRole = await this.prisma.sys_UserCompanyRole.findFirst({
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
    return userCompanyRole;
  }

  async validateGoogleUser(googleUser: Sys_CreateGoogleUserDto) {
    // Cek apakah email ada dalam whitelist
    await this.whiteListEmailService.validateEmailForAuth(googleUser.email);

    const user = await this.sys_userService.findByEmail(googleUser.email);
    if (user) return user;
    return await this.sys_userService.createGoogleUser(googleUser);
  }

  async signOut(id: number) {
    return await this.sys_userService.updateHashedRefreshToken(id, null);
  }

  async resetPasswordByEmail(email: string, newPassword: string) {
    // Validasi whitelist email juga untuk reset
    await this.whiteListEmailService.validateEmailForAuth(email);
    const user = await this.sys_userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User has not been registered');
    }
    await this.sys_userService.updatePasswordByEmail(email, newPassword);
    return { message: 'Password updated successfully' };
  }
}
