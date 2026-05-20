import React from "react";
import { Store, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { ProvinceData } from "../types";
import { formatIndoNumber } from "./KPICards";

interface BUMDesaChartProps {
  data: ProvinceData;
  tahun: string;
  onSelectProvince: (provId: string) => void;
  provinceList: ProvinceData[];
}

export default function BUMDesaChart({
  data,
  tahun,
  onSelectProvince,
  provinceList,
}: BUMDesaChartProps) {
  // Use status breakdown for the active year
  const activeYearData = data.bumDesaStatus[tahun] || data.bumDesaStatus["2025"] || {
    aktif: 36182,
    tidakAktif: 10337,
    dalamPengembangan: 5170,
  };

  const { aktif, tidakAktif, dalamPengembangan } = activeYearData;
  const totalBumDes = aktif + tidakAktif + dalamPengembangan;

  const pctAktif = (aktif / totalBumDes) * 100;
  const pctTidakAktif = (tidakAktif / totalBumDes) * 100;
  const pctDev = (dalamPengembangan / totalBumDes) * 100;

  // Pie chart sector calculations using stroke-dasharray & stroke-dashoffset (Circumference of r=35 is 220)
  const r = 35;
  const circ = 2 * Math.PI * r; // ~219.9
  
  const lenAktif = (pctAktif / 100) * circ;
  const lenTidakAktif = (pctTidakAktif / 100) * circ;
  const lenDev = (pctDev / 100) * circ;

  const offsetAktif = 0;
  const offsetTidakAktif = -lenAktif;
  const offsetDev = -(lenAktif + lenTidakAktif);

  // Top 5 provinces by BUM Desa density
  const sortedBumdesList = [...provinceList]
    .map(p => ({ id: p.id, name: p.name, count: p.bumDesaCount }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const bestBumProvinces = sortedBumdesList.length > 0 ? sortedBumdesList : [
    { id: "35", name: "Jawa Timur", count: 6192 },
    { id: "32", name: "Jawa Barat", count: 5678 },
    { id: "33", name: "Jawa Tengah", count: 5341 },
    { id: "12", name: "Sumatera Utara", count: 3261 },
    { id: "73", name: "Sulawesi Selatan", count: 2577 }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between h-full">
      {/* Title */}
      <div>
        <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest leading-none mb-1">
          BUM DESA PER PROVINSI
        </h3>
        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
          Status kemapanan Badan Usaha Milik Desa
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center my-4">
        {/* Left Col: Donut Chart representation */}
        <div className="sm:col-span-5 flex flex-col items-center justify-center relative">
          <div className="relative w-36 h-36 flex items-center justify-center select-none">
            <svg width="100%" height="100%" viewBox="0 0 100 100" className="transform -rotate-90">
              {/* Underlay tracking circle */}
              <circle
                cx="50"
                cy="50"
                r={r}
                fill="transparent"
                stroke="#f1f5f9"
                strokeWidth="10"
              />

              {/* Segment 1: Aktif (Green) */}
              <circle
                cx="50"
                cy="50"
                r={r}
                fill="transparent"
                stroke="#10b981" // emerald-500
                strokeWidth="10"
                strokeDasharray={`${lenAktif} ${circ}`}
                strokeDashoffset={offsetAktif}
                strokeLinecap="round"
                className="transition-all duration-500"
              />

              {/* Segment 2: Tidak Aktif (Red) */}
              <circle
                cx="50"
                cy="50"
                r={r}
                fill="transparent"
                stroke="#ef4444" // red-500
                strokeWidth="10"
                strokeDasharray={`${lenTidakAktif} ${circ}`}
                strokeDashoffset={offsetTidakAktif}
                className="transition-all duration-500"
              />

              {/* Segment 3: Dalam Pengembangan (Yellow/Orange) */}
              <circle
                cx="50"
                cy="50"
                r={r}
                fill="transparent"
                stroke="#f59e0b" // amber-500
                strokeWidth="10"
                strokeDasharray={`${lenDev} ${circ}`}
                strokeDashoffset={offsetDev}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>

            {/* Centered text box */}
            <div className="absolute text-center leading-tight">
              <span className="text-lg font-extrabold text-slate-800 font-mono block">
                {formatIndoNumber(totalBumDes)}
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                BUM DESA
              </span>
            </div>
          </div>

          {/* Quick Stats list with percentage share */}
          <div className="flex flex-wrap gap-2.5 justify-center mt-3 text-[10px] w-full">
            <span className="flex items-center gap-1 text-slate-500 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block" />
              Aktif: {pctAktif.toFixed(0)}%
            </span>
            <span className="flex items-center gap-1 text-slate-500 font-semibold" >
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 block" />
              Pasif: {pctTidakAktif.toFixed(0)}%
            </span>
            <span className="flex items-center gap-1 text-slate-500 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 block" />
              Rintis: {pctDev.toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Right Col: Top 5 density list and status detail bar charts */}
        <div className="sm:col-span-7 space-y-3.5">
          {/* Top density listing */}
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-2 leading-none">
              Populasi Terbanyak per Provinsi
            </span>
            <div className="space-y-1.5">
              {bestBumProvinces.map((prov) => {
                const isSelected = data.id === prov.id;
                return (
                  <div
                    key={prov.id}
                    onClick={() => onSelectProvince(prov.id)}
                    className={`flex items-center justify-between px-2.5 py-1 rounded-lg cursor-pointer text-xs transition-colors ${
                      isSelected
                        ? "bg-blue-50 text-blue-700 font-bold border border-blue-100"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-600 font-medium"
                    }`}
                  >
                    <span className="truncate max-w-[130px] font-bold">{prov.name}</span>
                    <span className="font-mono pl-2">{formatIndoNumber(prov.count)} unit</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Custom Horizontal status bars display */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-2 leading-none">
              Breakdown Status BUM Desa
            </span>

            <div className="space-y-2">
              {/* Aktif Bar */}
              <div>
                <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold mb-0.5">
                  <span className="flex items-center gap-1 font-bold text-emerald-600">
                    <CheckCircle className="w-3 h-3" />
                    Aktif
                  </span>
                  <span className="font-mono font-bold text-slate-700">{formatIndoNumber(aktif)} ({pctAktif.toFixed(1)}%)</span>
                </div>
                <div className="bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${pctAktif}%` }} />
                </div>
              </div>

              {/* Tidak Aktif Bar */}
              <div>
                <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold mb-0.5">
                  <span className="flex items-center gap-1 font-bold text-rose-600">
                    <XCircle className="w-3 h-3" />
                    Tidak Aktif
                  </span>
                  <span className="font-mono font-bold text-slate-700">{formatIndoNumber(tidakAktif)} ({pctTidakAktif.toFixed(1)}%)</span>
                </div>
                <div className="bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full transition-all duration-500" style={{ width: `${pctTidakAktif}%` }} />
                </div>
              </div>

              {/* Dalam Pengembangan Bar */}
              <div>
                <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold mb-0.5">
                  <span className="flex items-center gap-1 font-bold text-amber-600">
                    <RefreshCw className="w-3 h-3" strokeWidth="2.5" />
                    Binaan / Rintisan
                  </span>
                  <span className="font-mono font-bold text-slate-700">{formatIndoNumber(dalamPengembangan)} ({pctDev.toFixed(1)}%)</span>
                </div>
                <div className="bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${pctDev}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer reset button */}
      <div className="mt-2.5 pt-3 border-t border-slate-100 flex justify-between items-center">
        <button
          onClick={() => onSelectProvince("ALL")}
          className="text-xs text-blue-600 font-extrabold flex items-center gap-1 hover:text-blue-800 hover:underline cursor-pointer"
        >
          Lihat Semua Provinsi &rarr;
        </button>
      </div>
    </div>
  );
}
