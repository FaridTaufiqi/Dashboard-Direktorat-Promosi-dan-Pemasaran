import React, { useState } from "react";
import {
  Menu,
  Download,
  Calendar,
  Layers,
  Sparkles,
  HelpCircle,
  FileCheck2,
  Table,
  CheckCircle2,
  BookmarkCheck,
  Building,
  DollarSign,
  TrendingUp,
  FileText
} from "lucide-react";
import Sidebar from "./components/Sidebar";
import KPICards, { formatIndoDecimal, formatIndoNumber } from "./components/KPICards";
import SVGIndonesiaMap from "./components/SVGIndonesiaMap";
import RingkasanWilayah from "./components/RingkasanWilayah";
import IndeksDesaRadar from "./components/IndeksDesaRadar";
import BUMDesaChart from "./components/BUMDesaChart";
import PemeringkatanBUMDesa from "./components/PemeringkatanBUMDesa";
import BagiHasilPADes from "./components/BagiHasilPADes";
import NIBandProgram from "./components/NIBandProgram";
import {
  getFilteredData,
  provinceDataList,
  nationalSummary,
  getKabupatenList,
  getKecamatanList,
  getDesaList
} from "./data/mockData";
import { DashboardFilters } from "./types";

export default function App() {
  const [filters, setFilters] = useState<DashboardFilters>({
    tahun: "2025",
    provinsi: "ALL",
    kabupaten: "ALL",
    kecamatan: "ALL",
    desa: "ALL",
  });
  const [activeTab, setActiveTab] = useState("ringkasan");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const activeData = getFilteredData(filters);
  const isAllProvinces = filters.provinsi === "ALL";

  // Available Years
  const years = ["2022", "2023", "2024", "2025"];

  const handleSelectProvince = (provId: string) => {
    setFilters({
      ...filters,
      provinsi: provId,
      kabupaten: "ALL",
      kecamatan: "ALL",
      desa: "ALL"
    });
  };

  const handleDownloadReport = () => {
    // Generate actual CSV compiling the core indicators
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
      `Rata-rata Indeks Desa (ID);${activeData.indeksDesa[filters.tahun] || 0.678}\n` +
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

  return (
    <div className="min-h-screen flex text-slate-800 bg-slate-50/50 antialiased">
      {/* Sidebar navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* TOP COMPACT HEADER BLOCK AND FILTER CONTROLS */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 py-4 md:px-6 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          
          {/* Title and Meta */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-[#0c4a9f] tracking-tight uppercase flex items-center gap-2">
                DASHBOARD DATA DESA & BUM DESA
              </h1>
              <p className="text-xs md:text-sm font-bold text-slate-400 tracking-wide mt-0.5">
                INDEKS DESA & PEMERINGKATAN BUM DESA INDONESIA
              </p>
            </div>
          </div>

          {/* Filters & Actions Panel */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Year Selector */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-600 font-bold">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Tahun Data:</span>
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
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-600 font-bold">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span>Pilih Provinsi:</span>
              <select
                value={filters.provinsi}
                onChange={(e) => setFilters({
                  ...filters,
                  provinsi: e.target.value,
                  kabupaten: "ALL",
                  kecamatan: "ALL",
                  desa: "ALL"
                })}
                className="bg-transparent font-extrabold focus:outline-hidden text-slate-700 cursor-pointer max-w-[150px] md:max-w-xs pl-1"
              >
                <option value="ALL">Semua Provinsi (Nasional)</option>
                {provinceDataList.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Kabupaten/Kota Selector */}
            <div className={`flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-600 font-bold transition-opacity ${filters.provinsi === "ALL" ? "opacity-50" : ""}`}>
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span>Kabupaten/Kota:</span>
              <select
                value={filters.kabupaten}
                disabled={filters.provinsi === "ALL"}
                onChange={(e) => setFilters({
                  ...filters,
                  kabupaten: e.target.value,
                  kecamatan: "ALL",
                  desa: "ALL"
                })}
                className="bg-transparent font-extrabold focus:outline-hidden text-slate-700 cursor-pointer max-w-[150px] md:max-w-xs pl-1 enabled:hover:text-blue-600"
              >
                <option value="ALL">Semua Kabupaten/Kota</option>
                {getKabupatenList(filters.provinsi).map((kab) => (
                  <option key={kab} value={kab}>
                    {kab}
                  </option>
                ))}
              </select>
            </div>

            {/* Kecamatan Selector */}
            <div className={`flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-600 font-bold transition-opacity ${(filters.provinsi === "ALL" || filters.kabupaten === "ALL") ? "opacity-50" : ""}`}>
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span>Kecamatan:</span>
              <select
                value={filters.kecamatan}
                disabled={filters.provinsi === "ALL" || filters.kabupaten === "ALL"}
                onChange={(e) => setFilters({
                  ...filters,
                  kecamatan: e.target.value,
                  desa: "ALL"
                })}
                className="bg-transparent font-extrabold focus:outline-hidden text-slate-700 cursor-pointer max-w-[150px] md:max-w-xs pl-1 enabled:hover:text-blue-600"
              >
                <option value="ALL">Semua Kecamatan</option>
                {getKecamatanList(filters.provinsi, filters.kabupaten).map((kec) => (
                  <option key={kec} value={kec}>
                    {kec}
                  </option>
                ))}
              </select>
            </div>

            {/* Desa Selector */}
            <div className={`flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-600 font-bold transition-opacity ${(filters.provinsi === "ALL" || filters.kabupaten === "ALL" || filters.kecamatan === "ALL") ? "opacity-50" : ""}`}>
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span>Desa/Kelurahan:</span>
              <select
                value={filters.desa}
                disabled={filters.provinsi === "ALL" || filters.kabupaten === "ALL" || filters.kecamatan === "ALL"}
                onChange={(e) => setFilters({
                  ...filters,
                  desa: e.target.value
                })}
                className="bg-transparent font-extrabold focus:outline-hidden text-slate-700 cursor-pointer max-w-[150px] md:max-w-xs pl-1 enabled:hover:text-blue-600"
              >
                <option value="ALL">Semua Desa/Kelurahan</option>
                {getDesaList(filters.provinsi, filters.kabupaten, filters.kecamatan).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Update Timestamps */}
            <div className="hidden sm:block text-right pr-1">
              <span className="text-[10px] text-slate-400 font-extrabold block">
                UPDATE TERAKHIR
              </span>
              <span className="text-xs text-slate-600 font-extrabold">
                24 Mei 2025 10:30
              </span>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownloadReport}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
                downloadSuccess
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200"
                  : "bg-[#0c4a9f] hover:bg-blue-800 text-white shadow-blue-200"
              }`}
            >
              <Download className="w-4 h-4" />
              <span>{downloadSuccess ? "Tersimpan!" : "Unduh Laporan"}</span>
            </button>
          </div>
        </header>

        {/* PAGE DYNAMIC TAB VIEWS CONTAINER */}
        <div className="flex-1 p-4 md:p-6 space-y-6">

          {/* Active Filter Location Indicator */}
          {(filters.provinsi !== "ALL" || filters.kabupaten !== "ALL" || filters.kecamatan !== "ALL" || filters.desa !== "ALL") && (
            <div className="bg-blue-50/70 border border-blue-100 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-blue-800 font-semibold shadow-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <Sparkles className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Fokus Wilayah:</span>
                <span className="font-extrabold uppercase text-[#0c4a9f]">Nasional</span>
                {filters.provinsi !== "ALL" && (
                  <>
                    <span className="text-slate-300 select-none">&rsaquo;</span>
                    <span className="font-extrabold uppercase text-blue-700 bg-blue-100/65 px-2 py-0.5 rounded-md">
                      {provinceDataList.find(p => p.id === filters.provinsi)?.name}
                    </span>
                  </>
                )}
                {filters.kabupaten !== "ALL" && (
                  <>
                    <span className="text-slate-300 select-none">&rsaquo;</span>
                    <span className="font-extrabold uppercase text-indigo-700 bg-indigo-100/65 px-2 py-0.5 rounded-md">
                      {filters.kabupaten}
                    </span>
                  </>
                )}
                {filters.kecamatan !== "ALL" && (
                  <>
                    <span className="text-slate-300 select-none">&rsaquo;</span>
                    <span className="font-extrabold uppercase text-amber-700 bg-amber-100/65 px-2 py-0.5 rounded-md">
                      {filters.kecamatan}
                    </span>
                  </>
                )}
                {filters.desa !== "ALL" && (
                  <>
                    <span className="text-slate-300 select-none">&rsaquo;</span>
                    <span className="font-extrabold uppercase text-emerald-700 bg-emerald-100/65 px-2 py-0.5 rounded-md">
                      {filters.desa}
                    </span>
                  </>
                )}
              </div>
              <button
                onClick={() => setFilters({
                  ...filters,
                  provinsi: "ALL",
                  kabupaten: "ALL",
                  kecamatan: "ALL",
                  desa: "ALL"
                })}
                className="text-[10px] bg-white border border-blue-200 text-blue-700 hover:text-white px-2.5 py-1 rounded-lg font-bold hover:bg-blue-600 hover:border-blue-650 transition-colors cursor-pointer"
              >
                Reset Filter Wilayah
              </button>
            </div>
          )}

          {/* KPI Highlight Rows - Always shown on top for consistent high level summaries */}
          <KPICards
            data={activeData}
            tahun={filters.tahun}
            isAllProvinces={isAllProvinces}
          />

          {/* MAIN TAB CONTENT CONTROLLING */}
          {activeTab === "ringkasan" && (
            <div className="space-y-6">
              {/* Row 1: Interactive Map & Ringkasan Table List */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
                <div className="xl:col-span-4 h-full">
                  <RingkasanWilayah
                    selectedProvince={filters.provinsi}
                    onSelectProvince={handleSelectProvince}
                    provinceList={provinceDataList}
                  />
                </div>
                <div className="xl:col-span-5 h-full">
                  <SVGIndonesiaMap
                    selectedProvince={filters.provinsi}
                    onSelectProvince={handleSelectProvince}
                    provinceList={provinceDataList}
                    tahun={filters.tahun}
                  />
                </div>
                <div className="xl:col-span-3 h-full">
                  <IndeksDesaRadar data={activeData} tahun={filters.tahun} />
                </div>
              </div>

              {/* Row 2: BUM Desa Donut, Aspects Rating, Line Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <BUMDesaChart
                  data={activeData}
                  tahun={filters.tahun}
                  onSelectProvince={handleSelectProvince}
                  provinceList={provinceDataList}
                />
                <PemeringkatanBUMDesa data={activeData} tahun={filters.tahun} />
                <BagiHasilPADes data={activeData} tahun={filters.tahun} />
              </div>

              {/* Row 3: Bottom Row Cards (NIB, Program, BUMDesma Cooperative summaries) */}
              <NIBandProgram data={activeData} tahun={filters.tahun} />
            </div>
          )}

          {/* TAB 2: INDEKS DESA - SPECIFIC PILAR DEEP DIVE */}
          {activeTab === "indeks-desa" && (
            <div className="space-y-6 bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
              <div>
                <h2 className="text-lg font-black text-[#0c4a9f] tracking-tight truncate uppercase leading-none">
                  ANALISIS PILAR INDEKS DESA (ID)
                </h2>
                <p className="text-xs text-slate-400 font-bold mt-1 uppercase">
                  Metodologi evaluasi infrastruktur dasar dan kesejahteraan lokal
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-4">
                  <IndeksDesaRadar data={activeData} tahun={filters.tahun} />
                </div>
                <div className="lg:col-span-8 space-y-4">
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                    <h4 className="text-xs font-black text-slate-600 block uppercase mb-2">
                      Apa itu Indeks Desa?
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Indeks Desa merupakan instrumen pengukuran komposit yang mengukur kapasitas desa untuk bertransisi menuju kemandirian ekonomi, sosial, dan ketahanan ekologis. Indeks dibentuk berdasarkan rata-rata tertimbang dari 6 sub-indikator utama. Nilai skala berkisar antara <strong>0,000 sampai 1,000</strong>.
                    </p>
                  </div>

                  {/* Comparative list table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-sans text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-400 font-bold text-[10px] uppercase">
                          <th className="pb-2">Daftar Provinsi</th>
                          <th className="pb-2 text-center">Sosial</th>
                          <th className="pb-2 text-center">Ekonomi</th>
                          <th className="pb-2 text-center">Dasar</th>
                          <th className="pb-2 text-center">Akses</th>
                          <th className="pb-2 text-center">Kelola</th>
                          <th className="pb-2 text-right">Nilai ID</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                        {provinceDataList.map((prov) => {
                          const d = prov.idDimensions[filters.tahun] || prov.idDimensions["2025"];
                          return (
                            <tr key={prov.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => handleSelectProvince(prov.id)}>
                              <td className="py-2.5 font-bold text-[#0c4a9f]">{prov.name}</td>
                              <td className="py-2.5 text-center font-mono">{formatIndoDecimal(d?.sosial || 0.65)}</td>
                              <td className="py-2.5 text-center font-mono">{formatIndoDecimal(d?.ekonomi || 0.65)}</td>
                              <td className="py-2.5 text-center font-mono">{formatIndoDecimal(d?.layananDasar || 0.65)}</td>
                              <td className="py-2.5 text-center font-mono">{formatIndoDecimal(d?.aksesibilitas || 0.65)}</td>
                              <td className="py-2.5 text-center font-mono">{formatIndoDecimal(d?.tataKelola || 0.65)}</td>
                              <td className="py-2.5 text-right font-mono font-bold text-slate-800">{formatIndoDecimal(prov.indeksDesa[filters.tahun] || 0.65)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BUM DESA VIEW */}
          {activeTab === "bum-desa" && (
            <div className="space-y-6 bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
              <div>
                <h2 className="text-lg font-black text-[#0c4a9f] uppercase tracking-tight leading-none mb-1">
                  POPULASI & INTEGRITY BUM DESA
                </h2>
                <p className="text-xs text-slate-400 font-bold uppercase">
                  Peningkatan kompetensi kelembagaan unit usaha mandiri pedesaan
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BUMDesaChart
                  data={activeData}
                  tahun={filters.tahun}
                  onSelectProvince={handleSelectProvince}
                  provinceList={provinceDataList}
                />
                
                {/* Advanced statistics table */}
                <div className="space-y-4">
                  <div className="bg-slate-50 border border-slate-250 p-4 rounded-xl flex items-center gap-3">
                    <BookmarkCheck className="w-8 h-8 text-blue-600 flex-shrink-0" />
                    <div>
                      <span className="text-sm font-bold text-slate-700 block">Sertifikat Badan Hukum BUM Desa</span>
                      <p className="text-xs text-slate-400 leading-normal mt-0.5">
                        Melalui regulasi penunjang UU Cipta Kerja, BUM Desa kini dinaikkan statusnya menjadi Badan Hukum formal, memberikan jaminan kelayakan transaksi perbankan dan kucuran modal negara.
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block mb-2 leading-none">
                      Peta Klasifikasi Unit BUM Desa per Provinsi
                    </span>
                    <table className="w-full text-left font-sans text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-400 font-extrabold text-[10px] uppercase">
                          <th className="pb-2">Provinsi</th>
                          <th className="pb-2 text-center text-emerald-600">Aktif</th>
                          <th className="pb-2 text-center text-rose-600">Mati/Pasif</th>
                          <th className="pb-2 text-center text-amber-600">Rintisan</th>
                          <th className="pb-2 text-right">Total Unit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-650">
                        {provinceDataList.map((prov) => {
                          const s = prov.bumDesaStatus[filters.tahun] || { aktif: 0, tidakAktif: 0, dalamPengembangan: 0 };
                          return (
                            <tr key={prov.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => handleSelectProvince(prov.id)}>
                              <td className="py-2.5 font-bold text-slate-700">{prov.name}</td>
                              <td className="py-2.5 text-center font-mono text-emerald-600">{formatIndoNumber(s.aktif)}</td>
                              <td className="py-2.5 text-center font-mono text-rose-605">{formatIndoNumber(s.tidakAktif)}</td>
                              <td className="py-2.5 text-center font-mono text-amber-600">{formatIndoNumber(s.dalamPengembangan)}</td>
                              <td className="py-2.5 text-right font-mono font-bold text-slate-800">{formatIndoNumber(prov.bumDesaCount)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PEMERINGKATAN DEEP DIVE */}
          {activeTab === "pemeringkatan" && (
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-black text-[#0c4a9f] uppercase tracking-tight leading-none mb-1">
                  KOMPARASI ASPEK PEMERINGKATAN
                </h2>
                <p className="text-xs text-slate-400 font-bold uppercase">
                  Metodologi standarisasi akreditasi kehandalan internal organisasi
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-6">
                  <PemeringkatanBUMDesa data={activeData} tahun={filters.tahun} />
                </div>
                <div className="lg:col-span-6 space-y-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-150">
                    <h4 className="text-xs font-bold text-slate-700 uppercase mb-2">Penjelasan Matriks Penilaian BUM Desa</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Sertifikasi Pemeringkatan dinilai berdasarkan <strong>7 parameter administratif</strong> yang merangkum kesehatan finansial, kualitas sumber daya manusia (SDM), pengawasan komite, dan kontribusi sosial mereka untuk pedesaan.
                    </p>
                    <ul className="list-disc pl-4 mt-3 space-y-1.5 text-xs text-slate-500">
                      <li><strong>Kelembagaan</strong>: Legalitas formal, perumusan AD/ART dan kepatuhan anggaran.</li>
                      <li><strong>Manajemen</strong>: Transparansi audit, kemandirian SDM and pelaporan direksi.</li>
                      <li><strong>Usaha</strong>: Kelayakan bisnis, perputaran produk and kontribusi pasar terpadu.</li>
                      <li><strong>Kemitraan</strong>: Kerja sama institusional dengan pihak ketiga or perbankan swasta.</li>
                    </ul>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-sans text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-400 font-bold text-[10px] uppercase">
                          <th className="pb-2">Provinsi</th>
                          <th className="pb-2 text-center">Kelembagaan</th>
                          <th className="pb-2 text-center">Manajemen</th>
                          <th className="pb-2 text-center">Kemitraan</th>
                          <th className="pb-2 text-center">Manfaat</th>
                          <th className="pb-2 text-right">Skor Rata-rata</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-650">
                        {provinceDataList.map((prov) => {
                          const p = prov.bumDesaPemeringkatan[filters.tahun] || prov.bumDesaPemeringkatan["2025"] || { kelembagaan: 0.6, manajemen: 0.6, kemitraan: 0.6, manfaat: 0.6 };
                          const avg = (p.kelembagaan + p.manajemen + p.kemitraan + p.manfaat) / 4;
                          return (
                            <tr key={prov.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => handleSelectProvince(prov.id)}>
                              <td className="py-2.5 font-bold text-slate-700">{prov.name}</td>
                              <td className="py-2.5 text-center font-mono">{formatIndoDecimal(p.kelembagaan)}</td>
                              <td className="py-2.5 text-center font-mono">{formatIndoDecimal(p.manajemen)}</td>
                              <td className="py-2.5 text-center font-mono">{formatIndoDecimal(p.kemitraan)}</td>
                              <td className="py-2.5 text-center font-mono">{formatIndoDecimal(p.manfaat)}</td>
                              <td className="py-2.5 text-right font-mono font-bold text-emerald-600">{formatIndoDecimal(avg)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: BAGI HASIL VIEW */}
          {activeTab === "pades" && (
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-black text-[#0c4a9f] uppercase tracking-tight leading-none mb-1">
                  HISTORI KONTRIBUSI PENDAPATAN DESA (PADes)
                </h2>
                <p className="text-xs text-slate-400 font-bold uppercase">
                  Rekap kontribusi dividen bersih unit BUM Desa ke kas otonom desa
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-5">
                  <BagiHasilPADes data={activeData} tahun={filters.tahun} />
                </div>
                <div className="lg:col-span-7 space-y-4">
                  <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl">
                    <h4 className="text-xs font-bold text-slate-705 uppercase mb-2">Pemberdayaan Laba untuk Otonomi Desa</h4>
                    <p className="text-xs text-slate-500 leading-relaxed mb-2.5">
                      Sesuai peraturan, minimal <strong>15% sampai 35%</strong> dari laba bersih BUM Desa disetorkan ke Pemerintah Desa sebagai bagian dari pendapatan kas desa asli (PADes). Dana ini dimanfaatkan untuk pembangunan infrastruktur kecil, subsidi kesehatan darurat, or beasiswa siswa tidak mampu di wilayah setempat.
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block mb-2 leading-none">
                      Histori Finansial PADes Berkelanjutan (Miliar Rupiah)
                    </span>
                    <table className="w-full text-left font-sans text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-400 font-bold text-[10px] uppercase">
                          <th className="pb-2">Provinsi</th>
                          <th className="pb-2 text-center">Tahun 2022</th>
                          <th className="pb-2 text-center">Tahun 2023</th>
                          <th className="pb-2 text-center">Tahun 2024</th>
                          <th className="pb-2 text-right">Tahun 2025</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-650">
                        {provinceDataList.map((prov) => {
                          const h = prov.bagiHasilPADes;
                          return (
                            <tr key={prov.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => handleSelectProvince(prov.id)}>
                              <td className="py-2.5 font-bold text-[#0c4a9f]">{prov.name}</td>
                              <td className="py-2.5 text-center font-mono">Rp {h["2022"].toFixed(1).replace(".", ",")} M</td>
                              <td className="py-2.5 text-center font-mono">Rp {h["2023"].toFixed(1).replace(".", ",")} M</td>
                              <td className="py-2.5 text-center font-mono">Rp {h["2024"].toFixed(1).replace(".", ",")} M</td>
                              <td className="py-2.5 text-right font-mono font-bold text-slate-800">Rp {h["2025"].toFixed(1).replace(".", ",")} M</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: NIB & PROGRAM */}
          {activeTab === "nib" && (
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-6 animate-fade-in">
              <div>
                <h2 className="text-lg font-black text-[#0c4a9f] uppercase tracking-tight leading-none mb-1">
                  LEGALITAS PERIZINAN & PROGRAM STRATEGIS
                </h2>
                <p className="text-xs text-slate-400 font-bold uppercase">
                  Pemetaan status pendaftaran NIB dan inovasi binaan nasional
                </p>
              </div>

              {/* Grid block reuse bottom metrics */}
              <NIBandProgram data={activeData} tahun={filters.tahun} />

              <div className="bg-slate-50 border border-slate-205/55 p-4 rounded-xl mt-4">
                <h4 className="text-xs font-black text-[#0c4a9f] uppercase mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Manfaat Pembinaan Desa BRILian & MBG (Makanan Bergizi Gratis)
                </h4>
                <p className="text-xs text-slate-505 leading-relaxed">
                  Melalui kolaborasi lintas-instansi Kementerian Desa dan perbankan BUMN (seperti Bank BRI), program <strong>Desa BRILian</strong> mempercepat literasi keuangan digital pedesaan. Di sisi lain, program <strong>MBG (Makanan Bergizi Gratis)</strong> tahun 2025/2026 menunjuk BUM Desa sebagai pemasok eksklusif hasil pertanian and peternakan lokal, secara sirkular mengentaskan kemiskinan dan meningkatkan serapan pasar domestik secara masif.
                </p>
              </div>
            </div>
          )}

          {/* TAB 7: BUM DESA BERSAMA */}
          {activeTab === "bumdes-bersama" && (
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-black text-[#0c4a9f] uppercase tracking-tight leading-none mb-1">
                  KONSORSIUM BUM DESA BERSAMA (BUMDesma)
                </h2>
                <p className="text-xs text-slate-400 font-bold uppercase">
                  Kerja sama skala kawasan kecamatan untuk eskalasi kapasitas pasar
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                <div className="lg:col-span-6">
                  {/* Detailed summary widget */}
                  <div className="bg-[#0b3c8f]/10 border border-blue-200 rounded-2xl p-5 flex flex-col justify-between h-full">
                    <div>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">
                        Sistem Kepemilikan Konsorsium
                      </span>
                      <p className="text-xs text-slate-600 leading-relaxed mb-4">
                        BUM Desa Bersama (BUMDesma) didirikan oleh dua desa atau lebih berdasarkan kesepakatan kawasan dalam satu kecamatan. Tujuannya adalah mengelola potensi ekonomi padat modal yang tidak efisien dikelola secara individual oleh satu desa saja, seperti jaringan air bersih antardesa, pasar pariwisata terpadu, or pengelolaan pabrik produksi kelapa sawit skala menengah.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 bg-white/80 backdrop-blur-xs rounded-xl p-4 border border-blue-105/30">
                      <div>
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase">Unit Konsorsium</span>
                        <span className="text-xl font-extrabold text-slate-800 block font-mono">
                          {formatIndoNumber(activeData.bumDesaBersama.count)} unit
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase">Kinerja Operasional</span>
                        <span className="text-xl font-extrabold text-emerald-600 block">
                          Baik ({formatIndoDecimal(activeData.bumDesaBersama.pemeringkatanNilai)})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6">
                  <div className="overflow-x-auto">
                    <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block mb-2 leading-none">
                      Data Kerjasama BUMDesma per Provinsi {filters.tahun}
                    </span>
                    <table className="w-full text-left font-sans text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-400 font-bold text-[10px] uppercase">
                          <th className="pb-2">Provinsi</th>
                          <th className="pb-2 text-center text-emerald-600">Konsorsium Aktif</th>
                          <th className="pb-2 text-center text-rose-600">Konsorsium Pasif</th>
                          <th className="pb-2 text-right">Total Unit BEM</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-650">
                        {provinceDataList.map((prov) => {
                          const bm = prov.bumDesaBersama;
                          return (
                            <tr key={prov.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => handleSelectProvince(prov.id)}>
                              <td className="py-2.5 font-bold text-[#0c4a9f]">{prov.name}</td>
                              <td className="py-2.5 text-center font-mono text-emerald-600">{formatIndoNumber(bm.aktif)}</td>
                              <td className="py-2.5 text-center font-mono text-rose-600">{formatIndoNumber(bm.tidakAktif)}</td>
                              <td className="py-2.5 text-right font-mono font-extrabold text-slate-800">{formatIndoNumber(bm.count)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: KETERANGAN GLOSARIUM & REGULASI */}
          {activeTab === "keterangan" && (
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-black text-[#0c4a9f] uppercase tracking-tight leading-none mb-1">
                  KETERANGAN METODOLOGI & PERATURAN TERKAIT
                </h2>
                <p className="text-xs text-slate-400 font-bold uppercase">
                  Daftar singkatan istilah, rujukan undang-undang, dan formulas indeks
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed">
                {/* Metodologi formulas */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-150">
                  <h4 className="text-xs font-black text-slate-700 uppercase mb-3 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    Kamis Glosarium Istilah
                  </h4>
                  <ul className="space-y-3.5 text-xs text-slate-605">
                    <li>
                      <strong>Indeks Desa (ID)</strong>: Komposit dari Indeks Ketahanan Sosial, Indeks Ketahanan Ekonomi, dan Indeks Ketahanan Ekologi. Rentang skoring bernilai 0 hingga 1.
                    </li>
                    <li>
                      <strong>BUM Desa</strong>: Badan Usaha Milik Desa yang didirikan oleh pemerintah desa untuk mendayagunakan aset bersama dan menggerakkan sirkulasi keuangan lokal masyarakat.
                    </li>
                    <li>
                      <strong>BUMDesma (BUM Desa Bersama)</strong>: Struktur kerja sama korporasi antara beberapa desa dalam satu kecamatan yang terikat kesepakatan kawasan.
                    </li>
                    <li>
                      <strong>PADes (Pendapatan Asli Desa)</strong>: Kas milik desa yang didanai secara mandiri melalui bagi hasil usaha, retribusi pasar, swadaya, dan aset otonom lainnya.
                    </li>
                  </ul>
                </div>

                {/* Perundang-undangan hukum rujukan */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-150">
                  <h4 className="text-xs font-black text-slate-700 uppercase mb-3 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Fasilitas Regulasi Hukum Rujukan
                  </h4>
                  <ul className="space-y-3.5 text-xs text-slate-605">
                    <li>
                      <strong>Undang-Undang No. 6 Tahun 2014 tentang Desa</strong>: Landasan konstitusi utama otonomi desa dan penyaluran pos alokasi Dana Desa tahunan dari APBN.
                    </li>
                    <li>
                      <strong>Peraturan Pemerintah (PP) No. 11 Tahun 21 tentang BUM Desa</strong>: Regulasi pelaksana UU Cipta Kerja yang menetapkan BUM Desa sebagai Badan Hukum mandiri.
                    </li>
                    <li>
                      <strong>Peraturan Menteri Desa (Permendesa PDTT) No. 3 Tahun 2021</strong>: Pedoman pengelolaan operasional, pembinaan organisasi, and audit akuntabilitas keuangan BUM Desa.
                    </li>
                    <li>
                      <strong>Program MBG 2025/2026</strong>: Arahan Kementerian Pertanian & Kemendesa untuk melibatkan rantai sirkular pasok pertanian desa dalam program nutrisi gizi gratis nasional.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Humid Footer Credits */}
        <footer className="mt-auto bg-white border-t border-slate-200 py-4 px-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 font-bold select-none">
          <span>&copy; {new Date().getFullYear()} Kementerian Desa, Pembangunan Daerah Tertinggal, dan Transmigrasi RI.</span>
          <span className="mt-1.5 sm:mt-0">Sistem Portal Interaktif Satu Data Desa &bull; Republik Indonesia</span>
        </footer>

      </main>
    </div>
  );
}
