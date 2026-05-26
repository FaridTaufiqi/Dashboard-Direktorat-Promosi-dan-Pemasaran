import React, { useState } from "react";
import PemeringkatanBUMDesa from "../PemeringkatanBUMDesa";
import { formatIndoDecimal } from "../KPICards";
import { provinceDataList } from "../../data/mockData";
import { DashboardFilters } from "../../types";

interface TabPemeringkatanProps {
  filters: DashboardFilters;
  activeData: any;
  handleSelectProvince: (provId: string) => void;
}

export default function TabPemeringkatan({
  filters,
  activeData,
  handleSelectProvince,
}: TabPemeringkatanProps) {
  const [tableIsBersama, setTableIsBersama] = useState(false);

  return (
    <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-6">
      <div>
        <h2 className="text-lg font-black text-[#0c4a9f] uppercase tracking-tight leading-none mb-1">
          KOMPARASI ASPEK PEMERINGKATAN
        </h2>
        <p className="text-xs text-slate-400 font-bold uppercase">
          Metodologi standarisasi akreditasi kehandalan internal organisasi
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-6">
          <PemeringkatanBUMDesa data={activeData} tahun={filters.tahun} />
        </div>
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-150">
            <h4 className="text-xs font-bold text-slate-700 uppercase mb-2">
              Penjelasan Matriks Penilaian BUM Desa
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Sertifikasi Pemeringkatan dinilai berdasarkan <strong>7 parameter administratif</strong>{" "}
              yang merangkum kesehatan finansial, kualitas sumber daya manusia (SDM), pengawasan komite,
              dan kontribusi sosial mereka untuk pedesaan.
            </p>
            <ul className="list-disc pl-4 mt-3 space-y-1.5 text-xs text-slate-500">
              <li>
                <strong>Kelembagaan</strong>: Legalitas formal, perumusan AD/ART dan kepatuhan anggaran.
              </li>
              <li>
                <strong>Manajemen</strong>: Transparansi audit, kemandirian SDM and pelaporan direksi.
              </li>
              <li>
                <strong>Usaha</strong>: Kelayakan bisnis, perputaran produk and kontribusi pasar terpadu.
              </li>
              <li>
                <strong>Kemitraan</strong>: Kerja sama institusional dengan pihak ketiga or perbankan swasta.
              </li>
            </ul>
          </div>

          <div className="overflow-x-auto">
            <div className="flex justify-between items-end mb-2">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block leading-none">
                Data Provinsi: {tableIsBersama ? "BUM DESA BERSAMA" : "BUM DESA"}
              </span>
              <div className="flex bg-slate-100 p-0.5 rounded-lg shrink-0 border border-slate-200">
                <button
                  onClick={() => setTableIsBersama(false)}
                  className={`px-3 py-1 text-[9px] font-extrabold rounded-md transition-all ${
                    !tableIsBersama ? "bg-white text-blue-700 shadow-xs" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  BUM DESA
                </button>
                <button
                  onClick={() => setTableIsBersama(true)}
                  className={`px-3 py-1 text-[9px] font-extrabold rounded-md transition-all ${
                    tableIsBersama ? "bg-white text-blue-700 shadow-xs" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  BERSAMA
                </button>
              </div>
            </div>
            <table className="w-full text-left font-sans text-xs border-collapse mt-2">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold text-[10px] uppercase">
                  <th className="pb-2">Provinsi</th>
                  <th className="pb-2 text-center">Kelembagaan</th>
                  <th className="pb-2 text-center">Manajemen</th>
                  <th className="pb-2 text-center">Kemitraan</th>
                  <th className="pb-2 text-center">Manfaat</th>
                  <th className="pb-2 text-right">Skor Rekap</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-650">
                {provinceDataList.map((prov) => {
                  const p = !tableIsBersama ? (prov.bumDesaPemeringkatan[filters.tahun] ||
                    prov.bumDesaPemeringkatan["2025"] || {
                      kelembagaan: 0.6,
                      manajemen: 0.6,
                      kemitraan: 0.6,
                      manfaat: 0.6,
                      nilaiPemeringkatan: 0.6
                    }) : {
                      kelembagaan: prov.bumDesaBersama?.kelembagaan ?? 0.6,
                      manajemen: prov.bumDesaBersama?.manajemen ?? 0.6,
                      kemitraan: prov.bumDesaBersama?.kemitraan ?? 0.6,
                      manfaat: prov.bumDesaBersama?.manfaat ?? 0.6,
                      nilaiPemeringkatan: prov.bumDesaBersama?.pemeringkatanNilai ?? 0.6
                    };
                  
                  const avg = (p as any).nilaiPemeringkatan ?? ((p.kelembagaan + p.manajemen + p.kemitraan + p.manfaat) / 4);
                  
                  return (
                    <tr
                      key={prov.id}
                      className="hover:bg-slate-50 cursor-pointer"
                      onClick={() => handleSelectProvince(prov.id)}
                    >
                      <td className="py-2.5 font-bold text-slate-700">{prov.name}</td>
                      <td className="py-2.5 text-center font-mono">
                        {formatIndoDecimal(p.kelembagaan)}
                      </td>
                      <td className="py-2.5 text-center font-mono">
                        {formatIndoDecimal(p.manajemen)}
                      </td>
                      <td className="py-2.5 text-center font-mono">
                        {formatIndoDecimal(p.kemitraan)}
                      </td>
                      <td className="py-2.5 text-center font-mono">
                        {formatIndoDecimal(p.manfaat)}
                      </td>
                      <td className="py-2.5 text-right font-mono font-bold text-emerald-600">
                        {formatIndoDecimal(avg)}
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
