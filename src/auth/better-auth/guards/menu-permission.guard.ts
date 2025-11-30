import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../../prisma.service';
import { MENU_PERMISSION_KEY, MenuPermissionOptions } from '../decorators/menu-permission.decorator';

@Injectable()
export class MenuPermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Get menu permission options from decorator
    const options = this.reflector.getAllAndOverride<MenuPermissionOptions>(
      MENU_PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no menu permission required, allow access
    if (!options || !options.menuIds || options.menuIds.length === 0) {
      return true;
    }

    const { menuIds, requireAll = false, permission = 'view' } = options;

    // Get user's UserCompanyRole
    const userCompanyRole = await this.prisma.sys_UserCompanyRole.findFirst({
      where: {
        userRole: {
          user_id: user.id,
        },
        company_id: user.company_id || undefined,
        iStatus: 'Active',
      },
      include: {
        permissions: {
          where: {
            menu_id: { in: menuIds },
            iStatus: 'Active',
          },
        },
      },
    });

    if (!userCompanyRole) {
      throw new ForbiddenException(
        'User does not have a valid company role',
      );
    }

    // Check if user has permission for the required menus
    const hasPermission = this.checkMenuPermission(
      userCompanyRole.permissions,
      menuIds,
      requireAll,
      permission,
    );

    if (!hasPermission) {
      const menuList = menuIds.join(', ');
      throw new ForbiddenException(
        `Access denied. Required ${permission} permission for menu(s): ${menuList}`,
      );
    }

    return true;
  }

  private checkMenuPermission(
    permissions: Array<{
      menu_id: number;
      can_view: boolean;
      can_create: boolean;
      can_edit: boolean;
      can_delete: boolean;
      can_print: boolean;
      can_approve: boolean;
    }>,
    requiredMenuIds: number[],
    requireAll: boolean,
    permission: string,
  ): boolean {
    // Map permission string to field name
    const permissionFieldMap: Record<string, keyof typeof permissions[0]> = {
      view: 'can_view',
      create: 'can_create',
      edit: 'can_edit',
      delete: 'can_delete',
      print: 'can_print',
      approve: 'can_approve',
    };

    const permissionField = permissionFieldMap[permission] || 'can_view';

    if (requireAll) {
      // User must have permission for ALL required menus
      return requiredMenuIds.every((menuId) => {
        const perm = permissions.find((p) => p.menu_id === menuId);
        return perm && perm[permissionField] === true;
      });
    } else {
      // User must have permission for AT LEAST ONE of the required menus
      return requiredMenuIds.some((menuId) => {
        const perm = permissions.find((p) => p.menu_id === menuId);
        return perm && perm[permissionField] === true;
      });
    }
  }
}









