import { PrismaClient } from '@prisma/client';
import { hash } from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting users seed...');
  console.log(
    '📦 Seeding: 4 Non-Admin Users, 2 Roles, UserRoles, UserCompanyRoles',
  );

  const company_id = 'NGB';
  const branch_id = 'MAIN';

  // Check if company exists
  const company = await prisma.sys_Company.findUnique({
    where: { id: company_id },
  });

  if (!company) {
    console.log('❌ Company not found. Please create company first.');
    return;
  }

  console.log(`✅ Found company: ${company.name}`);

  // Check if branch exists
  const branches = await prisma.sys_Branch.findMany({
    where: { id: branch_id, company_id },
  });

  const branch = branches.length > 0 ? branches[0] : null;

  if (!branch) {
    console.log('❌ Branch not found. Please create branch first.');
    return;
  }

  console.log(`✅ Found branch: ${branch.name}`);

  // Use transaction to ensure all or nothing
  await prisma.$transaction(
    async (tx) => {
      let seedCount = 0;

      // ============================================================
      // 1. SEED ROLES (non-admin)
      // ============================================================
      console.log('\n📦 Creating roles...');

      const roles = await Promise.all([
        tx.sys_Role.upsert({
          where: { id: 'MANAGER' },
          update: {},
          create: {
            id: 'MANAGER',
            name: 'Manager',
            iStatus: 'Active',
            remarks: 'Role untuk manager',
            company_id: null,
            branch_id: null,
          },
        }),
        tx.sys_Role.upsert({
          where: { id: 'MECHANIC' },
          update: {},
          create: {
            id: 'MECHANIC',
            name: 'Mekanik',
            iStatus: 'Active',
            remarks: 'Role untuk mekanik',
            company_id: null,
            branch_id: null,
          },
        }),
      ]);
      seedCount += roles.length;
      console.log(`   ✅ Created ${roles.length} roles`);

      // ============================================================
      // 2. SEED USERS (non-admin)
      // ============================================================
      console.log('\n📦 Creating users...');

      // Hash password untuk semua user (default: password123)
      const hashedPassword = await hash('password123');

      const users = await Promise.all([
        tx.sys_User.upsert({
          where: { email: 'budi@example.com' },
          update: {},
          create: {
            name: 'Budi Santoso',
            email: 'budi@example.com',
            emailVerified: true,
            emailVerifiedAt: new Date(),
            isAdmin: false,
            iStatus: 'Active',
            password: hashedPassword,
            employee_id: 'EMP001',
            company_id,
            branch_id,
          },
        }),
        tx.sys_User.upsert({
          where: { email: 'siti@example.com' },
          update: {},
          create: {
            name: 'Siti Nurhaliza',
            email: 'siti@example.com',
            emailVerified: true,
            emailVerifiedAt: new Date(),
            isAdmin: false,
            iStatus: 'Active',
            password: hashedPassword,
            employee_id: 'EMP002',
            company_id,
            branch_id,
          },
        }),
        tx.sys_User.upsert({
          where: { email: 'ahmad@example.com' },
          update: {},
          create: {
            name: 'Ahmad Dahlan',
            email: 'ahmad@example.com',
            emailVerified: true,
            emailVerifiedAt: new Date(),
            isAdmin: false,
            iStatus: 'Active',
            password: hashedPassword,
            employee_id: 'EMP003',
            company_id,
            branch_id,
          },
        }),
        tx.sys_User.upsert({
          where: { email: 'rahma@example.com' },
          update: {},
          create: {
            name: 'Rahma Widya',
            email: 'rahma@example.com',
            emailVerified: true,
            emailVerifiedAt: new Date(),
            isAdmin: false,
            iStatus: 'Active',
            password: hashedPassword,
            employee_id: 'EMP004',
            company_id,
            branch_id,
          },
        }),
      ]);
      seedCount += users.length;
      console.log(`   ✅ Created ${users.length} users`);

      // ============================================================
      // 3. SEED USER ROLES
      // ============================================================
      console.log('\n📦 Creating user roles...');

      // Get user IDs (they are auto-increment integers)
      const [budi, siti, ahmad, rahma] = users;

      const userRoles = await Promise.all([
        tx.sys_UserRole.upsert({
          where: { user_id_role_id: { user_id: budi.id, role_id: 'MANAGER' } },
          update: {},
          create: {
            user_id: budi.id,
            role_id: 'MANAGER',
            iStatus: 'Active',
            isDefault: true,
            company_id,
            branch_id,
          },
        }),
        tx.sys_UserRole.upsert({
          where: { user_id_role_id: { user_id: siti.id, role_id: 'MANAGER' } },
          update: {},
          create: {
            user_id: siti.id,
            role_id: 'MANAGER',
            iStatus: 'Active',
            isDefault: true,
            company_id,
            branch_id,
          },
        }),
        tx.sys_UserRole.upsert({
          where: {
            user_id_role_id: { user_id: ahmad.id, role_id: 'MECHANIC' },
          },
          update: {},
          create: {
            user_id: ahmad.id,
            role_id: 'MECHANIC',
            iStatus: 'Active',
            isDefault: true,
            company_id,
            branch_id,
          },
        }),
        tx.sys_UserRole.upsert({
          where: {
            user_id_role_id: { user_id: rahma.id, role_id: 'MANAGER' },
          },
          update: {},
          create: {
            user_id: rahma.id,
            role_id: 'MANAGER',
            iStatus: 'Active',
            isDefault: true,
            company_id,
            branch_id,
          },
        }),
      ]);
      seedCount += userRoles.length;
      console.log(`   ✅ Created ${userRoles.length} user roles`);

      // ============================================================
      // 4. SEED USER COMPANY ROLES
      // ============================================================
      console.log('\n📦 Creating user company roles...');

      const userCompanyRoles = await Promise.all([
        tx.sys_UserCompanyRole.upsert({
          where: {
            userRole_id_company_id: {
              userRole_id: userRoles[0].id,
              company_id,
            },
          },
          update: {},
          create: {
            userRole_id: userRoles[0].id,
            company_id,
            branch_id,
            iStatus: 'Active',
            isDefault: true,
          },
        }),
        tx.sys_UserCompanyRole.upsert({
          where: {
            userRole_id_company_id: {
              userRole_id: userRoles[1].id,
              company_id,
            },
          },
          update: {},
          create: {
            userRole_id: userRoles[1].id,
            company_id,
            branch_id,
            iStatus: 'Active',
            isDefault: true,
          },
        }),
        tx.sys_UserCompanyRole.upsert({
          where: {
            userRole_id_company_id: {
              userRole_id: userRoles[2].id,
              company_id,
            },
          },
          update: {},
          create: {
            userRole_id: userRoles[2].id,
            company_id,
            branch_id,
            iStatus: 'Active',
            isDefault: true,
          },
        }),
        tx.sys_UserCompanyRole.upsert({
          where: {
            userRole_id_company_id: {
              userRole_id: userRoles[3].id,
              company_id,
            },
          },
          update: {},
          create: {
            userRole_id: userRoles[3].id,
            company_id,
            branch_id,
            iStatus: 'Active',
            isDefault: true,
          },
        }),
      ]);
      seedCount += userCompanyRoles.length;
      console.log(
        `   ✅ Created ${userCompanyRoles.length} user company roles`,
      );

      console.log('\n✅ ✅ ✅ USERS SEED COMPLETED! ✅ ✅ ✅');
      console.log(`\n📊 Summary: ${seedCount} records created`);
      console.log(`   • ${roles.length} roles`);
      console.log(`   • ${users.length} users`);
      console.log(`   • ${userRoles.length} user roles`);
      console.log(`   • ${userCompanyRoles.length} user company roles`);
      console.log(`   • Company ID: ${company_id}`);
      console.log(`   • Branch ID: ${branch_id}`);
      console.log('\n🔐 Default password for all users: password123');
    },
    {
      maxWait: 5000,
      timeout: 10000,
    },
  );
}

main()
  .catch((e) => {
    console.error('❌ Error seeding users:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
