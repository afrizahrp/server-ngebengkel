import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../../prisma.service';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class BetterRolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // Always allow OPTIONS requests (CORS preflight)
    if (request.method === 'OPTIONS') {
      return true;
    }

    // Use getAllAndOverride to get roles from handler first, then class if handler doesn't have it
    // This should properly merge both levels
    const handler = context.getHandler();
    const controller = context.getClass();
    
    // Get roles from both handler and class level
    const handlerRoles = this.reflector.get<string[]>(ROLES_KEY, handler);
    const classRoles = this.reflector.get<string[]>(ROLES_KEY, controller);
    
    // Helper function to flatten and normalize roles
    const normalizeRoles = (roles: any): string[] => {
      if (!roles) return [];
      if (Array.isArray(roles)) {
        // Flatten nested arrays and convert to strings
        return roles.flat().map(r => {
          if (Array.isArray(r)) return r.map(s => String(s).trim());
          return String(r).trim();
        }).flat();
      }
      return [String(roles).trim()];
    };
    
    // Normalize roles from both sources
    const handlerRolesArray = normalizeRoles(handlerRoles);
    const classRolesArray = normalizeRoles(classRoles);
    
    // Merge both: combine all roles from class and handler
    const allRoles = [...classRolesArray, ...handlerRolesArray];
    
    // Remove duplicates and filter empty strings
    const requiredRoles = Array.from(
      new Set(
        allRoles
          .filter(Boolean)
          .filter(role => role.length > 0)
      )
    );
    
    // console.log('[BetterRolesGuard] Handler:', handler?.name);
    // console.log('[BetterRolesGuard] Controller:', controller?.name);
    // console.log('[BetterRolesGuard] Handler Roles (raw):', handlerRoles);
    // console.log('[BetterRolesGuard] Class Roles (raw):', classRoles);
    // console.log('[BetterRolesGuard] Final Required Roles:', requiredRoles);

    if (requiredRoles.length === 0) {
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

    // Trim role ID from database to handle any whitespace issues
    const userRoleId = userCompanyRole.userRole.role.id.trim();
    // Compare with trimmed required roles (already trimmed above)
    const hasRequiredRole = requiredRoles.includes(userRoleId);

    // console.log('[BetterRolesGuard] User:', user.id);
    // console.log('[BetterRolesGuard] User Role:', userRoleId);
    // console.log('[BetterRolesGuard] Required Roles:', requiredRoles);
    // console.log('[BetterRolesGuard] Has required role:', hasRequiredRole);

    return hasRequiredRole;
  }
}
