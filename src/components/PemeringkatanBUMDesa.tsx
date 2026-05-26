import React, { useState } from "react";
import { Trophy, Star, ShieldCheck } from "lucide-react";
import { ProvinceData } from "../types";
import { formatIndoPrecise } from "./KPICards";

interface PemeringkatanBUMDesaProps {
  data: ProvinceData;
  tahun: string;
}

export default function PemeringkatanBUMDesa({ data, tahun }: PemeringkatanBUMDesaProps) {
  const [isBersama, setIsBersama] = useState(false);

  // Extract aspects for active year reflecting selection
  const aspects = !isBersama 
    ? (data.bumDesaPemeringkatan[tahun] || data.bumDesaPemeringkatan["2025"] || {
        kelembagaan: 72.1,
        manajemen: 67.1,
        usaha: 68.8,
        kemitraan: 62.0,
        asetModal: 65.8,
        administrasi: 64.2,
        manfaat: 67.4,
      })
    : {
        kelembagaan: data.bumDesaBersama.kelembagaan ?? 64.8,
        manajemen: data.bumDesaBersama.manajemen ?? 64.8,
        usaha: data.bumDesaBersama.usaha ?? 64.8,
        kemitraan: data.bumDesaBersama.kemitraan ?? 64.8,
        asetModal: data.bumDesaBersama.asetModal ?? 64.8,
        administrasi: data.bumDesaBersama.administrasi ?? 64.8,
        manfaat: data.bumDesaBersama.manfaat ?? 64.8,
      };

  const list = [
    { key: "kelembagaan", label: isBersama ? "Aspek Kelembagaan Bersama" : "Aspek Kelembagaan", val: aspects.kelembagaan, color: "bg-blue-600" },
    { key: "manajemen", label: isBersama ? "Aspek Manajemen Bersama" : "Aspek Manajemen", val: aspects.manajemen, color: "bg-blue-600" },
    { key: "usaha", label: isBersama ? "Aspek Usaha Bersama" : "Aspek Usaha", val: aspects.usaha, color: "bg-blue-600" },
    { key: "kemitraan", label: isBersama ? "Aspek Kemitraan Bersama" : "Aspek Kemitraan", val: aspects.kemitraan, color: "bg-blue-600" },
    { key: "asetModal", label: isBersama ? "Aspek Aset Modal Bersama" : "Aspek Aset Modal", val: aspects.asetModal, color: "bg-blue-600" },
    { key: "administrasi", label: isBersama ? "Aspek Administrasi Bersama" : "Aspek Administrasi", val: aspects.administrasi, color: "bg-blue-600" },
    { key: "manfaat", label: isBersama ? "Aspek Manfaat Bersama" : "Aspek Manfaat", val: aspects.manfaat, color: "bg-blue-600" },
  ];

  // Calculate Average score
  const totalAspects = list.reduce((sum, item) => sum + item.val, 0);
  
  // Use exact Column Z / Kolom AT average if available
  const averagePoint = !isBersama
    ? ((aspects as any).nilaiPemeringkatan !== undefined 
        ? (aspects as any).nilaiPemeringkatan 
        : Number((totalAspects / list.length).toFixed(3)))
    : (data.bumDesaBersama.pemeringkatanNilai ?? Number((totalAspects / list.length).toFixed(3)));

  // Determine Grade
  let grade = "Baik";
  let gradeColor = "text-emerald-700 bg-emerald-50 border-emerald-100";
  let iconColor = "text-emerald-500";
  let badgeText = isBersama ? "BUM Desa Bersama Kelas B" : "BUM Desa Kelas B";

  if (averagePoint >= 75) {
    grade = "Sangat Baik";
    gradeColor = "text-blue-700 bg-blue-50 border-blue-100";
    iconColor = "text-blue-500 animate-bounce";
    badgeText = isBersama ? "BUM Desa Bersama Unggul (Kelas A)" : "BUM Desa Unggul (Kelas A)";
  } else if (averagePoint >= 60) {
    grade = "Baik";
    gradeColor = "text-[#059669] bg-emerald-50 border-emerald-100";
    iconColor = "text-amber-500";
    badgeText = isBersama ? "BUM Desa Bersama Sehat (Kelas B)" : "BUM Desa Sehat (Kelas B)";
  } else if (averagePoint >= 50) {
    grade = "Cukup";
    gradeColor = "text-amber-700 bg-amber-50 border-amber-100";
    iconColor = "text-amber-600";
    badgeText = isBersama ? "BUM Desa Bersama Rintisan (Kelas C)" : "BUM Desa Rintisan (Kelas C)";
  } else {
    grade = "Kurang";
    gradeColor = "text-rose-700 bg-rose-50 border-rose-100";
    iconColor = "text-rose-500";
    badgeText = isBersama ? "Perlu Pengawasan Bersama" : "Perlu Pengawasan (Kelas D)";
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between h-full space-y-4">
      {/* Title with TOGGLE */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest leading-none mb-1">
            PEMERINGKATAN BADAN USAHA
          </h3>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
            Skoring 7 pilar tata kelola {isBersama ? "BUM Desa Bersama" : "BUM Desa"}
          </p>
        </div>
        <div className="flex bg-slate-100 p-0.5 rounded-lg shrink-0 border border-slate-200">
          <button
            onClick={() => setIsBersama(false)}
            className={`px-3 py-1 text-[10px] font-extrabold rounded-md transition-all ${
              !isBersama
                ? "bg-white text-blue-700 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            BUM DESA
          </button>
          <button
            onClick={() => setIsBersama(true)}
            className={`px-3 py-1 text-[10px] font-extrabold rounded-md transition-all ${
              isBersama
                ? "bg-white text-blue-700 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            BERSAMA
          </button>
        </div>
      </div>

      {/* Aspects Bar Charts - Full Width for ample breathing room */}
      <div className="space-y-2.5">
        {list.map((item) => {
          const pct = Math.min(item.val, 100);
          return (
            <div key={item.key} className="w-full">
              <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold mb-1">
                <span className="truncate pr-2">{item.label}</span>
                <span className="font-mono text-slate-700 shrink-0">{formatIndoPrecise(item.val)}</span>
              </div>
              {/* Visual score bar */}
              <div className="bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Sleek Horizontal Summary Banner */}
      <div className="bg-slate-50 border border-slate-150 rounded-2xl p-3.5 flex items-center justify-between gap-4 w-full select-none text-left">
        <div className="flex items-center gap-3 min-w-0">
          {/* Trophy Graphic Circle */}
          <div className="w-12 h-12 rounded-full bg-amber-100/60 border border-amber-200 flex items-center justify-center relative shrink-0">
            <Trophy className={`w-6 h-6 ${iconColor}`} />
            <Star className="w-2.5 h-2.5 text-yellow-500 absolute -top-0.5 -right-0.5 fill-yellow-500" />
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 absolute -bottom-0.5 -left-0.5" />
          </div>
          <div className="min-w-0">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block leading-none mb-1.5">
              PRESTASI TATA KELOLA
            </span>
            <span className="text-[11px] text-slate-600 font-bold block leading-none truncate">
              {badgeText}
            </span>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block leading-none mb-1">
            SKOR AKHIR
          </span>
          <span className="text-xl font-mono font-black text-blue-700 block leading-none mb-1">
            {formatIndoPrecise(averagePoint)}
          </span>
          <div className={`py-0.5 px-2.5 rounded-full border text-[9px] font-black inline-block uppercase leading-none shadow-2xs ${gradeColor}`}>
            {grade}
          </div>
        </div>
      </div>
    </div>
  );
}
