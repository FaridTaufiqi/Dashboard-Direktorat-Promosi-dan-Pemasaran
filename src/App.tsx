import React, { useState, useMemo } from "react";
import {
  Menu,
  Download,
  Calendar,
  Layers,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { Analytics } from "@vercel/analytics/react";
import Sidebar from "./components/Sidebar";
import KPICards from "./components/KPICards";
import SheetsSyncPanel from "./components/SheetsSyncPanel";

// Custom Hooks
import { useFilters } from "./hooks/useFilters";
import { useSheetSync } from "./hooks/useSheetSync";

// Tabs
import TabRingkasan from "./components/tabs/TabRingkasan";
import TabIndeksDesa from "./components/tabs/TabIndeksDesa";
import TabBumDesa from "./components/tabs/TabBumDesa";
import TabPemeringkatan from "./components/tabs/TabPemeringkatan";
import TabPADes from "./components/tabs/TabPADes";
import TabNIB from "./components/tabs/TabNIB";
import TabBumDesaBersama from "./components/tabs/TabBumDesaBersama";
import TabDesaEkspor from "./components/tabs/TabDesaEkspor";
import TabMakanBergiziGratis from "./components/tabs/TabMakanBergiziGratis";
import TabKeterangan from "./components/tabs/TabKeterangan";

import { provinceDataList } from "./data/mockData";

export default function App() {
  const [activeTab, setActiveTab] = useState("ringkasan");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const {
    filters,
    setFilters,
    getDynamicKabupatenList,
    getDynamicKecamatanList,
    getDynamicDesaList,
  } = useFilters();

  const {
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
  } = useSheetSync(filters);

  const isAllProvinces = filters.provinsi === "ALL";
  const years = ["2022", "2023", "2024", "2025", "2026"];

  const handleSelectProvince = React.useCallback((provId: string) => {
    setFilters(prev => ({
      ...prev,
      provinsi: provId,
      kabupaten: "ALL",
      kecamatan: "ALL",
      desa: "ALL",
    }));
  }, [setFilters]);

  const handleDownloadReport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      `PORTAL DATA REPUBLIK INDONESIA - HASIL DANA DESA & BUM DESA\n` +
      `Wilayah Pelaporan;${activeData.name}\n` +
      `Tahun Evaluasi;${filters.tahun}\n` +
      `===================================================\n` +
      `A. STATISTIK ADMINISTRATIF\n` +
      `Jumlah Kabupaten;${activeData.kabupatenCount}\n` +
      `Jumlah Kecamatan;${activeData.kecamatanCount}\n` +
      `Jumlah Desa/Kelurahan;${activeData.desaCount}\n` +
      `Rata-rata Indeks Desa (ID);${activeData.indeksDesa[filters.tahun] || 0.7060907572}\n` +
      `===================================================\n` +
      `B. PARAMETER BUM DESA\n` +
      `Total Populasi BUM Desa;${activeData.bumDesaCount}\n` +
      `BUM Desa Aktif;${activeData.bumDesaStatus[filters.tahun]?.aktif || 0}\n` +
      `BUM Desa Tidak Aktif;${activeData.bumDesaStatus[filters.tahun]?.tidakAktif || 0}\n` +
      `BUM Desa Dalam Rintisan;${activeData.bumDesaStatus[filters.tahun]?.dalamPengembangan || 0}\n` +
      `Kepemilikan legal NIB (Unit);${activeData.nib.count}\n` +
      `Kepemilikan legal NIB (%);${activeData.nib.percentage}%\n` +
      `===================================================\n` +
      `C. KONTRIBUSI BAGI HASIL PADES (MILIAR IDR)\n` +
      `Tahun 2022;${activeData.bagiHasilPADes["2022"] || 0}\n` +
      `Tahun 2023;${activeData.bagiHasilPADes["2023"] || 0}\n` +
      `Tahun 2024;${activeData.bagiHasilPADes["2024"] || 0}\n` +
      `Tahun 2025;${activeData.bagiHasilPADes["2025"] || 0}\n` +
      `===================================================\n` +
      `Laporan ini diunduh secara resmi lewat Portal Interaktif pada tanggal ${new Date().toLocaleDateString("id-ID")}.\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Laporan_Desa_${activeData.name.replace(/\s+/g, "_")}_${filters.tahun}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const kabList = useMemo(() => getDynamicKabupatenList(useGoogleSheets, sheetsData), [getDynamicKabupatenList, useGoogleSheets, sheetsData]);
  const kecList = useMemo(() => getDynamicKecamatanList(useGoogleSheets, sheetsData), [getDynamicKecamatanList, useGoogleSheets, sheetsData]);
  const desaList = useMemo(() => getDynamicDesaList(useGoogleSheets, sheetsData), [getDynamicDesaList, useGoogleSheets, sheetsData]);

  const renderedTabSumberData = useMemo(() => (
    <SheetsSyncPanel
      useGoogleSheets={useGoogleSheets}
      setUseGoogleSheets={setUseGoogleSheets}
      spreadsheetUrl={spreadsheetUrl}
      setSpreadsheetUrl={setSpreadsheetUrl}
      isSheetsLoading={isSheetsLoading}
      sheetsError={sheetsError}
      sheetsData={sheetsData}
      onTriggerSync={() => triggerSync()}
    />
  ), [useGoogleSheets, spreadsheetUrl, isSheetsLoading, sheetsError, sheetsData, setUseGoogleSheets, setSpreadsheetUrl, triggerSync]);

  const renderedTabRingkasan = useMemo(() => (
    <TabRingkasan
      filters={filters}
      activeData={activeData}
      handleSelectProvince={handleSelectProvince}
      provinceList={sheetsData?.provinces || provinceDataList}
    />
  ), [filters, activeData, handleSelectProvince, sheetsData]);

  const renderedTabIndeksDesa = useMemo(() => (
    <TabIndeksDesa
      filters={filters}
      activeData={activeData}
      handleSelectProvince={handleSelectProvince}
      provinceList={sheetsData?.provinces || provinceDataList}
    />
  ), [filters, activeData, handleSelectProvince, sheetsData]);

  const renderedTabBumDesa = useMemo(() => (
    <TabBumDesa
      filters={filters}
      activeData={activeData}
      handleSelectProvince={handleSelectProvince}
      provinceList={sheetsData?.provinces || provinceDataList}
    />
  ), [filters, activeData, handleSelectProvince, sheetsData]);

  const renderedTabPemeringkatan = useMemo(() => (
    <TabPemeringkatan
      filters={filters}
      activeData={activeData}
      handleSelectProvince={handleSelectProvince}
      provinceList={sheetsData?.provinces || provinceDataList}
    />
  ), [filters, activeData, handleSelectProvince, sheetsData]);

  const renderedTabPADes = useMemo(() => (
    <TabPADes
      filters={filters}
      activeData={activeData}
      handleSelectProvince={handleSelectProvince}
      provinceList={sheetsData?.provinces || provinceDataList}
    />
  ), [filters, activeData, handleSelectProvince, sheetsData]);

  const renderedTabNIB = useMemo(() => (
    <TabNIB filters={filters} activeData={activeData} />
  ), [filters, activeData]);

  const renderedTabDesaEkspor = useMemo(() => (
    <TabDesaEkspor data={activeData} />
  ), [activeData]);

  const renderedTabMbg = useMemo(() => (
    <TabMakanBergiziGratis data={activeData} tahun={filters.tahun} />
  ), [activeData, filters.tahun]);

  const renderedTabBumDesaBersama = useMemo(() => (
    <TabBumDesaBersama
      filters={filters}
      activeData={activeData}
      handleSelectProvince={handleSelectProvince}
      provinceList={sheetsData?.provinces || provinceDataList}
    />
  ), [filters, activeData, handleSelectProvince, sheetsData]);

  const renderedTabKeterangan = useMemo(() => (
    <TabKeterangan />
  ), []);

  return (
    <>
      <Analytics />
      <div className="min-h-screen flex text-slate-800 bg-white antialiased">
      {/* Sidebar navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50/50">
        {/* TOP COMPACT HEADER BLOCK AND FILTER CONTROLS */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 px-4 py-4 md:px-6 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 shadow-xs transition-all">
          {/* Title and Meta */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 items-center justify-center shadow-lg shadow-blue-500/20 text-white">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-2">
                  PORTAL DATA DESA
                </h1>
                <p className="text-[10px] md:text-[11px] font-bold text-blue-600 tracking-widest mt-0.5 uppercase bg-blue-50 w-max px-2 py-0.5 rounded-full border border-blue-100">
                  Dashboard Analytics & Executive Summary
                </p>
              </div>
            </div>
          </div>

          {/* Filters & Actions Panel */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Year Selector */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 shadow-xs rounded-lg px-3 py-1.5 text-xs text-slate-600 font-bold hover:border-slate-300 transition-colors group">
              <Calendar className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-colors" />
              <select
                value={filters.tahun}
                onChange={(e) => setFilters({ ...filters, tahun: e.target.value })}
                className="bg-transparent font-extrabold focus:outline-hidden text-slate-700 cursor-pointer pl-1"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Province Selector */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 shadow-xs rounded-lg px-3 py-1.5 text-xs text-slate-600 font-bold hover:border-slate-300 transition-colors group">
              <Layers className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-colors" />
              <select
                value={filters.provinsi}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    provinsi: e.target.value,
                    kabupaten: "ALL",
                    kecamatan: "ALL",
                    desa: "ALL",
                  })
                }
                className="bg-transparent font-extrabold focus:outline-hidden text-slate-700 cursor-pointer max-w-[150px] md:max-w-xs pl-1"
              >
                <option value="ALL">Semua Provinsi (Nasional)</option>
                {(sheetsData?.provinces || provinceDataList).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Kabupaten/Kota Selector */}
            <div
              className={`flex items-center gap-1.5 bg-white border border-slate-200 shadow-xs rounded-lg px-3 py-1.5 text-xs text-slate-600 font-bold transition-all group ${
                filters.provinsi === "ALL" ? "opacity-50 pointer-events-none" : "hover:border-slate-300"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-500 transition-colors" />
              <select
                value={filters.kabupaten}
                disabled={filters.provinsi === "ALL"}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    kabupaten: e.target.value,
                    kecamatan: "ALL",
                    desa: "ALL",
                  })
                }
                className="bg-transparent font-extrabold focus:outline-hidden text-slate-700 cursor-pointer max-w-[150px] md:max-w-xs pl-1 enabled:hover:text-blue-600"
              >
                <option value="ALL">Semua Kabupaten/Kota</option>
                {kabList.map((kab) => (
                  <option key={kab} value={kab}>
                    {kab}
                  </option>
                ))}
              </select>
            </div>

            {/* Kecamatan Selector */}
            <div
              className={`flex items-center gap-1.5 bg-white border border-slate-200 shadow-xs rounded-lg px-3 py-1.5 text-xs text-slate-600 font-bold transition-all group ${
                filters.provinsi === "ALL" || filters.kabupaten === "ALL" ? "opacity-50 pointer-events-none" : "hover:border-slate-300"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
              <select
                value={filters.kecamatan}
                disabled={filters.provinsi === "ALL" || filters.kabupaten === "ALL"}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    kecamatan: e.target.value,
                    desa: "ALL",
                  })
                }
                className="bg-transparent font-extrabold focus:outline-hidden text-slate-700 cursor-pointer max-w-[150px] md:max-w-xs pl-1 enabled:hover:text-blue-600"
              >
                <option value="ALL">Semua Kecamatan</option>
                {kecList.map((kec) => (
                  <option key={kec} value={kec}>
                    {kec}
                  </option>
                ))}
              </select>
            </div>

            {/* Desa Selector */}
            <div
              className={`flex items-center gap-1.5 bg-white border border-slate-200 shadow-xs rounded-lg px-3 py-1.5 text-xs text-slate-600 font-bold transition-all group ${
                filters.provinsi === "ALL" || filters.kabupaten === "ALL" || filters.kecamatan === "ALL"
                  ? "opacity-50 pointer-events-none"
                  : "hover:border-slate-300"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-500 transition-colors" />
              <select
                value={filters.desa}
                disabled={
                  filters.provinsi === "ALL" ||
                  filters.kabupaten === "ALL" ||
                  filters.kecamatan === "ALL"
                }
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    desa: e.target.value,
                  })
                }
                className="bg-transparent font-extrabold focus:outline-hidden text-slate-700 cursor-pointer max-w-[150px] md:max-w-xs pl-1 enabled:hover:text-blue-600"
              >
                <option value="ALL">Semua Desa/Kelurahan</option>
                {desaList.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Update Timestamps & Actions */}
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
              <button
                id="btn-refresh-data"
                onClick={() => triggerSync()}
                disabled={isSheetsLoading}
                className="flex items-center justify-center p-2.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 disabled:opacity-50 rounded-lg transition-all cursor-pointer shadow-xs hover:shadow-sm"
                title="Refresh data aktual dari Google Sheets"
              >
                <RefreshCw
                  className={`w-4 h-4 text-blue-600 ${isSheetsLoading ? "animate-spin" : ""}`}
                />
              </button>

              <div className="hidden sm:block text-right pr-2">
                <span className="text-[9px] text-slate-400 font-black block uppercase tracking-widest leading-none mb-0.5">
                  UPDATE TERAKHIR
                </span>
                <span className="text-xs text-slate-700 font-black tracking-tight">
                  {lastRefreshed.toLocaleTimeString("id-ID")} WIB
                </span>
              </div>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownloadReport}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-[0_2px_10px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_15px_rgba(37,99,235,0.2)] cursor-pointer hover:-translate-y-0.5 ${
                downloadSuccess
                  ? "bg-emerald-600 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              <Download className="w-4 h-4 text-blue-100" />
              <span>{downloadSuccess ? "Tersimpan!" : "Unduh Laporan Executive"}</span>
            </button>
          </div>
        </header>

        {/* PAGE DYNAMIC TAB VIEWS CONTAINER */}
        <div className="flex-1 p-4 md:p-6 space-y-6">
          {/* Active Filter Location Indicator */}
          {(filters.provinsi !== "ALL" ||
            filters.kabupaten !== "ALL" ||
            filters.kecamatan !== "ALL" ||
            filters.desa !== "ALL") && (
            <div className="bg-white border border-slate-200/60 rounded-xl px-5 py-3 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-800 font-semibold shadow-[0_4px_20px_rgb(0,0,0,0.03)] bg-linear-to-r from-blue-50/30 to-indigo-50/10">
              <div className="flex items-center gap-2.5 flex-wrap">
                <Sparkles className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="text-slate-400 font-black uppercase tracking-widest text-[10px]">
                  FOKUS WILAYAH:
                </span>
                <span className="font-extrabold uppercase text-slate-600 bg-slate-100/50 border border-slate-200 px-2.5 py-1 rounded-md shadow-xs">Nasional</span>
                {filters.provinsi !== "ALL" && (
                  <>
                    <span className="text-slate-300 font-light select-none">/</span>
                    <span className="font-extrabold uppercase text-blue-800 bg-blue-50 border border-blue-100/60 shadow-xs px-2.5 py-1 rounded-md">
                      {(sheetsData?.provinces || provinceDataList).find((p) => p.id === filters.provinsi)?.name}
                    </span>
                  </>
                )}
                {filters.kabupaten !== "ALL" && (
                  <>
                    <span className="text-slate-300 font-light select-none">/</span>
                    <span className="font-extrabold uppercase text-indigo-800 bg-indigo-50 border border-indigo-100/60 shadow-xs px-2.5 py-1 rounded-md">
                      {filters.kabupaten}
                    </span>
                  </>
                )}
                {filters.kecamatan !== "ALL" && (
                  <>
                    <span className="text-slate-300 font-light select-none">/</span>
                    <span className="font-extrabold uppercase text-amber-800 bg-amber-50 border border-amber-100/60 shadow-xs px-2.5 py-1 rounded-md">
                      {filters.kecamatan}
                    </span>
                  </>
                )}
                {filters.desa !== "ALL" && (
                  <>
                    <span className="text-slate-300 font-light select-none">/</span>
                    <span className="font-extrabold uppercase text-emerald-800 bg-emerald-50 border border-emerald-100/60 shadow-xs px-2.5 py-1 rounded-md">
                      {filters.desa}
                    </span>
                  </>
                )}
              </div>
              <button
                onClick={() =>
                  setFilters({
                    ...filters,
                    provinsi: "ALL",
                    kabupaten: "ALL",
                    kecamatan: "ALL",
                    desa: "ALL",
                  })
                }
                className="text-[10px] bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-600 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer shadow-xs uppercase tracking-widest hover:text-slate-900"
              >
                Reset Wilayah
              </button>
            </div>
          )}

          {/* KPI Highlight Rows - Always shown on top for consistent high level summaries */}
          <KPICards data={activeData} tahun={filters.tahun} isAllProvinces={isAllProvinces} />

          {/* MAIN TAB CONTENT CONTROLLING */}
          {activeTab === "sumber-data" && renderedTabSumberData}
          {activeTab === "ringkasan" && renderedTabRingkasan}
          {activeTab === "indeks-desa" && renderedTabIndeksDesa}
          {activeTab === "bum-desa" && renderedTabBumDesa}
          {activeTab === "pemeringkatan" && renderedTabPemeringkatan}
          {activeTab === "pades" && renderedTabPADes}
          {activeTab === "nib" && renderedTabNIB}
          {activeTab === "desa-ekspor" && renderedTabDesaEkspor}
          {activeTab === "makan-bergizi-gratis" && renderedTabMbg}
          {activeTab === "bumdes-bersama" && renderedTabBumDesaBersama}
          {activeTab === "keterangan" && renderedTabKeterangan}
        </div>

        {/* Humid Footer Credits */}
        <footer className="mt-auto bg-white border-t border-slate-200 py-4 px-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 font-bold select-none">
          <span>
            &copy; {new Date().getFullYear()} Kementerian Desa, Pembangunan Daerah Tertinggal, dan
            Transmigrasi RI.
          </span>
          <span className="mt-1.5 sm:mt-0">
            Sistem Portal Interaktif Satu Data Desa &bull; Republik Indonesia
          </span>
        </footer>
      </main>
    </div>
    </>
  );
}
