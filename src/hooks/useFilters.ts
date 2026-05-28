import React, { useState, Dispatch, SetStateAction } from "react";
import { DashboardFilters } from "../types";
import { getKabupatenList, getKecamatanList, getDesaList } from "../data/mockData";
import { AggregatedDashboardData } from "../data/sheetsDataEngine";

export interface UseFiltersReturn {
  filters: DashboardFilters;
  setFilters: Dispatch<SetStateAction<DashboardFilters>>;
  getDynamicKabupatenList: (useGoogleSheets: boolean, sheetsData: AggregatedDashboardData | null) => string[];
  getDynamicKecamatanList: (useGoogleSheets: boolean, sheetsData: AggregatedDashboardData | null) => string[];
  getDynamicDesaList: (useGoogleSheets: boolean, sheetsData: AggregatedDashboardData | null) => string[];
}

export function useFilters(): UseFiltersReturn {
  const [filters, setFilters] = useState<DashboardFilters>({
    tahun: "2026",
    provinsi: "ALL",
    kabupaten: "ALL",
    kecamatan: "ALL",
    desa: "ALL",
  });

  const getDynamicKabupatenList = (useGoogleSheets: boolean, sheetsData: AggregatedDashboardData | null) => {
    if (useGoogleSheets && sheetsData && filters.provinsi !== "ALL") {
      const pIdMapping = {
        "11": "ACEH", "12": "SUMATERA UTARA", "13": "SUMATERA BARAT", "14": "RIAU", "15": "JAMBI",
        "16": "SUMATERA SELATAN", "17": "BENGKULU", "18": "LAMPUNG", "19": "KEPULAUAN BANGKA BELITUNG", "21": "KEPULAUAN RIAU",
        "31": "DKI JAKARTA", "32": "JAWA BARAT", "33": "JAWA TENGAH", "34": "DI YOGYAKARTA", "35": "JAWA TIMUR",
        "36": "BANTEN", "51": "BALI", "52": "NUSA TENGGARA BARAT", "53": "NUSA TENGGARA TIMUR", "61": "KALIMANTAN BARAT",
        "62": "KALIMANTAN TENGAH", "63": "KALIMANTAN SELATAN", "64": "KALIMANTAN TIMUR", "65": "KALIMANTAN UTARA", "71": "SULAWESI UTARA",
        "72": "SULAWESI TENGAH", "73": "SULAWESI SELATAN", "74": "SULAWESI TENGGARA", "75": "GORONTALO", "76": "SULAWESI BARAT",
        "81": "MALUKU", "82": "MALUKU UTARA", "91": "PAPUA BARAT", "92": "PAPUA", "93": "PAPUA SELATAN",
        "94": "PAPUA TENGAH", "95": "PAPUA PEGUNUNGAN", "96": "PAPUA BARAT DAYA"
      };
      const provNameRequired = pIdMapping[filters.provinsi as keyof typeof pIdMapping];
      if (provNameRequired) {
        const kabs = sheetsData.rawRows
          .filter(r => r.provinsi === provNameRequired && r.kabupaten)
          .map(r => r.kabupaten);
        return Array.from(new Set(kabs)).sort();
      }
    }
    return getKabupatenList(filters.provinsi);
  };

  const getDynamicKecamatanList = (useGoogleSheets: boolean, sheetsData: AggregatedDashboardData | null) => {
    if (useGoogleSheets && sheetsData && filters.provinsi !== "ALL" && filters.kabupaten !== "ALL") {
      const kecs = sheetsData.rawRows
        .filter(r => r.kabupaten === filters.kabupaten && r.kecamatan)
        .map(r => r.kecamatan);
      return Array.from(new Set(kecs)).sort();
    }
    return getKecamatanList(filters.provinsi, filters.kabupaten);
  };

  const getDynamicDesaList = (useGoogleSheets: boolean, sheetsData: AggregatedDashboardData | null) => {
    if (useGoogleSheets && sheetsData && filters.provinsi !== "ALL" && filters.kabupaten !== "ALL" && filters.kecamatan !== "ALL") {
      const desas = sheetsData.rawRows
        .filter(r => r.kecamatan === filters.kecamatan && r.desa)
        .map(r => r.desa);
      return Array.from(new Set(desas)).sort();
    }
    return getDesaList(filters.provinsi, filters.kabupaten, filters.kecamatan);
  };

  return {
    filters,
    setFilters,
    getDynamicKabupatenList,
    getDynamicKecamatanList,
    getDynamicDesaList,
  };
}
