import React, { useState, Dispatch, SetStateAction, useMemo } from "react";
import { DashboardFilters } from "../types";
import { getKabupatenList, getKecamatanList, getDesaList } from "../data/mockData";
import { AggregatedDashboardData, pIdMapping } from "../data/sheetsDataEngine";

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

  const getDynamicKabupatenList = React.useCallback((useGoogleSheets: boolean, sheetsData: AggregatedDashboardData | null) => {
    if (useGoogleSheets && sheetsData && filters.provinsi !== "ALL") {
      const provNameRequired = pIdMapping[filters.provinsi];
      if (provNameRequired) {
        const kabs = sheetsData.rawRows
          .filter(r => r.provinsi === provNameRequired && r.kabupaten)
          .map(r => r.kabupaten);
        return Array.from(new Set(kabs)).sort();
      }
    }
    return getKabupatenList(filters.provinsi);
  }, [filters.provinsi]);

  const getDynamicKecamatanList = React.useCallback((useGoogleSheets: boolean, sheetsData: AggregatedDashboardData | null) => {
    if (useGoogleSheets && sheetsData && filters.provinsi !== "ALL" && filters.kabupaten !== "ALL") {
      const kecs = sheetsData.rawRows
        .filter(r => r.kabupaten === filters.kabupaten && r.kecamatan)
        .map(r => r.kecamatan);
      return Array.from(new Set(kecs)).sort();
    }
    return getKecamatanList(filters.provinsi, filters.kabupaten);
  }, [filters.provinsi, filters.kabupaten]);

  const getDynamicDesaList = React.useCallback((useGoogleSheets: boolean, sheetsData: AggregatedDashboardData | null) => {
    if (useGoogleSheets && sheetsData && filters.provinsi !== "ALL" && filters.kabupaten !== "ALL" && filters.kecamatan !== "ALL") {
      const desas = sheetsData.rawRows
        .filter(r => r.kecamatan === filters.kecamatan && r.desa)
        .map(r => r.desa);
      return Array.from(new Set(desas)).sort();
    }
    return getDesaList(filters.provinsi, filters.kabupaten, filters.kecamatan);
  }, [filters.provinsi, filters.kabupaten, filters.kecamatan]);

  return {
    filters,
    setFilters,
    getDynamicKabupatenList,
    getDynamicKecamatanList,
    getDynamicDesaList,
  };
}
