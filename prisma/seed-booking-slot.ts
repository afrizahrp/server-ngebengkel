import { PrismaClient, SlotStatusEnum } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function untuk mendapatkan tanggal hari ini dalam timezone Indonesia (WIB - UTC+7)
function getTodayIndonesia(): Date {
  const now = new Date();
  // Convert to Indonesia time (UTC+7)
  const indonesiaOffset = 7 * 60; // 7 hours in minutes
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
  const indonesiaTime = new Date(utcTime + indonesiaOffset * 60000);

  // Reset to start of day in Indonesia timezone
  indonesiaTime.setUTCHours(0, 0, 0, 0);
  return indonesiaTime;
}

// Helper function untuk membuat Date dengan waktu Indonesia (WIB - UTC+7)
// Parameter hour adalah waktu lokal Indonesia (contoh: 8 untuk jam 08:00 WIB)
// Function ini membuat Date object yang ketika dibaca dalam timezone Indonesia akan menampilkan jam yang benar
function createIndonesiaDateTime(
  date: Date,
  hour: number,
  minute: number = 0,
): Date {
  // Ambil tahun, bulan, tanggal dari date (yang sudah dalam UTC format)
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();

  // Buat Date dengan waktu Indonesia
  // Karena Indonesia UTC+7, jika kita mau jam 08:00 WIB, kita simpan sebagai 01:00 UTC
  // Formula: UTC = WIB - 7
  const utcHour = hour - 7;
  const utcDate = new Date(Date.UTC(year, month, day, utcHour, minute, 0, 0));
  return utcDate;
}

async function main() {
  console.log('🎯 Starting Booking Slot seed...');

  const companyId = 'NGB';
  const branchId = 'MAIN';

  // Check if company exists
  const company = await prisma.sys_Company.findUnique({
    where: { id: companyId },
  });

  if (!company) {
    console.log(`❌ Company with ID ${companyId} not found.`);
    return;
  }

  console.log(`✅ Found company: ${company.name}`);

  // Check if branch exists
  const branch = await prisma.sys_Branch.findFirst({
    where: {
      id: branchId,
      company_id: companyId,
    },
  });

  if (!branch) {
    console.log(`❌ Branch with ID ${branchId} not found.`);
    return;
  }

  console.log(`✅ Found branch: ${branch.name}`);

  // Get available bays (optional - bisa juga tanpa bay_id)
  const bays = await prisma.wks_ServiceBay.findMany({
    where: {
      company_id: companyId,
      branch_id: branchId,
      iStatus: 'Active',
    },
    take: 5, // Ambil maksimal 5 bay
  });

  console.log(`✅ Found ${bays.length} active bay(s)`);

  // Generate booking slots for the next 7 days
  // Gunakan timezone Indonesia (WIB - UTC+7)
  const today = getTodayIndonesia();

  interface BookingSlotData {
    id: string;
    company_id: string;
    branch_id: string;
    bay_id: string | null;
    date: Date;
    startTime: Date;
    endTime: Date;
    capacity: number;
    bookedCount: number;
    slotStatus: SlotStatusEnum;
    remarks: string | null;
    createdAt: Date;
  }

  const slots: BookingSlotData[] = [];
  const slotHours = [8, 9, 10, 11, 13, 14, 15, 16, 17]; // Jam operasional: 08:00 - 17:00
  const slotDuration = 60; // Durasi per slot: 60 menit

  for (let day = 0; day < 7; day++) {
    // Buat tanggal untuk hari ini + day offset, dalam timezone Indonesia
    const currentDate = new Date(today);
    currentDate.setUTCDate(today.getUTCDate() + day);

    // Pastikan field date menggunakan tanggal tanpa waktu (hanya tanggal)
    const dateOnly = new Date(
      Date.UTC(
        currentDate.getUTCFullYear(),
        currentDate.getUTCMonth(),
        currentDate.getUTCDate(),
        0,
        0,
        0,
        0,
      ),
    );

    // Skip weekend jika perlu (opsional)
    // if (currentDate.getUTCDay() === 0 || currentDate.getUTCDay() === 6) continue;

    for (const hour of slotHours) {
      // Jika ada bay, buat slot per bay
      if (bays.length > 0) {
        for (const bay of bays) {
          // Buat startTime dengan timezone Indonesia (WIB - UTC+7)
          const startTime = createIndonesiaDateTime(currentDate, hour, 0);

          const endTime = new Date(startTime);
          endTime.setUTCMinutes(endTime.getUTCMinutes() + slotDuration);

          // Format date string untuk ID (gunakan tanggal dalam format YYYYMMDD)
          // Ambil tanggal dari dateOnly dalam format Indonesia
          const year = dateOnly.getUTCFullYear();
          const month = String(dateOnly.getUTCMonth() + 1).padStart(2, '0');
          const day = String(dateOnly.getUTCDate()).padStart(2, '0');
          const dateStr = `${year}${month}${day}`;
          const timestamp = `${day}${hour}${bay.id.slice(-2)}`.padStart(6, '0');
          const slotId = `BSL${dateStr}${timestamp}`.substring(0, 20);

          slots.push({
            id: slotId,
            company_id: companyId,
            branch_id: branchId,
            bay_id: bay.id,
            date: dateOnly,
            startTime: startTime,
            endTime: endTime,
            capacity: 1,
            bookedCount: 0,
            slotStatus: SlotStatusEnum.OPEN,
            remarks: `Auto-generated slot for ${bay.name}`,
            createdAt: new Date(),
          });
        }
      } else {
        // Jika tidak ada bay, buat slot tanpa bay_id
        // Buat startTime dengan timezone Indonesia (WIB - UTC+7)
        const startTime = createIndonesiaDateTime(currentDate, hour, 0);

        const endTime = new Date(startTime);
        endTime.setUTCMinutes(endTime.getUTCMinutes() + slotDuration);

        // Format date string untuk ID (gunakan tanggal dalam format YYYYMMDD)
        // Ambil tanggal dari dateOnly dalam format Indonesia
        const year = dateOnly.getUTCFullYear();
        const month = String(dateOnly.getUTCMonth() + 1).padStart(2, '0');
        const day = String(dateOnly.getUTCDate()).padStart(2, '0');
        const dateStr = `${year}${month}${day}`;
        const timestamp = `${day}${hour}00`.padStart(6, '0');
        const slotId = `BSL${dateStr}${timestamp}`.substring(0, 20);

        slots.push({
          id: slotId,
          company_id: companyId,
          branch_id: branchId,
          bay_id: null,
          date: dateOnly,
          startTime: startTime,
          endTime: endTime,
          capacity: 1,
          bookedCount: 0,
          slotStatus: SlotStatusEnum.OPEN,
          remarks: 'Auto-generated slot',
          createdAt: new Date(),
        });
      }
    }
  }

  console.log(`📅 Generated ${slots.length} booking slots`);

  // Insert slots in batches
  const batchSize = 50;
  let insertedCount = 0;
  let skippedCount = 0;

  for (let i = 0; i < slots.length; i += batchSize) {
    const batch = slots.slice(i, i + batchSize);

    for (const slot of batch) {
      try {
        await prisma.wks_BookingSlot.upsert({
          where: {
            company_id_id: {
              company_id: slot.company_id,
              id: slot.id,
            },
          },
          update: {
            // Update existing slot jika sudah ada
            startTime: slot.startTime,
            endTime: slot.endTime,
            slotStatus: slot.slotStatus,
          },
          create: slot,
        });
        insertedCount++;
      } catch (error) {
        console.log(`⚠️  Failed to insert slot ${slot.id}:`, error.message);
        skippedCount++;
      }
    }

    console.log(
      `✅ Processed ${Math.min(i + batchSize, slots.length)}/${slots.length} slots...`,
    );
  }

  console.log(`\n✅ Seed completed!`);
  console.log(`   - Inserted/Updated: ${insertedCount} slots`);
  console.log(`   - Skipped: ${skippedCount} slots`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding booking slots:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
