import React, { useMemo } from "react";
import { Store, Layers, Award, ShieldAlert, Star, TrendingUp } from "lucide-react";
import { ProvinceData } from "../types";
import { formatIndoNumber, formatIndoDecimal } from "./KPICards";

interface BUMDesaChartProps {
  data: ProvinceData;
  tahun: string;
  onSelectProvince: (provId: string) => void;
  provinceList: ProvinceData[];
}

// Map rating aspects into categories: PERINTIS, PEMULA, BERKEMBANG, MAJU
export function getBumDesaPemeringkatanBreakdown(totalBumDes: number, averageAspectScore: number, seedKey: string) {
  const seed = seedKey.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Center points representing average aspect score concentrations for:
  // Perintis, Pemula, Berkembang, Maju
  const centers = [0.45, 0.58, 0.68, 0.78];
  const width = 0.12;
  
  let rawWeights = centers.map((center, i) => {
    let w = Math.exp(-Math.pow((center - averageAspectScore) / width, 2));
    const variation = 0.85 + ((seed * (i + 1) * 23) % 25) / 100;
    return w * variation;
  });
  
  rawWeights = rawWeights.map(w => Math.max(w, 0.01));
  const totalWeight = rawWeights.reduce((a, b) => a + b, 0);
  const normalizedWeights = rawWeights.map(w => w / totalWeight);
  
  let distributed = normalizedWeights.map(w => Math.round(w * totalBumDes));
  let distributedSum = distributed.reduce((a, b) => a + b, 0);
  let diff = totalBumDes - distributedSum;
  
  if (diff !== 0) {
    const maxIdx = distributed.indexOf(Math.max(...distributed));
    distributed[maxIdx] = Math.max(0, distributed[maxIdx] + diff);
  }
  
  return {
    perintis: distributed[0],
    pemula: distributed[1],
    berkembang: distributed[2],
    maju: distributed[3]
  };
}

export default function BUMDesaChart({
  data,
  tahun,
  onSelectProvince,
  provinceList,
}: BUMDesaChartProps) {
  const [isBersama, setIsBersama] = React.useState(false);

  // 1. Calculate the average of aspects to drive dynamic grading distribution
  const aspects = !isBersama
    ? (data.bumDesaPemeringkatan[tahun] || data.bumDesaPemeringkatan["2025"] || {
        kelembagaan: 0.72,
        manajemen: 0.67,
        usaha: 0.69,
        kemitraan: 0.61,
        asetModal: 0.65,
        administrasi: 0.63,
        manfaat: 0.67
      })
    : {
        kelembagaan: data.bumDesaBersama.kelembagaan !== undefined ? data.bumDesaBersama.kelembagaan : 0.65,
        manajemen: data.bumDesaBersama.manajemen !== undefined ? data.bumDesaBersama.manajemen : 0.65,
        usaha: data.bumDesaBersama.usaha !== undefined ? data.bumDesaBersama.usaha : 0.65,
        kemitraan: data.bumDesaBersama.kemitraan !== undefined ? data.bumDesaBersama.kemitraan : 0.65,
        asetModal: data.bumDesaBersama.asetModal !== undefined ? data.bumDesaBersama.asetModal : 0.65,
        administrasi: data.bumDesaBersama.administrasi !== undefined ? data.bumDesaBersama.administrasi : 0.65,
        manfaat: data.bumDesaBersama.manfaat !== undefined ? data.bumDesaBersama.manfaat : 0.65
      };
  
  const totalAspects = aspects.kelembagaan + aspects.manajemen + aspects.usaha + aspects.kemitraan + aspects.asetModal + aspects.administrasi + aspects.manfaat;
  const avgAspectScore = totalAspects / 7;

  // 2. Fetch the total populations
  const activeYearData = !isBersama
    ? (data.bumDesaStatus[tahun] || data.bumDesaStatus["2025"] || {
        aktif: 3600,
        tidakAktif: 1000,
        dalamPengembangan: 400
      })
    : {
        aktif: data.bumDesaBersama.aktif,
        tidakAktif: data.bumDesaBersama.tidakAktif,
        dalamPengembangan: 0,
        perintis: data.bumDesaBersama.perintis !== undefined ? data.bumDesaBersama.perintis : Math.round(data.bumDesaBersama.count * 0.15),
        pemula: data.bumDesaBersama.pemula !== undefined ? data.bumDesaBersama.pemula : Math.round(data.bumDesaBersama.count * 0.25),
        berkembang: data.bumDesaBersama.berkembang !== undefined ? data.bumDesaBersama.berkembang : Math.round(data.bumDesaBersama.count * 0.40),
        maju: data.bumDesaBersama.maju !== undefined ? data.bumDesaBersama.maju : data.bumDesaBersama.count - Math.round(data.bumDesaBersama.count * 0.8)
      };
  
  // 3. Compute the breakdown for the PEMERINGKATAN categories (PERINTIS, PEMULA, BERKEMBANG, MAJU)
  const fallbackTotal = !isBersama 
    ? (activeYearData.aktif + activeYearData.tidakAktif + activeYearData.dalamPengembangan)
    : data.bumDesaBersama.count;

  const seedKey = data.id || "ALL";
  const gradingBreakdown = useMemo(() => {
    return getBumDesaPemeringkatanBreakdown(fallbackTotal, avgAspectScore, seedKey);
  }, [fallbackTotal, avgAspectScore, seedKey]);

  // Use real sheet statistics if populated, otherwise fallback to gaussian weights
  const perintis = activeYearData.perintis !== undefined ? activeYearData.perintis : gradingBreakdown.perintis;
  const pemula = activeYearData.pemula !== undefined ? activeYearData.pemula : gradingBreakdown.pemula;
  const berkembang = activeYearData.berkembang !== undefined ? activeYearData.berkembang : gradingBreakdown.berkembang;
  const maju = activeYearData.maju !== undefined ? activeYearData.maju : gradingBreakdown.maju;

  const totalBumDes = perintis + pemula + berkembang + maju;

  const pctPerintis = totalBumDes > 0 ? (perintis / totalBumDes) * 100 : 0;
  const pctPemula = totalBumDes > 0 ? (pemula / totalBumDes) * 100 : 0;
  const pctBerkembang = totalBumDes > 0 ? (berkembang / totalBumDes) * 100 : 0;
  const pctMaju = totalBumDes > 0 ? (maju / totalBumDes) * 100 : 0;

  // 4. Circle circumference map (r=35 is 219.9)
  const r = 35;
  const circ = 2 * Math.PI * r;

  const lenPerintis = (pctPerintis / 100) * circ;
  const lenPemula = (pctPemula / 100) * circ;
  const lenBerkembang = (pctBerkembang / 100) * circ;
  const lenMaju = (pctMaju / 100) * circ;

  const offsetPerintis = 0;
  const offsetPemula = -lenPerintis;
  const offsetBerkembang = -(lenPerintis + lenPemula);
  const offsetMaju = -(lenPerintis + lenPemula + lenBerkembang);

  // 5. Sorted provinces by BUM Desa density (ALL 38 Provinces shown in scroll view!)
  const sortedProvinces = useMemo(() => {
    return [...provinceList]
      .map(p => ({ 
        id: p.id, 
        name: p.name, 
        count: isBersama ? p.bumDesaBersama.count : p.bumDesaCount 
      }))
      .sort((a, b) => b.count - a.count);
  }, [provinceList, isBersama]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between h-full space-y-4">
      {/* Header Panel */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest leading-none mb-1">
            {isBersama ? "BUM DESA BERSAMA PER PROVINSI" : "BUM DESA PER PROVINSI"}
          </h3>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
            STATUS & PEMERINGKATAN BADAN USAHA ({tahun})
          </p>
        </div>

        {/* Custom Tab Switcher */}
        <div className="flex bg-slate-100 p-0.5 rounded-lg shrink-0 border border-slate-200">
          <button
            onClick={() => setIsBersama(false)}
            className={`px-2.5 py-1 text-[9px] font-extrabold rounded-md transition-all ${
              !isBersama
                ? "bg-white text-blue-700 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            BUM DESA
          </button>
          <button
            onClick={() => setIsBersama(true)}
            className={`px-2.5 py-1 text-[9px] font-extrabold rounded-md transition-all ${
              isBersama
                ? "bg-white text-blue-700 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            BERSAMA
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center my-1.5">
        {/* Left Col (5 cols): Donut Chart displaying the 4 status classifications */}
        <div className="sm:col-span-5 flex flex-col items-center justify-center relative bg-slate-50/60 rounded-xl p-3 border border-slate-100">
          <div className="relative w-32 h-32 flex items-center justify-center select-none">
            <svg width="100%" height="100%" viewBox="0 0 100 100" className="transform -rotate-90">
              <circle
                cx="50"
                cy="50"
                r={r}
                fill="transparent"
                stroke="#f1f5f9"
                strokeWidth="9"
              />

              {/* Segment 1: Perintis (Red) */}
              <circle
                cx="50"
                cy="50"
                r={r}
                fill="transparent"
                stroke="#ef4444" 
                strokeWidth="9"
                strokeDasharray={`${lenPerintis} ${circ}`}
                strokeDashoffset={offsetPerintis}
                className="transition-all duration-500"
              />

              {/* Segment 2: Pemula (Orange) */}
              <circle
                cx="50"
                cy="50"
                r={r}
                fill="transparent"
                stroke="#f59e0b" 
                strokeWidth="9"
                strokeDasharray={`${lenPemula} ${circ}`}
                strokeDashoffset={offsetPemula}
                className="transition-all duration-500"
              />

              {/* Segment 3: Berkembang (Sky Blue) */}
              <circle
                cx="50"
                cy="50"
                r={r}
                fill="transparent"
                stroke="#06b6d4" 
                strokeWidth="9"
                strokeDasharray={`${lenBerkembang} ${circ}`}
                strokeDashoffset={offsetBerkembang}
                className="transition-all duration-500"
              />

              {/* Segment 4: Maju (Emerald Green) */}
              <circle
                cx="50"
                cy="50"
                r={r}
                fill="transparent"
                stroke="#10b981" 
                strokeWidth="9"
                strokeDasharray={`${lenMaju} ${circ}`}
                strokeDashoffset={offsetMaju}
                className="transition-all duration-500"
              />
            </svg>

            {/* Centered Total Text */}
            <div className="absolute text-center leading-none">
              <span className="text-sm font-black text-slate-800 font-mono block">
                {formatIndoNumber(totalBumDes)}
              </span>
              <span className="text-[7.5px] font-bold text-slate-400 uppercase tracking-widest block mt-0.5">
                UNIT UTAMA
              </span>
            </div>
          </div>

          {/* Inline labels */}
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-2 text-[8px] font-bold text-slate-500 w-full text-center">
            <div className="flex items-center gap-1 justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              <span>Perintis: {pctPerintis.toFixed(0)}%</span>
            </div>
            <div className="flex items-center gap-1 justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
              <span>Pemula: {pctPemula.toFixed(0)}%</span>
            </div>
            <div className="flex items-center gap-1 justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0" />
              <span>Kembang: {pctBerkembang.toFixed(0)}%</span>
            </div>
            <div className="flex items-center gap-1 justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span>Maju: {pctMaju.toFixed(0)}%</span>
            </div>
          </div>
        </div>

        {/* Right Col (7 cols): Scrollable Province List & breakdown stats bars */}
        <div className="sm:col-span-7 space-y-3.5">
          {/* Scrollable Province List instead of static 5 */}
          <div>
            <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 leading-none">
              DAFTAR AMBANG BATAS POPULASI BUM DESA PER WILAYAH
            </span>
            {/* Scrollable Container containing all provinces */}
            <div className="space-y-1 max-h-[145px] overflow-y-auto pr-1 scrollbar-thin shadow-inner bg-slate-50 rounded-lg p-1.5 border border-slate-100">
              {sortedProvinces.map((prov, idx) => {
                const isSelected = data.id === prov.id;
                return (
                  <div
                    key={prov.id}
                    onClick={() => onSelectProvince(prov.id)}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-md cursor-pointer text-[11px] transition-all ${
                      isSelected
                        ? "bg-blue-600 text-white font-black shadow-xs"
                        : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-100/80 font-semibold"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span className={`text-[8.5px] font-mono leading-none ${isSelected ? "text-white/80" : "text-slate-400"}`}>
                        {idx + 1}.
                      </span>
                      <span className="truncate">{prov.name}</span>
                    </div>
                    <span className="font-mono text-[10px] pl-2">{formatIndoNumber(prov.count)} unit</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown Status BUM Desa Bars section: customized based on col-ratings */}
      <div className="pt-2 border-t border-slate-100">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 px-1 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-[#0c4a9f]" />
          STATUS PEMERINGKATAN BUM DESA ({data.name})
        </span>

        <div className="grid grid-cols-2 gap-3 p-1">
          {/* PERINTIS Bar */}
          <div className="bg-slate-50 rounded-lg p-2 border border-slate-150-inset">
            <div className="flex justify-between items-baseline text-[9.5px] text-slate-500 font-bold mb-1">
              <span className="text-red-600">PERINTIS</span>
              <span className="font-mono text-slate-800">{formatIndoNumber(perintis)}</span>
            </div>
            <div className="bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-red-500 h-full rounded-full" style={{ width: `${pctPerintis}%` }} />
            </div>
          </div>

          {/* PEMULA Bar */}
          <div className="bg-slate-50 rounded-lg p-2 border border-slate-150-inset">
            <div className="flex justify-between items-baseline text-[9.5px] text-slate-500 font-bold mb-1">
              <span className="text-amber-600">PEMULA</span>
              <span className="font-mono text-slate-800">{formatIndoNumber(pemula)}</span>
            </div>
            <div className="bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${pctPemula}%` }} />
            </div>
          </div>

          {/* BERKEMBANG Bar */}
          <div className="bg-slate-50 rounded-lg p-2 border border-slate-150-inset">
            <div className="flex justify-between items-baseline text-[9.5px] text-slate-500 font-bold mb-1">
              <span className="text-cyan-600">BERKEMBANG</span>
              <span className="font-mono text-slate-800">{formatIndoNumber(berkembang)}</span>
            </div>
            <div className="bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${pctBerkembang}%` }} />
            </div>
          </div>

          {/* MAJU Bar */}
          <div className="bg-slate-50 rounded-lg p-2 border border-slate-150-inset">
            <div className="flex justify-between items-baseline text-[9.5px] text-slate-500 font-bold mb-1">
              <span className="text-emerald-600">MAJU</span>
              <span className="font-mono text-slate-800">{formatIndoNumber(maju)}</span>
            </div>
            <div className="bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${pctMaju}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer controls */}
      <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px]">
        <button
          onClick={() => {
            onSelectProvince("ALL");
          }}
          className="text-blue-600 font-black uppercase tracking-wider flex items-center gap-1 hover:text-blue-800 hover:underline cursor-pointer"
        >
          Reset Filter Wilayah (Nasional) &rarr;
        </button>
        <span className="text-slate-400 font-bold uppercase tracking-wider">
          Rata-rata Penilaian: {formatIndoDecimal(avgAspectScore)}
        </span>
      </div>
    </div>
  );
}
