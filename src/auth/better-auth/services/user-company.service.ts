import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { generateIncrementId } from '../../../utils/generateIncrementId';
import { UserCompanyInfo } from '../types/auth.types';

@Injectable()
export class UserCompanyService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get user companies dengan role info
   */
  async getUserCompaniesWithRoles(userId: number) {
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
   * Get user dengan company info
   */
  async getUserWithCompanies(userId: number) {
    const user = await this.prisma.sys_User.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return null;
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

  /**
   * Assign default company & role ke user baru
   */
  async assignDefaultCompanyRole(userId: number): Promise<void> {
    // Get default company
    const defaultCompany = await this.prisma.sys_Company.findFirst({
      where: { iStatus: 'Active' },
    });

    if (!defaultCompany) {
      throw new ConflictException('No active company found');
    }

    // Get default role (USER)
    const defaultRole = await this.prisma.sys_Role.findFirst({
      where: {
        iStatus: 'Active',
        id: 'USER',
      },
    });

    if (!defaultRole) {
      throw new ConflictException(
        'USER role not found. Please create USER role first.',
      );
    }

    // Create or get user role
    let userRole = await this.prisma.sys_UserRole.findFirst({
      where: {
        user_id: userId,
        role_id: defaultRole.id.trim(),
      },
    });

    if (!userRole) {
      const userRoleId = await generateIncrementId(this.prisma, 'sys_UserRole');

      userRole = await this.prisma.sys_UserRole.create({
        data: {
          id: userRoleId,
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

  /**
   * Format user companies untuk response
   */
  formatCompanies(userCompanies: any[]): UserCompanyInfo[] {
    return userCompanies.map((c) => ({
      company_id: c.company_id.trim(),
      branch_id: c.branch_id.trim(),
      role_id: c.userRole.role_id.trim(),
      role_name: c.userRole.role.name,
    }));
  }

  /**
   * Get atau assign default company untuk user
   */
  async getOrAssignDefaultCompanies(userId: number) {
    let userCompanies = await this.getUserCompaniesWithRoles(userId);

    if (userCompanies.length === 0) {
      await this.assignDefaultCompanyRole(userId);
      userCompanies = await this.getUserCompaniesWithRoles(userId);
    }

    return userCompanies;
  }
}
