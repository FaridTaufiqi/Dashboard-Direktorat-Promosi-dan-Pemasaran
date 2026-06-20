import React, { useState } from "react";
import { Search, RotateCcw, Building } from "lucide-react";
import { ProvinceData } from "../types";
import { formatIndoNumber } from "./KPICards";

interface RingkasanWilayahProps {
  selectedProvince: string;
  onSelectProvince: (provId: string) => void;
  provinceList: ProvinceData[];
}

export default function RingkasanWilayah({
  selectedProvince,
  onSelectProvince,
  provinceList,
}: RingkasanWilayahProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProvinces = provinceList.filter(prov =>
    prov.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Find the maximum village count to scale the progress bars proportionally
  const maxDesa = Math.max(...provinceList.map(p => p.desaCount), 10000);

  return (
    <div className="bg-white rounded-[24px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col justify-between h-full">
      {/* Header and Search */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest leading-none mb-1">
              RINGKASAN WILAYAH
            </h3>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
              Kabupaten, Kecamatan & Desa
            </p>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Cari provinsi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 w-full sm:w-40 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-blue-500 bg-slate-50 font-semibold"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

      {/* Scrollable Table Area */}
      <div className="flex-1 overflow-x-auto min-h-[320px] max-h-[460px] overflow-y-auto pr-1 scrollbar-thin mt-2 relative">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] sticky top-0 bg-white/95 backdrop-blur-sm z-10">
              <th className="pb-3 pl-2 font-semibold bg-transparent">No</th>
              <th className="pb-3 font-semibold bg-transparent">Provinsi</th>
              <th className="pb-3 text-center font-semibold bg-transparent">Kab</th>
              <th className="pb-3 text-center font-semibold bg-transparent">Kec</th>
              <th className="pb-3 text-right font-semibold pr-2 bg-transparent">Desa</th>
              <th className="pb-3 text-center font-semibold bg-transparent">Vis</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredProvinces.map((prov, index) => {
              const isSelected = selectedProvince === prov.id;
              const percentOfMax = (prov.desaCount / maxDesa) * 100;
              
              return (
                <tr
                  key={prov.id}
                  onClick={() => onSelectProvince(prov.id)}
                  className={`group cursor-pointer text-xs transition-all duration-300 hover:bg-blue-50/50 ${
                    isSelected ? "bg-blue-50/80 shadow-inner" : ""
                  }`}
                >
                  <td className={`py-3 pl-2 font-mono transition-colors ${isSelected ? "text-blue-600 font-bold" : "text-slate-400 font-medium"}`}>
                    {(index + 1).toString().padStart(2, '0')}
                  </td>
                  <td className={`py-3 transition-colors ${isSelected ? "text-blue-700 font-black" : "text-slate-700 font-semibold group-hover:text-blue-600"}`}>
                    {prov.name}
                  </td>
                  <td className="py-3 text-center text-slate-500 font-medium font-mono group-hover:text-slate-700 transition-colors">
                    {prov.kabupatenCount}
                  </td>
                  <td className="py-3 text-center text-slate-500 font-medium font-mono group-hover:text-slate-700 transition-colors">
                    {prov.kecamatanCount}
                  </td>
                  <td className="py-3 text-right font-bold font-mono pr-2 transition-colors group-hover:text-slate-900">
                    <span className={isSelected ? "text-blue-700" : "text-slate-800"}>
                      {formatIndoNumber(prov.desaCount)}
                    </span>
                  </td>
                  <td className="py-3 pl-4">
                    {/* Interactive Visual Bar */}
                    <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden shadow-inner flex items-center">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${isSelected ? "bg-blue-600" : "bg-blue-400 group-hover:bg-blue-500"}`}
                        style={{ width: `${Math.max(2, percentOfMax)}%` }}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}

            {filteredProvinces.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-12 text-xs text-slate-400 font-medium bg-slate-50/50 rounded-b-[24px]">
                  Data "{searchQuery}" tidak ditemukan pada indeks pencarian
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </div>

      {/* Footer Navigation Link */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
        <button
          onClick={() => {
            onSelectProvince("ALL");
            setSearchQuery("");
          }}
          className="text-[11px] text-blue-600 font-bold flex items-center gap-1 hover:text-blue-850 hover:underline transition-all cursor-pointer"
        >
          Lihat Semua Provinsi &rarr;
        </button>

        {selectedProvince !== "ALL" && (
          <button
            onClick={() => onSelectProvince("ALL")}
            className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 hover:bg-slate-200 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Filter
          </button>
        )}
      </div>
    </div>
  );
}
