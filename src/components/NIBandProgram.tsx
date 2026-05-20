import React from "react";
import {
  FileBadge,
  Globe,
  Sparkles,
  HeartHandshake,
  UsersRound,
  CheckCircle,
  XCircle,
  Medal,
  Activity,
  Heart
} from "lucide-react";
import { ProvinceData } from "../types";
import { formatIndoNumber, formatIndoDecimal } from "./KPICards";

interface NIBandProgramProps {
  data: ProvinceData;
  tahun: string;
}

export default function NIBandProgram({ data, tahun }: NIBandProgramProps) {
  // Extract NIB Info
  const nibCount = data.nib.count;
  const nibPercent = data.nib.percentage;
  
  // Extract Program & Inovasi
  const prog = data.programInovasi;
  
  // Extract BUM Desa Bersama
  const bumdesma = data.bumDesaBersama;
  const bemTotal = bumdesma.count;
  const bemAktif = bumdesma.aktif;
  const bemTidakAktif = bumdesma.tidakAktif;
  const bemPctAktif = (bemAktif / bemTotal) * 100;
  const bemPctTidakAktif = (bemTidakAktif / bemTotal) * 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* CARD 1: NOMOR INDUK BERUSAHA (NIB) - 3 Columns */}
      <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between hover:shadow-xs transition-shadow">
        <div>
          <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest leading-none mb-1">
            NOMOR INDUK BERUSAHA
          </h4>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-1">
            Legalitas & sertifikasi BUM Desa
          </p>
        </div>

        {/* Large Stat Box */}
        <div className="my-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 shadow-3xs">
              <FileBadge className="w-8 h-8" />
            </div>
            <div>
              <span className="text-3xl font-extrabold text-slate-900 block font-mono">
                {formatIndoNumber(nibCount)}
              </span>
              <span className="text-[10px] text-slate-500 font-bold block">
                BUM DESA MEMILIKI NIB
              </span>
            </div>
          </div>

          {/* Progress gauge bar */}
          <div className="mt-4">
            <div className="flex justify-between items-center text-[11px] font-bold text-slate-500 mb-1">
              <span>Sertifikasi Terpenuhi:</span>
              <span className="text-blue-600 font-mono text-xs">{nibPercent.toFixed(2).replace(".", ",")}%</span>
            </div>
            <div className="bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-700"
                style={{ width: `${nibPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="text-[10px] text-slate-400 font-medium pt-2 border-t border-slate-100">
          Dari total {formatIndoNumber(data.bumDesaCount)} BUM Desa terdaftar.
        </div>
      </div>

      {/* CARD 2: PROGRAM & INOVASI DESA - 5 Columns */}
      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between hover:shadow-xs transition-shadow">
        <div>
          <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest leading-none mb-1">
            PROGRAM & INOVASI DESA
          </h4>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-1">
            Klasifikasi desa dalam inovasi strategis {tahun}
          </p>
        </div>

        {/* Bento Grid Sub-items */}
        <div className="grid grid-cols-2 gap-3.5 my-4">
          {/* Item 1: Desa Ekspor */}
          <div className="bg-slate-50/50 hover:bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center gap-3 transition-colors">
            <div className="p-2 rounded-lg bg-teal-50 text-teal-600">
              <Globe className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[15px] font-extrabold text-slate-800 block font-mono leading-none">
                {formatIndoNumber(prog.desaEkspor)}
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase block mt-1 truncate">
                Desa Ekspor
              </span>
            </div>
          </div>

          {/* Item 2: Desa BRILian */}
          <div className="bg-slate-50/50 hover:bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center gap-3 transition-colors">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[15px] font-extrabold text-slate-800 block font-mono leading-none">
                {formatIndoNumber(prog.desaBrilian)}
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase block mt-1 truncate">
                Desa BRILian
              </span>
            </div>
          </div>

          {/* Item 3: MBG 2025 */}
          <div className="bg-slate-50/50 hover:bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center gap-3 transition-colors">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Heart className="w-5 h-5 fill-emerald-100" />
            </div>
            <div className="min-w-0">
              <span className="text-[15px] font-extrabold text-slate-800 block font-mono leading-none">
                {formatIndoNumber(prog.mbg2025)}
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase block mt-1 truncate">
                MBG 2025 (Pilar 1)
              </span>
            </div>
          </div>

          {/* Item 4: MBG 2026 */}
          <div className="bg-slate-50/50 hover:bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center gap-3 transition-colors">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Activity className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[15px] font-extrabold text-slate-800 block font-mono leading-none">
                {formatIndoNumber(prog.mbg2026)}
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase block mt-1 truncate">
                MBG 2026 (Pilar 2)
              </span>
            </div>
          </div>
        </div>

        <div className="text-[10px] text-slate-400 font-semibold pt-2 border-t border-slate-100">
          MBG: Program Makanan Bergizi Gratis Berbasis BUM Desa.
        </div>
      </div>

      {/* CARD 3: RINGKASAN BUM DESA BERSAMA - 4 Columns */}
      <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between hover:shadow-xs transition-shadow">
        <div>
          <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest leading-none mb-1">
            RINGKASAN BUM DESA BERSAMA
          </h4>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-1">
            Koperasi gabungan antar desa kecamatan
          </p>
        </div>

        {/* Middle row: Large total volume and status rows */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 my-3 items-center">
          {/* Left panel inside: Total & status lists */}
          <div className="sm:col-span-7 flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-purple-50 text-purple-600">
              <UsersRound className="w-7 h-7" />
            </div>
            <div>
              <span className="text-2xl font-extrabold text-slate-900 block font-mono">
                {formatIndoNumber(bemTotal)}
              </span>
              <span className="text-[10px] text-slate-450 font-bold block uppercase leading-none">
                BUM DESA BERSAMA
              </span>

              {/* Mini active list */}
              <div className="mt-3 space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 block" />
                  <span>Aktif:</span>
                  <span className="font-mono text-slate-700">{formatIndoNumber(bemAktif)} ({bemPctAktif.toFixed(1)}%)</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold">
                  <span className="w-2 h-2 rounded-full bg-rose-500 block" />
                  <span>Pasif:</span>
                  <span className="font-mono text-slate-700">{formatIndoNumber(bemTidakAktif)} ({bemPctTidakAktif.toFixed(1)}%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel inside: score rating badge */}
          <div className="sm:col-span-5 bg-slate-50 border border-slate-150 p-2.5 rounded-xl text-center select-none flex flex-col justify-center items-center">
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block leading-none mb-1">
              Rata-rata Nilai
            </span>
            <span className="text-[13px] font-extrabold text-blue-700 font-mono block mb-1">
              {formatIndoDecimal(bumdesma.pemeringkatanNilai)}
            </span>
            <div className="p-1 rounded-full bg-amber-50 border border-amber-200 inline-flex items-center justify-center text-amber-500 mb-1.5 animate-pulse">
              <Medal className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Peringkat
            </span>
            <span className="text-[11px] font-extrabold text-emerald-600 block">
              Baik
            </span>
          </div>
        </div>

        <div className="text-[10px] text-slate-455 font-bold pt-2 border-t border-slate-100 flex items-center gap-1">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
          <span>Kolaborasi multisektoral desa berjalan kondusif.</span>
        </div>
      </div>
    </div>
  );
}
