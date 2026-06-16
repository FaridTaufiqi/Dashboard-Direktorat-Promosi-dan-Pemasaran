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
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* CARD 1: NIB */}
      <div className="lg:col-span-4 bg-white rounded-[24px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
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

      {/* CARD 2: KLUSTERISASI DESA BISA EKSPOR */}
      <div className="lg:col-span-8 bg-white rounded-[24px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
        <div>
          <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest leading-none mb-1">
            KLUSTERISASI DESA BISA EKSPOR
          </h4>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-1">
            Status Ekspor dan Sentra IKM Berdasarkan Klasifikasi Desa {tahun}
          </p>
        </div>

        {/* Bento Grid Sub-items */}
        <div className="grid grid-cols-2 gap-3.5 my-4">
          {/* Item 1: Klaster 1 */}
          <div className="bg-slate-50/50 hover:bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center gap-3 transition-colors">
            <div className="p-2 rounded-lg bg-teal-50 text-teal-600">
              <Globe className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[15px] font-extrabold text-slate-800 block font-mono leading-none">
                {formatIndoNumber(data.desaEksporData?.klusterisasi?.klaster1 || 0)}
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase block mt-1 truncate">
                KLASTER 1
              </span>
            </div>
          </div>

          {/* Item 2: Klaster 2 */}
          <div className="bg-slate-50/50 hover:bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center gap-3 transition-colors">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Activity className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[15px] font-extrabold text-slate-800 block font-mono leading-none">
                {formatIndoNumber(data.desaEksporData?.klusterisasi?.klaster2 || 0)}
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase block mt-1 truncate">
                KLASTER 2
              </span>
            </div>
          </div>

          {/* Item 3: Sentra IKM */}
          <div className="bg-slate-50/50 hover:bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center gap-3 transition-colors">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <UsersRound className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[15px] font-extrabold text-slate-800 block font-mono leading-none">
                {formatIndoNumber(data.desaEksporData?.klusterisasi?.sentraIkm || 0)}
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase block mt-1 truncate">
                SENTRA IKM
              </span>
            </div>
          </div>

          {/* Item 4: Total */}
          <div className="bg-slate-50/50 hover:bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center gap-3 transition-colors">
            <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[15px] font-extrabold text-slate-800 block font-mono leading-none">
                {formatIndoNumber(data.desaEksporData?.klusterisasi?.total || 0)}
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase block mt-1 truncate">
                TOTAL DATA
              </span>
            </div>
          </div>
        </div>

        <div className="text-[10px] text-slate-400 font-semibold pt-2 border-t border-slate-100 grid md:grid-cols-2 gap-1">
          <div><span className="text-slate-500 font-bold">KLASTER 1:</span> Siap Ekspor / Skala Kecil.</div>
          <div><span className="text-slate-500 font-bold">KLASTER 2:</span> Komoditas Menonjol / Perlu Infrastruktur.</div>
        </div>
      </div>
    </div>
  );
}
