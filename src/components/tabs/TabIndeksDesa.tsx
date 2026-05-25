import React from "react";
import IndeksDesaRadar from "../IndeksDesaRadar";
import { formatIndoDecimal } from "../KPICards";
import { provinceDataList } from "../../data/mockData";
import { DashboardFilters } from "../../types";

interface TabIndeksDesaProps {
  filters: DashboardFilters;
  activeData: any;
  handleSelectProvince: (provId: string) => void;
}

export default function TabIndeksDesa({
  filters,
  activeData,
  handleSelectProvince,
}: TabIndeksDesaProps) {
  return (
    <div className="space-y-6 bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
      <div>
        <h2 className="text-lg font-black text-[#0c4a9f] tracking-tight truncate uppercase leading-none">
          ANALISIS PILAR INDEKS DESA (ID)
        </h2>
        <p className="text-xs text-slate-400 font-bold mt-1 uppercase">
          Metodologi evaluasi infrastruktur dasar dan kesejahteraan lokal
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4">
          <IndeksDesaRadar data={activeData} tahun={filters.tahun} />
        </div>
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
            <h4 className="text-xs font-black text-slate-600 block uppercase mb-2">
              Apa itu Indeks Desa?
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Indeks Desa merupakan instrumen pengukuran komposit yang mengukur kapasitas desa untuk bertransisi menuju kemandirian ekonomi, sosial, dan ketahanan ekologis. Indeks dibentuk berdasarkan rata-rata tertimbang dari 6 sub-indikator utama. Nilai skala berkisar antara <strong>0,000 sampai 1,000</strong>.
            </p>
          </div>

          {/* Comparative list table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold text-[10px] uppercase">
                  <th className="pb-2">Daftar Provinsi</th>
                  <th className="pb-2 text-center">Sosial</th>
                  <th className="pb-2 text-center">Ekonomi</th>
                  <th className="pb-2 text-center">Dasar</th>
                  <th className="pb-2 text-center">Akses</th>
                  <th className="pb-2 text-center">Kelola</th>
                  <th className="pb-2 text-right">Nilai ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                {provinceDataList.map((prov) => {
                  const d = prov.idDimensions[filters.tahun] || prov.idDimensions["2025"];
                  return (
                    <tr
                      key={prov.id}
                      className="hover:bg-slate-50 cursor-pointer"
                      onClick={() => handleSelectProvince(prov.id)}
                    >
                      <td className="py-2.5 font-bold text-[#0c4a9f]">{prov.name}</td>
                      <td className="py-2.5 text-center font-mono">
                        {formatIndoDecimal(d?.sosial || 0.65)}
                      </td>
                      <td className="py-2.5 text-center font-mono">
                        {formatIndoDecimal(d?.ekonomi || 0.65)}
                      </td>
                      <td className="py-2.5 text-center font-mono">
                        {formatIndoDecimal(d?.layananDasar || 0.65)}
                      </td>
                      <td className="py-2.5 text-center font-mono">
                        {formatIndoDecimal(d?.aksesibilitas || 0.65)}
                      </td>
                      <td className="py-2.5 text-center font-mono">
                        {formatIndoDecimal(d?.tataKelola || 0.65)}
                      </td>
                      <td className="py-2.5 text-right font-mono font-bold text-slate-800">
                        {formatIndoDecimal(prov.indeksDesa[filters.tahun] || 0.65)}
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
