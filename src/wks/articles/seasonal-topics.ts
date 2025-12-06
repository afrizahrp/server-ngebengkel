export type SeasonalTopicCategory = 'RAINY' | 'MUDIK';

export interface SeasonalTopic {
  id: string;
  title: string;
  category: SeasonalTopicCategory;
  description?: string;
  keywords: string[]; // SEO keywords: short + longtail
}

export const SEASONAL_TOPICS: SeasonalTopic[] = [
  // Rainy Season (10)
  {
    id: 'rainy-01',
    title: 'Cara Mencegah Aquaplaning Saat Hujan Deras',
    category: 'RAINY',
    keywords: ['aquaplaning', 'hujan deras', 'ban mobil hujan', 'cara mencegah aquaplaning', 'keselamatan mengemudi hujan'],
  },
  {
    id: 'rainy-02',
    title: 'Tips Mengemudi Aman Saat Jalanan Licin / Banjir',
    category: 'RAINY',
    keywords: ['mengemudi banjir', 'jalanan licin', 'tips berkendara hujan', 'mobil terendam air', 'cara aman lewat banjir'],
  },
  {
    id: 'rainy-03',
    title: 'Penyebab Rem Blong Saat Musim Hujan dan Cara Menghindarinya',
    category: 'RAINY',
    keywords: ['rem blong', 'rem basah hujan', 'rem tidak berfungsi', 'penyebab rem blong musim hujan', 'cara cegah rem blong'],
  },
  {
    id: 'rainy-04',
    title: 'Wiper Tidak Bersih / Bergetar: Penyebab & Solusi Cepat',
    category: 'RAINY',
    keywords: ['wiper bergetar', 'wiper tidak bersih', 'karet wiper rusak', 'cara ganti wiper', 'wiper mobil bermasalah'],
  },
  {
    id: 'rainy-05',
    title: 'Cara Mengecek Kesiapan Ban Sebelum Masuk Musim Hujan',
    category: 'RAINY',
    keywords: ['ban mobil hujan', 'cek ban musim hujan', 'tekanan ban hujan', 'grip ban licin', 'ban gundul berbahaya'],
  },
  {
    id: 'rainy-06',
    title: 'Panduan Cek Sistem Kelistrikan Mobil Saat Cuaca Basah',
    category: 'RAINY',
    keywords: ['kelistrikan mobil basah', 'aki terendam air', 'korsleting mobil hujan', 'cek kelistrikan musim hujan', 'lampu mobil mati hujan'],
  },
  {
    id: 'rainy-07',
    title: 'Air Masuk ke Kabin: Penyebab Umum dan Cara Mencegahnya',
    category: 'RAINY',
    keywords: ['air masuk kabin', 'kebocoran mobil hujan', 'lantai mobil basah', 'karpet mobil banjir', 'seal pintu bocor'],
  },
  {
    id: 'rainy-08',
    title: 'Fogging pada Kaca Mobil: Cara Mengatasi Embun dengan Benar',
    category: 'RAINY',
    keywords: ['kaca mobil berembun', 'fogging kaca', 'cara hilangkan embun kaca', 'ac mobil embun', 'anti fog mobil'],
  },
  {
    id: 'rainy-09',
    title: 'Langkah Penting Jika Mobil Terendam Banjir (Jangan Langsung Distarter!)',
    category: 'RAINY',
    keywords: ['mobil terendam banjir', 'mobil kena banjir', 'water hammer mesin', 'mobil mogok banjir', 'cara atasi mobil terendam'],
  },
  {
    id: 'rainy-10',
    title: 'Tips Rawat Rem & Kampas Rem di Musim Hujan Agar Tidak Licin',
    category: 'RAINY',
    keywords: ['perawatan rem hujan', 'kampas rem basah', 'rem licin hujan', 'cara rawat rem musim hujan', 'cek kampas rem'],
  },
  // Mudik / New Year (10)
  {
    id: 'mudik-01',
    title: 'Checklist Servis Mobil Sebelum Mudik Jarak Jauh',
    category: 'MUDIK',
    keywords: ['servis mobil mudik', 'checklist mudik', 'persiapan mobil lebaran', 'cek mobil sebelum mudik', 'servis lengkap mudik'],
  },
  {
    id: 'mudik-02',
    title: 'Cara Cek Rem dan Cairan Rem Sebelum Perjalanan Panjang',
    category: 'MUDIK',
    keywords: ['cek rem mudik', 'cairan rem habis', 'rem blong perjalanan jauh', 'ganti minyak rem', 'kampas rem tipis'],
  },
  {
    id: 'mudik-03',
    title: 'Penyebab Mobil Overheat Saat Macet di Tol + Cara Darurat',
    category: 'MUDIK',
    keywords: ['mobil overheat', 'mesin panas macet', 'radiator bocor', 'cara atasi overheat darurat', 'suhu mesin tinggi'],
  },
  {
    id: 'mudik-04',
    title: 'Rekomendasi Servis Ringan Sebelum Road Trip',
    category: 'MUDIK',
    keywords: ['servis ringan mobil', 'persiapan road trip', 'tune up mobil', 'cek rutin sebelum touring', 'servis murah mudik'],
  },
  {
    id: 'mudik-05',
    title: 'Cara Cek Oli, Radiator, Aki Sebelum Berangkat Jauh',
    category: 'MUDIK',
    keywords: ['cek oli mesin', 'radiator bocor', 'aki tekor', 'cara cek cairan mobil', 'oli mesin habis perjalanan'],
  },
  {
    id: 'mudik-06',
    title: 'Barang Wajib di Mobil Saat Mudik: Dari Tools sampai Safety Kit',
    category: 'MUDIK',
    keywords: ['perlengkapan mudik', 'safety kit mobil', 'tools wajib mobil', 'persiapan darurat mudik', 'emergency kit'],
  },
  {
    id: 'mudik-07',
    title: 'Cara Cegah Mobil Mogok Saat Perjalanan Jauh',
    category: 'MUDIK',
    keywords: ['mobil mogok', 'cegah mogok perjalanan', 'mobil mati mendadak', 'tips anti mogok', 'perawatan cegah mogok'],
  },
  {
    id: 'mudik-08',
    title: 'Ban Pecah di Tol: Penyebab, Cara Menghindari, dan Tindakan Darurat',
    category: 'MUDIK',
    keywords: ['ban pecah tol', 'ban meletus', 'ganti ban darurat', 'penyebab ban pecah', 'cara hindari ban pecah'],
  },
  {
    id: 'mudik-09',
    title: 'Tips Mengatur Beban Barang Agar Mobil Tidak Ompong Saat Mudik',
    category: 'MUDIK',
    keywords: ['mobil ompong', 'beban berlebih mudik', 'suspensi amblas', 'cara atur barang mobil', 'overload mobil'],
  },
  {
    id: 'mudik-10',
    title: '7 Komponen Mobil yang Paling Sering Rusak di Perjalanan Jauh',
    category: 'MUDIK',
    keywords: ['komponen sering rusak', 'kerusakan mobil touring', 'spare part mudik', 'part mobil rusak perjalanan', 'antisipasi kerusakan'],
  },
];

export const SEASONAL_TOPICS_MAP: Record<string, SeasonalTopic> = SEASONAL_TOPICS.reduce(
  (acc, topic) => {
    acc[topic.id] = topic;
    return acc;
  },
  {} as Record<string, SeasonalTopic>,
);

export function getSeasonalTopicById(id: string): SeasonalTopic | undefined {
  return SEASONAL_TOPICS_MAP[id];
}

export function slugifyTopicTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 120);
}
