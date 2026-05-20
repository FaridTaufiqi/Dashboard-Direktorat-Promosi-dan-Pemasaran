import React from "react";
import { Map, Building2, MapPin, Home, TrendingUp, Store } from "lucide-react";
import { ProvinceData } from "../types";

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

export default function KPICards({ data, tahun, isAllProvinces }: KPICardsProps) {
  // Extract values
  const provValue = isAllProvinces ? "38" : "1";
  const kabValue = formatIndoNumber(data.kabupatenCount);
  const kecValue = formatIndoNumber(data.kecamatanCount);
  const desaValue = formatIndoNumber(data.desaCount);
  
  const idValue = data.indeksDesa[tahun] || 0.678;
  const prevYear = (parseInt(tahun) - 1).toString();
  const idPrevValue = data.indeksDesa[prevYear] || (idValue - 0.042);
  const diff = idValue - idPrevValue;
  const trendSign = diff >= 0 ? "↑" : "↓";
  const trendColor = diff >= 0 ? "text-emerald-600 font-semibold" : "text-rose-600 font-semibold";
  const trendText = `${trendSign} ${Math.abs(diff).toFixed(3).replace(".", ",")} dari ${prevYear}`;

  const bumdesValue = formatIndoNumber(data.bumDesaCount);

  const kpis = [
    {
      id: "kpi-prov",
      title: "Jumlah Provinsi",
      value: provValue,
      suffix: "Provinsi",
      subtext: isAllProvinces ? "Seluruh Indonesia" : data.name,
      icon: Map,
      bg: "bg-white border-slate-200 hover:border-slate-300",
      iconBg: "bg-blue-50 text-blue-600 border border-blue-100",
    },
    {
      id: "kpi-kab",
      title: "Jumlah Kabupaten",
      value: kabValue,
      suffix: "Kabupaten",
      subtext: isAllProvinces ? "Kabupaten/Kota Nasional" : `Di ${data.name}`,
      icon: Building2,
      bg: "bg-white border-slate-200 hover:border-slate-300",
      iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-110",
    },
    {
      id: "kpi-kec",
      title: "Jumlah Kecamatan",
      value: kecValue,
      suffix: "Kecamatan",
      subtext: isAllProvinces ? "Kecamatan Nasional" : `Di ${data.name}`,
      icon: MapPin,
      bg: "bg-white border-slate-200 hover:border-slate-300",
      iconBg: "bg-amber-50 text-amber-600 border border-amber-100",
    },
    {
      id: "kpi-desa",
      title: "Jumlah Desa/Kelurahan",
      value: desaValue,
      suffix: "Desa/Kelurahan",
      subtext: "Menggunakan Dana Desa",
      icon: Home,
      bg: "bg-white border-slate-200 hover:border-slate-300",
      iconBg: "bg-purple-50 text-purple-600 border border-purple-100",
    },
    {
      id: "kpi-indeks",
      title: `Rata-rata Indeks Desa (ID ${tahun})`,
      value: formatIndoDecimal(idValue),
      suffix: "",
      subtext: (
        <span className={trendColor}>
          {trendText}
        </span>
      ),
      icon: TrendingUp,
      bg: "bg-white border-slate-200 hover:border-slate-300",
      iconBg: "bg-teal-50 text-teal-600 border border-teal-100",
    },
    {
      id: "kpi-bumdes",
      title: "Jumlah BUM Desa",
      value: bumdesValue,
      suffix: "BUM Desa",
      subtext: "Terdaftar secara Resmi",
      icon: Store,
      bg: "bg-white border-slate-200 hover:border-slate-300",
      iconBg: "bg-indigo-50 text-indigo-600 border border-indigo-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.id}
            id={kpi.id}
            className={`border rounded-2xl p-4 flex flex-col justify-between shadow-xs transition-all hover:shadow-xs hover:translate-y-[-1px] ${kpi.bg}`}
          >
            {/* Top row */}
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-1">
                {kpi.title}
              </span>
              <div className={`p-2 rounded-xl flex items-center justify-center ${kpi.iconBg}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            {/* Middle value */}
            <div className="mt-3">
              <span className="text-2xl font-black tracking-tight text-slate-800 block font-mono">
                {kpi.value}
              </span>
              {kpi.suffix && (
                <span className="text-[10px] font-bold text-slate-400 block uppercase mt-0.5">
                  {kpi.suffix}
                </span>
              )}
            </div>

            {/* Bottom Trend / Subtext */}
            <div className="mt-4 pt-2.5 border-t border-slate-100 text-[10px] text-slate-450 font-bold">
              {kpi.subtext}
            </div>
          </div>
        );
      })}
    </div>
  );
}
