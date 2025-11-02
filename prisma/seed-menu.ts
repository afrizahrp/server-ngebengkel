import { PrismaClient, sys_Menu, sys_Menu_Permission } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting menu seed...');
  console.log(
    '📦 Seeding: Beranda, Pemesanan, Perbaikan, Pengingat menus with permissions',
  );

  // ============================================================
  // 1. GET USER COMPANY ROLE ID FROM USER ROLE ID
  // ============================================================

  const userRole_id = 1;

  // Find all userCompanyRole records with the given userRole_id
  const userCompanyRoles = await prisma.sys_UserCompanyRole.findMany({
    where: {
      userRole_id: userRole_id,
      iStatus: 'Active',
    },
  });

  if (userCompanyRoles.length === 0) {
    console.log(
      `❌ No active UserCompanyRole found for userRole_id = ${userRole_id}`,
    );
    console.log(
      '⚠️  Please ensure userRole_id exists and has associated UserCompanyRole records',
    );
    return;
  }

  console.log(
    `✅ Found ${userCompanyRoles.length} UserCompanyRole(s) for userRole_id = ${userRole_id}`,
  );

  // Use the first active userCompanyRole (or you can create permissions for all)
  const targetUserCompanyRoleId = userCompanyRoles[0].id;
  console.log(`📌 Using userCompanyRole_id = ${targetUserCompanyRoleId}`);

  // ============================================================
  // 2. CLEANUP EXISTING MENUS (Hapus menu yang akan dibuat ulang)
  // ============================================================

  console.log('\n🧹 Cleaning up existing menus and permissions...');

  // Daftar menu yang akan dihapus (berdasarkan href atau description)
  const menusToDelete = [
    '/dashboard',
    '/booking',
    '/booking/calendar',
    '/service-order',
    '/service-order/history',
    '/reminder',
    '/reminder/settings',
    '/settings/users',
    '/settings/app',
  ];

  // Temukan ID menu yang akan dihapus untuk menghapus permission terlebih dahulu
  const menusToDeleteList = await prisma.sys_Menu.findMany({
    where: {
      OR: [
        { href: { in: menusToDelete } },
        {
          menu_description: {
            in: [
              'Beranda',
              'Dashboard',
              'Pemesanan',
              'Jadwal & Booking',
              'Booking',
              'Perbaikan',
              'Service',
              'Pengingat',
              'Reminder',
              'Promosi',
              'Pengaturan',
            ],
          },
          href: null,
        },
      ],
    },
    select: { id: true },
  });

  const menuIdsToDelete = menusToDeleteList.map((m) => m.id);

  // Hapus permission dulu (untuk menghindari foreign key constraint)
  if (menuIdsToDelete.length > 0) {
    await prisma.sys_Menu_Permission.deleteMany({
      where: {
        menu_id: { in: menuIdsToDelete },
      },
    });
    console.log(`   Deleted ${menuIdsToDelete.length} menu permissions`);
  }

  // Hapus submenu dulu (untuk menghindari foreign key constraint)
  for (const href of menusToDelete) {
    await prisma.sys_Menu.deleteMany({
      where: {
        href: href,
      },
    });
  }

  // Hapus parent menu
  await prisma.sys_Menu.deleteMany({
    where: {
      menu_description: {
        in: [
          'Beranda',
          'Dashboard',
          'Pemesanan',
          'Jadwal & Booking',
          'Booking',
          'Perbaikan',
          'Service',
          'Pengingat',
          'Reminder',
        ],
      },
      href: null,
    },
  });

  console.log('✅ Cleanup completed');

  // ============================================================
  // 3. HELPER FUNCTION TO CREATE MENU WITH SPECIFIC ID
  // ============================================================

  async function createMenuWithId(
    id: number,
    description: string,
    href: string | null,
    moduleId: string,
    menuType: string,
    parentId: number | null = null,
    icon: string | null = null,
    hasChild: boolean = false,
  ): Promise<sys_Menu> {
    const menu = await prisma.sys_Menu.create({
      data: {
        id: id,
        parent_id: parentId,
        menu_description: description,
        href: href,
        module_id: moduleId,
        menu_type: menuType,
        has_child: hasChild,
        icon: icon,
        iStatus: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log(`✅ Created menu: ${description} (ID: ${menu.id})`);
    return menu;
  }

  // ============================================================
  // 4. INSERT MENUS (Parent dulu, kemudian child dengan urutan ID yang benar)
  // ============================================================

  console.log('\n📦 Creating menus with sequential IDs...');

  // Menu 1: Beranda (Dashboard) - Bahasa sehari-hari
  const dashboardMenu = await createMenuWithId(
    1,
    'Beranda',
    '/dashboard',
    'SYS',
    'menu',
    null,
    'Home',
    false,
  );

  // Menu 2: Pemesanan (Booking) - Parent dengan bahasa sehari-hari
  const bookingParentMenu = await createMenuWithId(
    2,
    'Pemesanan',
    null,
    'WKS',
    'menu',
    null,
    'Calendar',
    true,
  );

  // Menu 3: Daftar Pemesanan (Child dari Pemesanan)
  const bookingListMenu = await createMenuWithId(
    3,
    'Daftar Pemesanan',
    '/booking',
    'WKS',
    'submenu',
    2, // parent_id = Pemesanan
    'List',
    false,
  );

  // Menu 4: Kalender Pemesanan (Child dari Pemesanan)
  const bookingCalendarMenu = await createMenuWithId(
    4,
    'Kalender Pemesanan',
    '/booking/calendar',
    'WKS',
    'submenu',
    2, // parent_id = Pemesanan
    'CalendarDays',
    false,
  );

  // Menu 5: Perbaikan (Service) - Parent dengan bahasa sehari-hari
  const serviceParentMenu = await createMenuWithId(
    5,
    'Perbaikan',
    null,
    'WKS',
    'menu',
    null,
    'Wrench',
    true,
  );

  // Menu 6: Daftar Perbaikan (Child dari Perbaikan)
  const serviceOrderMenu = await createMenuWithId(
    6,
    'Daftar Perbaikan',
    '/service-order',
    'WKS',
    'submenu',
    5, // parent_id = Perbaikan
    'FileText',
    false,
  );

  // Menu 7: Riwayat Perbaikan (Child dari Perbaikan)
  const serviceHistoryMenu = await createMenuWithId(
    7,
    'Riwayat Perbaikan',
    '/service-order/history',
    'WKS',
    'submenu',
    5, // parent_id = Perbaikan
    'History',
    false,
  );

  // Menu 8: Pengingat (Reminder) - Parent dengan bahasa sehari-hari
  const reminderParentMenu = await createMenuWithId(
    8,
    'Pengingat',
    null,
    'SYS',
    'menu',
    null,
    'AlarmClock',
    true,
  );

  // Menu 9: Daftar Pengingat (Child dari Pengingat)
  const reminderListMenu = await createMenuWithId(
    9,
    'Daftar Pengingat',
    '/reminder',
    'SYS',
    'submenu',
    8, // parent_id = Pengingat
    'List',
    false,
  );

  // Menu 10: Atur Pengingat (Child dari Pengingat)
  const reminderSettingsMenu = await createMenuWithId(
    10,
    'Atur Pengingat',
    '/reminder/settings',
    'SYS',
    'submenu',
    8, // parent_id = Pengingat
    'Settings',
    false,
  );

  // Menu 11: Promosi - Parent dengan bahasa sehari-hari
  const promotionParentMenu = await createMenuWithId(
    11,
    'Promosi',
    null,
    'SYS',
    'menu',
    null,
    'Tag',
    false,
  );

  // Menu 12: Pengaturan - Parent dengan bahasa sehari-hari
  const settingsParentMenu = await createMenuWithId(
    12,
    'Pengaturan',
    null,
    'SYS',
    'menu',
    null,
    'Settings',
    true,
  );

  // Menu 13: Pengguna (Child dari Pengaturan)
  const userSettingsMenu = await createMenuWithId(
    13,
    'Pengguna',
    '/settings/users',
    'SYS',
    'submenu',
    12, // parent_id = Pengaturan
    'Users',
    false,
  );

  // Menu 14: Aplikasi (Child dari Pengaturan)
  const appSettingsMenu = await createMenuWithId(
    14,
    'Aplikasi',
    '/settings/app',
    'SYS',
    'submenu',
    12, // parent_id = Pengaturan
    'Sliders',
    false,
  );

  const allMenus = [
    dashboardMenu,
    bookingParentMenu,
    bookingListMenu,
    bookingCalendarMenu,
    serviceParentMenu,
    serviceOrderMenu,
    serviceHistoryMenu,
    reminderParentMenu,
    reminderListMenu,
    reminderSettingsMenu,
    promotionParentMenu,
    settingsParentMenu,
    userSettingsMenu,
    appSettingsMenu,
  ];

  console.log(`\n✅ Created ${allMenus.length} menus total`);
  console.log('📝 Using user-friendly menu names in Indonesian');

  // ============================================================
  // 5. INSERT MENU PERMISSIONS
  // ============================================================

  console.log('\n📦 Creating menu permissions...');

  const permissions: sys_Menu_Permission[] = [];

  for (const menu of allMenus) {
    // Check if permission already exists
    const existingPermission = await prisma.sys_Menu_Permission.findUnique({
      where: {
        userCompanyRole_id_menu_id: {
          userCompanyRole_id: targetUserCompanyRoleId,
          menu_id: menu.id,
        },
      },
    });

    if (existingPermission) {
      console.log(
        `⏭️  Permission already exists for menu: ${menu.menu_description} (ID: ${menu.id})`,
      );

      // Update permission if needed (grant all permissions)
      const updatedPermission = await prisma.sys_Menu_Permission.update({
        where: { id: existingPermission.id },
        data: {
          can_view: true,
          can_create: true,
          can_edit: true,
          can_delete: true,
          can_print: true,
          can_approve: true,
          iStatus: 'Active',
          updatedAt: new Date(),
        },
      });

      permissions.push(updatedPermission);
      console.log(
        `✅ Updated permission for menu: ${menu.menu_description} (Permission ID: ${updatedPermission.id})`,
      );
      continue;
    }

    // Get next permission ID
    const lastPermission = await prisma.sys_Menu_Permission.findFirst({
      orderBy: { id: 'desc' },
    });
    const nextPermissionId = lastPermission ? lastPermission.id + 1 : 1;

    const permission = await prisma.sys_Menu_Permission.create({
      data: {
        id: nextPermissionId,
        userCompanyRole_id: targetUserCompanyRoleId,
        menu_id: menu.id,
        can_view: true,
        can_create: true,
        can_edit: true,
        can_delete: true,
        can_print: true,
        can_approve: true,
        iStatus: 'Active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    permissions.push(permission);
    console.log(
      `✅ Created permission for menu: ${menu.menu_description} (Menu ID: ${menu.id}, Permission ID: ${permission.id})`,
    );
  }

  // ============================================================
  // SUMMARY
  // ============================================================

  console.log('\n✅ ✅ ✅ MENU SEED COMPLETED! ✅ ✅ ✅');
  console.log('\n📊 Summary:');
  console.log(`   • ${allMenus.length} menus created/updated`);
  console.log(`   • ${permissions.length} permissions created`);
  console.log(`   • UserRole ID: ${userRole_id}`);
  console.log(`   • UserCompanyRole ID: ${targetUserCompanyRoleId}`);
  console.log('\n📋 Menu List:');
  allMenus.forEach((menu) => {
    console.log(
      `   - ${menu.menu_description} (ID: ${menu.id}, Parent: ${menu.parent_id || 'None'})`,
    );
  });
}

main()
  .catch((e) => {
    console.error('❌ Error seeding menus:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
