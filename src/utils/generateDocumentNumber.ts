import { PrismaService } from '../prisma.service';
import { DocumentResetEnum, MasterRecordStatusEnum } from '@prisma/client';

/**
 * Interface untuk parameter generateDocumentNumber
 */
export interface GenerateDocumentNumberParams {
  prisma: PrismaService;
  module_id: string; // PRC, WKS, SLS, IMC, ACC
  company_id: string;
  branch_id: string;
  date: Date; // Tanggal untuk generate document number
  prefix?: string; // ID dari sys_Numbering (opsional, bisa dicari berdasarkan module_id)
}

/**
 * Generate document number berdasarkan konfigurasi sys_Numbering
 *
 * Logika berdasarkan stored procedure get_document_id:
 * 1. Mencari konfigurasi sys_Numbering berdasarkan company_id, branch_id, dan prefix/id
 * 2. Handle reset logic (NEVER, YEAR, MONTH, DAY)
 * 3. Increment currentNumber dan update database
 * 4. Generate format sesuai template pattern
 *
 * @param params - Parameter untuk generate document number
 * @returns Promise<string> - Document number yang sudah digenerate
 */
export async function generateDocumentNumber(
  params: GenerateDocumentNumberParams,
): Promise<string> {
  const { prisma, module_id, company_id, branch_id, date, prefix } = params;

  try {
    // Mencari konfigurasi sys_Numbering
    // Jika prefix tidak diberikan, akan mencari berdasarkan module_id
    let numberingPrefix: string | undefined = prefix;

    if (!numberingPrefix) {
      const foundPrefix = await findPrefixByModuleId(
        prisma,
        module_id,
        company_id,
        branch_id,
      );

      if (!foundPrefix) {
        throw new Error(
          `Konfigurasi numbering tidak ditemukan untuk module_id: ${module_id}, company_id: ${company_id}, branch_id: ${branch_id}. Prefix harus diberikan atau konfigurasi numbering harus dibuat terlebih dahulu.`,
        );
      }

      numberingPrefix = foundPrefix;
    }

    // Query konfigurasi numbering
    const numberingConfig = await prisma.sys_Numbering.findUnique({
      where: {
        company_id_branch_id_id: {
          company_id,
          branch_id,
          id: numberingPrefix,
        },
      },
    });

    if (!numberingConfig) {
      throw new Error(
        `Konfigurasi numbering tidak ditemukan untuk company_id: ${company_id}, branch_id: ${branch_id}, prefix: ${numberingPrefix}`,
      );
    }

    // Gunakan numberingPrefix untuk proses selanjutnya
    const prefixToUse = numberingPrefix;

    // Parse tanggal
    const docDate = new Date(date);
    const year = docDate.getFullYear();
    const month = String(docDate.getMonth() + 1).padStart(2, '0');
    const twoDigitYear = String(year).slice(-2);

    // Inisialisasi variabel
    let currentNumber = numberingConfig.currentNumber || 0;
    let shouldReset = false;
    const lastUpdateDate = new Date(numberingConfig.updatedAt);
    const createdDate = new Date(numberingConfig.createdAt);

    // Handle reset logic berdasarkan resetAt
    // Logika reset: jika periode reset berbeda dengan last update, maka reset counter
    // Jika ini pertama kali (currentNumber === 0 atau belum pernah di-update), tidak perlu reset
    const isFirstTime =
      currentNumber === 0 || lastUpdateDate.getTime() === createdDate.getTime();

    if (!isFirstTime) {
      switch (numberingConfig.resetAt) {
        case DocumentResetEnum.DAY: {
          // Reset per hari - cek apakah hari berbeda
          if (
            lastUpdateDate.getDate() !== docDate.getDate() ||
            lastUpdateDate.getMonth() !== docDate.getMonth() ||
            lastUpdateDate.getFullYear() !== docDate.getFullYear()
          ) {
            shouldReset = true;
          }
          break;
        }
        case DocumentResetEnum.MONTH: {
          // Reset per bulan - cek apakah bulan atau tahun berbeda
          if (
            lastUpdateDate.getMonth() !== docDate.getMonth() ||
            lastUpdateDate.getFullYear() !== docDate.getFullYear()
          ) {
            shouldReset = true;
          }
          break;
        }
        case DocumentResetEnum.YEAR: {
          // Reset per tahun - cek apakah tahun berbeda
          if (lastUpdateDate.getFullYear() !== docDate.getFullYear()) {
            shouldReset = true;
          }
          break;
        }
        case DocumentResetEnum.NEVER: {
          // Tidak pernah reset, langsung increment
          shouldReset = false;
          break;
        }
      }
    }

    // Jika perlu reset, set currentNumber ke startNumber - 1
    // (karena akan di-increment di bawah menjadi startNumber)
    if (shouldReset) {
      currentNumber = numberingConfig.startNumber - 1;
    }

    // Increment currentNumber untuk mendapatkan nomor berikutnya
    const newNumber = currentNumber + 1;

    // Generate format berdasarkan template
    // Format biasanya seperti: {CODE}/{YYYY}/{MM}/{SEQ} atau variasi lainnya
    let documentNumber = numberingConfig.format || '';

    // Replace sequence number dengan padding sesuai sequenceLength (lakukan dulu sebelum replace lainnya)
    const sequenceString = String(newNumber).padStart(
      numberingConfig.sequenceLength,
      '0',
    );

    // Replace placeholders dalam format template
    // Prioritas: PREFIX -> CODE -> YEAR/MONTH -> SEQ
    if (numberingConfig.prefix) {
      documentNumber = documentNumber.replace(
        /\{PREFIX\}/g,
        numberingConfig.prefix,
      );
    }
    documentNumber = documentNumber.replace(/\{CODE\}/g, prefixToUse || '');

    // Replace tahun (jika includeYear true atau placeholder {YYYY}/{YY} ada)
    if (
      numberingConfig.includeYear ||
      documentNumber.includes('{YYYY}') ||
      documentNumber.includes('{YY}')
    ) {
      documentNumber = documentNumber.replace(/\{YYYY\}/g, String(year));
      documentNumber = documentNumber.replace(/\{YY\}/g, twoDigitYear);
    }

    // Replace bulan (jika includeMonth true atau placeholder {MM} ada)
    if (numberingConfig.includeMonth || documentNumber.includes('{MM}')) {
      documentNumber = documentNumber.replace(/\{MM\}/g, month);
    }

    // Replace sequence number
    documentNumber = documentNumber.replace(/\{SEQ\}/g, sequenceString);
    documentNumber = documentNumber.replace(/\{NUMBER\}/g, sequenceString);

    // Replace delimiter placeholder jika ada
    const delimiterEscaped = numberingConfig.delimiter.replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&',
    );
    documentNumber = documentNumber.replace(
      /\{DELIMITER\}/g,
      numberingConfig.delimiter,
    );

    // Clean up: hapus multiple delimiters dan trim
    // Ganti multiple delimiter menjadi single delimiter
    documentNumber = documentNumber.replace(
      new RegExp(`${delimiterEscaped}+`, 'g'),
      numberingConfig.delimiter,
    );

    // Hapus delimiter di awal jika ada
    if (documentNumber.startsWith(numberingConfig.delimiter)) {
      documentNumber = documentNumber.substring(
        numberingConfig.delimiter.length,
      );
    }

    // Hapus delimiter di akhir jika ada
    if (documentNumber.endsWith(numberingConfig.delimiter)) {
      documentNumber = documentNumber.slice(
        0,
        -numberingConfig.delimiter.length,
      );
    }

    // Trim whitespace
    documentNumber = documentNumber.trim().replace(/\s+/g, ' ');

    // Update currentNumber di database dalam transaction
    await prisma.$transaction(async (tx) => {
      await tx.sys_Numbering.update({
        where: {
          company_id_branch_id_id: {
            company_id,
            branch_id,
            id: prefixToUse,
          },
        },
        data: {
          currentNumber: newNumber,
          updatedAt: new Date(),
        },
      });
    });

    return documentNumber;
  } catch (error) {
    console.error('Error generating document number:', error);
    throw new Error(
      `Failed to generate document number: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

/**
 * Helper untuk mencari prefix berdasarkan module_id jika tidak diberikan
 * Ini adalah helper tambahan jika diperlukan logic untuk auto-determine prefix
 *
 * @param prisma - Instance PrismaService
 * @param module_id - Module ID (PRC, WKS, SLS, IMC, ACC)
 * @param company_id - Company ID
 * @param branch_id - Branch ID
 * @returns Promise<string | null> - Prefix yang ditemukan atau null
 */
export async function findPrefixByModuleId(
  prisma: PrismaService,
  module_id: string,
  company_id: string,
  branch_id: string,
): Promise<string | null> {
  try {
    // Mencari numbering config berdasarkan module_id
    // Asumsikan ada logic untuk menentukan prefix default berdasarkan module_id
    // Atau bisa juga mengambil yang pertama sesuai module_id
    const numberingConfig = await prisma.sys_Numbering.findFirst({
      where: {
        module_id,
        company_id,
        branch_id,
        iStatus: MasterRecordStatusEnum.Active,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return numberingConfig?.id || null;
  } catch (error) {
    console.error('Error finding prefix by module_id:', error);
    return null;
  }
}
