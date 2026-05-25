import { useState, useEffect } from "react";
import { DashboardFilters } from "../types";
import { fetchAndParseGoogleSheet, getFilteredSheetsData, AggregatedDashboardData } from "../data/sheetsDataEngine";
import { getFilteredData } from "../data/mockData";

export interface UseSheetSyncReturn {
  useGoogleSheets: boolean;
  setUseGoogleSheets: (val: boolean) => void;
  spreadsheetUrl: string;
  setSpreadsheetUrl: (url: string) => void;
  sheetsData: AggregatedDashboardData | null;
  isSheetsLoading: boolean;
  sheetsError: string | null;
  lastRefreshed: Date;
  triggerSync: (url?: string) => Promise<void>;
  activeData: any; // Can be detailed type if needed
}

export function useSheetSync(filters: DashboardFilters): UseSheetSyncReturn {
  const [useGoogleSheets, setUseGoogleSheets] = useState(false);
  const [spreadsheetUrl, setSpreadsheetUrl] = useState(
    "https://docs.google.com/spreadsheets/d/16uQIT5riOor66rsf01sosstgCjTtOg28-zRAf7TVeQo/edit?usp=sharing"
  );
  const [sheetsData, setSheetsData] = useState<AggregatedDashboardData | null>(null);
  const [isSheetsLoading, setIsSheetsLoading] = useState(false);
  const [sheetsError, setSheetsError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const triggerSync = async (urlToSync = spreadsheetUrl) => {
    setIsSheetsLoading(true);
    setSheetsError(null);
    try {
      const parsed = await fetchAndParseGoogleSheet(urlToSync);
      setSheetsData(parsed);
      setUseGoogleSheets(true); // Automatically switch on success
      setLastRefreshed(new Date());
    } catch (e: any) {
      console.error(e);
      setSheetsError(e.message || "Gagal menyinkronkan data Google Spreadsheet.");
    } finally {
      setIsSheetsLoading(false);
    }
  };

  useEffect(() => {
    triggerSync();
  }, []);

  // Determine active data structure
  let activeData = getFilteredData(filters);
  if (useGoogleSheets && sheetsData) {
    if (filters.provinsi === "ALL") {
      activeData = sheetsData.national;
    } else {
      const foundProv = sheetsData.provinces.find((p) => p.id === filters.provinsi);
      if (foundProv) {
        activeData = getFilteredSheetsData(foundProv, filters, sheetsData.rawRows);
      }
    }
  }

  return {
    useGoogleSheets,
    setUseGoogleSheets,
    spreadsheetUrl,
    setSpreadsheetUrl,
    sheetsData,
    isSheetsLoading,
    sheetsError,
    lastRefreshed,
    triggerSync,
    activeData,
  };
}
