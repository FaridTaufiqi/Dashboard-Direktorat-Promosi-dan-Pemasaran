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
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between h-full">
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
        <div className="flex-1 overflow-x-auto min-h-[320px] max-h-[460px] overflow-y-auto pr-1 scrollbar-thin mt-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider sticky top-0 bg-white z-10">
                <th className="pb-2 font-semibold bg-white">No</th>
                <th className="pb-2 font-semibold bg-white">Provinsi</th>
                <th className="pb-2 text-center font-semibold bg-white">Kab</th>
                <th className="pb-2 text-center font-semibold bg-white">Kec</th>
                <th className="pb-2 text-right font-semibold pr-2 bg-white">Desa</th>
                <th className="pb-2 font-semibold w-16 bg-white">Visual</th>
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
                    className={`group cursor-pointer text-xs transition-colors hover:bg-slate-50 ${
                      isSelected ? "bg-blue-50/60 font-bold" : ""
                    }`}
                  >
                    <td className="py-2.5 pl-1 text-slate-400 font-bold font-mono">
                      {index + 1}
                    </td>
                    <td className="py-2.5 font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                      {prov.name}
                    </td>
                    <td className="py-2.5 text-center text-slate-600 font-medium font-mono">
                      {prov.kabupatenCount}
                    </td>
                    <td className="py-2.5 text-center text-slate-600 font-medium font-mono">
                      {prov.kecamatanCount}
                    </td>
                    <td className="py-2.5 text-right text-slate-800 font-bold font-mono pr-2">
                      {formatIndoNumber(prov.desaCount)}
                    </td>
                    <td className="py-2.5">
                      {/* Interactive Visual Bar */}
                      <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentOfMax}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredProvinces.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-xs text-slate-400 font-medium">
                    Provinsi "{searchQuery}" tidak ditemukan
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
