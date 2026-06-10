export interface ProvinceData {
  id: string; // ID of the province
  name: string; // Indonesian name
  kabupatenCount: number;
  kecamatanCount: number;
  desaCount: number;
  
  // Indeks Desa (ID) per Year
  indeksDesa: {
    [year: string]: number; // ID overall (e.g., 0.678)
  };
  
  // Indeks Desa Dimensions for specific year (and trends)
  idDimensions: {
    [year: string]: {
      layananDasar: number;
      sosial: number;
      ekonomi: number;
      lingkungan: number;
      aksesibilitas: number;
      tataKelola: number;
    };
  };
  
  // BUM Desa stats
  bumDesaCount: number;
  bumDesaBersamaCount?: number;
  bumDesaTerverifikasiHukum?: number;
  desaMandiriCount?: number;
  bumDesaStatus: {
    [year: string]: {
      aktif: number;
      tidakAktif: number;
      dalamPengembangan: number;
      perintis?: number;
      pemula?: number;
      berkembang?: number;
      maju?: number;
    };
  };

  badanHukumStatus?: {
    bumDesa: {
      pengajuanNama: number;
      perbaikanNama: number;
      namaTerverifikasi: number;
      prosesPendaftaran: number;
      perbaikanDokumen: number;
      terverifikasiDokumen: number;
      kosong: number;
      total: number;
    };
    bumDesaBersama: {
      pengajuanNama: number;
      perbaikanNama: number;
      namaTerverifikasi: number;
      prosesPendaftaran: number;
      perbaikanDokumen: number;
      terverifikasiDokumen: number;
      kosong: number;
      total: number;
    };
  };
  
  // BUM Desa Dimensions for specific year
  bumDesaPemeringkatan: {
    [year: string]: {
      kelembagaan: number;
      manajemen: number;
      usaha: number;
      kemitraan: number;
      asetModal: number;
      administrasi: number;
      manfaat: number;
      nilaiPemeringkatan?: number;
    };
  };
  
  // Bagi Hasil BUM Desa ke PADes (in Miliar Rupiah)
  bagiHasilPADes: {
    [year: string]: number;
  };
  
  // NIB & Program
  nib: {
    count: number;
    percentage: number;
  };
  
  programInovasi: {
    desaEkspor: number;
    desaBrilian: number;
    mbg2025: number;
    mbg2026: number;
  };
  
  // BUM Desa Bersama
  bumDesaBersama: {
    count: number;
    aktif: number;
    tidakAktif: number;
    pemeringkatanNilai: number;
    pemeringkatanKategori: string;
    kelembagaan?: number;
    manajemen?: number;
    usaha?: number;
    kemitraan?: number;
    asetModal?: number;
    administrasi?: number;
    manfaat?: number;
    perintis?: number;
    pemula?: number;
    berkembang?: number;
    maju?: number;
  };

  // Desa Ekspor
  desaEksporData?: {
    klusterisasi: {
      klaster1: number;
      klaster2: number;
      sentraIkm: number;
      kosong: number;
      total: number;
    };
    sektorKomoditas: {
      [sektor: string]: number;
    };
    komoditas: {
      [komoditas: string]: number;
    };
  };
}

export interface DashboardFilters {
  tahun: string;
  provinsi: string;
  kabupaten: string;
  kecamatan: string;
  desa: string;
}
