import { PrismaClient } from '../lib/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // ============================================================================
  // 1. COMPANY & BRANCH
  // ============================================================================
  console.log('📍 Seeding Company...');

  const company = await prisma.sys_Company.upsert({
    where: { id: 'BIP' },
    update: {},
    create: {
      seq_no: 1,
      id: 'BIP',
      name: 'Bengkel Inovasi Prima',
      province: 'DKI Jakarta',
      district: 'Jakarta Selatan',
      city: 'Jakarta',
      address1: 'Jl. Raya Bengkel No. 123',
      postalCode: '12345',
      phone1: '021-1234567',
      mobile1: '081234567890',
      email1: 'info@bengelinnovasi.com',
      createdBy: 'SYSTEM',
      createdAt: new Date(),
      updatedBy: 'SYSTEM',
      updatedAt: new Date(),
    },
  });
  console.log('✅ Company created:', company.name);

  // ============================================================================
  // 2. ROLES
  // ============================================================================
  console.log('👥 Seeding Roles...');

  const adminRole = await prisma.sys_Role.upsert({
    where: { id: 'ADMIN' },
    update: {},
    create: {
      id: 'ADMIN',
      name: 'Administrator',
      iStatus: 'Active',
      remarks: 'Full access',
    },
  });

  const mechanicRole = await prisma.sys_Role.upsert({
    where: { id: 'MECHANIC' },
    update: {},
    create: {
      id: 'MECHANIC',
      name: 'Mekanik',
      iStatus: 'Active',
      remarks: 'Service technician',
    },
  });
  console.log('✅ Roles created');

  // ============================================================================
  // 3. USERS
  // ============================================================================
  console.log('👤 Seeding Users...');

  const adminUser = await prisma.sys_User.upsert({
    where: { email: 'admin@bengkel.com' },
    update: {},
    create: {
      id: 1,
      name: 'Admin Budi',
      email: 'admin@bengkel.com',
      password: '$2a$10$abcdefghijklmnopqrstuv', // hashed password (dummy)
      isAdmin: true,
      iStatus: 'Active',
    },
  });

  const mechanicUser = await prisma.sys_User.upsert({
    where: { email: 'andi@bengkel.com' },
    update: {},
    create: {
      id: 2,
      name: 'Andi Mekanik',
      email: 'andi@bengkel.com',
      password: '$2a$10$abcdefghijklmnopqrstuv',
      isAdmin: false,
      iStatus: 'Active',
    },
  });
  console.log('✅ Users created');

  // ============================================================================
  // 4. WAREHOUSE & LOCATION
  // ============================================================================
  console.log('🏭 Seeding Warehouse...');

  const warehouse = await prisma.imc_Warehouse.upsert({
    where: { id: 'WH01' },
    update: {},
    create: {
      id: 'WH01',
      name: 'Warehouse Utama',
      iMain: 1,
      iStatus: 'Active',
      address: 'Jl. Raya Bengkel No. 123',
      postalCode: '12345',
      phone: '0211234567',
      createdBy: 'SYSTEM',
      createdAt: new Date(),
      updatedBy: 'SYSTEM',
      updatedAt: new Date(),
      company_id: 'BIP',
      branch_id: 'BIP-MAIN',
    },
  });

  const floor = await prisma.imc_Floor.upsert({
    where: { id: 'FL01' },
    update: {},
    create: {
      warehouse_id: 'WH01',
      id: 'FL01',
      name: 'Lantai 1',
      iStatus: 'Active',
      createdBy: 'SYSTEM',
      createdAt: new Date(),
      updatedBy: 'SYSTEM',
      updatedAt: new Date(),
      company_id: 'BIP',
      branch_id: 'BIP-MAIN',
    },
  });

  const shelf = await prisma.imc_Shelf.upsert({
    where: {
      floor_id_id: {
        floor_id: 'FL01',
        id: 'SH01',
      },
    },
    update: {},
    create: {
      floor_id: 'FL01',
      id: 'SH01',
      name: 'Rak A',
      iStatus: 'Active',
      createdBy: 'SYSTEM',
      createdAt: new Date(),
      updatedBy: 'SYSTEM',
      updatedAt: new Date(),
      company_id: 'BIP',
      branch_id: 'BIP-MAIN',
    },
  });

  const row = await prisma.imc_Row.upsert({
    where: {
      floor_id_shelf_id_id: {
        floor_id: 'FL01',
        shelf_id: 'SH01',
        id: 'RW01',
      },
    },
    update: {},
    create: {
      floor_id: 'FL01',
      shelf_id: 'SH01',
      id: 'RW01',
      name: 'Baris 1',
      iStatus: 'Active',
      createdBy: 'SYSTEM',
      createdAt: new Date(),
      updatedBy: 'SYSTEM',
      updatedAt: new Date(),
      company_id: 'BIP',
      branch_id: 'BIP-MAIN',
    },
  });
  console.log('✅ Warehouse → Floor → Shelf → Row created');

  // ============================================================================
  // 5. UOM (Unit of Measure)
  // ============================================================================
  console.log('📏 Seeding UOM...');

  await prisma.imc_Uom.upsert({
    where: {
      company_id_id: {
        company_id: 'BIP',
        id: 'PCS',
      },
    },
    update: {},
    create: {
      id: 'PCS',
      name: 'Pieces',
      iStatus: 'Active',
      createdBy: 'SYSTEM',
      createdAt: new Date(),
      updatedBy: 'SYSTEM',
      updatedAt: new Date(),
      company_id: 'BIP',
      branch_id: 'BIP-MAIN',
    },
  });

  await prisma.imc_Uom.upsert({
    where: {
      company_id_id: {
        company_id: 'BIP',
        id: 'LITER',
      },
    },
    update: {},
    create: {
      id: 'LITER',
      name: 'Liter',
      iStatus: 'Active',
      createdBy: 'SYSTEM',
      createdAt: new Date(),
      updatedBy: 'SYSTEM',
      updatedAt: new Date(),
      company_id: 'BIP',
      branch_id: 'BIP-MAIN',
    },
  });
  console.log('✅ UOM created');

  // ============================================================================
  // 6. CATEGORY & BRAND
  // ============================================================================
  console.log('📦 Seeding Category & Brand...');

  const categoryType = await prisma.imc_CategoryType.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Spare Parts',
      iStatus: 'Active',
      company_id: 'BIP',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const category = await prisma.imc_Category.upsert({
    where: {
      company_id_id: {
        company_id: 'BIP',
        id: 'CAT-001',
      },
    },
    update: {},
    create: {
      type: 1,
      id: 'CAT-001',
      name: 'Oil & Lubricants',
      slug: 'oil-lubricants',
      iStatus: 'Active',
      createdBy: 'SYSTEM',
      createdAt: new Date(),
      updatedBy: 'SYSTEM',
      updatedAt: new Date(),
      company_id: 'BIP',
      branch_id: 'BIP-MAIN',
    },
  });

  const subCategory = await prisma.imc_SubCategory.upsert({
    where: {
      company_id_category_id_id: {
        company_id: 'BIP',
        category_id: 'CAT-001',
        id: 'SCAT-001',
      },
    },
    update: {},
    create: {
      id: 'SCAT-001',
      category_id: 'CAT-001',
      name: 'Engine Oil',
      slug: 'engine-oil',
      iStatus: 'Active',
      createdBy: 'SYSTEM',
      createdAt: new Date(),
      updatedBy: 'SYSTEM',
      updatedAt: new Date(),
      company_id: 'BIP',
      branch_id: 'BIP-MAIN',
    },
  });

  const brand = await prisma.imc_Brand.upsert({
    where: {
      company_id_id: {
        company_id: 'BIP',
        id: 'BRAND-001',
      },
    },
    update: {},
    create: {
      id: 'BRAND-001',
      name: 'Shell',
      slug: 'shell',
      iStatus: 'Active',
      createdBy: 'SYSTEM',
      createdAt: new Date(),
      updatedBy: 'SYSTEM',
      updatedAt: new Date(),
      company_id: 'BIP',
      branch_id: 'BIP-MAIN',
    },
  });
  console.log('✅ Category & Brand created');

  // ============================================================================
  // 7. PRODUCTS (Spare Parts)
  // ============================================================================
  console.log('🛒 Seeding Products...');

  // Product 1: Oli Shell Helix HX7
  const product1 = await prisma.imc_Product.upsert({
    where: {
      company_id_id: {
        company_id: 'BIP',
        id: 'PROD-001',
      },
    },
    update: {},
    create: {
      id: 'PROD-001',
      name: 'Shell Helix HX7 5W-30 4L',
      slug: 'shell-helix-hx7-5w30-4l',
      category_id: 'CAT-001',
      subCategory_id: 'SCAT-001',
      brand_id: 'BRAND-001',
      uom_id: 'LITER',
      iStatus: 'Active',
      isMaterial: true,
      createdBy: 'SYSTEM',
      createdAt: new Date(),
      updatedBy: 'SYSTEM',
      updatedAt: new Date(),
      company_id: 'BIP',
      branch_id: 'BIP-MAIN',
    },
  });

  // Product 2: Filter Oli
  const product2 = await prisma.imc_Product.upsert({
    where: {
      company_id_id: {
        company_id: 'BIP',
        id: 'PROD-002',
      },
    },
    update: {},
    create: {
      id: 'PROD-002',
      name: 'Filter Oli Toyota',
      slug: 'filter-oli-toyota',
      category_id: 'CAT-001',
      subCategory_id: 'SCAT-001',
      brand_id: 'BRAND-001',
      uom_id: 'PCS',
      iStatus: 'Active',
      isMaterial: true,
      createdBy: 'SYSTEM',
      createdAt: new Date(),
      updatedBy: 'SYSTEM',
      updatedAt: new Date(),
      company_id: 'BIP',
      branch_id: 'BIP-MAIN',
    },
  });

  // Product 3: Kampas Rem
  const product3 = await prisma.imc_Product.upsert({
    where: {
      company_id_id: {
        company_id: 'BIP',
        id: 'PROD-003',
      },
    },
    update: {},
    create: {
      id: 'PROD-003',
      name: 'Kampas Rem Depan Toyota Avanza',
      slug: 'kampas-rem-depan-avanza',
      category_id: 'CAT-001',
      subCategory_id: 'SCAT-001',
      brand_id: 'BRAND-001',
      uom_id: 'PCS',
      iStatus: 'Active',
      isMaterial: true,
      createdBy: 'SYSTEM',
      createdAt: new Date(),
      updatedBy: 'SYSTEM',
      updatedAt: new Date(),
      company_id: 'BIP',
      branch_id: 'BIP-MAIN',
    },
  });
  // Product 4-10: Tambahan produk
  await prisma.imc_Product.createMany({
    data: [
      {
        id: 'PROD-004',
        name: 'Ban Bridgestone Turanza 195/65 R15',
        slug: 'ban-bridgestone-turanza-195-65-r15',
        category_id: 'CAT-001',
        subCategory_id: 'SCAT-001',
        brand_id: 'BRAND-001',
        uom_id: 'PCS',
        iStatus: 'Active',
        isMaterial: true,
        createdBy: 'SYSTEM',
        createdAt: new Date(),
        updatedBy: 'SYSTEM',
        updatedAt: new Date(),
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
      {
        id: 'PROD-005',
        name: 'Aki GS Astra NS60 12V 45Ah',
        slug: 'aki-gs-astra-ns60',
        category_id: 'CAT-001',
        subCategory_id: 'SCAT-001',
        brand_id: 'BRAND-001',
        uom_id: 'PCS',
        iStatus: 'Active',
        isMaterial: true,
        createdBy: 'SYSTEM',
        createdAt: new Date(),
        updatedBy: 'SYSTEM',
        updatedAt: new Date(),
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
      {
        id: 'PROD-006',
        name: 'Busi NGK Iridium',
        slug: 'busi-ngk-iridium',
        category_id: 'CAT-001',
        subCategory_id: 'SCAT-001',
        brand_id: 'BRAND-001',
        uom_id: 'PCS',
        iStatus: 'Active',
        isMaterial: true,
        createdBy: 'SYSTEM',
        createdAt: new Date(),
        updatedBy: 'SYSTEM',
        updatedAt: new Date(),
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
      {
        id: 'PROD-007',
        name: 'Air Radiator Coolant Prestone 1L',
        slug: 'air-radiator-coolant-prestone',
        category_id: 'CAT-001',
        subCategory_id: 'SCAT-001',
        brand_id: 'BRAND-001',
        uom_id: 'LITER',
        iStatus: 'Active',
        isMaterial: true,
        createdBy: 'SYSTEM',
        createdAt: new Date(),
        updatedBy: 'SYSTEM',
        updatedAt: new Date(),
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
      {
        id: 'PROD-008',
        name: 'Kampas Rem Belakang Toyota Avanza',
        slug: 'kampas-rem-belakang-avanza',
        category_id: 'CAT-001',
        subCategory_id: 'SCAT-001',
        brand_id: 'BRAND-001',
        uom_id: 'PCS',
        iStatus: 'Active',
        isMaterial: true,
        createdBy: 'SYSTEM',
        createdAt: new Date(),
        updatedBy: 'SYSTEM',
        updatedAt: new Date(),
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
      {
        id: 'PROD-009',
        name: 'Wiper Blade Bosch Aerotwin 24"',
        slug: 'wiper-blade-bosch-aerotwin-24',
        category_id: 'CAT-001',
        subCategory_id: 'SCAT-001',
        brand_id: 'BRAND-001',
        uom_id: 'PCS',
        iStatus: 'Active',
        isMaterial: true,
        createdBy: 'SYSTEM',
        createdAt: new Date(),
        updatedBy: 'SYSTEM',
        updatedAt: new Date(),
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
      {
        id: 'PROD-010',
        name: 'Lampu Halogen Philips H4 12V 60/55W',
        slug: 'lampu-halogen-philips-h4',
        category_id: 'CAT-001',
        subCategory_id: 'SCAT-001',
        brand_id: 'BRAND-001',
        uom_id: 'PCS',
        iStatus: 'Active',
        isMaterial: true,
        createdBy: 'SYSTEM',
        createdAt: new Date(),
        updatedBy: 'SYSTEM',
        updatedAt: new Date(),
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Products created (10 items)');

  // ============================================================================
  // 7B. PRODUCT VARIANTS
  // ============================================================================
  console.log('🎨 Seeding Product Variants...');

  // Variant Types
  const variantTypeColor = await prisma.imc_VariantType.upsert({
    where: {
      company_id_id: {
        company_id: 'BIP',
        id: 'VT-COLOR',
      },
    },
    update: {},
    create: {
      id: 'VT-COLOR',
      name: 'Warna',
      seq: 1,
      iStatus: 'Active',
      createdBy: 'SYSTEM',
      createdAt: new Date(),
      updatedBy: 'SYSTEM',
      updatedAt: new Date(),
      company_id: 'BIP',
      branch_id: 'BIP-MAIN',
    },
  });

  const variantTypeSize = await prisma.imc_VariantType.upsert({
    where: {
      company_id_id: {
        company_id: 'BIP',
        id: 'VT-SIZE',
      },
    },
    update: {},
    create: {
      id: 'VT-SIZE',
      name: 'Ukuran',
      seq: 2,
      iStatus: 'Active',
      createdBy: 'SYSTEM',
      createdAt: new Date(),
      updatedBy: 'SYSTEM',
      updatedAt: new Date(),
      company_id: 'BIP',
      branch_id: 'BIP-MAIN',
    },
  });

  // Variant Options - Colors
  await prisma.imc_VariantOption.createMany({
    data: [
      {
        id: 'VO-RED',
        variantType_id: 'VT-COLOR',
        name: 'Merah',
        code: 'RED',
        hexColorCode: '#FF0000',
        seq: 1,
        iStatus: 'Active',
        createdBy: 'SYSTEM',
        createdAt: new Date(),
        updatedBy: 'SYSTEM',
        updatedAt: new Date(),
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
      {
        id: 'VO-BLUE',
        variantType_id: 'VT-COLOR',
        name: 'Biru',
        code: 'BLUE',
        hexColorCode: '#0000FF',
        seq: 2,
        iStatus: 'Active',
        createdBy: 'SYSTEM',
        createdAt: new Date(),
        updatedBy: 'SYSTEM',
        updatedAt: new Date(),
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
      {
        id: 'VO-BLACK',
        variantType_id: 'VT-COLOR',
        name: 'Hitam',
        code: 'BLACK',
        hexColorCode: '#000000',
        seq: 3,
        iStatus: 'Active',
        createdBy: 'SYSTEM',
        createdAt: new Date(),
        updatedBy: 'SYSTEM',
        updatedAt: new Date(),
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
    ],
    skipDuplicates: true,
  });

  // Variant Options - Sizes
  await prisma.imc_VariantOption.createMany({
    data: [
      {
        id: 'VO-SIZE-S',
        variantType_id: 'VT-SIZE',
        name: 'Small (14")',
        code: 'SIZE-14',
        seq: 1,
        iStatus: 'Active',
        createdBy: 'SYSTEM',
        createdAt: new Date(),
        updatedBy: 'SYSTEM',
        updatedAt: new Date(),
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
      {
        id: 'VO-SIZE-M',
        variantType_id: 'VT-SIZE',
        name: 'Medium (15")',
        code: 'SIZE-15',
        seq: 2,
        iStatus: 'Active',
        createdBy: 'SYSTEM',
        createdAt: new Date(),
        updatedBy: 'SYSTEM',
        updatedAt: new Date(),
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
      {
        id: 'VO-SIZE-L',
        variantType_id: 'VT-SIZE',
        name: 'Large (16")',
        code: 'SIZE-16',
        seq: 3,
        iStatus: 'Active',
        createdBy: 'SYSTEM',
        createdAt: new Date(),
        updatedBy: 'SYSTEM',
        updatedAt: new Date(),
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
    ],
    skipDuplicates: true,
  });

  // Product Variant Types (Link product dengan variant type)
  await prisma.imc_ProductVariantType.createMany({
    data: [
      // Ban punya variant warna dan ukuran
      {
        product_id: 'PROD-004',
        variantType_id: 'VT-COLOR',
        seq: 1,
        iStatus: 'Active',
        createdBy: 'SYSTEM',
        createdAt: new Date(),
        updatedBy: 'SYSTEM',
        updatedAt: new Date(),
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
      {
        product_id: 'PROD-004',
        variantType_id: 'VT-SIZE',
        seq: 2,
        iStatus: 'Active',
        createdBy: 'SYSTEM',
        createdAt: new Date(),
        updatedBy: 'SYSTEM',
        updatedAt: new Date(),
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
    ],
    skipDuplicates: true,
  });

  // Product Variants (Kombinasi variant)
  const variantBanBlack15 = await prisma.imc_ProductVariant.upsert({
    where: {
      company_id_product_id_id: {
        company_id: 'BIP',
        product_id: 'PROD-004',
        id: 'VAR-001',
      },
    },
    update: {},
    create: {
      id: 'VAR-001',
      product_id: 'PROD-004',
      sku: 'BAN-BLK-15',
      name: 'Bridgestone Turanza Hitam 15"',
      additionalPrice: 0,
      stockQty: 20,
      iStatus: 'Active',
      createdBy: 'SYSTEM',
      createdAt: new Date(),
      updatedBy: 'SYSTEM',
      updatedAt: new Date(),
      company_id: 'BIP',
      branch_id: 'BIP-MAIN',
    },
  });

  const variantBanBlack16 = await prisma.imc_ProductVariant.upsert({
    where: {
      company_id_product_id_id: {
        company_id: 'BIP',
        product_id: 'PROD-004',
        id: 'VAR-002',
      },
    },
    update: {},
    create: {
      id: 'VAR-002',
      product_id: 'PROD-004',
      sku: 'BAN-BLK-16',
      name: 'Bridgestone Turanza Hitam 16"',
      additionalPrice: 100000,
      stockQty: 15,
      iStatus: 'Active',
      createdBy: 'SYSTEM',
      createdAt: new Date(),
      updatedBy: 'SYSTEM',
      updatedAt: new Date(),
      company_id: 'BIP',
      branch_id: 'BIP-MAIN',
    },
  });

  const variantBanBlack14 = await prisma.imc_ProductVariant.upsert({
    where: {
      company_id_product_id_id: {
        company_id: 'BIP',
        product_id: 'PROD-004',
        id: 'VAR-003',
      },
    },
    update: {},
    create: {
      id: 'VAR-003',
      product_id: 'PROD-004',
      sku: 'BAN-BLK-14',
      name: 'Bridgestone Turanza Hitam 14"',
      additionalPrice: -100000,
      stockQty: 25,
      iStatus: 'Active',
      createdBy: 'SYSTEM',
      createdAt: new Date(),
      updatedBy: 'SYSTEM',
      updatedAt: new Date(),
      company_id: 'BIP',
      branch_id: 'BIP-MAIN',
    },
  });

  // Product Variant Options (Link variant dengan option)
  await prisma.imc_ProductVariantOption.createMany({
    data: [
      // Variant 1: Black 15"
      {
        product_id: 'PROD-004',
        productVariant_id: 'VAR-001',
        variantType_id: 'VT-COLOR',
        variantOption_id: 'VO-BLACK',
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
      {
        product_id: 'PROD-004',
        productVariant_id: 'VAR-001',
        variantType_id: 'VT-SIZE',
        variantOption_id: 'VO-SIZE-M',
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
      // Variant 2: Black 16"
      {
        product_id: 'PROD-004',
        productVariant_id: 'VAR-002',
        variantType_id: 'VT-COLOR',
        variantOption_id: 'VO-BLACK',
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
      {
        product_id: 'PROD-004',
        productVariant_id: 'VAR-002',
        variantType_id: 'VT-SIZE',
        variantOption_id: 'VO-SIZE-L',
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
      // Variant 3: Black 14"
      {
        product_id: 'PROD-004',
        productVariant_id: 'VAR-003',
        variantType_id: 'VT-COLOR',
        variantOption_id: 'VO-BLACK',
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
      {
        product_id: 'PROD-004',
        productVariant_id: 'VAR-003',
        variantType_id: 'VT-SIZE',
        variantOption_id: 'VO-SIZE-S',
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Product Variants created (3 variants for Ban Bridgestone)');

  // ============================================================================
  // 8. PRODUCT STOCK
  // ============================================================================
  console.log('📊 Seeding Product Stock...');

  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String(now.getFullYear());

  await prisma.imc_ProductStock.upsert({
    where: {
      id_floor_id_shelf_id_row_id_mExpired_dt_yExpired_dt_warehouse_id_company_id:
        {
          id: 'PROD-001',
          floor_id: 'FL01',
          shelf_id: 'SH01',
          row_id: 'RW01',
          mExpired_dt: '12',
          yExpired_dt: '2027',
          warehouse_id: 'WH01',
          company_id: 'BIP',
        },
    },
    update: {},
    create: {
      id: 'PROD-001',
      warehouse_id: 'WH01',
      floor_id: 'FL01',
      shelf_id: 'SH01',
      row_id: 'RW01',
      mExpired_dt: '12',
      yExpired_dt: '2027',
      onhand_qty: 50,
      unit_cost: 285000,
      selling_price: 350000,
      iStatus: 'Active',
      createdBy: 'SYSTEM',
      createdAt: new Date(),
      updatedBy: 'SYSTEM',
      updatedAt: new Date(),
      company_id: 'BIP',
      branch_id: 'BIP-MAIN',
    },
  });

  await prisma.imc_ProductStock.upsert({
    where: {
      id_floor_id_shelf_id_row_id_mExpired_dt_yExpired_dt_warehouse_id_company_id:
        {
          id: 'PROD-002',
          floor_id: 'FL01',
          shelf_id: 'SH01',
          row_id: 'RW01',
          mExpired_dt: '12',
          yExpired_dt: '2027',
          warehouse_id: 'WH01',
          company_id: 'BIP',
        },
    },
    update: {},
    create: {
      id: 'PROD-002',
      warehouse_id: 'WH01',
      floor_id: 'FL01',
      shelf_id: 'SH01',
      row_id: 'RW01',
      mExpired_dt: '12',
      yExpired_dt: '2027',
      onhand_qty: 100,
      unit_cost: 45000,
      selling_price: 65000,
      iStatus: 'Active',
      createdBy: 'SYSTEM',
      createdAt: new Date(),
      updatedBy: 'SYSTEM',
      updatedAt: new Date(),
      company_id: 'BIP',
      branch_id: 'BIP-MAIN',
    },
  });

  await prisma.imc_ProductStock.upsert({
    where: {
      id_floor_id_shelf_id_row_id_mExpired_dt_yExpired_dt_warehouse_id_company_id:
        {
          id: 'PROD-003',
          floor_id: 'FL01',
          shelf_id: 'SH01',
          row_id: 'RW01',
          mExpired_dt: '12',
          yExpired_dt: '2027',
          warehouse_id: 'WH01',
          company_id: 'BIP',
        },
    },
    update: {},
    create: {
      id: 'PROD-003',
      warehouse_id: 'WH01',
      floor_id: 'FL01',
      shelf_id: 'SH01',
      row_id: 'RW01',
      mExpired_dt: '12',
      yExpired_dt: '2027',
      onhand_qty: 30,
      unit_cost: 450000,
      selling_price: 650000,
      iStatus: 'Active',
      createdBy: 'SYSTEM',
      createdAt: new Date(),
      updatedBy: 'SYSTEM',
      updatedAt: new Date(),
      company_id: 'BIP',
      branch_id: 'BIP-MAIN',
    },
  });

  // Stock untuk produk baru (4-10)
  await prisma.imc_ProductStock.createMany({
    data: [
      {
        id: 'PROD-004',
        warehouse_id: 'WH01',
        floor_id: 'FL01',
        shelf_id: 'SH01',
        row_id: 'RW01',
        mExpired_dt: '12',
        yExpired_dt: '2027',
        onhand_qty: 60,
        unit_cost: 700000,
        selling_price: 850000,
        iStatus: 'Active',
        createdBy: 'SYSTEM',
        createdAt: new Date(),
        updatedBy: 'SYSTEM',
        updatedAt: new Date(),
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
      {
        id: 'PROD-005',
        warehouse_id: 'WH01',
        floor_id: 'FL01',
        shelf_id: 'SH01',
        row_id: 'RW01',
        mExpired_dt: '12',
        yExpired_dt: '2027',
        onhand_qty: 40,
        unit_cost: 650000,
        selling_price: 850000,
        iStatus: 'Active',
        createdBy: 'SYSTEM',
        createdAt: new Date(),
        updatedBy: 'SYSTEM',
        updatedAt: new Date(),
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
      {
        id: 'PROD-006',
        warehouse_id: 'WH01',
        floor_id: 'FL01',
        shelf_id: 'SH01',
        row_id: 'RW01',
        mExpired_dt: '12',
        yExpired_dt: '2027',
        onhand_qty: 200,
        unit_cost: 45000,
        selling_price: 65000,
        iStatus: 'Active',
        createdBy: 'SYSTEM',
        createdAt: new Date(),
        updatedBy: 'SYSTEM',
        updatedAt: new Date(),
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
      {
        id: 'PROD-007',
        warehouse_id: 'WH01',
        floor_id: 'FL01',
        shelf_id: 'SH01',
        row_id: 'RW01',
        mExpired_dt: '12',
        yExpired_dt: '2027',
        onhand_qty: 80,
        unit_cost: 75000,
        selling_price: 95000,
        iStatus: 'Active',
        createdBy: 'SYSTEM',
        createdAt: new Date(),
        updatedBy: 'SYSTEM',
        updatedAt: new Date(),
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
      {
        id: 'PROD-008',
        warehouse_id: 'WH01',
        floor_id: 'FL01',
        shelf_id: 'SH01',
        row_id: 'RW01',
        mExpired_dt: '12',
        yExpired_dt: '2027',
        onhand_qty: 35,
        unit_cost: 550000,
        selling_price: 650000,
        iStatus: 'Active',
        createdBy: 'SYSTEM',
        createdAt: new Date(),
        updatedBy: 'SYSTEM',
        updatedAt: new Date(),
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
      {
        id: 'PROD-009',
        warehouse_id: 'WH01',
        floor_id: 'FL01',
        shelf_id: 'SH01',
        row_id: 'RW01',
        mExpired_dt: '12',
        yExpired_dt: '2027',
        onhand_qty: 150,
        unit_cost: 150000,
        selling_price: 195000,
        iStatus: 'Active',
        createdBy: 'SYSTEM',
        createdAt: new Date(),
        updatedBy: 'SYSTEM',
        updatedAt: new Date(),
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
      {
        id: 'PROD-010',
        warehouse_id: 'WH01',
        floor_id: 'FL01',
        shelf_id: 'SH01',
        row_id: 'RW01',
        mExpired_dt: '12',
        yExpired_dt: '2027',
        onhand_qty: 120,
        unit_cost: 85000,
        selling_price: 115000,
        iStatus: 'Active',
        createdBy: 'SYSTEM',
        createdAt: new Date(),
        updatedBy: 'SYSTEM',
        updatedAt: new Date(),
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Product Stock created (10 items total)');

  // ============================================================================
  // 9. VEHICLE MASTER DATA
  // ============================================================================
  console.log('🚗 Seeding Vehicle Master...');

  const vehicleType = await prisma.wks_VehicleType.upsert({
    where: {
      company_id_id: {
        company_id: 'BIP',
        id: 'VT01',
      },
    },
    update: {},
    create: {
      id: 'VT01',
      name: 'Mobil',
      iStatus: 'Active',
      createdBy: 'SYSTEM',
      createdAt: new Date(),
      updatedBy: 'SYSTEM',
      updatedAt: new Date(),
      company_id: 'BIP',
      branch_id: 'BIP-MAIN',
    },
  });

  const vehicleBrand = await prisma.wks_VehicleBrand.upsert({
    where: {
      company_id_vehicleType_id_id: {
        company_id: 'BIP',
        vehicleType_id: 'VT01',
        id: 'VB01',
      },
    },
    update: {},
    create: {
      id: 'VB01',
      vehicleType_id: 'VT01',
      name: 'Toyota',
      slug: 'toyota',
      iStatus: 'Active',
      createdBy: 'SYSTEM',
      createdAt: new Date(),
      updatedBy: 'SYSTEM',
      updatedAt: new Date(),
      company_id: 'BIP',
      branch_id: 'BIP-MAIN',
    },
  });

  const vehicleModel = await prisma.wks_VehicleModel.upsert({
    where: {
      company_id_vehicleType_id_brand_id_id: {
        company_id: 'BIP',
        vehicleType_id: 'VT01',
        brand_id: 'VB01',
        id: 'VM01',
      },
    },
    update: {},
    create: {
      id: 'VM01',
      vehicleType_id: 'VT01',
      brand_id: 'VB01',
      name: 'Avanza',
      slug: 'avanza',
      engineType: 'Bensin',
      transmission: 'Manual',
      fuelType: 'Pertalite',
      iStatus: 'Active',
      createdBy: 'SYSTEM',
      createdAt: new Date(),
      updatedBy: 'SYSTEM',
      updatedAt: new Date(),
      company_id: 'BIP',
      branch_id: 'BIP-MAIN',
    },
  });

  // Tambahan vehicle brands
  await prisma.wks_VehicleBrand.createMany({
    data: [
      {
        id: 'VB02',
        vehicleType_id: 'VT01',
        name: 'Honda',
        slug: 'honda',
        iStatus: 'Active',
        createdBy: 'SYSTEM',
        createdAt: new Date(),
        updatedBy: 'SYSTEM',
        updatedAt: new Date(),
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
      {
        id: 'VB03',
        vehicleType_id: 'VT01',
        name: 'Daihatsu',
        slug: 'daihatsu',
        iStatus: 'Active',
        createdBy: 'SYSTEM',
        createdAt: new Date(),
        updatedBy: 'SYSTEM',
        updatedAt: new Date(),
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
      {
        id: 'VB04',
        vehicleType_id: 'VT01',
        name: 'Suzuki',
        slug: 'suzuki',
        iStatus: 'Active',
        createdBy: 'SYSTEM',
        createdAt: new Date(),
        updatedBy: 'SYSTEM',
        updatedAt: new Date(),
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
      {
        id: 'VB05',
        vehicleType_id: 'VT01',
        name: 'Mitsubishi',
        slug: 'mitsubishi',
        iStatus: 'Active',
        createdBy: 'SYSTEM',
        createdAt: new Date(),
        updatedBy: 'SYSTEM',
        updatedAt: new Date(),
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
    ],
    skipDuplicates: true,
  });

  // Tambahan vehicle models
  await prisma.wks_VehicleModel.createMany({
    data: [
      {
        id: 'VM02',
        vehicleType_id: 'VT01',
        brand_id: 'VB01',
        name: 'Innova',
        slug: 'innova',
        engineType: 'Bensin',
        transmission: 'Manual',
        fuelType: 'Pertamax',
        iStatus: 'Active',
        createdBy: 'SYSTEM',
        createdAt: new Date(),
        updatedBy: 'SYSTEM',
        updatedAt: new Date(),
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
      {
        id: 'VM03',
        vehicleType_id: 'VT01',
        brand_id: 'VB01',
        name: 'Fortuner',
        slug: 'fortuner',
        engineType: 'Diesel',
        transmission: 'Automatic',
        fuelType: 'Solar',
        iStatus: 'Active',
        createdBy: 'SYSTEM',
        createdAt: new Date(),
        updatedBy: 'SYSTEM',
        updatedAt: new Date(),
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
      {
        id: 'VM04',
        vehicleType_id: 'VT01',
        brand_id: 'VB02',
        name: 'Jazz',
        slug: 'jazz',
        engineType: 'Bensin',
        transmission: 'CVT',
        fuelType: 'Pertalite',
        iStatus: 'Active',
        createdBy: 'SYSTEM',
        createdAt: new Date(),
        updatedBy: 'SYSTEM',
        updatedAt: new Date(),
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
      {
        id: 'VM05',
        vehicleType_id: 'VT01',
        brand_id: 'VB02',
        name: 'BR-V',
        slug: 'br-v',
        engineType: 'Bensin',
        transmission: 'CVT',
        fuelType: 'Pertalite',
        iStatus: 'Active',
        createdBy: 'SYSTEM',
        createdAt: new Date(),
        updatedBy: 'SYSTEM',
        updatedAt: new Date(),
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
      {
        id: 'VM06',
        vehicleType_id: 'VT01',
        brand_id: 'VB03',
        name: 'Xenia',
        slug: 'xenia',
        engineType: 'Bensin',
        transmission: 'Manual',
        fuelType: 'Pertalite',
        iStatus: 'Active',
        createdBy: 'SYSTEM',
        createdAt: new Date(),
        updatedBy: 'SYSTEM',
        updatedAt: new Date(),
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Vehicle Master created (5 brands, 7 models)');

  // ============================================================================
  // 10. CUSTOMERS (10 customers)
  // ============================================================================
  console.log('👨 Seeding Customers...');

  const customer = await prisma.cmf_Customer.upsert({
    where: {
      company_id_id: {
        company_id: 'BIP',
        id: 'CUST-001',
      },
    },
    update: {},
    create: {
      id: 'CUST-001',
      customerType: 'INDIVIDUAL',
      name: 'Budi Santoso',
      mobile1: '081234567890',
      email: 'budi.santoso@email.com',
      province: 'DKI Jakarta',
      city: 'Jakarta Selatan',
      address1: 'Jl. Sudirman No. 456',
      postalCode: '12190',
      iStatus: 'Active',
      createdBy: 'ADMIN',
      createdAt: new Date(),
      updatedBy: 'ADMIN',
      updatedAt: new Date(),
      company_id: 'BIP',
      branch_id: 'BIP-MAIN',
    },
  });

  // Tambahan 9 customers
  await prisma.cmf_Customer.createMany({
    data: [
      {
        id: 'CUST-002',
        customerType: 'INDIVIDUAL',
        name: 'Siti Nurhaliza',
        mobile1: '081234567891',
        email: 'siti.nurhaliza@email.com',
        province: 'DKI Jakarta',
        city: 'Jakarta Timur',
        address1: 'Jl. Kebon Jeruk No. 78',
        iStatus: 'Active',
        createdBy: 'ADMIN',
        createdAt: new Date(),
        updatedBy: 'ADMIN',
        updatedAt: new Date(),
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
      {
        id: 'CUST-003',
        customerType: 'INDIVIDUAL',
        name: 'Agus Wijaya',
        mobile1: '081234567892',
        email: 'agus.wijaya@email.com',
        province: 'Jawa Barat',
        city: 'Bekasi',
        address1: 'Jl. Raya Bekasi No. 234',
        iStatus: 'Active',
        createdBy: 'ADMIN',
        createdAt: new Date(),
        updatedBy: 'ADMIN',
        updatedAt: new Date(),
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
      {
        id: 'CUST-004',
        customerType: 'INDIVIDUAL',
        name: 'Dewi Lestari',
        mobile1: '081234567893',
        email: 'dewi.lestari@email.com',
        province: 'Banten',
        city: 'Tangerang',
        address1: 'Jl. BSD Raya No. 456',
        iStatus: 'Active',
        createdBy: 'ADMIN',
        createdAt: new Date(),
        updatedBy: 'ADMIN',
        updatedAt: new Date(),
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
      {
        id: 'CUST-005',
        customerType: 'INDIVIDUAL',
        name: 'Eko Prasetyo',
        mobile1: '081234567894',
        email: 'eko.prasetyo@email.com',
        province: 'DKI Jakarta',
        city: 'Jakarta Pusat',
        address1: 'Jl. Thamrin No. 999',
        iStatus: 'Active',
        createdBy: 'ADMIN',
        createdAt: new Date(),
        updatedBy: 'ADMIN',
        updatedAt: new Date(),
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
      {
        id: 'CUST-006',
        customerType: 'CORPORATE',
        name: 'PT Maju Jaya Sejahtera',
        legalName: 'PT Maju Jaya Sejahtera Tbk',
        mobile1: '081234567895',
        email: 'purchasing@majujaya.com',
        companyRegistrationNumber: '1234567890',
        businessType: 'PT',
        industryType: 'Manufacturing',
        numberOfVehicles: 15,
        province: 'DKI Jakarta',
        city: 'Jakarta Utara',
        address1: 'Kawasan Industri Sunter Blok A No. 12',
        iStatus: 'Active',
        createdBy: 'ADMIN',
        createdAt: new Date(),
        updatedBy: 'ADMIN',
        updatedAt: new Date(),
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
      {
        id: 'CUST-007',
        customerType: 'INDIVIDUAL',
        name: 'Rina Wijayanti',
        mobile1: '081234567896',
        email: 'rina.wijayanti@email.com',
        province: 'DKI Jakarta',
        city: 'Jakarta Selatan',
        address1: 'Jl. Panjang No. 567',
        iStatus: 'Active',
        createdBy: 'ADMIN',
        createdAt: new Date(),
        updatedBy: 'ADMIN',
        updatedAt: new Date(),
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
      {
        id: 'CUST-008',
        customerType: 'INDIVIDUAL',
        name: 'Ahmad Suryadi',
        mobile1: '081234567897',
        email: 'ahmad.suryadi@email.com',
        province: 'Jawa Barat',
        city: 'Depok',
        address1: 'Jl. Margonda Raya No. 234',
        iStatus: 'Active',
        createdBy: 'ADMIN',
        createdAt: new Date(),
        updatedBy: 'ADMIN',
        updatedAt: new Date(),
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
      {
        id: 'CUST-009',
        customerType: 'INDIVIDUAL',
        name: 'Mega Puspitasari',
        mobile1: '081234567898',
        email: 'mega.puspitasari@email.com',
        province: 'Banten',
        city: 'Tangerang Selatan',
        address1: 'Jl. Bintaro Raya No. 789',
        iStatus: 'Active',
        createdBy: 'ADMIN',
        createdAt: new Date(),
        updatedBy: 'ADMIN',
        updatedAt: new Date(),
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
      {
        id: 'CUST-010',
        customerType: 'INDIVIDUAL',
        name: 'Hendri Kurniawan',
        mobile1: '081234567899',
        email: 'hendri.kurniawan@email.com',
        province: 'DKI Jakarta',
        city: 'Jakarta Barat',
        address1: 'Jl. Daan Mogot No. 345',
        iStatus: 'Active',
        createdBy: 'ADMIN',
        createdAt: new Date(),
        updatedBy: 'ADMIN',
        updatedAt: new Date(),
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Customers created (10 customers total)');

  // ============================================================================
  // 11. CUSTOMER VEHICLES (10 vehicles)
  // ============================================================================
  console.log('🚙 Seeding Customer Vehicles...');

  const customerVehicle = await prisma.cmf_CustomerVehicle.upsert({
    where: {
      company_id_licensePlate: {
        company_id: 'BIP',
        licensePlate: 'B1234XYZ',
      },
    },
    update: {},
    create: {
      id: 'VEH-001',
      customer_id: 'CUST-001',
      vehicleType_id: 'VT01',
      brand_id: 'VB01',
      model_id: 'VM01',
      licensePlate: 'B1234XYZ',
      vehicleYear: 2020,
      color: 'Silver',
      transmission: 'Manual',
      fuelType: 'Pertalite',
      engineCapacity: '1500cc',
      currentOdometer: 45000,
      isPrimary: true,
      iStatus: 'Active',
      createdBy: 'ADMIN',
      createdAt: new Date(),
      updatedBy: 'ADMIN',
      updatedAt: new Date(),
      company_id: 'BIP',
      branch_id: 'BIP-MAIN',
    },
  });

  // Tambahan 9 vehicles
  await prisma.cmf_CustomerVehicle.createMany({
    data: [
      {
        id: 'VEH-002',
        customer_id: 'CUST-002',
        vehicleType_id: 'VT01',
        brand_id: 'VB02',
        model_id: 'VM04',
        licensePlate: 'B2345ABC',
        vehicleYear: 2019,
        color: 'Putih',
        transmission: 'CVT',
        fuelType: 'Pertalite',
        engineCapacity: '1500cc',
        currentOdometer: 35000,
        isPrimary: true,
        iStatus: 'Active',
        createdBy: 'ADMIN',
        createdAt: new Date(),
        updatedBy: 'ADMIN',
        updatedAt: new Date(),
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
      {
        id: 'VEH-003',
        customer_id: 'CUST-003',
        vehicleType_id: 'VT01',
        brand_id: 'VB01',
        model_id: 'VM02',
        licensePlate: 'B3456DEF',
        vehicleYear: 2021,
        color: 'Hitam',
        transmission: 'Manual',
        fuelType: 'Pertamax',
        engineCapacity: '2000cc',
        currentOdometer: 25000,
        isPrimary: true,
        iStatus: 'Active',
        createdBy: 'ADMIN',
        createdAt: new Date(),
        updatedBy: 'ADMIN',
        updatedAt: new Date(),
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
      {
        id: 'VEH-004',
        customer_id: 'CUST-004',
        vehicleType_id: 'VT01',
        brand_id: 'VB03',
        model_id: 'VM06',
        licensePlate: 'B4567GHI',
        vehicleYear: 2018,
        color: 'Abu-abu',
        transmission: 'Manual',
        fuelType: 'Pertalite',
        engineCapacity: '1300cc',
        currentOdometer: 55000,
        isPrimary: true,
        iStatus: 'Active',
        createdBy: 'ADMIN',
        createdAt: new Date(),
        updatedBy: 'ADMIN',
        updatedAt: new Date(),
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
      {
        id: 'VEH-005',
        customer_id: 'CUST-005',
        vehicleType_id: 'VT01',
        brand_id: 'VB01',
        model_id: 'VM03',
        licensePlate: 'B5678JKL',
        vehicleYear: 2022,
        color: 'Putih',
        transmission: 'Automatic',
        fuelType: 'Solar',
        engineCapacity: '2400cc',
        currentOdometer: 15000,
        isPrimary: true,
        iStatus: 'Active',
        createdBy: 'ADMIN',
        createdAt: new Date(),
        updatedBy: 'ADMIN',
        updatedAt: new Date(),
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
      {
        id: 'VEH-006',
        customer_id: 'CUST-006',
        vehicleType_id: 'VT01',
        brand_id: 'VB01',
        model_id: 'VM02',
        licensePlate: 'B6789MNO',
        vehicleYear: 2020,
        color: 'Silver',
        transmission: 'Manual',
        fuelType: 'Pertamax',
        engineCapacity: '2000cc',
        currentOdometer: 40000,
        isPrimary: true,
        iStatus: 'Active',
        createdBy: 'ADMIN',
        createdAt: new Date(),
        updatedBy: 'ADMIN',
        updatedAt: new Date(),
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
      {
        id: 'VEH-007',
        customer_id: 'CUST-007',
        vehicleType_id: 'VT01',
        brand_id: 'VB02',
        model_id: 'VM05',
        licensePlate: 'B7890PQR',
        vehicleYear: 2021,
        color: 'Merah',
        transmission: 'CVT',
        fuelType: 'Pertalite',
        engineCapacity: '1500cc',
        currentOdometer: 20000,
        isPrimary: true,
        iStatus: 'Active',
        createdBy: 'ADMIN',
        createdAt: new Date(),
        updatedBy: 'ADMIN',
        updatedAt: new Date(),
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
      {
        id: 'VEH-008',
        customer_id: 'CUST-008',
        vehicleType_id: 'VT01',
        brand_id: 'VB01',
        model_id: 'VM01',
        licensePlate: 'B8901STU',
        vehicleYear: 2019,
        color: 'Hitam',
        transmission: 'Manual',
        fuelType: 'Pertalite',
        engineCapacity: '1500cc',
        currentOdometer: 50000,
        isPrimary: true,
        iStatus: 'Active',
        createdBy: 'ADMIN',
        createdAt: new Date(),
        updatedBy: 'ADMIN',
        updatedAt: new Date(),
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
      {
        id: 'VEH-009',
        customer_id: 'CUST-009',
        vehicleType_id: 'VT01',
        brand_id: 'VB02',
        model_id: 'VM04',
        licensePlate: 'B9012VWX',
        vehicleYear: 2020,
        color: 'Biru',
        transmission: 'CVT',
        fuelType: 'Pertalite',
        engineCapacity: '1500cc',
        currentOdometer: 30000,
        isPrimary: true,
        iStatus: 'Active',
        createdBy: 'ADMIN',
        createdAt: new Date(),
        updatedBy: 'ADMIN',
        updatedAt: new Date(),
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
      {
        id: 'VEH-010',
        customer_id: 'CUST-010',
        vehicleType_id: 'VT01',
        brand_id: 'VB03',
        model_id: 'VM06',
        licensePlate: 'B0123YZ1',
        vehicleYear: 2018,
        color: 'Silver',
        transmission: 'Manual',
        fuelType: 'Pertalite',
        engineCapacity: '1300cc',
        currentOdometer: 60000,
        isPrimary: true,
        iStatus: 'Active',
        createdBy: 'ADMIN',
        createdAt: new Date(),
        updatedBy: 'ADMIN',
        updatedAt: new Date(),
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Customer Vehicles created (10 vehicles total)');

  // ============================================================================
  // 12. EMPLOYEES (10 employees)
  // ============================================================================
  console.log('👤 Seeding Employees...');

  const employee = await prisma.cmf_Employee.upsert({
    where: {
      company_id_id: {
        company_id: 'BIP',
        id: 'EMP-001',
      },
    },
    update: {},
    create: {
      id: 'EMP-001',
      employeeCode: 'EMP-001',
      name: 'Andi Wijaya',
      nickname: 'Andi',
      email: 'andi.wijaya@ngebengkel.com',
      mobile: '081987654321',
      birthDate: new Date('1990-05-15'),
      gender: 'M',
      identityNumber: '3174051505900001',
      address: 'Jl. Sudirman No. 123',
      city: 'Jakarta Selatan',
      province: 'DKI Jakarta',
      postalCode: '12190',
      joinDate: new Date('2020-01-01'),
      employmentStatus: 'Permanent',
      department: 'Service',
      position: 'Mechanic',
      bankName: 'Bank Mandiri',
      bankAccountNo: '1234567890',
      bankAccountName: 'Andi Wijaya',
      iStatus: 'Active',
      createdBy: 'ADMIN',
      createdAt: new Date(),
      updatedBy: 'ADMIN',
      updatedAt: new Date(),
      company_id: 'BIP',
      branch_id: 'BIP-MAIN',
    },
  });

  // Tambahan 2 employees
  await prisma.cmf_Employee.createMany({
    data: [
      {
        id: 'EMP-002',
        employeeCode: 'EMP-002',
        name: 'Budi Santoso',
        nickname: 'Budi',
        email: 'budi.santoso@ngebengkel.com',
        mobile: '081987654322',
        birthDate: new Date('1988-08-20'),
        gender: 'M',
        identityNumber: '3174082008880002',
        address: 'Jl. Gatot Subroto No. 456',
        city: 'Jakarta Pusat',
        province: 'DKI Jakarta',
        postalCode: '10270',
        joinDate: new Date('2021-06-01'),
        employmentStatus: 'Permanent',
        department: 'Service',
        position: 'Mechanic',
        bankName: 'Bank BCA',
        bankAccountNo: '2234567890',
        bankAccountName: 'Budi Santoso',
        iStatus: 'Active',
        createdBy: 'ADMIN',
        createdAt: new Date(),
        updatedBy: 'ADMIN',
        updatedAt: new Date(),
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
      {
        id: 'EMP-003',
        employeeCode: 'EMP-003',
        name: 'Siti Aminah',
        nickname: 'Siti',
        email: 'siti.aminah@ngebengkel.com',
        mobile: '081987654323',
        birthDate: new Date('1995-03-12'),
        gender: 'F',
        identityNumber: '3174031203950003',
        address: 'Jl. HR Rasuna Said No. 789',
        city: 'Jakarta Selatan',
        province: 'DKI Jakarta',
        postalCode: '12940',
        joinDate: new Date('2022-01-15'),
        employmentStatus: 'Permanent',
        department: 'Admin',
        position: 'Admin',
        bankName: 'Bank BRI',
        bankAccountNo: '3334567890',
        bankAccountName: 'Siti Aminah',
        iStatus: 'Active',
        createdBy: 'ADMIN',
        createdAt: new Date(),
        updatedBy: 'ADMIN',
        updatedAt: new Date(),
        company_id: 'BIP',
        branch_id: 'BIP-MAIN',
      },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Employees created (3 employees total)');

  // ============================================================================
  // 13. MECHANICS (2 mechanics dari 3 employees)
  // ============================================================================
  console.log('🔧 Seeding Mechanics...');

  const mechanic = await prisma.cmf_Mechanic.upsert({
    where: {
      company_id_id: {
        company_id: 'BIP',
        id: 'MECH-001',
      },
    },
    update: {},
    create: {
      id: 'MECH-001',
      employee_id: 'EMP-001',
      specialization: 'Mesin & Elektrik',
      level: 'SENIOR',
      isAvailable: true,
      iStatus: 'Active',
      createdBy: 'ADMIN',
      createdAt: new Date(),
      updatedBy: 'ADMIN',
      updatedAt: new Date(),
      company_id: 'BIP',
      branch_id: 'BIP-MAIN',
    },
  });

  // Mechanic kedua (Budi)
  await prisma.cmf_Mechanic.create({
    data: {
      id: 'MECH-002',
      employee_id: 'EMP-002',
      specialization: 'Body & Cat',
      level: 'JUNIOR',
      isAvailable: true,
      iStatus: 'Active',
      createdBy: 'ADMIN',
      createdAt: new Date(),
      updatedBy: 'ADMIN',
      updatedAt: new Date(),
      company_id: 'BIP',
      branch_id: 'BIP-MAIN',
    },
  });
  console.log('✅ Mechanics created (2 mechanics total)');

  // ============================================================================
  // 14. SERVICE BAY
  // ============================================================================
  console.log('🏗️ Seeding Service Bay...');

  const serviceBay = await prisma.wks_ServiceBay.upsert({
    where: {
      company_id_id: {
        company_id: 'BIP',
        id: 'BAY-001',
      },
    },
    update: {},
    create: {
      id: 'BAY-001',
      name: 'Bay 1',
      bayType: 'GENERAL',
      capacity: 1,
      isOccupied: false,
      iStatus: 'Active',
      createdBy: 'ADMIN',
      createdAt: new Date(),
      updatedBy: 'ADMIN',
      updatedAt: new Date(),
      company_id: 'BIP',
      branch_id: 'BIP-MAIN',
    },
  });
  console.log('✅ Service Bay created');

  // ============================================================================
  // 15. SERVICE TYPE
  // ============================================================================
  console.log('⚙️ Seeding Service Type...');

  const serviceType1 = await prisma.wks_ServiceType.upsert({
    where: {
      company_id_id: {
        company_id: 'BIP',
        id: 'SVC-001',
      },
    },
    update: {},
    create: {
      id: 'SVC-001',
      name: 'Ganti Oli Mesin',
      category: 'MAINTENANCE',
      description: 'Ganti oli mesin + filter',
      estimatedTime: 30,
      defaultPrice: 150000,
      iStatus: 'Active',
      createdBy: 'ADMIN',
      createdAt: new Date(),
      updatedBy: 'ADMIN',
      updatedAt: new Date(),
      company_id: 'BIP',
      branch_id: 'BIP-MAIN',
    },
  });

  const serviceType2 = await prisma.wks_ServiceType.upsert({
    where: {
      company_id_id: {
        company_id: 'BIP',
        id: 'SVC-002',
      },
    },
    update: {},
    create: {
      id: 'SVC-002',
      name: 'Ganti Kampas Rem',
      category: 'REPAIR',
      description: 'Ganti kampas rem depan/belakang',
      estimatedTime: 60,
      defaultPrice: 200000,
      iStatus: 'Active',
      createdBy: 'ADMIN',
      createdAt: new Date(),
      updatedBy: 'ADMIN',
      updatedAt: new Date(),
      company_id: 'BIP',
      branch_id: 'BIP-MAIN',
    },
  });
  console.log('✅ Service Types created');

  // ============================================================================
  // 16. PAYMENT METHOD
  // ============================================================================
  console.log('💳 Seeding Payment Method...');

  await prisma.cmf_PaymentMethod.upsert({
    where: {
      company_id_id: {
        company_id: 'BIP',
        id: 'CASH',
      },
    },
    update: {},
    create: {
      id: 'CASH',
      name: 'Tunai',
      methodType: 'CASH',
      requireBankAccount: false,
      requireReference: false,
      iStatus: 'Active',
      createdBy: 'SYSTEM',
      createdAt: new Date(),
      updatedBy: 'SYSTEM',
      updatedAt: new Date(),
      company_id: 'BIP',
      branch_id: 'BIP-MAIN',
    },
  });

  await prisma.cmf_PaymentMethod.upsert({
    where: {
      company_id_id: {
        company_id: 'BIP',
        id: 'TRANSFER',
      },
    },
    update: {},
    create: {
      id: 'TRANSFER',
      name: 'Transfer Bank',
      methodType: 'BANK',
      requireBankAccount: true,
      requireReference: true,
      iStatus: 'Active',
      createdBy: 'SYSTEM',
      createdAt: new Date(),
      updatedBy: 'SYSTEM',
      updatedAt: new Date(),
      company_id: 'BIP',
      branch_id: 'BIP-MAIN',
    },
  });

  await prisma.cmf_PaymentMethod.upsert({
    where: {
      company_id_id: {
        company_id: 'BIP',
        id: 'QRIS',
      },
    },
    update: {},
    create: {
      id: 'QRIS',
      name: 'QRIS',
      methodType: 'QRIS',
      requireBankAccount: false,
      requireReference: true,
      processingFee: 0.7,
      iStatus: 'Active',
      createdBy: 'SYSTEM',
      createdAt: new Date(),
      updatedBy: 'SYSTEM',
      updatedAt: new Date(),
      company_id: 'BIP',
      branch_id: 'BIP-MAIN',
    },
  });
  console.log('✅ Payment Methods created');

  // ============================================================================
  // 17. TAX SCHEME
  // ============================================================================
  console.log('💰 Seeding Tax Scheme...');

  await prisma.cmf_TaxScheme.upsert({
    where: {
      company_id_id: {
        company_id: 'BIP',
        id: 'T1',
      },
    },
    update: {},
    create: {
      id: 'T1',
      schemeCode: 'T1',
      name: 'PPN 11%',
      taxType: 'SALES',
      category: 'VAT',
      isInclusive: false,
      defaultRate: 11.0,
      isDefault: true,
      iStatus: 'Active',
      createdBy: 'SYSTEM',
      createdAt: new Date(),
      updatedBy: 'SYSTEM',
      updatedAt: new Date(),
      company_id: 'BIP',
      branch_id: 'BIP-MAIN',
    },
  });
  console.log('✅ Tax Scheme created');

  // ============================================================================
  // 18. CHART OF ACCOUNT (COA) - Basic
  // ============================================================================
  console.log('📚 Seeding Chart of Account...');

  // Asset - Account Receivable
  await prisma.acc_COA.upsert({
    where: {
      company_id_id: {
        company_id: 'BIP',
        id: '1-1200',
      },
    },
    update: {},
    create: {
      id: '1-1200',
      accountCode: '1-1200',
      accountName: 'Piutang Usaha',
      accountType: 'ASSET',
      accountGroup: 'Current Asset',
      normalBalance: 'DEBIT',
      level: 2,
      isHeader: false,
      isAR: true,
      iStatus: 'Active',
      createdBy: 'SYSTEM',
      createdAt: new Date(),
      updatedBy: 'SYSTEM',
      updatedAt: new Date(),
      company_id: 'BIP',
      branch_id: 'BIP-MAIN',
    },
  });

  // Asset - Cash
  await prisma.acc_COA.upsert({
    where: {
      company_id_id: {
        company_id: 'BIP',
        id: '1-1100',
      },
    },
    update: {},
    create: {
      id: '1-1100',
      accountCode: '1-1100',
      accountName: 'Kas',
      accountType: 'ASSET',
      accountGroup: 'Current Asset',
      normalBalance: 'DEBIT',
      level: 2,
      isHeader: false,
      isCash: true,
      iStatus: 'Active',
      createdBy: 'SYSTEM',
      createdAt: new Date(),
      updatedBy: 'SYSTEM',
      updatedAt: new Date(),
      company_id: 'BIP',
      branch_id: 'BIP-MAIN',
    },
  });

  // Liability - PPN Keluaran
  await prisma.acc_COA.upsert({
    where: {
      company_id_id: {
        company_id: 'BIP',
        id: '2-3000',
      },
    },
    update: {},
    create: {
      id: '2-3000',
      accountCode: '2-3000',
      accountName: 'PPN Keluaran',
      accountType: 'LIABILITY',
      accountGroup: 'Current Liability',
      normalBalance: 'CREDIT',
      level: 2,
      isHeader: false,
      iStatus: 'Active',
      createdBy: 'SYSTEM',
      createdAt: new Date(),
      updatedBy: 'SYSTEM',
      updatedAt: new Date(),
      company_id: 'BIP',
      branch_id: 'BIP-MAIN',
    },
  });

  // Revenue - Service Revenue
  await prisma.acc_COA.upsert({
    where: {
      company_id_id: {
        company_id: 'BIP',
        id: '4-1000',
      },
    },
    update: {},
    create: {
      id: '4-1000',
      accountCode: '4-1000',
      accountName: 'Pendapatan Jasa Service',
      accountType: 'REVENUE',
      accountGroup: 'Operating Revenue',
      normalBalance: 'CREDIT',
      level: 2,
      isHeader: false,
      iStatus: 'Active',
      createdBy: 'SYSTEM',
      createdAt: new Date(),
      updatedBy: 'SYSTEM',
      updatedAt: new Date(),
      company_id: 'BIP',
      branch_id: 'BIP-MAIN',
    },
  });

  // Revenue - Parts Sales
  await prisma.acc_COA.upsert({
    where: {
      company_id_id: {
        company_id: 'BIP',
        id: '4-2000',
      },
    },
    update: {},
    create: {
      id: '4-2000',
      accountCode: '4-2000',
      accountName: 'Pendapatan Penjualan Spare Parts',
      accountType: 'REVENUE',
      accountGroup: 'Operating Revenue',
      normalBalance: 'CREDIT',
      level: 2,
      isHeader: false,
      iStatus: 'Active',
      createdBy: 'SYSTEM',
      createdAt: new Date(),
      updatedBy: 'SYSTEM',
      updatedAt: new Date(),
      company_id: 'BIP',
      branch_id: 'BIP-MAIN',
    },
  });
  console.log('✅ Chart of Account created');

  // ============================================================================
  // 19. SERVICE ORDER (Customer Pak Budi datang)
  // ============================================================================
  console.log('📋 Seeding Service Order...');

  const serviceDate = new Date('2025-10-15T09:00:00');

  const serviceOrder = await prisma.wks_ServiceOrder.upsert({
    where: {
      company_id_id: {
        company_id: 'BIP',
        id: 'SO-2025-10-00001',
      },
    },
    update: {},
    create: {
      id: 'SO-2025-10-00001',
      orderNumber: 'SO/2025/10/00001',
      orderDate: serviceDate,
      customer_id: 'CUST-001',
      customerVehicle_id: 'VEH-001',
      vehicle_customer_id: 'CUST-001',
      odometerIn: 45123,
      fuelLevel: 'HALF',
      mechanic_id: 'MECH-001',
      serviceBay_id: 'BAY-001',
      scheduledStartDate: serviceDate,
      scheduledEndDate: new Date('2025-10-15T11:00:00'),
      // Keluhan Customer
      customerComplaint: 'Mesin agak kasar saat akselerasi, rem bunyi',
      serviceRequest: 'Service berkala + cek rem',
      // Status
      orderStatus: 'CONFIRMED',
      priority: 'NORMAL',
      iStatus: 'Active',
      createdBy: 'ADMIN',
      createdAt: new Date(),
      updatedBy: 'ADMIN',
      updatedAt: new Date(),
      company_id: 'BIP',
      branch_id: 'BIP-MAIN',
    },
  });
  console.log('✅ Service Order created:', serviceOrder.orderNumber);

  // ============================================================================
  // 20. SERVICE ORDER DETAILS (Pekerjaan & Parts)
  // ============================================================================
  console.log('📝 Seeding Service Order Details...');

  // Detail 1: Ganti Oli (Service)
  await prisma.wks_ServiceOrderDetail.upsert({
    where: {
      company_id_id: {
        company_id: 'BIP',
        id: 'SOD/2025/10/00001',
      },
    },
    update: {},
    create: {
      id: 'SOD/2025/10/00001',
      serviceOrder_id: 'SO-2025-10-00001',
      lineNumber: 1,
      detailType: 'SERVICE',
      serviceType_id: 'SVC-001',
      serviceName: 'Ganti Oli Mesin',
      serviceDescription: 'Ganti oli mesin + filter oli',
      mechanic_id: 'MECH-001',
      quantity: 1,
      unitPrice: 150000,
      subtotal: 150000,
      detailStatus: 'PENDING',
      iStatus: 'Active',
      createdBy: 'ADMIN',
      createdAt: new Date(),
      updatedBy: 'ADMIN',
      updatedAt: new Date(),
      company_id: 'BIP',
      branch_id: 'BIP-MAIN',
    },
  });

  // Detail 2: Oli Shell (Part)
  await prisma.wks_ServiceOrderDetail.upsert({
    where: {
      company_id_id: {
        company_id: 'BIP',
        id: 'SOD/2025/10/00002',
      },
    },
    update: {},
    create: {
      id: 'SOD/2025/10/00002',
      serviceOrder_id: 'SO-2025-10-00001',
      lineNumber: 2,
      detailType: 'PART',
      product_id: 'PROD-001',
      partName: 'Shell Helix HX7 5W-30 4L',
      mechanic_id: 'MECH-001',
      quantity: 1,
      unitPrice: 350000,
      subtotal: 350000,
      detailStatus: 'PENDING',
      iStatus: 'Active',
      createdBy: 'ADMIN',
      createdAt: new Date(),
      updatedBy: 'ADMIN',
      updatedAt: new Date(),
      company_id: 'BIP',
      branch_id: 'BIP-MAIN',
    },
  });

  // Detail 3: Filter Oli (Part)
  await prisma.wks_ServiceOrderDetail.upsert({
    where: {
      company_id_id: {
        company_id: 'BIP',
        id: 'SOD/2025/10/00003',
      },
    },
    update: {},
    create: {
      id: 'SOD/2025/10/00003',
      serviceOrder_id: 'SO-2025-10-00001',
      lineNumber: 3,
      detailType: 'PART',
      product_id: 'PROD-002',
      partName: 'Filter Oli Toyota',
      mechanic_id: 'MECH-001',
      quantity: 1,
      unitPrice: 65000,
      subtotal: 65000,
      detailStatus: 'PENDING',
      iStatus: 'Active',
      createdBy: 'ADMIN',
      createdAt: new Date(),
      updatedBy: 'ADMIN',
      updatedAt: new Date(),
      company_id: 'BIP',
      branch_id: 'BIP-MAIN',
    },
  });

  // Detail 4: Ganti Kampas Rem (Service)
  await prisma.wks_ServiceOrderDetail.upsert({
    where: {
      company_id_id: {
        company_id: 'BIP',
        id: 'SOD/2025/10/00004',
      },
    },
    update: {},
    create: {
      id: 'SOD/2025/10/00004',
      serviceOrder_id: 'SO-2025-10-00001',
      lineNumber: 4,
      detailType: 'SERVICE',
      serviceType_id: 'SVC-002',
      serviceName: 'Ganti Kampas Rem Depan',
      mechanic_id: 'MECH-001',
      quantity: 1,
      unitPrice: 200000,
      subtotal: 200000,
      detailStatus: 'PENDING',
      iStatus: 'Active',
      createdBy: 'ADMIN',
      createdAt: new Date(),
      updatedBy: 'ADMIN',
      updatedAt: new Date(),
      company_id: 'BIP',
      branch_id: 'BIP-MAIN',
    },
  });

  // Detail 5: Kampas Rem (Part)
  await prisma.wks_ServiceOrderDetail.upsert({
    where: {
      company_id_id: {
        company_id: 'BIP',
        id: 'SOD/2025/10/00005',
      },
    },
    update: {},
    create: {
      id: 'SOD/2025/10/00005',
      serviceOrder_id: 'SO-2025-10-00001',
      lineNumber: 5,
      detailType: 'PART',
      product_id: 'PROD-003',
      partName: 'Kampas Rem Depan Toyota Avanza',
      mechanic_id: 'MECH-001',
      quantity: 1,
      unitPrice: 650000,
      subtotal: 650000,
      detailStatus: 'PENDING',
      iStatus: 'Active',
      createdBy: 'ADMIN',
      createdAt: new Date(),
      updatedBy: 'ADMIN',
      updatedAt: new Date(),
      company_id: 'BIP',
      branch_id: 'BIP-MAIN',
    },
  });
  console.log('✅ Service Order Details created (5 items)');

  // ============================================================================
  // 21. INVOICE
  // ============================================================================
  console.log('🧾 Seeding Invoice...');

  // Calculation:
  // Service: 150,000 + 200,000 = 350,000
  // Parts: 350,000 + 65,000 + 650,000 = 1,065,000
  // Subtotal: 1,415,000
  // PPN 11%: 155,650
  // Total: 1,570,650

  const invoice = await prisma.arm_Invoice.upsert({
    where: {
      company_id_id: {
        company_id: 'BIP',
        id: 'INV/2025/10/00001',
      },
    },
    update: {},
    create: {
      id: 'INV/2025/10/00001',
      invoiceNumber: 'INV/2025/10/00001',
      invoiceDate: new Date('2025-10-15T11:30:00'),
      dueDate: new Date('2025-10-15'),
      transaction_type: 'INV',
      transaction_class: 'SALES',
      taxScheme_id: 'T1',
      source_module: 'SERVICE',
      source_document_id: 'SO-2025-10-00001',
      source_document_number: 'SO/2025/10/00001',
      customer_id: 'CUST-001',
      customerName: 'Budi Santoso',
      customerPhone: '081234567890',
      customerVehicle_id: 'VEH-001',
      vehicle_customer_id: 'CUST-001',
      vehicleInfo: 'Toyota Avanza 2020 - B 1234 XYZ',
      subtotalAmount: 1415000,
      taxPercent: 11.0,
      taxAmount: 155650,
      totalAmount: 1570650,
      paidAmount: 0,
      outstandingAmount: 1570650,
      invoiceStatus: 'SENT',
      paymentStatus: 'UNPAID',
      isPosted: false,
      notes: 'Service berkala + ganti oli + ganti kampas rem',
      iStatus: 'Active',
      createdBy: 'ADMIN',
      createdAt: new Date(),
      updatedBy: 'ADMIN',
      updatedAt: new Date(),
      company_id: 'BIP',
      branch_id: 'BIP-MAIN',
    },
  });
  console.log('✅ Invoice created:', invoice.invoiceNumber);

  // ============================================================================
  // 22. INVOICE DETAILS
  // ============================================================================
  console.log('📄 Seeding Invoice Details...');

  // Line 1: Ganti Oli (Service)
  await prisma.arm_InvoiceDetail.upsert({
    where: {
      company_id_id: {
        company_id: 'BIP',
        id: 'IND/2025/10/00001',
      },
    },
    update: {},
    create: {
      id: 'IND/2025/10/00001',
      invoice_id: 'INV/2025/10/00001',
      lineNumber: 1,
      itemType: 'SERVICE',
      itemName: 'Ganti Oli Mesin',
      itemDescription: 'Ganti oli mesin + filter',
      quantity: 1,
      unitPrice: 150000,
      subtotal: 150000,
      iStatus: 'Active',
      createdBy: 'ADMIN',
      createdAt: new Date(),
      updatedBy: 'ADMIN',
      updatedAt: new Date(),
      company_id: 'BIP',
      branch_id: 'BIP-MAIN',
    },
  });

  // Line 2: Oli Shell
  await prisma.arm_InvoiceDetail.upsert({
    where: {
      company_id_id: {
        company_id: 'BIP',
        id: 'IND/2025/10/00002',
      },
    },
    update: {},
    create: {
      id: 'IND/2025/10/00002',
      invoice_id: 'INV/2025/10/00001',
      lineNumber: 2,
      itemType: 'PART',
      item_id: 'PROD-001',
      itemCode: 'PROD-001',
      itemName: 'Shell Helix HX7 5W-30 4L',
      quantity: 1,
      uom: 'LITER',
      unitPrice: 350000,
      subtotal: 350000,
      iStatus: 'Active',
      createdBy: 'ADMIN',
      createdAt: new Date(),
      updatedBy: 'ADMIN',
      updatedAt: new Date(),
      company_id: 'BIP',
      branch_id: 'BIP-MAIN',
    },
  });

  // Line 3: Filter Oli
  await prisma.arm_InvoiceDetail.upsert({
    where: {
      company_id_id: {
        company_id: 'BIP',
        id: 'IND/2025/10/00003',
      },
    },
    update: {},
    create: {
      id: 'IND/2025/10/00003',
      invoice_id: 'INV/2025/10/00001',
      lineNumber: 3,
      itemType: 'PART',
      item_id: 'PROD-002',
      itemCode: 'PROD-002',
      itemName: 'Filter Oli Toyota',
      quantity: 1,
      uom: 'PCS',
      unitPrice: 65000,
      subtotal: 65000,
      iStatus: 'Active',
      createdBy: 'ADMIN',
      createdAt: new Date(),
      updatedBy: 'ADMIN',
      updatedAt: new Date(),
      company_id: 'BIP',
      branch_id: 'BIP-MAIN',
    },
  });

  // Line 4: Ganti Kampas Rem (Service)
  await prisma.arm_InvoiceDetail.upsert({
    where: {
      company_id_id: {
        company_id: 'BIP',
        id: 'IND/2025/10/00004',
      },
    },
    update: {},
    create: {
      id: 'IND/2025/10/00004',
      invoice_id: 'INV/2025/10/00001',
      lineNumber: 4,
      itemType: 'SERVICE',
      itemName: 'Ganti Kampas Rem Depan',
      quantity: 1,
      unitPrice: 200000,
      subtotal: 200000,
      iStatus: 'Active',
      createdBy: 'ADMIN',
      createdAt: new Date(),
      updatedBy: 'ADMIN',
      updatedAt: new Date(),
      company_id: 'BIP',
      branch_id: 'BIP-MAIN',
    },
  });

  // Line 5: Kampas Rem (Part)
  await prisma.arm_InvoiceDetail.upsert({
    where: {
      company_id_id: {
        company_id: 'BIP',
        id: 'IND/2025/10/00005',
      },
    },
    update: {},
    create: {
      id: 'IND/2025/10/00005',
      invoice_id: 'INV/2025/10/00001',
      lineNumber: 5,
      itemType: 'PART',
      item_id: 'PROD-003',
      itemCode: 'PROD-003',
      itemName: 'Kampas Rem Depan Toyota Avanza',
      quantity: 1,
      uom: 'PCS',
      unitPrice: 650000,
      subtotal: 650000,
      iStatus: 'Active',
      createdBy: 'ADMIN',
      createdAt: new Date(),
      updatedBy: 'ADMIN',
      updatedAt: new Date(),
      company_id: 'BIP',
      branch_id: 'BIP-MAIN',
    },
  });
  console.log('✅ Invoice Details created (5 items)');

  console.log('\n🎉 Seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log('- Company: Bengkel Inovasi Prima');
  console.log('- Customer: Budi Santoso');
  console.log('- Vehicle: Toyota Avanza 2020 (B 1234 XYZ)');
  console.log('- Mechanic: Andi Wijaya (SENIOR)');
  console.log('- Service Order: SO/2025/10/00001');
  console.log('- Invoice: INV/2025/10/00001');
  console.log('- Total Amount: Rp 1,570,650');
  console.log('  • Service: Rp 350,000');
  console.log('  • Parts: Rp 1,065,000');
  console.log('  • PPN 11%: Rp 155,650');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error during seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
