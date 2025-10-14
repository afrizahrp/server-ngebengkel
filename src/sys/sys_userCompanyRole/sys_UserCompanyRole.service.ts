import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Sys_CreateUserCompanyRoleDto } from './dto/sys_CreateUserCompanyRole.dto';
import { Sys_UpdateUserCompanyRoleDto } from './dto/sys_UpdateUserCompanyRole.dto';
import { Sys_ResponseUserCompanyRoleDto } from './dto/sys_ResponseUserCompanyRole.dto';

@Injectable()
export class Sys_UserCompanyRoleService {
  constructor(private prisma: PrismaService) {}

  async create(
    createUserCompanyRoleDto: Sys_CreateUserCompanyRoleDto,
  ): Promise<Sys_ResponseUserCompanyRoleDto> {
    // Check if userRole exists
    const userRole = await this.prisma.sys_UserRole.findUnique({
      where: { id: createUserCompanyRoleDto.userRole_id },
    });
    if (!userRole) {
      throw new NotFoundException(
        `UserRole with ID ${createUserCompanyRoleDto.userRole_id} not found`,
      );
    }

    // Check if company exists
    const company = await this.prisma.sys_Company.findUnique({
      where: { id: createUserCompanyRoleDto.company_id },
    });
    if (!company) {
      throw new NotFoundException(
        `Company with ID ${createUserCompanyRoleDto.company_id} not found`,
      );
    }

    // Check if userRole-company combination already exists
    const existingUserCompanyRole =
      await this.prisma.sys_UserCompanyRole.findFirst({
        where: {
          userRole_id: createUserCompanyRoleDto.userRole_id,
          company_id: createUserCompanyRoleDto.company_id,
        },
      });
    if (existingUserCompanyRole) {
      throw new ConflictException(`UserRole already assigned to this company`);
    }

    const userCompanyRole = await this.prisma.sys_UserCompanyRole.create({
      data: {
        ...createUserCompanyRoleDto,
        iStatus: createUserCompanyRoleDto.iStatus || 'Active',
      },
      include: {
        userRole: {
          include: {
            role: true,
            user: true,
          },
        },
        company: true,
        permissions: true,
      },
    });

    return this.mapToResponseDto(userCompanyRole);
  }

  async findAll(): Promise<Sys_ResponseUserCompanyRoleDto[]> {
    const userCompanyRoles = await this.prisma.sys_UserCompanyRole.findMany({
      include: {
        userRole: {
          include: {
            role: true,
            user: true,
          },
        },
        company: true,
        permissions: true,
      },
    });

    return userCompanyRoles.map(this.mapToResponseDto);
  }

  async findByCompanyId(
    company_id: string,
  ): Promise<Sys_ResponseUserCompanyRoleDto[]> {
    const userCompanyRoles = await this.prisma.sys_UserCompanyRole.findMany({
      where: { company_id },
      include: {
        userRole: {
          include: {
            role: true,
            user: true,
          },
        },
        company: true,
        permissions: true,
      },
    });

    return userCompanyRoles.map(this.mapToResponseDto);
  }

  async findByUserRoleId(
    userRole_id: number,
  ): Promise<Sys_ResponseUserCompanyRoleDto[]> {
    const userCompanyRoles = await this.prisma.sys_UserCompanyRole.findMany({
      where: { userRole_id },
      include: {
        userRole: {
          include: {
            role: true,
            user: true,
          },
        },
        company: true,
        permissions: true,
      },
    });

    return userCompanyRoles.map(this.mapToResponseDto);
  }

  async findByUserId(
    user_id: number,
  ): Promise<Sys_ResponseUserCompanyRoleDto[]> {
    const userCompanyRoles = await this.prisma.sys_UserCompanyRole.findMany({
      where: {
        userRole: {
          user_id: user_id,
        },
      },
      include: {
        userRole: {
          include: {
            role: true,
            user: true,
          },
        },
        company: true,
        permissions: true,
      },
    });

    return userCompanyRoles.map(this.mapToResponseDto);
  }

  async findOne(id: number): Promise<Sys_ResponseUserCompanyRoleDto> {
    const userCompanyRole = await this.prisma.sys_UserCompanyRole.findUnique({
      where: { id },
      include: {
        userRole: {
          include: {
            role: true,
            user: true,
          },
        },
        company: true,
        permissions: true,
      },
    });

    if (!userCompanyRole) {
      throw new NotFoundException(`UserCompanyRole with ID ${id} not found`);
    }

    return this.mapToResponseDto(userCompanyRole);
  }

  async update(
    id: number,
    updateUserCompanyRoleDto: Sys_UpdateUserCompanyRoleDto,
  ): Promise<Sys_ResponseUserCompanyRoleDto> {
    const userCompanyRole = await this.prisma.sys_UserCompanyRole.findUnique({
      where: { id },
    });

    if (!userCompanyRole) {
      throw new NotFoundException(`UserCompanyRole with ID ${id} not found`);
    }

    // If updating userRole_id or company_id, check for conflicts
    if (
      updateUserCompanyRoleDto.userRole_id ||
      updateUserCompanyRoleDto.company_id
    ) {
      const userRoleId =
        updateUserCompanyRoleDto.userRole_id || userCompanyRole.userRole_id;
      const companyId =
        updateUserCompanyRoleDto.company_id || userCompanyRole.company_id;

      const existingUserCompanyRole =
        await this.prisma.sys_UserCompanyRole.findFirst({
          where: {
            userRole_id: userRoleId,
            company_id: companyId,
            id: { not: id },
          },
        });

      if (existingUserCompanyRole) {
        throw new ConflictException(
          `UserRole already assigned to this company`,
        );
      }
    }

    const updatedUserCompanyRole = await this.prisma.sys_UserCompanyRole.update(
      {
        where: { id },
        data: updateUserCompanyRoleDto,
        include: {
          userRole: {
            include: {
              role: true,
              user: true,
            },
          },
          company: true,
          permissions: true,
        },
      },
    );

    return this.mapToResponseDto(updatedUserCompanyRole);
  }

  async remove(id: number): Promise<void> {
    const userCompanyRole = await this.prisma.sys_UserCompanyRole.findUnique({
      where: { id },
    });

    if (!userCompanyRole) {
      throw new NotFoundException(`UserCompanyRole with ID ${id} not found`);
    }

    // Check if userCompanyRole has any permissions
    const permissions = await this.prisma.sys_Menu_Permission.findMany({
      where: { userCompanyRole_id: id },
    });

    if (permissions.length > 0) {
      throw new ConflictException(
        `Cannot delete UserCompanyRole with existing permissions. Please remove permissions first.`,
      );
    }

    await this.prisma.sys_UserCompanyRole.delete({
      where: { id },
    });
  }

  // Method untuk assign UserRole ke Company
  async assignUserRoleToCompany(
    userRole_id: number,
    company_id: string,
    branch_id: string,
    isDefault: boolean = false,
  ): Promise<Sys_ResponseUserCompanyRoleDto> {
    // Check if userRole exists
    const userRole = await this.prisma.sys_UserRole.findUnique({
      where: { id: userRole_id },
      include: { role: true, user: true },
    });
    if (!userRole) {
      throw new NotFoundException(`UserRole with ID ${userRole_id} not found`);
    }

    // Check if company exists
    const company = await this.prisma.sys_Company.findUnique({
      where: { id: company_id },
    });
    if (!company) {
      throw new NotFoundException(`Company with ID ${company_id} not found`);
    }

    // Check if already assigned
    const existingAssignment = await this.prisma.sys_UserCompanyRole.findFirst({
      where: {
        userRole_id: userRole_id,
        company_id: company_id,
      },
    });
    if (existingAssignment) {
      throw new ConflictException(`UserRole already assigned to this company`);
    }

    const userCompanyRole = await this.prisma.sys_UserCompanyRole.create({
      data: {
        userRole_id,
        company_id,
        branch_id,
        iStatus: 'Active',
        isDefault,
      },
      include: {
        userRole: {
          include: {
            role: true,
            user: true,
          },
        },
        company: true,
        permissions: true,
      },
    });

    return this.mapToResponseDto(userCompanyRole);
  }

  // Method untuk bulk assign multiple UserRoles ke Company
  async bulkAssignUserRolesToCompany(
    userRole_ids: number[],
    company_id: string,
    branch_id: string,
  ): Promise<Sys_ResponseUserCompanyRoleDto[]> {
    // Check if company exists
    const company = await this.prisma.sys_Company.findUnique({
      where: { id: company_id },
    });
    if (!company) {
      throw new NotFoundException(`Company with ID ${company_id} not found`);
    }

    // Check if all userRoles exist
    const userRoles = await this.prisma.sys_UserRole.findMany({
      where: { id: { in: userRole_ids } },
    });
    if (userRoles.length !== userRole_ids.length) {
      throw new NotFoundException(`Some UserRoles not found`);
    }

    // Check existing assignments
    const existingAssignments = await this.prisma.sys_UserCompanyRole.findMany({
      where: {
        userRole_id: { in: userRole_ids },
        company_id: company_id,
      },
    });

    if (existingAssignments.length > 0) {
      const existingIds = existingAssignments.map((ea) => ea.userRole_id);
      throw new ConflictException(
        `UserRoles with IDs ${existingIds.join(', ')} already assigned to this company`,
      );
    }

    // Create assignments
    const assignments = await Promise.all(
      userRole_ids.map((userRole_id, index) =>
        this.prisma.sys_UserCompanyRole.create({
          data: {
            userRole_id,
            company_id,
            branch_id,
            iStatus: 'Active',
            isDefault: index === 0, // First one as default
          },
          include: {
            userRole: {
              include: {
                role: true,
                user: true,
              },
            },
            company: true,
            permissions: true,
          },
        }),
      ),
    );

    return assignments.map(this.mapToResponseDto);
  }

  // Method untuk get available UserRoles untuk assign ke company
  async getAvailableUserRolesForCompany(company_id: string): Promise<any[]> {
    // Get all userRoles
    const allUserRoles = await this.prisma.sys_UserRole.findMany({
      where: { iStatus: 'Active' },
      include: {
        role: true,
        user: true,
        userCompanies: {
          where: { company_id: company_id },
        },
      },
    });

    // Filter yang belum di-assign ke company ini
    const availableUserRoles = allUserRoles
      .filter((userRole) => userRole.userCompanies.length === 0)
      .map((userRole) => ({
        id: userRole.id,
        user_id: userRole.user_id,
        role_id: userRole.role_id,
        user: {
          id: userRole.user.id,
          name: userRole.user.name,
          email: userRole.user.email,
        },
        role: {
          id: userRole.role.id,
          name: userRole.role.name,
        },
      }));

    return availableUserRoles;
  }

  private mapToResponseDto(
    userCompanyRole: any,
  ): Sys_ResponseUserCompanyRoleDto {
    return {
      id: userCompanyRole.id,
      userRole_id: userCompanyRole.userRole_id,
      company_id: userCompanyRole.company_id,
      branch_id: userCompanyRole.branch_id,
      iStatus: userCompanyRole.iStatus,
      isDefault: userCompanyRole.isDefault,
      userRole: userCompanyRole.userRole
        ? {
            id: userCompanyRole.userRole.id,
            user_id: userCompanyRole.userRole.user_id,
            role_id: userCompanyRole.userRole.role_id,
            role: userCompanyRole.userRole.role
              ? {
                  id: userCompanyRole.userRole.role.id,
                  name: userCompanyRole.userRole.role.name,
                }
              : undefined,
            user: userCompanyRole.userRole.user
              ? {
                  id: userCompanyRole.userRole.user.id,
                  name: userCompanyRole.userRole.user.name,
                  email: userCompanyRole.userRole.user.email,
                }
              : undefined,
          }
        : undefined,
      company: userCompanyRole.company
        ? {
            id: userCompanyRole.company.id,
            name: userCompanyRole.company.name,
          }
        : undefined,
      permissions: userCompanyRole.permissions?.map((perm: any) => ({
        id: perm.id,
        menu_id: perm.menu_id,
        can_view: perm.can_view,
        can_create: perm.can_create,
        can_edit: perm.can_edit,
        can_delete: perm.can_delete,
        can_print: perm.can_print,
        can_approve: perm.can_approve,
      })),
    };
  }
}
