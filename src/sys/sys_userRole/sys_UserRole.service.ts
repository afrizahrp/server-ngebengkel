import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Sys_CreateUserRoleDto } from './dto/sys_CreateUserRole.dto';
import { Sys_UpdateUserRoleDto } from './dto/sys_UpdateUserRole.dto';
import { Sys_ResponseUserRoleDto } from './dto/sys_ResponseUserRole.dto';
import { generateIncrementId } from '../../utils/generateIncrementId';

@Injectable()
export class Sys_UserRoleService {
  constructor(private prisma: PrismaService) {}

  async create(
    createUserRoleDto: Sys_CreateUserRoleDto,
  ): Promise<Sys_ResponseUserRoleDto> {
    // Check if user exists
    const user = await this.prisma.sys_User.findUnique({
      where: { id: createUserRoleDto.user_id },
    });
    if (!user) {
      throw new NotFoundException(
        `User with ID ${createUserRoleDto.user_id} not found`,
      );
    }

    // Check if role exists
    const role = await this.prisma.sys_Role.findUnique({
      where: { id: createUserRoleDto.role_id },
    });
    if (!role) {
      throw new NotFoundException(
        `Role with ID ${createUserRoleDto.role_id} not found`,
      );
    }

    // Check if user-role combination already exists
    const existingUserRole = await this.prisma.sys_UserRole.findFirst({
      where: {
        user_id: createUserRoleDto.user_id,
        role_id: createUserRoleDto.role_id,
      },
    });
    if (existingUserRole) {
      throw new ConflictException(`User already has this role assigned`);
    }

    const newId = await generateIncrementId(this.prisma, 'sys_UserRole');

    const userRole = await this.prisma.sys_UserRole.create({
      data: {
        id: newId,
        ...createUserRoleDto,
        iStatus: createUserRoleDto.iStatus || 'Active',
      },
      include: {
        role: true,
        user: true,
        userCompanies: {
          include: {
            company: true,
          },
        },
      },
    });

    return this.mapToResponseDto(userRole);
  }

  async findAll(): Promise<Sys_ResponseUserRoleDto[]> {
    const userRoles = await this.prisma.sys_UserRole.findMany({
      include: {
        role: true,
        user: true,
        userCompanies: {
          include: {
            company: true,
          },
        },
      },
    });

    return userRoles.map(this.mapToResponseDto);
  }

  async findByUserId(user_id: number): Promise<Sys_ResponseUserRoleDto[]> {
    const userRoles = await this.prisma.sys_UserRole.findMany({
      where: { user_id },
      include: {
        role: true,
        user: true,
        userCompanies: {
          include: {
            company: true,
          },
        },
      },
    });

    return userRoles.map(this.mapToResponseDto);
  }

  async findByRoleId(role_id: string): Promise<Sys_ResponseUserRoleDto[]> {
    const userRoles = await this.prisma.sys_UserRole.findMany({
      where: { role_id },
      include: {
        role: true,
        user: true,
        userCompanies: {
          include: {
            company: true,
          },
        },
      },
    });

    return userRoles.map(this.mapToResponseDto);
  }

  async findOne(id: number): Promise<Sys_ResponseUserRoleDto> {
    const userRole = await this.prisma.sys_UserRole.findUnique({
      where: { id },
      include: {
        role: true,
        user: true,
        userCompanies: {
          include: {
            company: true,
          },
        },
      },
    });

    if (!userRole) {
      throw new NotFoundException(`UserRole with ID ${id} not found`);
    }

    return this.mapToResponseDto(userRole);
  }

  async update(
    id: number,
    updateUserRoleDto: Sys_UpdateUserRoleDto,
  ): Promise<Sys_ResponseUserRoleDto> {
    const userRole = await this.prisma.sys_UserRole.findUnique({
      where: { id },
    });

    if (!userRole) {
      throw new NotFoundException(`UserRole with ID ${id} not found`);
    }

    // If updating user_id or role_id, check for conflicts
    if (updateUserRoleDto.user_id || updateUserRoleDto.role_id) {
      const userId = updateUserRoleDto.user_id || userRole.user_id;
      const roleId = updateUserRoleDto.role_id || userRole.role_id;

      const existingUserRole = await this.prisma.sys_UserRole.findFirst({
        where: {
          user_id: userId,
          role_id: roleId,
          id: { not: id },
        },
      });

      if (existingUserRole) {
        throw new ConflictException(`User already has this role assigned`);
      }
    }

    const updatedUserRole = await this.prisma.sys_UserRole.update({
      where: { id },
      data: updateUserRoleDto,
      include: {
        role: true,
        user: true,
        userCompanies: {
          include: {
            company: true,
          },
        },
      },
    });

    return this.mapToResponseDto(updatedUserRole);
  }

  async remove(id: number): Promise<void> {
    const userRole = await this.prisma.sys_UserRole.findUnique({
      where: { id },
    });

    if (!userRole) {
      throw new NotFoundException(`UserRole with ID ${id} not found`);
    }

    // Check if userRole has any company assignments
    const userCompanies = await this.prisma.sys_UserCompanyRole.findMany({
      where: { userRole_id: id },
    });

    if (userCompanies.length > 0) {
      throw new ConflictException(
        `Cannot delete UserRole with existing company assignments. Please remove company assignments first.`,
      );
    }

    await this.prisma.sys_UserRole.delete({
      where: { id },
    });
  }

  private mapToResponseDto(userRole: any): Sys_ResponseUserRoleDto {
    return {
      id: userRole.id,
      user_id: userRole.user_id,
      role_id: userRole.role_id,
      iStatus: userRole.iStatus,
      isDefault: userRole.isDefault,
      role: userRole.role
        ? {
            id: userRole.role.id,
            name: userRole.role.name,
          }
        : undefined,
      user: userRole.user
        ? {
            id: userRole.user.id,
            name: userRole.user.name,
            email: userRole.user.email,
          }
        : undefined,
      userCompanies: userRole.userCompanies?.map((uc: any) => ({
        id: uc.id,
        company_id: uc.company_id,
        branch_id: uc.branch_id,
        iStatus: uc.iStatus,
        isDefault: uc.isDefault,
      })),
    };
  }
}
