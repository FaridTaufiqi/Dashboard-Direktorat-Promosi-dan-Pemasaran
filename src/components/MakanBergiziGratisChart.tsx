import React from "react";
import { ProvinceData } from "../types";
import { Utensils, TrendingUp } from "lucide-react";
import { formatIndoNumber } from "./KPICards";

interface MakanBergiziGratisChartProps {
  data: ProvinceData;
  tahun: string;
}

export default function MakanBergiziGratisChart({ data }: MakanBergiziGratisChartProps) {
  const mbg = data.makanBergiziGratis || {
    bumDesaCount: 0,
    pendapatan2025: 0,
    pendapatan2026: 0,
  };

  const toMiliar = (val: number) => {
    return (val).toFixed(2);
  };

  return (
    <div className="bg-white rounded-[24px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col justify-between h-full space-y-4">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest leading-none mb-1">
            BUM Desa Makan Bergizi Gratis
          </h3>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
            Target & Capaian BUM Desa Terhadap Program Pemerintah
          </p>
        </div>
        <div className="bg-orange-50 p-2 rounded-xl border border-orange-100">
          <Utensils className="w-5 h-5 text-orange-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 items-center">
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100/50 flex flex-col justify-center items-center text-center h-full min-h-[140px]">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
            BUM Desa Terlibat
          </p>
          <p className="flex items-baseline gap-1.5 focus:outline-none">
            <span className="text-4xl font-black text-slate-800 tracking-tight">
              {formatIndoNumber(mbg.bumDesaCount)}
            </span>
            <span className="text-xs font-bold text-slate-500 uppercase">Unit</span>
          </p>
        </div>

        <div className="flex flex-col gap-3 h-full justify-center">
          <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-50">
              <TrendingUp className="w-8 h-8 text-slate-100" />
            </div>
            <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1 z-10">
              Pendapatan 2025
            </p>
            <p className="text-lg font-black text-slate-700 font-mono tracking-tighter z-10">
              <span className="text-[10px] text-slate-400 font-sans mr-1">Rp</span>
              {formatIndoNumber(Math.round(mbg.pendapatan2025 * 100) / 100)}
              <span className="text-[9px] text-slate-400 font-sans ml-1 uppercase">Miliar</span>
            </p>
          </div>

          <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-50">
              <TrendingUp className="w-8 h-8 text-slate-100" />
            </div>
            <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-1 z-10">
              Pendapatan 2026
            </p>
            <p className="text-lg font-black text-slate-700 font-mono tracking-tighter z-10">
              <span className="text-[10px] text-slate-400 font-sans mr-1">Rp</span>
              {formatIndoNumber(Math.round(mbg.pendapatan2026 * 100) / 100)}
              <span className="text-[9px] text-slate-400 font-sans ml-1 uppercase">Miliar</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
