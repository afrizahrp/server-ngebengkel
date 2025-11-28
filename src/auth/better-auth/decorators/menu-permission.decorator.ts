import { SetMetadata } from '@nestjs/common';

export const MENU_PERMISSION_KEY = 'menu_permission';

export interface MenuPermissionOptions {
  menuIds: number[];
  requireAll?: boolean; // Jika true, user harus punya akses ke SEMUA menu. Jika false, cukup salah satu.
  permission?: 'view' | 'create' | 'edit' | 'delete' | 'print' | 'approve'; // Default: 'view'
}

/**
 * Decorator untuk mengecek permission user terhadap menu tertentu
 * 
 * @example
 * // User harus punya akses view ke menu 18, 19, 20, atau 21
 * @MenuPermission({ menuIds: [18, 19, 20, 21] })
 * 
 * @example
 * // User harus punya akses create ke menu 18 DAN 19 (requireAll: true)
 * @MenuPermission({ menuIds: [18, 19], requireAll: true, permission: 'create' })
 */
export const MenuPermission = (options: MenuPermissionOptions) =>
  SetMetadata(MENU_PERMISSION_KEY, options);



