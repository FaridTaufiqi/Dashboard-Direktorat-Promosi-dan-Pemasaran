import React from "react";
import { Trophy, Star, ShieldCheck } from "lucide-react";
import { ProvinceData } from "../types";
import { formatIndoDecimal } from "./KPICards";

interface PemeringkatanBUMDesaProps {
  data: ProvinceData;
  tahun: string;
}

export default function PemeringkatanBUMDesa({ data, tahun }: PemeringkatanBUMDesaProps) {
  // Extract aspects for active year
  const aspects = data.bumDesaPemeringkatan[tahun] || data.bumDesaPemeringkatan["2025"] || {
    kelembagaan: 0.721,
    manajemen: 0.671,
    usaha: 0.688,
    kemitraan: 0.620,
    asetModal: 0.658,
    administrasi: 0.642,
    manfaat: 0.674,
  };

  const list = [
    { key: "kelembagaan", label: "Aspek Kelembagaan", val: aspects.kelembagaan, color: "bg-blue-600" },
    { key: "manajemen", label: "Aspek Manajemen", val: aspects.manajemen, color: "bg-blue-600" },
    { key: "usaha", label: "Aspek Usaha", val: aspects.usaha, color: "bg-blue-600" },
    { key: "kemitraan", label: "Aspek Kemitraan", val: aspects.kemitraan, color: "bg-blue-600" },
    { key: "asetModal", label: "Aspek Aset Modal", val: aspects.asetModal, color: "bg-blue-600" },
    { key: "administrasi", label: "Aspek Administrasi", val: aspects.administrasi, color: "bg-blue-600" },
    { key: "manfaat", label: "Aspek Manfaat", val: aspects.manfaat, color: "bg-blue-600" },
  ];

  // Calculate Average score
  const totalAspects = list.reduce((sum, item) => sum + item.val, 0);
  const averagePoint = Number((totalAspects / list.length).toFixed(3));

  // Determine Grade
  // In Indonesia: Sangat Baik (A), Baik (B), Cukup (C), Kurang (D)
  let grade = "Baik";
  let gradeColor = "text-emerald-700 bg-emerald-50 border-emerald-100";
  let iconColor = "text-emerald-500";
  let badgeText = "BUM Desa Kelas B";

  if (averagePoint >= 0.75) {
    grade = "Sangat Baik";
    gradeColor = "text-blue-700 bg-blue-50 border-blue-100";
    iconColor = "text-blue-500 animate-bounce";
    badgeText = "BUM Desa Unggul (Kelas A)";
  } else if (averagePoint >= 0.60) {
    grade = "Baik";
    gradeColor = "text-[#059669] bg-emerald-50 border-emerald-100";
    iconColor = "text-amber-500";
    badgeText = "BUM Desa Sehat (Kelas B)";
  } else if (averagePoint >= 0.50) {
    grade = "Cukup";
    gradeColor = "text-amber-700 bg-amber-50 border-amber-100";
    iconColor = "text-amber-600";
    badgeText = "BUM Desa Rintisan (Kelas C)";
  } else {
    grade = "Kurang";
    gradeColor = "text-rose-700 bg-rose-50 border-rose-100";
    iconColor = "text-rose-500";
    badgeText = "Perlu Pengawasan (Kelas D)";
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between h-full">
      {/* Title */}
      <div>
        <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest leading-none mb-1">
          PEMERINGKATAN BUM DESA
        </h3>
        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
          Skoring 7 aspek kapabilitas tata kelola
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center my-4">
        {/* Left Col: Aspects Bar Charts */}
        <div className="sm:col-span-8 space-y-1.5">
          {list.map((item) => {
            const pct = item.val * 100;
            return (
              <div key={item.key}>
                <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold mb-0.5">
                  <span className="truncate">{item.label}</span>
                  <span className="font-mono text-slate-705">{formatIndoDecimal(item.val)}</span>
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

        {/* Right Col: Rating Trophy Panel */}
        <div className="sm:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-100 rounded-2xl h-full select-none text-center">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block leading-none mb-1.5">
            Nilai Pemeringkatan
          </span>
          <span className="text-2xl font-extrabold text-blue-700 font-mono leading-none mb-4">
            {formatIndoDecimal(averagePoint)}
          </span>

          {/* Trophy Graphic Circle */}
          <div className="w-16 h-16 rounded-full bg-amber-100/60 border-2 border-amber-300 flex items-center justify-center p-1 relative shadow-xs mb-3.5">
            <Trophy className={`w-8 h-8 ${iconColor}`} />
            
            {/* Double star overlays */}
            <Star className="w-3.5 h-3.5 text-yellow-500 absolute -top-1 -right-1 fill-yellow-500" />
            <ShieldCheck className="w-4 h-4 text-emerald-500 absolute -bottom-1 -left-1" />
          </div>

          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
            PEMERINGKATAN BUM DESA
          </span>
          <div className={`py-1 px-3.5 rounded-full border text-[11px] font-extrabold shadow-2xs ${gradeColor} tracking-wider uppercase`}>
            {grade}
          </div>
          <span className="text-[9px] text-slate-400 font-bold block mt-1.5 leading-none">
            {badgeText}
          </span>
        </div>
      </div>
    </div>
  );
}
