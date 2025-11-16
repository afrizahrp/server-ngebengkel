/* eslint-disable no-console */
import { PrismaClient, wks_PromoType, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Cari WL secara fleksibel agar tidak bermasalah padding CHAR(21)
  const wl = await prisma.wks_waitingList.findFirst({
    where: {
      OR: [
        { id: { startsWith: 'WL-00001' } },
        { email: 'info@ngebengkel.com' },
        { name: 'Bekti AutoSolution' },
      ],
    },
    select: { id: true },
  });

  if (!wl) {
    throw new Error(`wks_waitingList dengan id/name/email target tidak ditemukan.`);
  }

  // Data promo "FREE CHECKLIST"
  const freeChecklistItems: string[] = [
    'Cek aki',
    'Cek fanbelt',
    'Cek coolant',
    'Cek rembes" oli di mesin',
    'Cek & bersihkan filter udara',
    'Cek & bersihkan filter AC',
    'Cek air washer',
    'Cek rem depan',
    'Cek minyak rem reservoir',
  ];

  // Insert promo
  // Buat id promo yang pendek (<=21) supaya tidak melebihi CHAR(21)
  const promoId = `PRM${Date.now().toString(36)}`.slice(0, 21);

  // Logging defensif bila masih error panjang kolom
  console.log('DEBUG length:', {
    promoId: promoId.length,
    waitingListId: wl.id.length,
    title: 'Free General Check'.length,
  });

  const created = await prisma.wks_promo.create({
    data: {
      id: promoId,
      waitingList_id: wl.id,
      title: 'Free General Check',
      description: 'Pengecekan umum kendaraan secara gratis.',
      promoType: wks_PromoType.FREE_CHECKLIST,
      checklist: freeChecklistItems as unknown as Prisma.JsonArray,
      isActive: true,
      createdBy: 'seed',
      updatedBy: 'seed',
    },
  });

  console.log('✅ Promo created:', created.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
