import React from "react";
import { formatIndoPrecise, formatIndoNumber } from "../KPICards";
import { provinceDataList } from "../../data/mockData";
import { DashboardFilters } from "../../types";

interface TabBumDesaBersamaProps {
  filters: DashboardFilters;
  activeData: any;
  handleSelectProvince: (provId: string) => void;
}

export default function TabBumDesaBersama({
  filters,
  activeData,
  handleSelectProvince,
}: TabBumDesaBersamaProps) {
  return (
    <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-6">
      <div>
        <h2 className="text-lg font-black text-[#0c4a9f] uppercase tracking-tight leading-none mb-1">
          KONSORSIUM BUM DESA BERSAMA (BUMDesma)
        </h2>
        <p className="text-xs text-slate-400 font-bold uppercase">
          Kerja sama skala kawasan kecamatan untuk eskalasi kapasitas pasar
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-6">
          {/* Detailed summary widget */}
          <div className="bg-[#0b3c8f]/10 border border-blue-200 rounded-2xl p-5 flex flex-col justify-between h-full">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">
                Sistem Kepemilikan Konsorsium
              </span>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                BUM Desa Bersama (BUMDesma) didirikan by dua desa or lebih berdasarkan kesepakatan
                kawasan dalam satu kecamatan. Tujuannya adalah mengelola potensi ekonomi padat modal
                yang tidak efisien dikelola secara individual by satu desa saja, seperti jaringan
                air bersih antardesa, pasar pariwisata terpadu, or pengelolaan pabrik produksi
                kelapa sawit skala menengah.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-white/80 backdrop-blur-xs rounded-xl p-4 border border-blue-100/30">
              <div>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase">
                  Unit Konsorsium
                </span>
                <span className="text-xl font-extrabold text-slate-800 block font-mono">
                  {formatIndoNumber(activeData.bumDesaBersama.count)} unit
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase">
                  Kinerja Operasional
                </span>
                <span className="text-sm md:text-xl font-extrabold text-emerald-600 block flex-shrink-0 whitespace-nowrap">
                  {activeData.bumDesaBersama.pemeringkatanKategori || "Baik"}{" "}
                  ({formatIndoPrecise(activeData.bumDesaBersama.pemeringkatanNilai || 65)})
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="overflow-x-auto">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block mb-2 leading-none">
              Data Kerjasama BUMDesma per Provinsi {filters.tahun}
            </span>
            <table className="w-full text-left font-sans text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold text-[10px] uppercase">
                  <th className="pb-2">Provinsi</th>
                  <th className="pb-2 text-center text-emerald-600">Konsorsium Aktif</th>
                  <th className="pb-2 text-center text-rose-600">Konsorsium Pasif</th>
                  <th className="pb-2 text-right">Total Unit BUMDesma</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-655">
                {provinceDataList.map((prov) => {
                  const bm = prov.bumDesaBersama;
                  return (
                    <tr
                      key={prov.id}
                      className="hover:bg-slate-50 cursor-pointer"
                      onClick={() => handleSelectProvince(prov.id)}
                    >
                      <td className="py-2.5 font-bold text-[#0c4a9f]">{prov.name}</td>
                      <td className="py-2.5 text-center font-mono text-emerald-600">
                        {formatIndoNumber(bm.aktif)}
                      </td>
                      <td className="py-2.5 text-center font-mono text-rose-600">
                        {formatIndoNumber(bm.tidakAktif)}
                      </td>
                      <td className="py-2.5 text-right font-mono font-extrabold text-slate-800">
                        {formatIndoNumber(bm.count)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
