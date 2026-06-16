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

  const totalBumDesPemeringkatan = perintis + pemula + berkembang + maju;

  const pctPerintis = totalBumDesPemeringkatan > 0 ? (perintis / totalBumDesPemeringkatan) * 100 : 0;
  const pctPemula = totalBumDesPemeringkatan > 0 ? (pemula / totalBumDesPemeringkatan) * 100 : 0;
  const pctBerkembang = totalBumDesPemeringkatan > 0 ? (berkembang / totalBumDesPemeringkatan) * 100 : 0;
  const pctMaju = totalBumDesPemeringkatan > 0 ? (maju / totalBumDesPemeringkatan) * 100 : 0;

  const statusData = !isBersama ? data.badanHukumStatus?.bumDesa : data.badanHukumStatus?.bumDesaBersama;
  const totalBumDes = statusData?.total || 0;

  const pct = {
    pengajuanNama: totalBumDes > 0 ? ((statusData?.pengajuanNama || 0) / totalBumDes) * 100 : 0,
    perbaikanNama: totalBumDes > 0 ? ((statusData?.perbaikanNama || 0) / totalBumDes) * 100 : 0,
    namaTerverifikasi: totalBumDes > 0 ? ((statusData?.namaTerverifikasi || 0) / totalBumDes) * 100 : 0,
    prosesPendaftaran: totalBumDes > 0 ? ((statusData?.prosesPendaftaran || 0) / totalBumDes) * 100 : 0,
    perbaikanDokumen: totalBumDes > 0 ? ((statusData?.perbaikanDokumen || 0) / totalBumDes) * 100 : 0,
    terverifikasiDokumen: totalBumDes > 0 ? ((statusData?.terverifikasiDokumen || 0) / totalBumDes) * 100 : 0,
    kosong: totalBumDes > 0 ? ((statusData?.kosong || 0) / totalBumDes) * 100 : 0,
  };

  const r = 35;
  const circ = 2 * Math.PI * r;

  const len = {
    pengajuanNama: (pct.pengajuanNama / 100) * circ,
    perbaikanNama: (pct.perbaikanNama / 100) * circ,
    namaTerverifikasi: (pct.namaTerverifikasi / 100) * circ,
    prosesPendaftaran: (pct.prosesPendaftaran / 100) * circ,
    perbaikanDokumen: (pct.perbaikanDokumen / 100) * circ,
    terverifikasiDokumen: (pct.terverifikasiDokumen / 100) * circ,
    kosong: (pct.kosong / 100) * circ,
  };

  let cumulativeOffset = 0;
  const getOffset = (segmentLen) => {
    const o = -cumulativeOffset;
    cumulativeOffset += segmentLen;
    return o;
  };

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
    <div className="bg-white rounded-[24px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col justify-between h-full space-y-4">
      {/* Header Panel */}
      <div className="flex flex-wrap items-center justify-between gap-3">
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
            BUM DESA BERSAMA
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-5 items-stretch my-1.5 flex-1">
        {/* Top Col: Donut Chart displaying the 4 status classifications */}
        <div className="flex flex-col items-center justify-center relative bg-slate-50/60 rounded-xl p-4 border border-slate-100">
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

              {/* Segment 1: Pengajuan Nama */}
              <circle
                cx="50"
                cy="50"
                r={r}
                fill="transparent"
                stroke="#94a3b8" 
                strokeWidth="9"
                strokeDasharray={`${len.pengajuanNama} ${circ}`}
                strokeDashoffset={getOffset(len.pengajuanNama)}
                className="transition-all duration-500"
              />

              {/* Segment 2: Perbaikan Nama */}
              <circle
                cx="50"
                cy="50"
                r={r}
                fill="transparent"
                stroke="#f87171" 
                strokeWidth="9"
                strokeDasharray={`${len.perbaikanNama} ${circ}`}
                strokeDashoffset={getOffset(len.perbaikanNama)}
                className="transition-all duration-500"
              />

              {/* Segment 3: Nama Terverifikasi */}
              <circle
                cx="50"
                cy="50"
                r={r}
                fill="transparent"
                stroke="#fbbf24" 
                strokeWidth="9"
                strokeDasharray={`${len.namaTerverifikasi} ${circ}`}
                strokeDashoffset={getOffset(len.namaTerverifikasi)}
                className="transition-all duration-500"
              />

              {/* Segment 4: Proses Pendaftaran */}
              <circle
                cx="50"
                cy="50"
                r={r}
                fill="transparent"
                stroke="#38bdf8" 
                strokeWidth="9"
                strokeDasharray={`${len.prosesPendaftaran} ${circ}`}
                strokeDashoffset={getOffset(len.prosesPendaftaran)}
                className="transition-all duration-500"
              />

              {/* Segment 5: Perbaikan Dokumen */}
              <circle
                cx="50"
                cy="50"
                r={r}
                fill="transparent"
                stroke="#fb923c" 
                strokeWidth="9"
                strokeDasharray={`${len.perbaikanDokumen} ${circ}`}
                strokeDashoffset={getOffset(len.perbaikanDokumen)}
                className="transition-all duration-500"
              />

              {/* Segment 6: Terverifikasi Dokumen */}
              <circle
                cx="50"
                cy="50"
                r={r}
                fill="transparent"
                stroke="#10b981" 
                strokeWidth="9"
                strokeDasharray={`${len.terverifikasiDokumen} ${circ}`}
                strokeDashoffset={getOffset(len.terverifikasiDokumen)}
                className="transition-all duration-500"
              />

              {/* Segment 7: Kosong */}
              <circle
                cx="50"
                cy="50"
                r={r}
                fill="transparent"
                stroke="#e2e8f0" 
                strokeWidth="9"
                strokeDasharray={`${len.kosong} ${circ}`}
                strokeDashoffset={getOffset(len.kosong)}
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
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-2 text-[8px] font-bold text-slate-500 w-full text-left ml-2">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
              <span className="truncate">Pengajuan N: {pct.pengajuanNama.toFixed(0)}%</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
              <span className="truncate">Perb. Nama: {pct.perbaikanNama.toFixed(0)}%</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
              <span className="truncate">Nama Terv: {pct.namaTerverifikasi.toFixed(0)}%</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
              <span className="truncate">Proses Pend: {pct.prosesPendaftaran.toFixed(0)}%</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
              <span className="truncate">Perb. Dok: {pct.perbaikanDokumen.toFixed(0)}%</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="truncate">Terv. Dok: {pct.terverifikasiDokumen.toFixed(0)}%</span>
            </div>
            <div className="col-span-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-200 shrink-0" />
              <span className="truncate">Tabel Kosong: {pct.kosong.toFixed(0)}%</span>
            </div>
          </div>
        </div>

        {/* Bottom Col: Scrollable Province List & breakdown stats bars */}
        <div className="flex-1 flex flex-col gap-4 min-h-0">
          <div className="flex-1 flex flex-col min-h-0">
            <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 leading-none">
              DAFTAR AMBANG BATAS POPULASI BUM DESA PER WILAYAH
            </span>
            {/* Scrollable Container containing all provinces */}
            <div className="flex-1 overflow-y-auto space-y-1 pr-1 scrollbar-thin shadow-inner bg-slate-50 rounded-lg p-1.5 border border-slate-100 min-h-[145px]">
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

      {/* Breakdown Status Badan Hukum BUM Desa */}
      <div className="pt-2 border-t border-slate-100">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 px-1 flex items-center gap-1">
          <ShieldAlert className="w-3.5 h-3.5 text-[#0c4a9f]" />
          STATUS BADAN HUKUM {isBersama ? "BUM DESA BERSAMA" : "BUM DESA"} ({data.name})
        </span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-1">
          <div className="bg-slate-50 rounded-lg p-2 border border-slate-150-inset">
             <div className="flex justify-between items-baseline text-[8.5px] text-slate-500 font-bold mb-1"><span className="text-slate-600">PENGAJUAN NAMA</span><span className="font-mono text-[9px] text-slate-800">{formatIndoNumber(statusData?.pengajuanNama || 0)}</span></div>
             <div className="bg-slate-200 h-1 rounded-full overflow-hidden"><div className="bg-slate-400 h-full rounded-full" style={{ width: `${pct.pengajuanNama}%` }} /></div>
          </div>
          <div className="bg-slate-50 rounded-lg p-2 border border-slate-150-inset">
             <div className="flex justify-between items-baseline text-[8.5px] text-slate-500 font-bold mb-1"><span className="text-red-500 truncate mr-1">PERB. NAMA</span><span className="font-mono text-[9px] text-slate-800">{formatIndoNumber(statusData?.perbaikanNama || 0)}</span></div>
             <div className="bg-slate-200 h-1 rounded-full overflow-hidden"><div className="bg-red-400 h-full rounded-full" style={{ width: `${pct.perbaikanNama}%` }} /></div>
          </div>
          <div className="bg-slate-50 rounded-lg p-2 border border-slate-150-inset">
             <div className="flex justify-between items-baseline text-[8.5px] text-slate-500 font-bold mb-1"><span className="text-amber-600 truncate mr-1">NAMA TERV.</span><span className="font-mono text-[9px] text-slate-800">{formatIndoNumber(statusData?.namaTerverifikasi || 0)}</span></div>
             <div className="bg-slate-200 h-1 rounded-full overflow-hidden"><div className="bg-amber-400 h-full rounded-full" style={{ width: `${pct.namaTerverifikasi}%` }} /></div>
          </div>
          <div className="bg-slate-50 rounded-lg p-2 border border-slate-150-inset">
             <div className="flex justify-between items-baseline text-[8.5px] text-slate-500 font-bold mb-1"><span className="text-sky-600 truncate mr-1">PROS. PENDAF.</span><span className="font-mono text-[9px] text-slate-800">{formatIndoNumber(statusData?.prosesPendaftaran || 0)}</span></div>
             <div className="bg-slate-200 h-1 rounded-full overflow-hidden"><div className="bg-sky-400 h-full rounded-full" style={{ width: `${pct.prosesPendaftaran}%` }} /></div>
          </div>
          <div className="bg-slate-50 rounded-lg p-2 border border-slate-150-inset">
             <div className="flex justify-between items-baseline text-[8.5px] text-slate-500 font-bold mb-1"><span className="text-orange-600 truncate mr-1">PERB. DOK.</span><span className="font-mono text-[9px] text-slate-800">{formatIndoNumber(statusData?.perbaikanDokumen || 0)}</span></div>
             <div className="bg-slate-200 h-1 rounded-full overflow-hidden"><div className="bg-orange-400 h-full rounded-full" style={{ width: `${pct.perbaikanDokumen}%` }} /></div>
          </div>
          <div className="bg-slate-50 rounded-lg p-2 border border-slate-150-inset">
             <div className="flex justify-between items-baseline text-[8.5px] text-slate-500 font-bold mb-1"><span className="text-emerald-600 truncate mr-1">TERV. DOK.</span><span className="font-mono text-[9px] text-slate-800">{formatIndoNumber(statusData?.terverifikasiDokumen || 0)}</span></div>
             <div className="bg-slate-200 h-1 rounded-full overflow-hidden"><div className="bg-emerald-500 h-full rounded-full" style={{ width: `${pct.terverifikasiDokumen}%` }} /></div>
          </div>
          <div className="col-span-2 bg-slate-50 rounded-lg p-2 border border-slate-150-inset">
             <div className="flex justify-between items-baseline text-[8.5px] text-slate-500 font-bold mb-1"><span className="text-slate-600 truncate mr-1">Tabel Kosong / Tidak Diketahui</span><span className="font-mono text-[9px] text-slate-800">{formatIndoNumber(statusData?.kosong || 0)}</span></div>
             <div className="bg-slate-200 h-1 rounded-full overflow-hidden"><div className="bg-slate-300 h-full rounded-full" style={{ width: `${pct.kosong}%` }} /></div>
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
