import React, { useState } from "react";
import { 
  Table, 
  RefreshCw, 
  CheckCircle2, 
  HelpCircle, 
  AlertTriangle, 
  FileCheck2, 
  Database, 
  Layers, 
  ArrowRight,
  TrendingUp,
  ExternalLink
} from "lucide-react";
import { AggregatedDashboardData } from "../data/sheetsDataEngine";
import { formatIndoNumber } from "./KPICards";

interface SheetsSyncPanelProps {
  useGoogleSheets: boolean;
  setUseGoogleSheets: (use: boolean) => void;
  spreadsheetUrl: string;
  setSpreadsheetUrl: (url: string) => void;
  isSheetsLoading: boolean;
  sheetsError: string | null;
  sheetsData: AggregatedDashboardData | null;
  onTriggerSync: () => void;
}

export default function SheetsSyncPanel({
  useGoogleSheets,
  setUseGoogleSheets,
  spreadsheetUrl,
  setSpreadsheetUrl,
  isSheetsLoading,
  sheetsError,
  sheetsData,
  onTriggerSync,
}: SheetsSyncPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(spreadsheetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasSuccessfulSync = sheetsData !== null;
  const totalRows = sheetsData ? sheetsData.rawRows.length : 0;
  const totalProvincesActive = sheetsData ? sheetsData.provinces.filter(p => p.desaCount > 0).length : 0;

  // List of required columns to guide the user on column names
  const requiredColumns = [
    { key: "provinsi", label: "PROVINSI / KABUPATEN / KECAMATAN / DESA", desc: "Data wilayah administratif berjenjang.", optional: false },
    { key: "indeksDesa", label: "SKOR INDEKS DESA & INDEKS DESA (ID 2025)", desc: "Skor numerik (0-1) dan kategori tulisan komposit.", optional: false },
    { key: "pilarRadar", label: "Layanan Dasar, Sosial, Ekonomi, Lingkungan, Aksesibilitas, Tata Kelola Pemerintah", desc: "Pilar penentu grafik radar indeks jaring keselamatan.", optional: false },
    { key: "bumDesStatus", label: "PEMERINGKATAN BUM DESA", desc: "Kategori pendirian: PERINTIS, PEMULA, BERKEMBANG, MAJU.", optional: false },
    { key: "bumDesAspects", label: "ASPEK KELEMBAGAAN, MANAJEMEN, USAHA, KEMITRAAN, ASET MODAL, ADMINISTRASI, MANFAAT", desc: "Tujuh parameter kinerja finansial & operasional.", optional: false },
    { key: "bagiHasil", label: "BAGI HASIL BUM DESA KE PADES (2022, 2023, 2024, 2025)", desc: "Setoran laba bersih otonom ke kas perbendaharaan desa.", optional: false },
    { key: "nib", label: "NOMOR INDUK BERUSAHA (NIB)", desc: "Kolom kode hukum legalitas unit usaha desa.", optional: false }
  ];

  return (
    <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-6">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-5 gap-4">
        <div>
          <h2 className="text-xl font-black text-[#0c4a9f] tracking-tight uppercase flex items-center gap-2">
            <Database className="w-5.5 h-5.5 text-blue-600" />
            PANEL SINKRONISASI GOOGLE SPREADSHEET
          </h2>
          <p className="text-xs text-slate-400 font-bold uppercase mt-1">
            Konfigurasi Sumber Data Utama Dashboard (Real-Time Raw Data Integration)
          </p>
        </div>

        {/* Dynamic Mode badge */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">MODE AKTIF:</span>
          <span className={`text-[10.5px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
            useGoogleSheets 
              ? "bg-emerald-100 text-emerald-800 border border-emerald-200" 
              : "bg-blue-50 text-blue-805 border border-blue-200"
          }`}>
            {useGoogleSheets ? "● Google Sheet Resmi" : "○ Simulasi Padat"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side (7 columns) - Control panel and switch */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-5 bg-slate-50 border border-slate-150 rounded-2xl space-y-4">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider">
              1. Pilih Sumber Data Dan Konfigurasi Spreadsheet
            </h3>
            
            <p className="text-xs text-slate-500 leading-relaxed">
              Anda bisa menghubungkan otonomi dashboard ini ke spreadsheet milik Anda sendiri. Secara bawaan, kami menyediakan Option A yang menyambungkan visualisasi langsung ke spreadsheet resmi.
            </p>

            {/* Input URL Group */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex justify-between">
                <span>URL Google Spreadsheet:</span>
                <a 
                  href={spreadsheetUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-0.5 font-bold"
                >
                  Buka Spreadsheet <ExternalLink className="w-3 h-3" />
                </a>
              </label>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={spreadsheetUrl}
                  readOnly
                  className="flex-1 text-[10px] px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-xl focus:outline-none font-mono text-slate-500 shadow-inner cursor-not-allowed cursor-default select-all"
                />
                
                <button
                  onClick={onTriggerSync}
                  disabled={isSheetsLoading}
                  className="bg-[#0c4a9f] hover:bg-blue-800 disabled:bg-slate-300 text-white px-4 py-2 bg-gradient-to-r rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-blue-200 cursor-pointer text-center shrink-0"
                >
                  <RefreshCw className={`w-4 h-4 ${isSheetsLoading ? "animate-spin" : ""}`} />
                  <span>{isSheetsLoading ? "Menyinkronkan..." : "Sinkronkan"}</span>
                </button>
              </div>
              <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mt-1.5 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Terkunci pada koneksi resmi khusus Sheet "final"
              </p>
            </div>

            {/* Switch Mode Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div 
                onClick={() => setUseGoogleSheets(false)}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                  !useGoogleSheets 
                    ? "bg-white border-blue-600 shadow-sm"
                    : "bg-slate-50/50 hover:bg-white border-slate-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-3 h-3 rounded-full border-2 ${!useGoogleSheets ? "bg-blue-600 border-blue-600" : "border-slate-300"}`} />
                  <span className="text-xs font-black text-slate-800 uppercase">Data Contoh (Simulasi)</span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium leading-normal pl-5">
                  Gunakan dataset default bawaan sistem untuk visualisasi performa tinggi yang andal.
                </p>
              </div>

              <div 
                onClick={() => {
                  if (hasSuccessfulSync) {
                    setUseGoogleSheets(true);
                  } else {
                    onTriggerSync();
                  }
                }}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                  useGoogleSheets 
                    ? "bg-white border-emerald-600 shadow-xs"
                    : "bg-slate-50/50 hover:bg-white border-slate-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-3 h-3 rounded-full border-2 ${useGoogleSheets ? "bg-emerald-600 border-emerald-600" : "border-slate-300"}`} />
                  <span className="text-xs font-black text-emerald-800 uppercase">Data Google Sheet</span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium leading-normal pl-5">
                  Tarik baris otonom secara langsung dari Google Sheet resmi Kementerian Desa secara real-time.
                </p>
              </div>
            </div>
          </div>

          {/* Sync Alerts & Messages */}
          {sheetsError && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3.5">
              <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-xs font-black text-rose-800 block uppercase tracking-wide leading-none">
                  Gagal Membaca Dari Google Sheet
                </span>
                <p className="text-[11px] text-rose-600 leading-normal font-semibold">
                  Sebab: {sheetsError}
                </p>
                <p className="text-[10px] text-rose-500 pt-1 leading-normal">
                  Pastikan spreadsheet tersebut telah dibagikan dengan status <strong>"Anyone with the link can view" (Siapa saja yang memiliki link dapat melihat)</strong>, agar sistem portal bisa menarik baris datanya secara otonom tanpa halangan CORS.
                </p>
              </div>
            </div>
          )}

          {!sheetsError && hasSuccessfulSync && (
            <div className="p-4 bg-emerald-50/80 border border-emerald-150 rounded-2xl flex items-start gap-3.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div className="space-y-1 leading-none">
                <span className="text-xs font-black text-emerald-800 block uppercase tracking-wide mb-1">
                  Sinkronisasi Berhasil Dilakukan!
                </span>
                <p className="text-[11px] text-slate-600 font-semibold leading-normal">
                  Sistem mengekstrak sebanyak <strong>{formatIndoNumber(totalRows)} desa/baris</strong> yang tersebar di <strong>{totalProvincesActive} wilayah provinsi resmi</strong> di Indonesia.
                </p>
                <span className="text-[9.5px] text-slate-400 block pt-1.5 font-bold">
                  SINKRONISASI AKTIF: {new Date().toLocaleTimeString("id-ID")} WIB
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Side (5 columns) - Mapping status & checklist */}
        <div className="lg:col-span-5 space-y-4">
          <div className="border border-slate-200 rounded-2xl p-5 space-y-4">
            <div>
              <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                2. Pemetaan Struktur Kolom (Mapping Status)
              </h3>
              <p className="text-[11px] text-slate-400 font-bold uppercase leading-normal">
                Kondisi kecocokan nama header kolom di Spreadsheet
              </p>
            </div>

            <div className="space-y-3.5">
              {requiredColumns.map((col, idx) => {
                const isMapped = hasSuccessfulSync;
                return (
                  <div key={idx} className="flex gap-3 text-xs leading-normal items-start">
                    {isMapped ? (
                      <CheckCircle2 className="w-4.5 h-4.5 text-emerald-550 shrink-0 mt-0.5 fill-emerald-50 stroke-emerald-600" />
                    ) : (
                      <span className="w-4.5 h-4.5 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center font-mono text-[9px] font-black text-slate-400 mt-0.5 shrink-0">
                        {idx + 1}
                      </span>
                    )}
                    <div>
                      <span className={`text-[11px] font-bold block ${isMapped ? "text-slate-800" : "text-slate-500"}`}>
                        {col.label}
                      </span>
                      <p className="text-[10px] text-slate-400 font-semibold leading-tight mt-0.5">
                        {col.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-450">
              <span className="font-bold flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-blue-650" />
                Daftar Integrasi: Otonom
              </span>
              <button 
                onClick={handleCopy}
                className="text-blue-600 font-black uppercase tracking-wider hover:underline hover:text-blue-800 cursor-pointer"
              >
                {copied ? "Tersalin!" : "Salin Link Spread"}
              </button>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
