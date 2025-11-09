import { PrismaClient, Prisma } from '@prisma/client';
import { readFileSync } from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const COMPANY_ID = 'NGB';
const BRANCH_ID = 'MAIN';
const CREATED_BY = 'SEEDER';
const UPDATED_BY = 'SEED';

type WorkshopTypeJson = {
  kategori: string;
  jenis: Array<{
    nama: string;
    deskripsi: string;
    layanan: string[];
  }>;
};

type WorkshopJsonMap = Record<string, WorkshopTypeJson>;
const CATEGORY_ID_MAP: Record<string, string> = {
  motor: 'WKC01',
  mobil: 'WKC02',
  truk_bus_karoseri: 'WKC03',
};

type CategoryMetaMap = Record<
  string,
  {
    id: string;
  }
>;

function buildTypeId(counter: number) {
  return `WKTYPE${counter.toString().padStart(4, '0')}`;
}

function buildDescription(deskripsi: string, layanan: string[]) {
  const layananList = layanan.length ? `Layanan: ${layanan.join(', ')}` : '';
  return [deskripsi, layananList].filter(Boolean).join(' | ');
}

async function upsertCategories(
  data: WorkshopJsonMap,
): Promise<CategoryMetaMap> {
  const categoryMeta: CategoryMetaMap = {};

  let seq = 1;
  for (const [key, value] of Object.entries(data)) {
    const categoryId = CATEGORY_ID_MAP[key];

    if (!categoryId) {
      console.warn(`⚠️  Skipping unknown category key "${key}" from JSON seed`);
      continue;
    }

    await prisma.wks_WorkshopCategory.upsert({
      where: { id: categoryId },
      update: {
        code: key.toUpperCase(),
        name: value.kategori,
        description: value.jenis.map((item) => item.nama).join(', '),
        seq,
        isActive: true,
        updatedBy: UPDATED_BY,
      },
      create: {
        id: categoryId,
        code: key.toUpperCase(),
        name: value.kategori,
        description: value.jenis.map((item) => item.nama).join(', '),
        seq,
        isActive: true,
        createdBy: CREATED_BY,
        updatedBy: UPDATED_BY,
      },
    });

    categoryMeta[key] = { id: categoryId };
    seq += 1;
  }

  return categoryMeta;
}

async function upsertWorkshopTypes(
  data: WorkshopJsonMap,
  categoryMeta: CategoryMetaMap,
): Promise<Record<string, string[]>> {
  const typeIdsByCategory: Record<string, string[]> = {};
  const operations: Prisma.PrismaPromise<any>[] = [];

  let counter = 1;

  for (const [key, value] of Object.entries(data)) {
    const meta = categoryMeta[key];
    if (!meta) continue;

    const typeIds: string[] = [];

    value.jenis.forEach((item, index) => {
      const typeId = buildTypeId(counter);
      counter += 1;

      operations.push(
        prisma.wks_WorkshopType.upsert({
          where: { id: typeId },
          update: {
            category_id: meta.id,
            company_id: COMPANY_ID,
            branch_id: BRANCH_ID,
            name: item.nama,
            description: buildDescription(item.deskripsi, item.layanan),
            seq: index + 1,
            isActive: true,
            updatedBy: UPDATED_BY,
          },
          create: {
            id: typeId,
            category_id: meta.id,
            company_id: COMPANY_ID,
            branch_id: BRANCH_ID,
            name: item.nama,
            description: buildDescription(item.deskripsi, item.layanan),
            seq: index + 1,
            isActive: true,
            createdBy: CREATED_BY,
            updatedBy: UPDATED_BY,
          },
        }),
      );

      typeIds.push(typeId);
    });

    typeIdsByCategory[meta.id] = typeIds;
  }

  if (operations.length > 0) {
    await prisma.$transaction(operations);
  }

  return typeIdsByCategory;
}

async function seedWaitingListRelations(
  typeIdsByCategory: Record<string, string[]>,
): Promise<number> {
  const waitingLists = await prisma.wks_waitingList.findMany({
    where: { isDeleted: false },
    select: { id: true, category_id: true },
  });

  let createdCount = 0;

  for (const waitingList of waitingLists) {
    if (!waitingList.category_id) continue;

    const typeIds = typeIdsByCategory[waitingList.category_id] ?? [];
    if (typeIds.length === 0) continue;

    const existing = await prisma.wks_WaitingListType.findMany({
      where: { waitingList_id: waitingList.id },
      select: { workshopType_id: true },
    });

    const existingSet = new Set(existing.map((entry) => entry.workshopType_id));

    const data = typeIds
      .filter((typeId) => !existingSet.has(typeId))
      .map((typeId) => ({
        waitingList_id: waitingList.id,
        workshopType_id: typeId,
        assignedAt: new Date(),
        createdBy: CREATED_BY,
        createdAt: new Date(),
      }));

    if (data.length > 0) {
      await prisma.wks_WaitingListType.createMany({
        data,
        skipDuplicates: true,
      });
      createdCount += data.length;
    }
  }

  return createdCount;
}

async function main() {
  console.log('🌱 Seeding workshop categories & types from JSON...');

  const jsonPath = path.resolve(__dirname, '../../data/wks_types.json');
  const raw = readFileSync(jsonPath, 'utf-8');
  const workshopData: WorkshopJsonMap = JSON.parse(raw);

  const company = await prisma.sys_Company.findUnique({
    where: { id: COMPANY_ID },
  });
  if (!company) {
    console.log(`❌ Company ${COMPANY_ID} not found. Abort seeding.`);
    return;
  }

  const branch = await prisma.sys_Branch.findFirst({
    where: {
      company_id: COMPANY_ID,
      id: BRANCH_ID,
    },
  });
  if (!branch) {
    console.log(
      `❌ Branch ${BRANCH_ID} not found for company ${COMPANY_ID}. Abort seeding.`,
    );
    return;
  }

  const categoryMeta = await upsertCategories(workshopData);

  const typeIdsByCategory = await upsertWorkshopTypes(
    workshopData,
    categoryMeta,
  );

  const pivotCreated = await seedWaitingListRelations(typeIdsByCategory);

  console.log('✅ Workshop category & type seeding completed.');
  console.log(
    `   • Categories processed : ${Object.keys(categoryMeta).length}`,
  );
  console.log(
    `   • Types processed      : ${Object.values(typeIdsByCategory).reduce(
      (sum, arr) => sum + arr.length,
      0,
    )}`,
  );
  console.log(`   • Waiting list links   : ${pivotCreated}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding workshop types:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
