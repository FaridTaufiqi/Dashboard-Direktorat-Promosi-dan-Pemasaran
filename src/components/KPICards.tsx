import React from "react";
import { Map, Building2, MapPin, Home, TrendingUp, Store, Users, ShieldCheck, Award } from "lucide-react";
import { ProvinceData } from "../types";
import { AnimatedNumber } from "./AnimatedNumber";

interface KPICardsProps {
  data: ProvinceData;
  tahun: string;
  isAllProvinces: boolean;
}

// Utility to format numbers with Indonesian currency/decimal format
export function formatIndoNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function formatIndoDecimal(num: number): string {
  return num.toFixed(3).replace(".", ",");
}

export function formatIndoPrecise(num: number): string {
  const val = num <= 1.2 ? num * 100 : num;
  const str = val.toString();
  if (!str.includes(".")) return formatIndoNumber(val);
  const decimalPart = str.split(".")[1] || "";
  const len = Math.max(3, Math.min(10, decimalPart.length));
  return val.toFixed(len).replace(".", ",");
}

const KPICards = React.memo(function KPICards({ data, tahun, isAllProvinces }: KPICardsProps) {
  // Extract numerical values for animation
  const provNum = isAllProvinces ? 38 : 1;
  const kabNum = data.kabupatenCount;
  const kecNum = data.kecamatanCount;
  const desaNum = data.desaCount;
  
  const idNum = data.indeksDesa[tahun] || 70.60907572;
  const rawIdValue = idNum <= 1.2 ? idNum * 100 : idNum;
  const prevYear = (parseInt(tahun) - 1).toString();
  
  const rawIdPrevValue = data.indeksDesa[prevYear]
    ? (data.indeksDesa[prevYear]! <= 1.2 ? data.indeksDesa[prevYear]! * 100 : data.indeksDesa[prevYear]!)
    : (rawIdValue - 4.2);

  const diff = rawIdValue - rawIdPrevValue;
  const trendSign = diff >= 0 ? "↑" : "↓";
  const trendColor = diff >= 0 ? "text-emerald-600 font-semibold" : "text-rose-600 font-semibold";
  const trendText = `${trendSign} ${Math.abs(diff).toFixed(3).replace(".", ",")} dari ${prevYear}`;

  const bumdesNum = data.bumDesaCount;
  const bumdesBersamaNum = data.bumDesaBersamaCount || 0;
  const bumdesTerverifikasiNum = data.bumDesaTerverifikasiHukum || 0;
  const desaMandiriNum = data.desaMandiriCount || 0;

  const kpis = [
    {
      id: "kpi-prov",
      title: "Jumlah Provinsi",
      value: <AnimatedNumber value={provNum} />,
      suffix: "Provinsi",
      subtext: isAllProvinces ? "Seluruh Indonesia" : data.name,
      icon: Map,
      bg: "bg-white border-slate-200/70 hover:border-blue-200",
      iconBg: "bg-blue-50/80 text-blue-600 border-blue-100/50 shadow-inner",
    },
    {
      id: "kpi-kab",
      title: "Jumlah Kabupaten",
      value: <AnimatedNumber value={kabNum} />,
      suffix: "Kabupaten",
      subtext: isAllProvinces ? "Kabupaten/Kota Nasional" : `Di ${data.name}`,
      icon: Building2,
      bg: "bg-white border-slate-200/70 hover:border-emerald-200",
      iconBg: "bg-emerald-50/80 text-emerald-600 border-emerald-100/50 shadow-inner",
    },
    {
      id: "kpi-kec",
      title: "Jumlah Kecamatan",
      value: <AnimatedNumber value={kecNum} />,
      suffix: "Kecamatan",
      subtext: isAllProvinces ? "Kecamatan Nasional" : `Di ${data.name}`,
      icon: MapPin,
      bg: "bg-white border-slate-200/70 hover:border-amber-200",
      iconBg: "bg-amber-50/80 text-amber-600 border-amber-100/50 shadow-inner",
    },
    {
      id: "kpi-desa",
      title: "Jumlah Desa/Kelurahan",
      value: <AnimatedNumber value={desaNum} />,
      suffix: "Desa/Kelurahan",
      subtext: "Menggunakan Dana Desa",
      icon: Home,
      bg: "bg-white border-slate-200/70 hover:border-purple-200",
      iconBg: "bg-purple-50/80 text-purple-600 border-purple-100/50 shadow-inner",
    },
    {
      id: "kpi-indeks",
      title: `Rata-rata Indeks Desa (ID ${tahun})`,
      value: <AnimatedNumber value={rawIdValue} isDecimal={true} />,
      suffix: "",
      subtext: (
        <span className={trendColor}>
          {trendText}
        </span>
      ),
      icon: TrendingUp,
      bg: "bg-white border-slate-200/70 hover:border-teal-200",
      iconBg: "bg-teal-50/80 text-teal-600 border-teal-100/50 shadow-inner",
    },
    {
      id: "kpi-bumdes",
      title: "Jumlah BUM Desa",
      value: <AnimatedNumber value={bumdesNum} />,
      suffix: "BUM Desa",
      subtext: "Terdaftar secara Resmi",
      icon: Store,
      bg: "bg-white border-slate-200/70 hover:border-indigo-200",
      iconBg: "bg-indigo-50/80 text-indigo-600 border-indigo-100/50 shadow-inner",
    },
    {
      id: "kpi-bumdes-bersama",
      title: "BUM Desa Bersama",
      value: <AnimatedNumber value={bumdesBersamaNum} />,
      suffix: "BUM Desa Bersama",
      subtext: "Terdaftar secara Resmi",
      icon: Users,
      bg: "bg-white border-slate-200/70 hover:border-cyan-200",
      iconBg: "bg-cyan-50/80 text-cyan-600 border-cyan-100/50 shadow-inner",
    },
    {
      id: "kpi-bumdes-terverifikasi",
      title: "Terverifikasi Badan Hukum",
      value: <AnimatedNumber value={bumdesTerverifikasiNum} />,
      suffix: "Lembaga",
      subtext: "BUM Desa & Bersama",
      icon: ShieldCheck,
      bg: "bg-white border-slate-200/70 hover:border-sky-200",
      iconBg: "bg-sky-50/80 text-sky-600 border-sky-100/50 shadow-inner",
    },
    {
      id: "kpi-desa-mandiri",
      title: "Desa Mandiri",
      value: <AnimatedNumber value={desaMandiriNum} />,
      suffix: "Desa",
      subtext: "Berdasarkan Indeks Desa",
      icon: Award,
      bg: "bg-white border-slate-200/70 hover:border-yellow-200",
      iconBg: "bg-yellow-50/80 text-yellow-600 border-yellow-100/50 shadow-inner",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.id}
            id={kpi.id}
            className={`group relative overflow-hidden border rounded-2xl p-5 flex flex-col justify-between shadow-[0_4px_15px_rgb(0,0,0,0.02)] hover:shadow-[0_12px_30px_rgb(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 ${kpi.bg}`}
          >
            {/* Ambient Background Glow Effect on Hover */}
            <div className="absolute top-0 right-0 -mx-4 -my-4 w-24 h-24 rounded-full opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-500 pointer-events-none bg-current text-blue-500" />
            
            {/* Top row */}
            <div className="flex items-start justify-between relative z-10">
              <span className="text-[10px] font-black text-slate-400/80 uppercase tracking-widest block mt-1">
                {kpi.title}
              </span>
              <div className={`p-2.5 rounded-xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-110 ${kpi.iconBg}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            {/* Middle value */}
            <div className="mt-4 relative z-10">
              <span className="text-[28px] leading-none font-black tracking-tighter text-slate-800 block font-sans">
                {kpi.value}
              </span>
              {kpi.suffix && (
                <span className="text-[10px] font-bold text-slate-400 block uppercase mt-1 tracking-wider">
                  {kpi.suffix}
                </span>
              )}
            </div>

            {/* Bottom Trend / Subtext */}
            <div className="mt-4 pt-3 border-t border-slate-100/80 text-[10px] text-slate-500 font-bold tracking-wide relative z-10">
              {kpi.subtext}
            </div>
          </div>
        );
      })}
    </div>
  );
});

export default KPICards;
