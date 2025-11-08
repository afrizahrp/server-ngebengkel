import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting master bulk insert seed...');
  console.log('📦 Seeding master and transaction tables (excluding SAAS, SYS tables)');

  const company_id = 'NGB';
  const branch_id = 'MAIN';
  const createdBy = 'SEEDER';

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
      // 1. SEED INVENTORY & WAREHOUSE MANAGEMENT (IMC)
      // ============================================================
      console.log('\n📦 Creating inventory warehouse data...');

      // Warehouse
      const warehouses = await Promise.all([
        tx.imc_Warehouse.upsert({
          where: { id: 'WH01' },
          update: {},
          create: {
            id: 'WH01',
            name: 'Gudang Utama',
            iMain: 1,
            iStatus: 'Active',
            address: 'Jl. Gudang Utama No. 1',
            postalCode: '12345',
            phone: '0211234567',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.imc_Warehouse.upsert({
          where: { id: 'WH02' },
          update: {},
          create: {
            id: 'WH02',
            name: 'Gudang Sparepart',
            iMain: 2,
            iStatus: 'Active',
            address: 'Jl. Sparepart No. 2',
            postalCode: '12346',
            phone: '0211234568',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
      ]);
      seedCount += warehouses.length;
      console.log(`   ✅ Created ${warehouses.length} warehouses`);

      // Floor
      const floors = await Promise.all([
        tx.imc_Floor.upsert({
          where: { id: 'FL001' },
          update: {},
          create: {
            warehouse_id: 'WH01',
            id: 'FL001',
            name: 'Lantai 1',
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.imc_Floor.upsert({
          where: { id: 'FL002' },
          update: {},
          create: {
            warehouse_id: 'WH01',
            id: 'FL002',
            name: 'Lantai 2',
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.imc_Floor.upsert({
          where: { id: 'FL003' },
          update: {},
          create: {
            warehouse_id: 'WH02',
            id: 'FL003',
            name: 'Lantai 1',
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
      ]);
      seedCount += floors.length;
      console.log(`   ✅ Created ${floors.length} floors`);

      // Shelf
      const shelves = await Promise.all([
        tx.imc_Shelf.upsert({
          where: { floor_id_id: { floor_id: 'FL001', id: 'SH001' } },
          update: {},
          create: {
            floor_id: 'FL001',
            id: 'SH001',
            name: 'Rak A',
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.imc_Shelf.upsert({
          where: { floor_id_id: { floor_id: 'FL001', id: 'SH002' } },
          update: {},
          create: {
            floor_id: 'FL001',
            id: 'SH002',
            name: 'Rak B',
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.imc_Shelf.upsert({
          where: { floor_id_id: { floor_id: 'FL002', id: 'SH001' } },
          update: {},
          create: {
            floor_id: 'FL002',
            id: 'SH001',
            name: 'Rak C',
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
      ]);
      seedCount += shelves.length;
      console.log(`   ✅ Created ${shelves.length} shelves`);

      // Row
      const rows = await Promise.all([
        tx.imc_Row.upsert({
          where: {
            floor_id_shelf_id_id: {
              floor_id: 'FL001',
              shelf_id: 'SH001',
              id: 'RW001',
            },
          },
          update: {},
          create: {
            floor_id: 'FL001',
            shelf_id: 'SH001',
            id: 'RW001',
            name: 'Baris 1',
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.imc_Row.upsert({
          where: {
            floor_id_shelf_id_id: {
              floor_id: 'FL001',
              shelf_id: 'SH001',
              id: 'RW002',
            },
          },
          update: {},
          create: {
            floor_id: 'FL001',
            shelf_id: 'SH001',
            id: 'RW002',
            name: 'Baris 2',
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.imc_Row.upsert({
          where: {
            floor_id_shelf_id_id: {
              floor_id: 'FL001',
              shelf_id: 'SH002',
              id: 'RW001',
            },
          },
          update: {},
          create: {
            floor_id: 'FL001',
            shelf_id: 'SH002',
            id: 'RW001',
            name: 'Baris 3',
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
      ]);
      seedCount += rows.length;
      console.log(`   ✅ Created ${rows.length} rows`);

      // UOM
      const uoms = await Promise.all([
        tx.imc_Uom.upsert({
          where: { company_id_id: { company_id, id: 'UOM001' } },
          update: {},
          create: {
            id: 'UOM001',
            name: 'PCS',
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.imc_Uom.upsert({
          where: { company_id_id: { company_id, id: 'UOM002' } },
          update: {},
          create: {
            id: 'UOM002',
            name: 'BOX',
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.imc_Uom.upsert({
          where: { company_id_id: { company_id, id: 'UOM003' } },
          update: {},
          create: {
            id: 'UOM003',
            name: 'KG',
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
      ]);
      seedCount += uoms.length;
      console.log(`   ✅ Created ${uoms.length} UOMs`);

      // CategoryType
      const categoryType1 = await tx.imc_CategoryType.create({
        data: {
          name: 'Sparepart',
          iStatus: 'Active',
          createdBy,
          createdAt: new Date(),
          updatedBy: createdBy,
          updatedAt: new Date(),
          company_id,
        },
      });

      const categoryType2 = await tx.imc_CategoryType.create({
        data: {
          name: 'Material',
          iStatus: 'Active',
          createdBy,
          createdAt: new Date(),
          updatedBy: createdBy,
          updatedAt: new Date(),
          company_id,
        },
      });

      const categoryType3 = await tx.imc_CategoryType.create({
        data: {
          name: 'Service',
          iStatus: 'Active',
          createdBy,
          createdAt: new Date(),
          updatedBy: createdBy,
          updatedAt: new Date(),
          company_id,
        },
      });

      seedCount += 3;
      console.log('   ✅ Created 3 category types');

      // Category
      const categories = await Promise.all([
        tx.imc_Category.upsert({
          where: { company_id_id: { company_id, id: 'CAT001' } },
          update: {},
          create: {
            type: categoryType1.id,
            id: 'CAT001',
            name: 'Oli & Fluida',
            seq: 1,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.imc_Category.upsert({
          where: { company_id_id: { company_id, id: 'CAT002' } },
          update: {},
          create: {
            type: categoryType1.id,
            id: 'CAT002',
            name: 'Filter',
            seq: 2,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.imc_Category.upsert({
          where: { company_id_id: { company_id, id: 'CAT003' } },
          update: {},
          create: {
            type: categoryType1.id,
            id: 'CAT003',
            name: 'Ban',
            seq: 3,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.imc_Category.upsert({
          where: { company_id_id: { company_id, id: 'CAT004' } },
          update: {},
          create: {
            type: categoryType1.id,
            id: 'CAT004',
            name: 'Battery',
            seq: 4,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.imc_Category.upsert({
          where: { company_id_id: { company_id, id: 'CAT005' } },
          update: {},
          create: {
            type: categoryType1.id,
            id: 'CAT005',
            name: 'Lampu',
            seq: 5,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
      ]);
      seedCount += categories.length;
      console.log(`   ✅ Created ${categories.length} categories`);

      // SubCategory
      const subCategories = await Promise.all([
        tx.imc_SubCategory.upsert({
          where: {
            company_id_category_id_id: { company_id, category_id: 'CAT001', id: 'SCAT01' },
          },
          update: {},
          create: {
            id: 'SCAT01',
            category_id: 'CAT001',
            name: 'Oli Mesin',
            seq: 1,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.imc_SubCategory.upsert({
          where: {
            company_id_category_id_id: { company_id, category_id: 'CAT001', id: 'SCAT02' },
          },
          update: {},
          create: {
            id: 'SCAT02',
            category_id: 'CAT001',
            name: 'Oli Gardan',
            seq: 2,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.imc_SubCategory.upsert({
          where: {
            company_id_category_id_id: { company_id, category_id: 'CAT002', id: 'SCAT01' },
          },
          update: {},
          create: {
            id: 'SCAT01',
            category_id: 'CAT002',
            name: 'Filter Udara',
            seq: 1,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.imc_SubCategory.upsert({
          where: {
            company_id_category_id_id: { company_id, category_id: 'CAT002', id: 'SCAT02' },
          },
          update: {},
          create: {
            id: 'SCAT02',
            category_id: 'CAT002',
            name: 'Filter Oli',
            seq: 2,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.imc_SubCategory.upsert({
          where: {
            company_id_category_id_id: { company_id, category_id: 'CAT003', id: 'SCAT01' },
          },
          update: {},
          create: {
            id: 'SCAT01',
            category_id: 'CAT003',
            name: 'Ban Mobil',
            seq: 1,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
      ]);
      seedCount += subCategories.length;
      console.log(`   ✅ Created ${subCategories.length} sub categories`);

      // Brand
      const brands = await Promise.all([
        tx.imc_Brand.upsert({
          where: { company_id_id: { company_id, id: 'BRAND01' } },
          update: {},
          create: {
            id: 'BRAND01',
            name: 'Shell',
            slug: 'shell',
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.imc_Brand.upsert({
          where: { company_id_id: { company_id, id: 'BRAND02' } },
          update: {},
          create: {
            id: 'BRAND02',
            name: 'Total',
            slug: 'total',
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.imc_Brand.upsert({
          where: { company_id_id: { company_id, id: 'BRAND03' } },
          update: {},
          create: {
            id: 'BRAND03',
            name: 'Yamalube',
            slug: 'yamalube',
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.imc_Brand.upsert({
          where: { company_id_id: { company_id, id: 'BRAND04' } },
          update: {},
          create: {
            id: 'BRAND04',
            name: 'Bosch',
            slug: 'bosch',
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.imc_Brand.upsert({
          where: { company_id_id: { company_id, id: 'BRAND05' } },
          update: {},
          create: {
            id: 'BRAND05',
            name: 'Michelin',
            slug: 'michelin',
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
      ]);
      seedCount += brands.length;
      console.log(`   ✅ Created ${brands.length} brands`);

      // VariantType
      const variantTypes = await Promise.all([
        tx.imc_VariantType.upsert({
          where: { company_id_id: { company_id, id: 'VT001' } },
          update: {},
          create: {
            id: 'VT001',
            name: 'Kemasan',
            seq: 1,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.imc_VariantType.upsert({
          where: { company_id_id: { company_id, id: 'VT002' } },
          update: {},
          create: {
            id: 'VT002',
            name: 'Warna',
            seq: 2,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.imc_VariantType.upsert({
          where: { company_id_id: { company_id, id: 'VT003' } },
          update: {},
          create: {
            id: 'VT003',
            name: 'Ukuran',
            seq: 3,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.imc_VariantType.upsert({
          where: { company_id_id: { company_id, id: 'VT004' } },
          update: {},
          create: {
            id: 'VT004',
            name: 'Type',
            seq: 4,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.imc_VariantType.upsert({
          where: { company_id_id: { company_id, id: 'VT005' } },
          update: {},
          create: {
            id: 'VT005',
            name: 'Grade',
            seq: 5,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
      ]);
      seedCount += variantTypes.length;
      console.log(`   ✅ Created ${variantTypes.length} variant types`);

      // VariantOption
      const variantOptions = await Promise.all([
        tx.imc_VariantOption.upsert({
          where: {
            company_id_variantType_id_id: {
              company_id,
              variantType_id: 'VT001',
              id: 'VO001',
            },
          },
          update: {},
          create: {
            id: 'VO001',
            variantType_id: 'VT001',
            name: '1 Liter',
            code: '1L',
            seq: 1,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.imc_VariantOption.upsert({
          where: {
            company_id_variantType_id_id: {
              company_id,
              variantType_id: 'VT001',
              id: 'VO002',
            },
          },
          update: {},
          create: {
            id: 'VO002',
            variantType_id: 'VT001',
            name: '4 Liter',
            code: '4L',
            seq: 2,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.imc_VariantOption.upsert({
          where: {
            company_id_variantType_id_id: {
              company_id,
              variantType_id: 'VT001',
              id: 'VO003',
            },
          },
          update: {},
          create: {
            id: 'VO003',
            variantType_id: 'VT001',
            name: '20 Liter',
            code: '20L',
            seq: 3,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.imc_VariantOption.upsert({
          where: {
            company_id_variantType_id_id: {
              company_id,
              variantType_id: 'VT002',
              id: 'VO001',
            },
          },
          update: {},
          create: {
            id: 'VO001',
            variantType_id: 'VT002',
            name: 'Merah',
            code: 'RED',
            hexColorCode: '#FF0000',
            seq: 1,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.imc_VariantOption.upsert({
          where: {
            company_id_variantType_id_id: {
              company_id,
              variantType_id: 'VT002',
              id: 'VO002',
            },
          },
          update: {},
          create: {
            id: 'VO002',
            variantType_id: 'VT002',
            name: 'Hitam',
            code: 'BLK',
            hexColorCode: '#000000',
            seq: 2,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
      ]);
      seedCount += variantOptions.length;
      console.log(`   ✅ Created ${variantOptions.length} variant options`);

      // Product
      const products = await Promise.all([
        tx.imc_Product.upsert({
          where: { company_id_id: { company_id, id: 'PROD001' } },
          update: {},
          create: {
            id: 'PROD001',
            name: 'Shell Helix Ultra 5W-40',
            category_id: 'CAT001',
            subCategory_id: 'SCAT01',
            brand_id: 'BRAND01',
            uom_id: 'UOM001',
            isMaterial: true,
            isService: false,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.imc_Product.upsert({
          where: { company_id_id: { company_id, id: 'PROD002' } },
          update: {},
          create: {
            id: 'PROD002',
            name: 'Total Quartz 7000',
            category_id: 'CAT001',
            subCategory_id: 'SCAT01',
            brand_id: 'BRAND02',
            uom_id: 'UOM001',
            isMaterial: true,
            isService: false,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.imc_Product.upsert({
          where: { company_id_id: { company_id, id: 'PROD003' } },
          update: {},
          create: {
            id: 'PROD003',
            name: 'Bosch Filter Udara',
            category_id: 'CAT002',
            subCategory_id: 'SCAT01',
            brand_id: 'BRAND04',
            uom_id: 'UOM001',
            isMaterial: true,
            isService: false,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.imc_Product.upsert({
          where: { company_id_id: { company_id, id: 'PROD004' } },
          update: {},
          create: {
            id: 'PROD004',
            name: 'Bosch Filter Oli',
            category_id: 'CAT002',
            subCategory_id: 'SCAT02',
            brand_id: 'BRAND04',
            uom_id: 'UOM001',
            isMaterial: true,
            isService: false,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.imc_Product.upsert({
          where: { company_id_id: { company_id, id: 'PROD005' } },
          update: {},
          create: {
            id: 'PROD005',
            name: 'Michelin Energy XM2 205/55R16',
            category_id: 'CAT003',
            subCategory_id: 'SCAT01',
            brand_id: 'BRAND05',
            uom_id: 'UOM001',
            isMaterial: true,
            isService: false,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
      ]);
      seedCount += products.length;
      console.log(`   ✅ Created ${products.length} products`);

      // ============================================================
      // 2. SEED PRODUCT TRANSACTION TABLES
      // ============================================================
      console.log('\n📦 Creating product variant data...');

      // ProductVariantType
      const productVariantTypes = await Promise.all([
        tx.imc_ProductVariantType.upsert({
          where: {
            company_id_product_id_variantType_id: {
              company_id,
              product_id: 'PROD001',
              variantType_id: 'VT001',
            },
          },
          update: {},
          create: {
            product_id: 'PROD001',
            variantType_id: 'VT001',
            isRequired: true,
            seq: 1,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.imc_ProductVariantType.upsert({
          where: {
            company_id_product_id_variantType_id: {
              company_id,
              product_id: 'PROD002',
              variantType_id: 'VT001',
            },
          },
          update: {},
          create: {
            product_id: 'PROD002',
            variantType_id: 'VT001',
            isRequired: true,
            seq: 1,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
      ]);
      seedCount += productVariantTypes.length;
      console.log(`   ✅ Created ${productVariantTypes.length} product variant types`);

      // ProductVariant
      const productVariants = await Promise.all([
        tx.imc_ProductVariant.upsert({
          where: { company_id_product_id_id: { company_id, product_id: 'PROD001', id: 'PV001' } },
          update: {},
          create: {
            id: 'PV001',
            product_id: 'PROD001',
            sku: 'SHU-1L',
            name: 'Shell Helix Ultra 5W-40 - 1 Liter',
            stockQty: 50,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.imc_ProductVariant.upsert({
          where: { company_id_product_id_id: { company_id, product_id: 'PROD001', id: 'PV002' } },
          update: {},
          create: {
            id: 'PV002',
            product_id: 'PROD001',
            sku: 'SHU-4L',
            name: 'Shell Helix Ultra 5W-40 - 4 Liter',
            stockQty: 30,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.imc_ProductVariant.upsert({
          where: { company_id_product_id_id: { company_id, product_id: 'PROD002', id: 'PV003' } },
          update: {},
          create: {
            id: 'PV003',
            product_id: 'PROD002',
            sku: 'TQ7-1L',
            name: 'Total Quartz 7000 - 1 Liter',
            stockQty: 40,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
      ]);
      seedCount += productVariants.length;
      console.log(`   ✅ Created ${productVariants.length} product variants`);

      // ProductVariantOption
      const productVariantOptions = await Promise.all([
        tx.imc_ProductVariantOption.upsert({
          where: {
            company_id_product_id_productVariant_id_variantType_id_variantOption_id: {
              company_id,
              product_id: 'PROD001',
              productVariant_id: 'PV001',
              variantType_id: 'VT001',
              variantOption_id: 'VO001',
            },
          },
          update: {},
          create: {
            productVariant_id: 'PV001',
            product_id: 'PROD001',
            variantType_id: 'VT001',
            variantOption_id: 'VO001',
            company_id,
            branch_id,
          },
        }),
        tx.imc_ProductVariantOption.upsert({
          where: {
            company_id_product_id_productVariant_id_variantType_id_variantOption_id: {
              company_id,
              product_id: 'PROD001',
              productVariant_id: 'PV002',
              variantType_id: 'VT001',
              variantOption_id: 'VO002',
            },
          },
          update: {},
          create: {
            productVariant_id: 'PV002',
            product_id: 'PROD001',
            variantType_id: 'VT001',
            variantOption_id: 'VO002',
            company_id,
            branch_id,
          },
        }),
        tx.imc_ProductVariantOption.upsert({
          where: {
            company_id_product_id_productVariant_id_variantType_id_variantOption_id: {
              company_id,
              product_id: 'PROD002',
              productVariant_id: 'PV003',
              variantType_id: 'VT001',
              variantOption_id: 'VO001',
            },
          },
          update: {},
          create: {
            productVariant_id: 'PV003',
            product_id: 'PROD002',
            variantType_id: 'VT001',
            variantOption_id: 'VO001',
            company_id,
            branch_id,
          },
        }),
      ]);
      seedCount += productVariantOptions.length;
      console.log(`   ✅ Created ${productVariantOptions.length} product variant options`);

      // ============================================================
      // 3. SEED VEHICLE MASTER DATA (WKS)
      // ============================================================
      console.log('\n📦 Creating vehicle master data...');

      // VehicleType
      const vehicleTypes = await Promise.all([
        tx.wks_VehicleType.upsert({
          where: { id: 'VT001' },
          update: {},
          create: {
            id: 'VT001',
            name: 'Mobil',
            seq: 1,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
          },
        }),
        tx.wks_VehicleType.upsert({
          where: { id: 'VT002' },
          update: {},
          create: {
            id: 'VT002',
            name: 'Motor',
            seq: 2,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
          },
        }),
        tx.wks_VehicleType.upsert({
          where: { id: 'VT003' },
          update: {},
          create: {
            id: 'VT003',
            name: 'Truk',
            seq: 3,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
          },
        }),
      ]);
      seedCount += vehicleTypes.length;
      console.log(`   ✅ Created ${vehicleTypes.length} vehicle types`);

      // VehicleBrand
      const vehicleBrands = await Promise.all([
        tx.wks_VehicleBrand.upsert({
          where: { vehicleType_id_id: { vehicleType_id: 'VT001', id: 'VB001' } },
          update: {},
          create: {
            vehicleType_id: 'VT001',
            id: 'VB001',
            name: 'Toyota',
            slug: 'toyota',
            seq: 1,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
          },
        }),
        tx.wks_VehicleBrand.upsert({
          where: { vehicleType_id_id: { vehicleType_id: 'VT001', id: 'VB002' } },
          update: {},
          create: {
            vehicleType_id: 'VT001',
            id: 'VB002',
            name: 'Honda',
            slug: 'honda',
            seq: 2,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
          },
        }),
        tx.wks_VehicleBrand.upsert({
          where: { vehicleType_id_id: { vehicleType_id: 'VT001', id: 'VB003' } },
          update: {},
          create: {
            vehicleType_id: 'VT001',
            id: 'VB003',
            name: 'Suzuki',
            slug: 'suzuki',
            seq: 3,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
          },
        }),
        tx.wks_VehicleBrand.upsert({
          where: { vehicleType_id_id: { vehicleType_id: 'VT002', id: 'VB004' } },
          update: {},
          create: {
            vehicleType_id: 'VT002',
            id: 'VB004',
            name: 'Yamaha',
            slug: 'yamaha',
            seq: 1,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
          },
        }),
        tx.wks_VehicleBrand.upsert({
          where: { vehicleType_id_id: { vehicleType_id: 'VT002', id: 'VB005' } },
          update: {},
          create: {
            vehicleType_id: 'VT002',
            id: 'VB005',
            name: 'Honda',
            slug: 'honda',
            seq: 2,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
          },
        }),
      ]);
      seedCount += vehicleBrands.length;
      console.log(`   ✅ Created ${vehicleBrands.length} vehicle brands`);

      // VehicleModel
      const vehicleModels = await Promise.all([
        tx.wks_VehicleModel.upsert({
          where: {
            vehicleType_id_brand_id_id: {
              vehicleType_id: 'VT001',
              brand_id: 'VB001',
              id: 'VM001',
            },
          },
          update: {},
          create: {
            vehicleType_id: 'VT001',
            brand_id: 'VB001',
            id: 'VM001',
            name: 'Avanza',
            slug: 'avanza',
            seq: 1,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
          },
        }),
        tx.wks_VehicleModel.upsert({
          where: {
            vehicleType_id_brand_id_id: {
              vehicleType_id: 'VT001',
              brand_id: 'VB001',
              id: 'VM002',
            },
          },
          update: {},
          create: {
            vehicleType_id: 'VT001',
            brand_id: 'VB001',
            id: 'VM002',
            name: 'Innova',
            slug: 'innova',
            seq: 2,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
          },
        }),
        tx.wks_VehicleModel.upsert({
          where: {
            vehicleType_id_brand_id_id: {
              vehicleType_id: 'VT001',
              brand_id: 'VB002',
              id: 'VM003',
            },
          },
          update: {},
          create: {
            vehicleType_id: 'VT001',
            brand_id: 'VB002',
            id: 'VM003',
            name: 'Jazz',
            slug: 'jazz',
            seq: 1,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
          },
        }),
        tx.wks_VehicleModel.upsert({
          where: {
            vehicleType_id_brand_id_id: {
              vehicleType_id: 'VT001',
              brand_id: 'VB002',
              id: 'VM004',
            },
          },
          update: {},
          create: {
            vehicleType_id: 'VT001',
            brand_id: 'VB002',
            id: 'VM004',
            name: 'CR-V',
            slug: 'cr-v',
            seq: 2,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
          },
        }),
        tx.wks_VehicleModel.upsert({
          where: {
            vehicleType_id_brand_id_id: {
              vehicleType_id: 'VT002',
              brand_id: 'VB004',
              id: 'VM005',
            },
          },
          update: {},
          create: {
            vehicleType_id: 'VT002',
            brand_id: 'VB004',
            id: 'VM005',
            name: 'Vario',
            slug: 'vario',
            seq: 1,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
          },
        }),
      ]);
      seedCount += vehicleModels.length;
      console.log(`   ✅ Created ${vehicleModels.length} vehicle models`);

      // ============================================================
      // 4. SEED CUSTOMER & EMPLOYEE DATA (CMF)
      // ============================================================
      console.log('\n📦 Creating customer and employee data...');

      // Employee
      const employees = await Promise.all([
        tx.cmf_Employee.upsert({
          where: { company_id_id: { company_id, id: 'EMP001' } },
          update: {},
          create: {
            id: 'EMP001',
            employeeCode: 'EMP001',
            name: 'Budi Santoso',
            nickname: 'Budi',
            email: 'budi@example.com',
            mobile: '081234567890',
            department: 'Service',
            position: 'Mekanik Senior',
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.cmf_Employee.upsert({
          where: { company_id_id: { company_id, id: 'EMP002' } },
          update: {},
          create: {
            id: 'EMP002',
            employeeCode: 'EMP002',
            name: 'Siti Nurhaliza',
            nickname: 'Siti',
            email: 'siti@example.com',
            mobile: '081234567891',
            department: 'Admin',
            position: 'Admin Service',
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.cmf_Employee.upsert({
          where: { company_id_id: { company_id, id: 'EMP003' } },
          update: {},
          create: {
            id: 'EMP003',
            employeeCode: 'EMP003',
            name: 'Ahmad Dahlan',
            nickname: 'Ahmad',
            email: 'ahmad@example.com',
            mobile: '081234567892',
            department: 'Service',
            position: 'Mekanik Junior',
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.cmf_Employee.upsert({
          where: { company_id_id: { company_id, id: 'EMP004' } },
          update: {},
          create: {
            id: 'EMP004',
            employeeCode: 'EMP004',
            name: 'Rahma Widya',
            nickname: 'Rahma',
            email: 'rahma@example.com',
            mobile: '081234567893',
            department: 'Kasir',
            position: 'Kasir',
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.cmf_Employee.upsert({
          where: { company_id_id: { company_id, id: 'EMP005' } },
          update: {},
          create: {
            id: 'EMP005',
            employeeCode: 'EMP005',
            name: 'Joko Susilo',
            nickname: 'Joko',
            email: 'joko@example.com',
            mobile: '081234567894',
            department: 'Service',
            position: 'Foreman',
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
      ]);
      seedCount += employees.length;
      console.log(`   ✅ Created ${employees.length} employees`);

      // Mechanic
      const mechanics = await Promise.all([
        tx.cmf_Mechanic.upsert({
          where: { company_id_id: { company_id, id: 'MEC001' } },
          update: {},
          create: {
            id: 'MEC001',
            employee_id: 'EMP001',
            specialization: 'Mesin & Transmisi',
            level: 'SENIOR',
            totalJobs: 0,
            averageRating: 0,
            iStatus: 'Active',
            isAvailable: true,
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.cmf_Mechanic.upsert({
          where: { company_id_id: { company_id, id: 'MEC002' } },
          update: {},
          create: {
            id: 'MEC002',
            employee_id: 'EMP003',
            specialization: 'AC & Kelistrikan',
            level: 'JUNIOR',
            totalJobs: 0,
            averageRating: 0,
            iStatus: 'Active',
            isAvailable: true,
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.cmf_Mechanic.upsert({
          where: { company_id_id: { company_id, id: 'MEC003' } },
          update: {},
          create: {
            id: 'MEC003',
            employee_id: 'EMP005',
            specialization: 'Oversee & Quality Control',
            level: 'FOREMAN',
            totalJobs: 0,
            averageRating: 0,
            iStatus: 'Active',
            isAvailable: true,
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
      ]);
      seedCount += mechanics.length;
      console.log(`   ✅ Created ${mechanics.length} mechanics`);

      // Customer
      const customers = await Promise.all([
        tx.cmf_Customer.upsert({
          where: { company_id_id: { company_id, id: 'CUST01' } },
          update: {},
          create: {
            id: 'CUST01',
            name: 'Agus Widodo',
            customerType: 'INDIVIDUAL',
            mobile1: '081111111111',
            email: 'agus@example.com',
            province: 'DKI Jakarta',
            city: 'Jakarta Selatan',
            address1: 'Jl. Sudirman No. 1',
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.cmf_Customer.upsert({
          where: { company_id_id: { company_id, id: 'CUST02' } },
          update: {},
          create: {
            id: 'CUST02',
            name: 'Indah Permata',
            customerType: 'INDIVIDUAL',
            mobile1: '081111111112',
            email: 'indah@example.com',
            province: 'Jawa Barat',
            city: 'Bandung',
            address1: 'Jl. Gatot Subroto No. 2',
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.cmf_Customer.upsert({
          where: { company_id_id: { company_id, id: 'CUST03' } },
          update: {},
          create: {
            id: 'CUST03',
            name: 'PT Transportasi Mandiri',
            customerType: 'CORPORATE',
            legalName: 'PT Transportasi Mandiri',
            mobile1: '081111111113',
            email: 'info@transportasimandiri.com',
            companyRegistrationNumber: 'SIUP123456',
            businessType: 'PT',
            province: 'DKI Jakarta',
            city: 'Jakarta Pusat',
            address1: 'Jl. Thamrin No. 3',
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.cmf_Customer.upsert({
          where: { company_id_id: { company_id, id: 'CUST04' } },
          update: {},
          create: {
            id: 'CUST04',
            name: 'Budi Kurniawan',
            customerType: 'INDIVIDUAL',
            mobile1: '081111111114',
            email: 'budi.k@example.com',
            province: 'Jawa Timur',
            city: 'Surabaya',
            address1: 'Jl. Pemuda No. 4',
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.cmf_Customer.upsert({
          where: { company_id_id: { company_id, id: 'CUST05' } },
          update: {},
          create: {
            id: 'CUST05',
            name: 'Sinta Dewi',
            customerType: 'INDIVIDUAL',
            mobile1: '081111111115',
            email: 'sinta@example.com',
            province: 'DKI Jakarta',
            city: 'Jakarta Barat',
            address1: 'Jl. Kebon Jeruk No. 5',
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
      ]);
      seedCount += customers.length;
      console.log(`   ✅ Created ${customers.length} customers`);

      // CustomerVehicle
      const customerVehicles = await Promise.all([
        tx.cmf_CustomerVehicle.upsert({
          where: { company_id_customer_id_id: { company_id, customer_id: 'CUST01', id: 'VH001' } },
          update: {},
          create: {
            id: 'VH001',
            customer_id: 'CUST01',
            vehicleType_id: 'VT001',
            brand_id: 'VB001',
            model_id: 'VM001',
            licensePlate: 'B 1234 ABC',
            vehicleYear: 2020,
            color: 'Silver',
            currentOdometer: 45000,
            iStatus: 'Active',
            isPrimary: true,
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.cmf_CustomerVehicle.upsert({
          where: { company_id_customer_id_id: { company_id, customer_id: 'CUST02', id: 'VH002' } },
          update: {},
          create: {
            id: 'VH002',
            customer_id: 'CUST02',
            vehicleType_id: 'VT001',
            brand_id: 'VB002',
            model_id: 'VM003',
            licensePlate: 'D 5678 DEF',
            vehicleYear: 2021,
            color: 'White',
            currentOdometer: 30000,
            iStatus: 'Active',
            isPrimary: true,
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.cmf_CustomerVehicle.upsert({
          where: { company_id_customer_id_id: { company_id, customer_id: 'CUST03', id: 'VH003' } },
          update: {},
          create: {
            id: 'VH003',
            customer_id: 'CUST03',
            vehicleType_id: 'VT001',
            brand_id: 'VB001',
            model_id: 'VM002',
            licensePlate: 'B 9012 GHI',
            vehicleYear: 2019,
            color: 'Black',
            currentOdometer: 60000,
            iStatus: 'Active',
            isPrimary: true,
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.cmf_CustomerVehicle.upsert({
          where: { company_id_customer_id_id: { company_id, customer_id: 'CUST04', id: 'VH004' } },
          update: {},
          create: {
            id: 'VH004',
            customer_id: 'CUST04',
            vehicleType_id: 'VT001',
            brand_id: 'VB002',
            model_id: 'VM004',
            licensePlate: 'L 3456 JKL',
            vehicleYear: 2022,
            color: 'Red',
            currentOdometer: 25000,
            iStatus: 'Active',
            isPrimary: true,
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.cmf_CustomerVehicle.upsert({
          where: { company_id_customer_id_id: { company_id, customer_id: 'CUST05', id: 'VH005' } },
          update: {},
          create: {
            id: 'VH005',
            customer_id: 'CUST05',
            vehicleType_id: 'VT002',
            brand_id: 'VB004',
            model_id: 'VM005',
            licensePlate: 'B 7890 MNO',
            vehicleYear: 2021,
            color: 'Blue',
            currentOdometer: 15000,
            iStatus: 'Active',
            isPrimary: true,
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
      ]);
      seedCount += customerVehicles.length;
      console.log(`   ✅ Created ${customerVehicles.length} customer vehicles`);

      // ============================================================
      // 5. SEED SERVICE MASTER DATA (WKS)
      // ============================================================
      console.log('\n📦 Creating service master data...');

      // ServiceType
      const serviceTypes = await Promise.all([
        tx.wks_ServiceType.upsert({
          where: { company_id_id: { company_id, id: 'ST001' } },
          update: {},
          create: {
            id: 'ST001',
            name: 'Service Berkala',
            category: 'MAINTENANCE',
            description: 'Service berkala sesuai jadwal',
            estimatedTime: 120,
            defaultPrice: 150000,
            seq: 1,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.wks_ServiceType.upsert({
          where: { company_id_id: { company_id, id: 'ST002' } },
          update: {},
          create: {
            id: 'ST002',
            name: 'Ganti Oli',
            category: 'MAINTENANCE',
            description: 'Ganti oli mesin dan filter',
            estimatedTime: 30,
            defaultPrice: 250000,
            seq: 2,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.wks_ServiceType.upsert({
          where: { company_id_id: { company_id, id: 'ST003' } },
          update: {},
          create: {
            id: 'ST003',
            name: 'Tune Up Mesin',
            category: 'REPAIR',
            description: 'Tune up mesin lengkap',
            estimatedTime: 180,
            defaultPrice: 500000,
            seq: 3,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.wks_ServiceType.upsert({
          where: { company_id_id: { company_id, id: 'ST004' } },
          update: {},
          create: {
            id: 'ST004',
            name: 'Service AC',
            category: 'REPAIR',
            description: 'Service AC lengkap',
            estimatedTime: 90,
            defaultPrice: 400000,
            seq: 4,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.wks_ServiceType.upsert({
          where: { company_id_id: { company_id, id: 'ST005' } },
          update: {},
          create: {
            id: 'ST005',
            name: 'Cuci & Wax',
            category: 'WASH',
            description: 'Cuci dan wax kendaraan',
            estimatedTime: 60,
            defaultPrice: 100000,
            seq: 5,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
      ]);
      seedCount += serviceTypes.length;
      console.log(`   ✅ Created ${serviceTypes.length} service types`);

      // ServiceBay
      const serviceBays = await Promise.all([
        tx.wks_ServiceBay.upsert({
          where: { company_id_id: { company_id, id: 'BAY001' } },
          update: {},
          create: {
            id: 'BAY001',
            name: 'Bay 1',
            bayType: 'GENERAL',
            capacity: 1,
            iStatus: 'Active',
            isOccupied: false,
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.wks_ServiceBay.upsert({
          where: { company_id_id: { company_id, id: 'BAY002' } },
          update: {},
          create: {
            id: 'BAY002',
            name: 'Bay 2',
            bayType: 'GENERAL',
            capacity: 1,
            iStatus: 'Active',
            isOccupied: false,
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.wks_ServiceBay.upsert({
          where: { company_id_id: { company_id, id: 'BAY003' } },
          update: {},
          create: {
            id: 'BAY003',
            name: 'Bay 3',
            bayType: 'BODYWORK',
            capacity: 1,
            iStatus: 'Active',
            isOccupied: false,
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.wks_ServiceBay.upsert({
          where: { company_id_id: { company_id, id: 'BAY004' } },
          update: {},
          create: {
            id: 'BAY004',
            name: 'Bay 4',
            bayType: 'QUICK_SERVICE',
            capacity: 1,
            iStatus: 'Active',
            isOccupied: false,
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.wks_ServiceBay.upsert({
          where: { company_id_id: { company_id, id: 'BAY005' } },
          update: {},
          create: {
            id: 'BAY005',
            name: 'Bay 5',
            bayType: 'HEAVY_DUTY',
            capacity: 1,
            iStatus: 'Active',
            isOccupied: false,
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
      ]);
      seedCount += serviceBays.length;
      console.log(`   ✅ Created ${serviceBays.length} service bays`);

      // ============================================================
      // 6. SEED SUPPLIER & PURCHASE MASTER DATA (PRC)
      // ============================================================
      console.log('\n📦 Creating supplier master data...');

      // Supplier
      const suppliers = await Promise.all([
        tx.prc_Supplier.upsert({
          where: { company_id_id: { company_id, id: 'SUP001' } },
          update: {},
          create: {
            id: 'SUP001',
            name: 'CV Sparepart Jaya',
            supplierType: 'VENDOR',
            contactPerson: 'Budi Handoko',
            phone1: '02112345678',
            mobile1: '081222222222',
            email: 'budi@sparepartjaya.com',
            province: 'DKI Jakarta',
            city: 'Jakarta Utara',
            address1: 'Jl. Sparepart No. 1',
            paymentTermDays: 30,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.prc_Supplier.upsert({
          where: { company_id_id: { company_id, id: 'SUP002' } },
          update: {},
          create: {
            id: 'SUP002',
            name: 'PT Distributor Otomotif',
            supplierType: 'DISTRIBUTOR',
            legalName: 'PT Distributor Otomotif',
            contactPerson: 'Siti Rahmawati',
            phone1: '02187654321',
            mobile1: '081333333333',
            email: 'siti@distributoroto.com',
            province: 'Jawa Barat',
            city: 'Bekasi',
            address1: 'Jl. Distributor No. 2',
            paymentTermDays: 45,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.prc_Supplier.upsert({
          where: { company_id_id: { company_id, id: 'SUP003' } },
          update: {},
          create: {
            id: 'SUP003',
            name: 'CV Sumber Teknik',
            supplierType: 'VENDOR',
            contactPerson: 'Ahmad Fauzi',
            phone1: '02155555555',
            mobile1: '081444444444',
            email: 'ahmad@sumberteknik.com',
            province: 'DKI Jakarta',
            city: 'Jakarta Selatan',
            address1: 'Jl. Teknik No. 3',
            paymentTermDays: 30,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.prc_Supplier.upsert({
          where: { company_id_id: { company_id, id: 'SUP004' } },
          update: {},
          create: {
            id: 'SUP004',
            name: 'PT Oli Nasional',
            supplierType: 'MANUFACTURER',
            legalName: 'PT Oli Nasional',
            contactPerson: 'Indah Permatasari',
            phone1: '02166666666',
            mobile1: '081555555555',
            email: 'indah@olinasional.com',
            province: 'Jawa Timur',
            city: 'Surabaya',
            address1: 'Jl. Oli No. 4',
            paymentTermDays: 60,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
        tx.prc_Supplier.upsert({
          where: { company_id_id: { company_id, id: 'SUP005' } },
          update: {},
          create: {
            id: 'SUP005',
            name: 'CV Filter Sejahtera',
            supplierType: 'VENDOR',
            contactPerson: 'Bambang Sutrisno',
            phone1: '02177777777',
            mobile1: '081666666666',
            email: 'bambang@filtersejahtera.com',
            province: 'DKI Jakarta',
            city: 'Jakarta Timur',
            address1: 'Jl. Filter No. 5',
            paymentTermDays: 30,
            iStatus: 'Active',
            createdBy,
            createdAt: new Date(),
            updatedBy: createdBy,
            updatedAt: new Date(),
            company_id,
            branch_id,
          },
        }),
      ]);
      seedCount += suppliers.length;
      console.log(`   ✅ Created ${suppliers.length} suppliers`);

      console.log('\n✅ ✅ ✅ ALL MASTER DATA SEED COMPLETED! ✅ ✅ ✅');
      console.log(`\n📊 Summary: ${seedCount} records created`);
      console.log(`   • Company ID: ${company_id}`);
      console.log(`   • Branch ID: ${branch_id}`);
      console.log(`   • Created By: ${createdBy}`);
    },
    {
      maxWait: 5000, // default: 2000
      timeout: 10000, // default: 5000
    },
  );
}

main()
  .catch((e) => {
    console.error('❌ Error seeding master bulk insert:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

