import { ProvinceData, DashboardFilters } from "../types";

function getSeedForString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = hash * 31 + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Complete 38 Provinces of Indonesia with realistic administrative counts
const provincesMeta = [
  { id: "11", name: "Aceh", kab: 23, kec: 289, desa: 6497, idBase: 0.648, bumdes: 7463 },
  { id: "12", name: "Sumatera Utara", kab: 33, kec: 450, desa: 5417, idBase: 0.655, bumdes: 5168 },
  { id: "13", name: "Sumatera Barat", kab: 19, kec: 179, desa: 928, idBase: 0.685, bumdes: 1104 },
  { id: "14", name: "Riau", kab: 12, kec: 169, desa: 1591, idBase: 0.665, bumdes: 1781 },
  { id: "15", name: "Jambi", kab: 11, kec: 141, desa: 1414, idBase: 0.645, bumdes: 1442 },
  { id: "16", name: "Sumatera Selatan", kab: 17, kec: 236, desa: 2853, idBase: 0.635, bumdes: 2772 },
  { id: "17", name: "Bengkulu", kab: 10, kec: 128, desa: 1341, idBase: 0.612, bumdes: 1279 },
  { id: "18", name: "Lampung", kab: 15, kec: 228, desa: 2435, idBase: 0.649, bumdes: 2521 },
  { id: "19", name: "Kepulauan Bangka Belitung", kab: 7, kec: 47, desa: 309, idBase: 0.702, bumdes: 351 },
  { id: "21", name: "Kepulauan Riau", kab: 7, kec: 75, desa: 275, idBase: 0.691, bumdes: 301 },
  { id: "31", name: "DKI Jakarta", kab: 1, kec: 2, desa: 11, idBase: 0.771, bumdes: 14 },
  { id: "32", name: "Jawa Barat", kab: 27, kec: 627, desa: 5312, idBase: 0.702, bumdes: 6133 },
  { id: "33", name: "Jawa Tengah", kab: 35, kec: 576, desa: 7809, idBase: 0.719, bumdes: 6698 },
  { id: "34", name: "DI Yogyakarta", kab: 5, kec: 78, desa: 392, idBase: 0.801, bumdes: 483 },
  { id: "35", name: "Jawa Timur", kab: 38, kec: 666, desa: 7725, idBase: 0.698, bumdes: 7764 },
  { id: "36", name: "Banten", kab: 8, kec: 155, desa: 1238, idBase: 0.668, bumdes: 1380 },
  { id: "51", name: "Bali", kab: 9, kec: 57, desa: 636, idBase: 0.742, bumdes: 778 },
  { id: "52", name: "Nusa Tenggara Barat", kab: 10, kec: 117, desa: 1005, idBase: 0.658, bumdes: 1192 },
  { id: "53", name: "Nusa Tenggara Timur", kab: 22, kec: 309, desa: 3026, idBase: 0.582, bumdes: 3073 },
  { id: "61", name: "Kalimantan Barat", kab: 14, kec: 174, desa: 2031, idBase: 0.615, bumdes: 2283 },
  { id: "62", name: "Kalimantan Tengah", kab: 14, kec: 136, desa: 1432, idBase: 0.608, bumdes: 1568 },
  { id: "63", name: "Kalimantan Selatan", kab: 13, kec: 153, desa: 1864, idBase: 0.638, bumdes: 1932 },
  { id: "64", name: "Kalimantan Timur", kab: 10, kec: 103, desa: 841, idBase: 0.672, bumdes: 941 },
  { id: "65", name: "Kalimantan Utara", kab: 5, kec: 53, desa: 447, idBase: 0.621, bumdes: 477 },
  { id: "71", name: "Sulawesi Utara", kab: 15, kec: 171, desa: 1507, idBase: 0.652, bumdes: 1618 },
  { id: "72", name: "Sulawesi Tengah", kab: 13, kec: 175, desa: 1842, idBase: 0.621, bumdes: 1856 },
  { id: "73", name: "Sulawesi Selatan", kab: 24, kec: 307, desa: 2253, idBase: 0.662, bumdes: 2446 },
  { id: "74", name: "Sulawesi Tenggara", kab: 17, kec: 220, desa: 1908, idBase: 0.618, bumdes: 1982 },
  { id: "75", name: "Gorontalo", kab: 6, kec: 77, desa: 657, idBase: 0.622, bumdes: 640 },
  { id: "76", name: "Sulawesi Barat", kab: 6, kec: 69, desa: 575, idBase: 0.605, bumdes: 527 },
  { id: "81", name: "Maluku", kab: 11, kec: 118, desa: 1198, idBase: 0.592, bumdes: 1154 },
  { id: "82", name: "Maluku Utara", kab: 10, kec: 115, desa: 1063, idBase: 0.581, bumdes: 1016 },
  { id: "91", name: "Papua Barat", kab: 7, kec: 86, desa: 803, idBase: 0.552, bumdes: 564 },
  { id: "92", name: "Papua", kab: 9, kec: 105, desa: 935, idBase: 0.548, bumdes: 477 },
  { id: "93", name: "Papua Selatan", kab: 4, kec: 74, desa: 674, idBase: 0.535, bumdes: 364 },
  { id: "94", name: "Papua Tengah", kab: 8, kec: 131, desa: 1131, idBase: 0.521, bumdes: 389 },
  { id: "95", name: "Papua Pegunungan", kab: 8, kec: 252, desa: 2617, idBase: 0.495, bumdes: 527 },
  { id: "96", name: "Papua Barat Daya", kab: 6, kec: 132, desa: 939, idBase: 0.542, bumdes: 426 }
];

export const provinceDataList: ProvinceData[] = provincesMeta.map(pm => {
  const seed = parseInt(pm.id) || 45;
  const idBase = pm.idBase;

  // Create multi-year Indeks Desa
  const indeksDesa: { [year: string]: number } = {
    "2022": parseFloat((idBase - 0.052).toFixed(3)),
    "2023": parseFloat((idBase - 0.030).toFixed(3)),
    "2024": parseFloat((idBase - 0.015).toFixed(3)),
    "2025": idBase,
    "2026": idBase
  };

  // Create dimensions
  const idDimensions: { [year: string]: { layananDasar: number, sosial: number, ekonomi: number, lingkungan: number, aksesibilitas: number, tataKelola: number } } = {
    "2026": {
      layananDasar: parseFloat((idBase + 0.045).toFixed(3)),
      sosial: parseFloat((idBase + 0.022).toFixed(3)),
      ekonomi: parseFloat((idBase + 0.012).toFixed(3)),
      lingkungan: parseFloat((idBase - 0.024).toFixed(3)),
      aksesibilitas: parseFloat((idBase - 0.035).toFixed(3)),
      tataKelola: parseFloat((idBase + 0.025).toFixed(3))
    },
    "2025": {
      layananDasar: parseFloat((idBase + 0.045).toFixed(3)),
      sosial: parseFloat((idBase + 0.022).toFixed(3)),
      ekonomi: parseFloat((idBase + 0.012).toFixed(3)),
      lingkungan: parseFloat((idBase - 0.024).toFixed(3)),
      aksesibilitas: parseFloat((idBase - 0.035).toFixed(3)),
      tataKelola: parseFloat((idBase + 0.025).toFixed(3))
    },
    "2024": {
      layananDasar: parseFloat((idBase + 0.030).toFixed(3)),
      sosial: parseFloat((idBase + 0.010).toFixed(3)),
      ekonomi: parseFloat((idBase + 0.002).toFixed(3)),
      lingkungan: parseFloat((idBase - 0.034).toFixed(3)),
      aksesibilitas: parseFloat((idBase - 0.045).toFixed(3)),
      tataKelola: parseFloat((idBase + 0.010).toFixed(3))
    },
    "2023": {
      layananDasar: parseFloat((idBase + 0.015).toFixed(3)),
      sosial: parseFloat((idBase - 0.002).toFixed(3)),
      ekonomi: parseFloat((idBase - 0.010).toFixed(3)),
      lingkungan: parseFloat((idBase - 0.045).toFixed(3)),
      aksesibilitas: parseFloat((idBase - 0.055).toFixed(3)),
      tataKelola: parseFloat(idBase.toFixed(3))
    },
    "2022": {
      layananDasar: parseFloat((idBase + 0.005).toFixed(3)),
      sosial: parseFloat((idBase - 0.015).toFixed(3)),
      ekonomi: parseFloat((idBase - 0.022).toFixed(3)),
      lingkungan: parseFloat((idBase - 0.055).toFixed(3)),
      aksesibilitas: parseFloat((idBase - 0.065).toFixed(3)),
      tataKelola: parseFloat((idBase - 0.015).toFixed(3))
    }
  };

  // BUM Desa count
  const bumDesaCount = pm.bumdes;

  // Status
  const bumDesaStatus: { [year: string]: { aktif: number, tidakAktif: number, dalamPengembangan: number } } = {
    "2026": {
      aktif: Math.round(bumDesaCount * 0.72),
      tidakAktif: Math.round(bumDesaCount * 0.18),
      dalamPengembangan: Math.round(bumDesaCount * 0.10)
    },
    "2025": {
      aktif: Math.round(bumDesaCount * 0.72),
      tidakAktif: Math.round(bumDesaCount * 0.18),
      dalamPengembangan: Math.round(bumDesaCount * 0.10)
    },
    "2024": {
      aktif: Math.round(bumDesaCount * 0.68),
      tidakAktif: Math.round(bumDesaCount * 0.20),
      dalamPengembangan: Math.round(bumDesaCount * 0.12)
    },
    "2023": {
      aktif: Math.round(bumDesaCount * 0.62),
      tidakAktif: Math.round(bumDesaCount * 0.23),
      dalamPengembangan: Math.round(bumDesaCount * 0.15)
    },
    "2022": {
      aktif: Math.round(bumDesaCount * 0.58),
      tidakAktif: Math.round(bumDesaCount * 0.25),
      dalamPengembangan: Math.round(bumDesaCount * 0.17)
    }
  };

  // Dimensions
  const bumDesaPemeringkatan: { [year: string]: { kelembagaan: number, manajemen: number, usaha: number, kemitraan: number, asetModal: number, administrasi: number, manfaat: number } } = {
    "2026": {
      kelembagaan: parseFloat((0.72 + (seed % 8) / 100).toFixed(3)),
      manajemen: parseFloat((0.67 + (seed % 10) / 100).toFixed(3)),
      usaha: parseFloat((0.69 + (seed % 8) / 100).toFixed(3)),
      kemitraan: parseFloat((0.61 + (seed % 12) / 100).toFixed(3)),
      asetModal: parseFloat((0.65 + (seed % 9) / 100).toFixed(3)),
      administrasi: parseFloat((0.63 + (seed % 11) / 100).toFixed(3)),
      manfaat: parseFloat((0.67 + (seed % 8) / 100).toFixed(3))
    },
    "2025": {
      kelembagaan: parseFloat((0.72 + (seed % 8) / 100).toFixed(3)),
      manajemen: parseFloat((0.67 + (seed % 10) / 100).toFixed(3)),
      usaha: parseFloat((0.69 + (seed % 8) / 100).toFixed(3)),
      kemitraan: parseFloat((0.61 + (seed % 12) / 100).toFixed(3)),
      asetModal: parseFloat((0.65 + (seed % 9) / 100).toFixed(3)),
      administrasi: parseFloat((0.63 + (seed % 11) / 100).toFixed(3)),
      manfaat: parseFloat((0.67 + (seed % 8) / 100).toFixed(3))
    },
    "2024": {
      kelembagaan: parseFloat((0.68 + (seed % 8) / 100).toFixed(3)),
      manajemen: parseFloat((0.63 + (seed % 10) / 100).toFixed(3)),
      usaha: parseFloat((0.65 + (seed % 8) / 100).toFixed(3)),
      kemitraan: parseFloat((0.57 + (seed % 12) / 100).toFixed(3)),
      asetModal: parseFloat((0.61 + (seed % 9) / 100).toFixed(3)),
      administrasi: parseFloat((0.59 + (seed % 11) / 100).toFixed(3)),
      manfaat: parseFloat((0.63 + (seed % 8) / 100).toFixed(3))
    },
    "2023": {
      kelembagaan: parseFloat((0.65 + (seed % 8) / 100).toFixed(3)),
      manajemen: parseFloat((0.60 + (seed % 10) / 100).toFixed(3)),
      usaha: parseFloat((0.61 + (seed % 8) / 100).toFixed(3)),
      kemitraan: parseFloat((0.53 + (seed % 12) / 100).toFixed(3)),
      asetModal: parseFloat((0.57 + (seed % 9) / 100).toFixed(3)),
      administrasi: parseFloat((0.55 + (seed % 11) / 100).toFixed(3)),
      manfaat: parseFloat((0.59 + (seed % 8) / 100).toFixed(3))
    },
    "2022": {
      kelembagaan: parseFloat((0.62 + (seed % 8) / 100).toFixed(3)),
      manajemen: parseFloat((0.57 + (seed % 10) / 100).toFixed(3)),
      usaha: parseFloat((0.58 + (seed % 8) / 100).toFixed(3)),
      kemitraan: parseFloat((0.50 + (seed % 12) / 100).toFixed(3)),
      asetModal: parseFloat((0.54 + (seed % 9) / 100).toFixed(3)),
      administrasi: parseFloat((0.52 + (seed % 11) / 100).toFixed(3)),
      manfaat: parseFloat((0.55 + (seed % 8) / 100).toFixed(3))
    }
  };

  // Bagi Hasil BUM Desa ke PADes (dalam Miliar Rupiah)
  const scale = pm.desa / 100;
  const bagiHasilPADes: { [year: string]: number } = {
    "2022": parseFloat((scale * 1.6 + (seed % 10) / 5).toFixed(1)),
    "2023": parseFloat((scale * 1.9 + (seed % 10) / 5).toFixed(1)),
    "2024": parseFloat((scale * 2.3 + (seed % 10) / 5).toFixed(1)),
    "2025": parseFloat((scale * 2.7 + (seed % 10) / 5).toFixed(1)),
    "2026": parseFloat((scale * 2.7 + (seed % 10) / 5).toFixed(1))
  };

  const nibCount = Math.round(bumDesaCount * (0.68 + (seed % 16) / 100));
  const nibPercentage = parseFloat(((nibCount / bumDesaCount) * 100).toFixed(2));

  // Program Inovasi
  const programInovasi = {
    desaEkspor: Math.round(bumDesaCount * 0.04),
    desaBrilian: Math.round(bumDesaCount * 0.08),
    mbg2025: Math.round(pm.desa * 0.12),
    mbg2026: Math.round(pm.desa * 0.18)
  };

  const makanBergiziGratis = {
    bumDesaCount: programInovasi.mbg2026,
    pendapatan2025: programInovasi.mbg2025 * 32.5, // Mock data Miliar Rp
    pendapatan2026: programInovasi.mbg2026 * 41.8
  };

  // BUMDesma (BUM Desa Bersama)
  const bBersamaCount = Math.round(pm.kec * 0.22) || 1;
  const bBersamaAktif = Math.round(bBersamaCount * 0.74);

  const categories: ("Baik" | "Sangat Baik" | "Cukup" | "Kurang")[] = ["Cukup", "Baik", "Sangat Baik"];
  const bKategori = categories[seed % 3];

  return {
    id: pm.id,
    name: pm.name,
    kabupatenCount: pm.kab,
    kecamatanCount: pm.kec,
    desaCount: pm.desa,
    indeksDesa,
    idDimensions,
    bumDesaCount,
    bumDesaStatus,
    bumDesaPemeringkatan,
    bagiHasilPADes,
    nib: {
      count: nibCount,
      percentage: nibPercentage
    },
    programInovasi,
    makanBergiziGratis,
    bumDesaBersama: {
      count: bBersamaCount,
      aktif: bBersamaAktif,
      tidakAktif: bBersamaCount - bBersamaAktif,
      pemeringkatanNilai: parseFloat((0.61 + (seed % 14) / 100).toFixed(3)),
      pemeringkatanKategori: bKategori
    }
  };
});

// National Summary Totals
export const nationalSummary: ProvinceData = {
  id: "ALL",
  name: "Semua Provinsi",
  kabupatenCount: 514,
  kecamatanCount: 7277,
  desaCount: 75266,
  indeksDesa: {
    "2022": 0.61214,
    "2023": 0.65586,
    "2024": 0.68532,
    "2025": 0.7060907572,
    "2026": 0.7060907572,
  },
  idDimensions: {
    "2026": {
      layananDasar: 0.721,
      sosial: 0.691,
      ekonomi: 0.692,
      lingkungan: 0.645,
      aksesibilitas: 0.624,
      tataKelola: 0.683,
    },
    "2025": {
      layananDasar: 0.721,
      sosial: 0.691,
      ekonomi: 0.692,
      lingkungan: 0.645,
      aksesibilitas: 0.624,
      tataKelola: 0.683,
    },
    "2024": {
      layananDasar: 0.680,
      sosial: 0.655,
      ekonomi: 0.652,
      lingkungan: 0.605,
      aksesibilitas: 0.582,
      tataKelola: 0.638,
    },
    "2023": {
      layananDasar: 0.652,
      sosial: 0.631,
      ekonomi: 0.628,
      lingkungan: 0.580,
      aksesibilitas: 0.560,
      tataKelola: 0.615,
    },
    "2022": {
      layananDasar: 0.625,
      sosial: 0.608,
      ekonomi: 0.604,
      lingkungan: 0.558,
      aksesibilitas: 0.539,
      tataKelola: 0.590,
    }
  },
  bumDesaCount: 64831,
  bumDesaStatus: {
    "2026": {
      aktif: 36582,
      tidakAktif: 8521,
      dalamPengembangan: 18451,
      perintis: 141,
      pemula: 29000,
      berkembang: 5000,
      maju: 1800
    },
    "2025": { aktif: 46678, tidakAktif: 11670, dalamPengembangan: 6483 },
    "2024": { aktif: 40700, tidakAktif: 15850, dalamPengembangan: 8281 },
    "2023": { aktif: 36200, tidakAktif: 18600, dalamPengembangan: 10031 },
    "2022": { aktif: 31800, tidakAktif: 21500, dalamPengembangan: 11531 },
  },
  bumDesaPemeringkatan: {
    "2026": {
      kelembagaan: 0.682,
      manajemen: 0.641,
      usaha: 0.652,
      kemitraan: 0.591,
      asetModal: 0.615,
      administrasi: 0.602,
      manfaat: 0.645,
      nilaiPemeringkatan: 44.59
    },
    "2025": {
      kelembagaan: 0.721,
      manajemen: 0.671,
      usaha: 0.688,
      kemitraan: 0.620,
      asetModal: 0.658,
      administrasi: 0.642,
      manfaat: 0.674,
    },
    "2024": {
      kelembagaan: 0.685,
      manajemen: 0.635,
      usaha: 0.652,
      kemitraan: 0.585,
      asetModal: 0.622,
      administrasi: 0.608,
      manfaat: 0.638,
    },
    "2023": {
      kelembagaan: 0.650,
      manajemen: 0.602,
      usaha: 0.620,
      kemitraan: 0.550,
      asetModal: 0.588,
      administrasi: 0.575,
      manfaat: 0.605,
    },
    "2022": {
      kelembagaan: 0.620,
      manajemen: 0.570,
      usaha: 0.590,
      kemitraan: 0.520,
      asetModal: 0.558,
      administrasi: 0.545,
      manfaat: 0.575,
    }
  },
  bagiHasilPADes: {
    "2022": 642.7,
    "2023": 732.4,
    "2024": 852.1,
    "2025": 963.8,
    "2026": 963.8,
  },
  nib: {
    count: 47943,
    percentage: 73.95,
  },
  programInovasi: {
    desaEkspor: 1923,
    desaBrilian: 3276,
    mbg2025: 6401,
    mbg2026: 8752,
  },
  makanBergiziGratis: {
    bumDesaCount: 8752,
    pendapatan2025: 6401 * 32.5,
    pendapatan2026: 8752 * 41.8,
  },
  bumDesaBersama: {
    count: 1258,
    aktif: 892,
    tidakAktif: 366,
    pemeringkatanNilai: 0.654,
    pemeringkatanKategori: "Baik"
  }
};

// --- HIERARCHICAL ADMINISTRATIVE GENERATION (STABLE SEED-BASED) ---

export function getKabupatenList(provinsiId: string): string[] {
  if (provinsiId === "ALL") return [];
  const prov = provinceDataList.find(p => p.id === provinsiId);
  if (!prov) return [];

  // Stable generation down to total kabupaten count
  const list: string[] = [];
  
  if (prov.name === "Jawa Timur") {
    return [
      "Kabupaten Pacitan", "Kabupaten Ponorogo", "Kabupaten Trenggalek", "Kabupaten Blitar", 
      "Kabupaten Kediri", "Kabupaten Malang", "Kabupaten Lumajang", "Kabupaten Jember", 
      "Kabupaten Banyuwangi", "Kabupaten Bondowoso", "Kabupaten Situbondo", "Kabupaten Probolinggo", 
      "Kabupaten Pasuruan", "Kabupaten Sidoarjo", "Kabupaten Mojokerto", "Kabupaten Jombang", 
      "Kabupaten Nganjuk", "Kabupaten Madiun", "Kabupaten Magetan", "Kabupaten Ngawi", 
      "Kabupaten Bojonegoro", "Kabupaten Tuban", "Kabupaten Lamongan", "Kabupaten Gresik", 
      "Kabupaten Bangkalan", "Kabupaten Sampang", "Kabupaten Pamekasan", "Kabupaten Sumenep", 
      "Kota Kediri", "Kota Blitar", "Kota Malang", "Kota Probolinggo", "Kota Pasuruan", 
      "Kota Mojokerto", "Kota Madiun", "Kota Surabaya", "Kota Batu"
    ].slice(0, prov.kabupatenCount);
  }

  if (prov.name === "Jawa Barat") {
    return [
      "Kabupaten Bogor", "Kabupaten Sukabumi", "Kabupaten Cianjur", "Kabupaten Bandung", 
      "Kabupaten Garut", "Kabupaten Tasikmalaya", "Kabupaten Ciamis", "Kabupaten Kuningan", 
      "Kabupaten Cirebon", "Kabupaten Majalengka", "Kabupaten Sumedang", "Kabupaten Indramayu", 
      "Kabupaten Subang", "Kabupaten Purwakarta", "Kabupaten Karawang", "Kabupaten Bekasi", 
      "Kabupaten Bandung Barat", "Kabupaten Pangandaran", "Kota Bogor", "Kota Sukabumi", 
      "Kota Bandung", "Kota Cirebon", "Kota Bekasi", "Kota Depok", "Kota Cimahi", 
      "Kota Tasikmalaya", "Kota Banjar"
    ].slice(0, prov.kabupatenCount);
  }

  if (prov.name === "Jawa Tengah") {
    return [
      "Kabupaten Cilacap", "Kabupaten Banyumas", "Kabupaten Purbalingga", "Kabupaten Banjarnegara", 
      "Kabupaten Kebumen", "Kabupaten Purworejo", "Kabupaten Wonosobo", "Kabupaten Magelang", 
      "Kabupaten Boyolali", "Kabupaten Klaten", "Kabupaten Sukoharjo", "Kabupaten Wonogiri", 
      "Kabupaten Karanganyar", "Kabupaten Sragen", "Kabupaten Grobogan", "Kabupaten Blora", 
      "Kabupaten Rembang", "Kabupaten Pati", "Kabupaten Kudus", "Kabupaten Jepara", 
      "Kabupaten Demak", "Kabupaten Semarang", "Kabupaten Temanggung", "Kabupaten Kendal", 
      "Kabupaten Batang", "Kabupaten Pekalongan", "Kabupaten Pemalang", "Kabupaten Tegal", 
      "Kabupaten Brebes", "Kota Magelang", "Kota Surakarta", "Kota Salatiga", "Kota Semarang", 
      "Kota Pekalongan", "Kota Tegal"
    ].slice(0, prov.kabupatenCount);
  }

  if (prov.name === "DKI Jakarta") {
    return ["Kabupaten Kepulauan Seribu"];
  }

  if (prov.name === "DI Yogyakarta") {
    return ["Kabupaten Kulon Progo", "Kabupaten Bantul", "Kabupaten Gunungkidul", "Kabupaten Sleman", "Kota Yogyakarta"];
  }

  if (prov.name === "Bali") {
    return ["Kabupaten Jembrana", "Kabupaten Tabanan", "Kabupaten Badung", "Kabupaten Gianyar", "Kabupaten Klungkung", "Kabupaten Bangli", "Kabupaten Karangasem", "Kabupaten Buleleng", "Kota Denpasar"];
  }

  // General realistic generators for remaining 32 provinces
  const bases = [
    "Sleman", "Cianjur", "Sidoarjo", "Banyuwangi", "Dharma", "Lestari", "Kencana", "Bakti", "Karta", "Prasetya", "Santosa", "Berjaya", 
    "Indah", "Sejahtera", "Makmur", "Agung", "Raya", "Utama", "Mulya", "Luhur", "Jaya", "Mulia", "Persada", "Artha"
  ];

  for (let i = 0; i < prov.kabupatenCount; i++) {
    const seed = (parseInt(provinsiId) * 17 + i * 31) % bases.length;
    const isKota = i === 0 && prov.kabupatenCount > 3;
    const pref = isKota ? "Kota" : "Kabupaten";
    const name = `${pref} ${bases[seed]} ${["I", "II", "Utara", "Selatan", "Barat", "Timur", "Hulu", "Hilir", "Raya"][i % 9]}`;
    // Deduplicate
    if (!list.includes(name)) {
      list.push(name);
    } else {
      list.push(`${name} ${i + 1}`);
    }
  }

  return list;
}

export function getKecamatanList(provinsiId: string, kabupatenName: string): string[] {
  if (provinsiId === "ALL" || !kabupatenName) return [];

  // Determine realistic subdistrict counts (between 6 and 14 Kec)
  const seedVal = getSeedForString(kabupatenName);
  const count = 6 + (seedVal % 9);
  const list: string[] = [];

  const isPapua = provinsiId.startsWith("9");
  const pref = isPapua ? "Distrik" : "Kecamatan";

  const bases = [
    "Sukajadi", "Sukamaju", "Sukamakmur", "Mekarsari", "Harapan", "Girimulya", "Bukitindah", "Sungairaya",
    "Tanjungsari", "Bumiasih", "Sumberjaya", "Karangagung", "Saribumi", "Puncakjaya", "Wonorejo", "Wonoasri",
    "Cempakawangi", "Mentari", "Kembang", "Bata", "Aman", "Rukun", "Makmur", "Sentosa"
  ];

  for (let i = 0; i < count; i++) {
    const idx = (seedVal + i * 7) % bases.length;
    const dirIdx = (seedVal + i * 13) % 6;
    const directions = ["", " Barat", " Timur", " Utara", " Selatan", " Tengah"];
    const kecName = `${pref} ${bases[idx]}${directions[dirIdx]}`;
    if (!list.includes(kecName)) {
      list.push(kecName);
    } else {
      list.push(`${kecName} ${i + 1}`);
    }
  }

  return list;
}

export function getDesaList(provinsiId: string, kabupatenName: string, kecamatanName: string): string[] {
  if (provinsiId === "ALL" || !kabupatenName || !kecamatanName) return [];

  // Determine realistic village counts (between 8 and 16 Desa)
  const seedVal = getSeedForString(kecamatanName) + getSeedForString(kabupatenName);
  const count = 8 + (seedVal % 9);
  const list: string[] = [];

  const bases = [
    "Bojong", "Sukahurip", "Karangharjo", "Sukarukun", "Sumbersekar", "Banjarasri", "Grogol", "Sidomulyo",
    "Kertosari", "Purwodadi", "Margomulyo", "Cempaka", "Sendangagung", "Sukaraja", "Tanjung", "Mentari",
    "Mekarmulya", "Dharma", "Luhur", "Putera"
  ];

  for (let i = 0; i < count; i++) {
    const idx = (seedVal + i * 11) % bases.length;
    const sufIdx = (seedVal + i * 19) % 5;
    const suffixes = ["", " Satu", " Dua", " Asri", " Kidul"];
    const isKel = (seedVal + i) % 5 === 0;
    const prefix = isKel ? "Kelurahan" : "Desa";
    const desaName = `${prefix} ${bases[idx]}${suffixes[sufIdx]}`;
    if (!list.includes(desaName)) {
      list.push(desaName);
    } else {
      list.push(`${desaName} ${i + 1}`);
    }
  }

  return list;
}

// Map filter variables down into dynamic, realistic calculations
export function getFilteredData(filters: DashboardFilters): ProvinceData {
  let baseData: ProvinceData;
  if (filters.provinsi === "ALL") {
    const sum2022 = parseFloat(provinceDataList.reduce((sum, p) => sum + (p.bagiHasilPADes["2022"] || 0), 0).toFixed(1));
    const sum2023 = parseFloat(provinceDataList.reduce((sum, p) => sum + (p.bagiHasilPADes["2023"] || 0), 0).toFixed(1));
    const sum2024 = parseFloat(provinceDataList.reduce((sum, p) => sum + (p.bagiHasilPADes["2024"] || 0), 0).toFixed(1));
    const sum2025 = parseFloat(provinceDataList.reduce((sum, p) => sum + (p.bagiHasilPADes["2025"] || 0), 0).toFixed(1));

    const totalNIBCount = provinceDataList.reduce((sum, p) => sum + p.nib.count, 0);
    const totalBumDesa = provinceDataList.reduce((sum, p) => sum + p.bumDesaCount, 0);
    const nibPercentage = parseFloat(((totalNIBCount / totalBumDesa) * 100).toFixed(2));

    baseData = {
      ...nationalSummary,
      bumDesaCount: totalBumDesa,
      bagiHasilPADes: {
        "2022": sum2022,
        "2023": sum2023,
        "2024": sum2024,
        "2025": sum2025,
        "2026": sum2025
      },
      nib: {
        count: totalNIBCount,
        percentage: nibPercentage
      }
    };
  } else {
    const found = provinceDataList.find(p => p.id === filters.provinsi);
    baseData = found ? { ...found } : { ...nationalSummary };
  }

  // Apply Kabupaten Filter
  if (filters.kabupaten && filters.kabupaten !== "ALL") {
    const kabName = filters.kabupaten;
    const kabSeed = getSeedForString(kabName);

    // Calculate dynamic child count
    const kecList = getKecamatanList(filters.provinsi, kabName);
    const totalDesaInKab = kecList.length * 11;

    // Mutate state metrics
    const updatedIndeksDesa: { [year: string]: number } = {};
    const offset = parseFloat((((kabSeed % 20) - 10) / 200).toFixed(3)); // -0.05 ... +0.05
    Object.keys(baseData.indeksDesa).forEach(yr => {
      updatedIndeksDesa[yr] = parseFloat(Math.min(0.98, Math.max(0.40, baseData.indeksDesa[yr] + offset)).toFixed(3));
    });

    const bumDesaCount = Math.round(totalDesaInKab * (0.65 + (kabSeed % 20) / 100));

    const updatedBumDesaStatus: { [yr: string]: { aktif: number, tidakAktif: number, dalamPengembangan: number } } = {};
    Object.keys(baseData.bumDesaStatus).forEach(yr => {
      const activeRatio = 0.68 + (kabSeed % 12) / 100;
      const inactiveRatio = 0.18 - (kabSeed % 8) / 100;
      const devRatio = 1.0 - activeRatio - inactiveRatio;
      const yrTotal = Math.round(bumDesaCount * (yr === filters.tahun ? 1.0 : 0.9));
      updatedBumDesaStatus[yr] = {
        aktif: Math.round(yrTotal * activeRatio),
        tidakAktif: Math.round(yrTotal * inactiveRatio),
        dalamPengembangan: Math.round(yrTotal * devRatio)
      };
    });

    const updatedBagiHasilPADes: { [yr: string]: number } = {};
    Object.keys(baseData.bagiHasilPADes).forEach(yr => {
      updatedBagiHasilPADes[yr] = parseFloat((baseData.bagiHasilPADes[yr] / (baseData.kabupatenCount || 1) * (0.8 + (kabSeed % 5) / 10)).toFixed(1));
    });

    baseData = {
      ...baseData,
      name: kabName,
      kabupatenCount: 1,
      kecamatanCount: kecList.length,
      desaCount: totalDesaInKab,
      bumDesaCount,
      indeksDesa: updatedIndeksDesa,
      bumDesaStatus: updatedBumDesaStatus,
      bagiHasilPADes: updatedBagiHasilPADes,
      nib: {
        count: Math.round(bumDesaCount * 0.74),
        percentage: 74.0
      },
      programInovasi: {
        desaEkspor: Math.round(bumDesaCount * 0.04),
        desaBrilian: Math.round(bumDesaCount * 0.08),
        mbg2025: Math.round(totalDesaInKab * 0.12),
        mbg2026: Math.round(totalDesaInKab * 0.18)
      },
      makanBergiziGratis: {
        bumDesaCount: Math.round(totalDesaInKab * 0.18),
        pendapatan2025: Math.round(totalDesaInKab * 0.12) * 5.2,
        pendapatan2026: Math.round(totalDesaInKab * 0.18) * 8.4
      }
    };
  }

  // Apply Kecamatan Filter
  if (filters.kecamatan && filters.kecamatan !== "ALL") {
    const kecName = filters.kecamatan;
    const kecSeed = getSeedForString(kecName);

    const desaList = getDesaList(filters.provinsi, filters.kabupaten, kecName);
    const totalDesaInKec = desaList.length;

    const updatedIndeksDesa: { [year: string]: number } = {};
    const offset = parseFloat((((kecSeed % 20) - 10) / 200).toFixed(3));
    Object.keys(baseData.indeksDesa).forEach(yr => {
      updatedIndeksDesa[yr] = parseFloat(Math.min(0.98, Math.max(0.40, baseData.indeksDesa[yr] + offset)).toFixed(3));
    });

    const bumDesaCount = Math.round(totalDesaInKec * (0.75 + (kecSeed % 15) / 100));

    const updatedBumDesaStatus: { [yr: string]: { aktif: number, tidakAktif: number, dalamPengembangan: number } } = {};
    Object.keys(baseData.bumDesaStatus).forEach(yr => {
      const activeRatio = 0.74;
      const inactiveRatio = 0.16;
      const devRatio = 0.10;
      const yrTotal = Math.round(bumDesaCount * (yr === filters.tahun ? 1.0 : 0.9));
      updatedBumDesaStatus[yr] = {
        aktif: Math.round(yrTotal * activeRatio),
        tidakAktif: Math.round(yrTotal * inactiveRatio),
        dalamPengembangan: Math.round(yrTotal * devRatio)
      };
    });

    const updatedBagiHasilPADes: { [yr: string]: number } = {};
    Object.keys(baseData.bagiHasilPADes).forEach(yr => {
      updatedBagiHasilPADes[yr] = parseFloat((baseData.bagiHasilPADes[yr] / (baseData.kecamatanCount || 1) * (0.9 + (kecSeed % 3) / 10)).toFixed(2));
    });

    baseData = {
      ...baseData,
      name: kecName,
      kabupatenCount: 0,
      kecamatanCount: 1,
      desaCount: totalDesaInKec,
      bumDesaCount,
      indeksDesa: updatedIndeksDesa,
      bumDesaStatus: updatedBumDesaStatus,
      bagiHasilPADes: updatedBagiHasilPADes,
      nib: {
        count: Math.round(bumDesaCount * 0.8),
        percentage: 80.0
      },
      programInovasi: {
        desaEkspor: Math.round(bumDesaCount * 0.05),
        desaBrilian: Math.round(bumDesaCount * 0.1),
        mbg2025: Math.round(totalDesaInKec * 0.15),
        mbg2026: Math.round(totalDesaInKec * 0.22)
      },
      makanBergiziGratis: {
        bumDesaCount: Math.round(totalDesaInKec * 0.22),
        pendapatan2025: Math.round(totalDesaInKec * 0.15) * 2.1,
        pendapatan2026: Math.round(totalDesaInKec * 0.22) * 3.8
      }
    };
  }

  // Apply Desa Filter
  if (filters.desa && filters.desa !== "ALL") {
    const desaName = filters.desa;
    const desaSeed = getSeedForString(desaName);

    const updatedIndeksDesa: { [year: string]: number } = {};
    const offset = parseFloat((((desaSeed % 20) - 10) / 200).toFixed(3));
    Object.keys(baseData.indeksDesa).forEach(yr => {
      updatedIndeksDesa[yr] = parseFloat(Math.min(0.98, Math.max(0.40, baseData.indeksDesa[yr] + offset)).toFixed(3));
    });

    const hasBumdes = (desaSeed % 10) < 8; // 80% have a registered BUM Desa
    const bumDesaCount = hasBumdes ? 1 : 0;

    const updatedBumDesaStatus: { [yr: string]: { aktif: number, tidakAktif: number, dalamPengembangan: number } } = {};
    Object.keys(baseData.bumDesaStatus).forEach(yr => {
      const stateId = (desaSeed + yr.length) % 3;
      updatedBumDesaStatus[yr] = {
        aktif: hasBumdes && stateId === 0 ? 1 : 0,
        tidakAktif: hasBumdes && stateId === 1 ? 1 : 0,
        dalamPengembangan: hasBumdes && stateId === 2 ? 1 : 0
      };
    });

    const updatedBagiHasilPADes: { [yr: string]: number } = {};
    Object.keys(baseData.bagiHasilPADes).forEach(yr => {
      // 0.01 to 0.08 Miliar (10 to 80 Million Rupiah) if active BUM Desa exists
      updatedBagiHasilPADes[yr] = hasBumdes ? parseFloat((0.012 + (desaSeed % 15) / 250).toFixed(3)) : 0;
    });

    baseData = {
      ...baseData,
      name: desaName,
      kabupatenCount: 0,
      kecamatanCount: 0,
      desaCount: 1,
      bumDesaCount,
      indeksDesa: updatedIndeksDesa,
      bumDesaStatus: updatedBumDesaStatus,
      bagiHasilPADes: updatedBagiHasilPADes,
      nib: {
        count: bumDesaCount,
        percentage: bumDesaCount ? 100.0 : 0.0
      },
      programInovasi: {
        desaEkspor: hasBumdes && (desaSeed % 9) === 0 ? 1 : 0,
        desaBrilian: hasBumdes && (desaSeed % 6) === 0 ? 1 : 0,
        mbg2025: (desaSeed % 4) < 3 ? 1 : 0, // Makan Bergizi Gratis 2025
        mbg2026: 1
      },
      makanBergiziGratis: {
        bumDesaCount: 1,
        pendapatan2025: ((desaSeed % 4) < 3 ? 1 : 0) * 0.45,
        pendapatan2026: 0.65
      }
    };
  }

  return baseData;
}
