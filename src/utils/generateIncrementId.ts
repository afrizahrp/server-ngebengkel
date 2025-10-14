import { PrismaService } from '../prisma.service';

/**
 * Generate increment ID untuk model apapun
 * Mengambil ID terakhir dari tabel yang ditentukan dan menambahkan 1
 *
 * @param prisma - Instance PrismaService
 * @param modelName - Nama model Prisma (contoh: 'sys_User', 'sys_Menu', dll)
 * @param startFrom - ID mulai dari (default: 1)
 * @returns Promise<number> - ID baru yang sudah di-increment
 */
export async function generateIncrementId(
  prisma: PrismaService,
  modelName: string,
  startFrom: number = 1,
): Promise<number> {
  try {
    // Query untuk mendapatkan record dengan ID tertinggi
    const lastRecord = await (prisma as any)[modelName].findFirst({
      orderBy: { id: 'desc' },
      select: { id: true },
    });

    // Jika belum ada record, mulai dari startFrom
    if (!lastRecord) {
      return startFrom;
    }

    // Return ID terakhir + 1
    return lastRecord.id + 1;
  } catch (error) {
    console.error(
      `Error generating increment ID for model ${modelName}:`,
      error,
    );
    throw new Error(`Failed to generate increment ID for ${modelName}`);
  }
}

/**
 * Generate increment ID untuk model dengan kondisi khusus
 * Berguna untuk model yang memiliki composite key atau kondisi khusus
 *
 * @param prisma - Instance PrismaService
 * @param modelName - Nama model Prisma
 * @param whereCondition - Kondisi WHERE untuk filter record
 * @param startFrom - ID mulai dari (default: 1)
 * @returns Promise<number> - ID baru yang sudah di-increment
 */
export async function generateIncrementIdWithCondition(
  prisma: PrismaService,
  modelName: string,
  whereCondition: any = {},
  startFrom: number = 1,
): Promise<number> {
  try {
    // Query untuk mendapatkan record dengan ID tertinggi berdasarkan kondisi
    const lastRecord = await (prisma as any)[modelName].findFirst({
      where: whereCondition,
      orderBy: { id: 'desc' },
      select: { id: true },
    });

    // Jika belum ada record, mulai dari startFrom
    if (!lastRecord) {
      return startFrom;
    }

    // Return ID terakhir + 1
    return lastRecord.id + 1;
  } catch (error) {
    console.error(
      `Error generating increment ID for model ${modelName} with condition:`,
      error,
    );
    throw new Error(
      `Failed to generate increment ID for ${modelName} with condition`,
    );
  }
}
