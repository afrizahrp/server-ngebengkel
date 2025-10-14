import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../../prisma.service';
import { ROLES_KEY } from '../../decorators/roles.decorator';

@Injectable()
export class BetterRolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      console.log('[BetterRolesGuard] User not found in request');
      return false;
    }

    // Get user's company role
    const userCompanyRole = await this.prisma.sys_UserCompanyRole.findFirst({
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

    if (!userCompanyRole) {
      console.log('[BetterRolesGuard] Role not found for user:', user.id);
      return false;
    }

    const userRoleId = userCompanyRole.userRole.role.id.trim();
    const hasRequiredRole = requiredRoles.includes(userRoleId);

    console.log('[BetterRolesGuard] User:', user.id);
    console.log('[BetterRolesGuard] User Role:', userRoleId);
    console.log('[BetterRolesGuard] Required Roles:', requiredRoles);
    console.log('[BetterRolesGuard] Has required role:', hasRequiredRole);

    return hasRequiredRole;
  }
}
