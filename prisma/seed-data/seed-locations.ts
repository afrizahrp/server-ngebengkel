import { PrismaClient } from '@prisma/client';
import { promises as fs } from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const CREATED_BY = 'Seeder';
const UPDATED_BY = 'Seed';

type SubDistrictJson = {
  id: string;
  name: string;
  company_id: string;
};

type DistrictJson = {
  id: string;
  name: string;
  company_id: string;
  subdistricts?: SubDistrictJson[];
};

type CityJson = {
  id: string;
  name: string;
  company_id: string;
  districts?: DistrictJson[];
};

type ProvinceJson = {
  id: string;
  name: string;
  company_id: string;
  cities?: CityJson[];
};

type ProvinceFile = {
  province: ProvinceJson;
};

type LocationRecords = {
  provinces: Array<{ id: string; name: string; company_id: string }>;
  cities: Array<{
    id: string;
    name: string;
    company_id: string;
    province_id: string;
  }>;
  districts: Array<{
    id: string;
    name: string;
    company_id: string;
    city_id: string;
  }>;
  subDistricts: Array<{
    id: string;
    name: string;
    company_id: string;
    district_id: string;
    city_id: string;
  }>;
};

async function loadLocationRecords(): Promise<LocationRecords> {
  const dataDir = path.resolve(__dirname, '../../src/data/locations');
  const files = (await fs.readdir(dataDir)).filter((file) =>
    file.endsWith('.json'),
  );

  const provinces = new Map<
    string,
    { id: string; name: string; company_id: string }
  >();
  const cities = new Map<
    string,
    { id: string; name: string; company_id: string; province_id: string }
  >();
  const districts = new Map<
    string,
    { id: string; name: string; company_id: string; city_id: string }
  >();
  const subDistricts = new Map<
    string,
    {
      id: string;
      name: string;
      company_id: string;
      district_id: string;
      city_id: string;
    }
  >();

  for (const file of files) {
    const filePath = path.join(dataDir, file);
    const raw = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(raw) as ProvinceFile;

    const province = parsed.province;
    if (!province) {
      console.warn(`⚠️  File ${file} tidak memiliki data province.`);
      continue;
    }

    provinces.set(province.id, {
      id: province.id,
      name: province.name,
      company_id: province.company_id,
    });

    province.cities?.forEach((city) => {
      cities.set(city.id, {
        id: city.id,
        name: city.name,
        company_id: city.company_id,
        province_id: province.id,
      });

      city.districts?.forEach((district) => {
        districts.set(district.id, {
          id: district.id,
          name: district.name,
          company_id: district.company_id,
          city_id: city.id,
        });

        district.subdistricts?.forEach((subDistrict) => {
          subDistricts.set(subDistrict.id, {
            id: subDistrict.id,
            name: subDistrict.name,
            company_id: subDistrict.company_id,
            district_id: district.id,
            city_id: city.id,
          });
        });
      });
    });
  }

  return {
    provinces: Array.from(provinces.values()),
    cities: Array.from(cities.values()),
    districts: Array.from(districts.values()),
    subDistricts: Array.from(subDistricts.values()),
  };
}

function withAuditFields<T>(records: T[]) {
  return records.map((record) => ({
    ...record,
    createdBy: CREATED_BY,
    updatedBy: UPDATED_BY,
  }));
}

async function main() {
  console.log(
    '🌱 Mulai seeding lokasi (province, city, district, subdistrict)...',
  );

  const { provinces, cities, districts, subDistricts } =
    await loadLocationRecords();

  console.log(
    `📦 Data terkumpul: ${provinces.length} province, ${cities.length} city, ${districts.length} district, ${subDistricts.length} subdistrict.`,
  );

  await prisma.$transaction(async (tx) => {
    if (provinces.length > 0) {
      await tx.sys_Province.createMany({
        data: withAuditFields(provinces),
        skipDuplicates: true,
      });
      console.log(`   ✅ Province selesai: ${provinces.length} record.`);
    }

    if (cities.length > 0) {
      for (const city of cities) {
        await tx.sys_City.upsert({
          where: { id: city.id },
          update: {
            name: city.name,
            company_id: city.company_id,
            province: { connect: { id: city.province_id } },
            updatedBy: UPDATED_BY,
          },
          create: {
            id: city.id,
            name: city.name,
            company_id: city.company_id,
            province: { connect: { id: city.province_id } },
            createdBy: CREATED_BY,
            updatedBy: UPDATED_BY,
          },
        });
      }
      console.log(`   ✅ City selesai: ${cities.length} record.`);
    }

    if (districts.length > 0) {
      for (const district of districts) {
        await tx.sys_District.upsert({
          where: { id: district.id },
          update: {
            name: district.name,
            company_id: district.company_id,
            city: { connect: { id: district.city_id } },
            updatedBy: UPDATED_BY,
          },
          create: {
            id: district.id,
            name: district.name,
            company_id: district.company_id,
            city: { connect: { id: district.city_id } },
            createdBy: CREATED_BY,
            updatedBy: UPDATED_BY,
          },
        });
      }
      console.log(`   ✅ District selesai: ${districts.length} record.`);
    }

    if (subDistricts.length > 0) {
      for (const subDistrict of subDistricts) {
        await tx.sys_SubDistrict.upsert({
          where: { id: subDistrict.id },
          update: {
            name: subDistrict.name,
            company_id: subDistrict.company_id,
            city_id: subDistrict.city_id,
            district: { connect: { id: subDistrict.district_id } },
            updatedBy: UPDATED_BY,
          },
          create: {
            id: subDistrict.id,
            name: subDistrict.name,
            company_id: subDistrict.company_id,
            city_id: subDistrict.city_id,
            district: { connect: { id: subDistrict.district_id } },
            createdBy: CREATED_BY,
            updatedBy: UPDATED_BY,
          },
        });
      }
      console.log(`   ✅ SubDistrict selesai: ${subDistricts.length} record.`);
    }
  });

  console.log('🎉 Seeder lokasi selesai dijalankan.');
}

main()
  .catch((error) => {
    console.error('❌ Terjadi kesalahan saat menjalankan seed lokasi:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
