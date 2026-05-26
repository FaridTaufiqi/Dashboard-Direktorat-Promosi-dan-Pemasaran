import React from "react";
import BagiHasilPADes from "../BagiHasilPADes";
import { provinceDataList } from "../../data/mockData";
import { DashboardFilters } from "../../types";

interface TabPADesProps {
  filters: DashboardFilters;
  activeData: any;
  handleSelectProvince: (provId: string) => void;
}

export default function TabPADes({
  filters,
  activeData,
  handleSelectProvince,
}: TabPADesProps) {
  return (
    <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-6">
      <div>
        <h2 className="text-lg font-black text-[#0c4a9f] uppercase tracking-tight leading-none mb-1">
          HISTORI KONTRIBUSI PENDAPATAN DESA (PADes)
        </h2>
        <p className="text-xs text-slate-400 font-bold uppercase">
          Rekap kontribusi dividen bersih unit BUM Desa ke kas otonom desa
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5">
          <BagiHasilPADes data={activeData} tahun={filters.tahun} />
        </div>
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl">
            <h4 className="text-xs font-bold text-slate-700 uppercase mb-2">
              Pemberdayaan Laba untuk Otonomi Desa
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-2.5">
              Sesuai peraturan, minimal <strong>15% sampai 35%</strong> dari laba bersih BUM Desa
              disetorkan ke Pemerintah Desa sebagai bagian dari pendapatan kas desa asli (PADes).
              Dana ini dimanfaatkan untuk pembangunan infrastruktur kecil, subsidi kesehatan
              darurat, or beasiswa siswa tidak mampu di wilayah setempat.
            </p>
          </div>

          <div className="overflow-x-auto">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block mb-2 leading-none">
              Histori Finansial PADes Berkelanjutan
            </span>
            <table className="w-full text-left font-sans text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold text-[10px] uppercase">
                  <th className="pb-2">Provinsi</th>
                  <th className="pb-2 text-center">Tahun 2022</th>
                  <th className="pb-2 text-center">Tahun 2023</th>
                  <th className="pb-2 text-center">Tahun 2024</th>
                  <th className="pb-2 text-right">Tahun 2025</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-650">
                {provinceDataList.map((prov) => {
                  const h = prov.bagiHasilPADes;
                  
                  const formatCmp = (val: number) => {
                    if (val >= 1e9) return (val / 1e9).toFixed(1).replace(".", ",") + " M";
                    if (val >= 1e6) return (val / 1e6).toFixed(1).replace(".", ",") + " Jt";
                    return val.toLocaleString("id-ID");
                  };

                  return (
                    <tr
                      key={prov.id}
                      className="hover:bg-slate-50 cursor-pointer"
                      onClick={() => handleSelectProvince(prov.id)}
                    >
                      <td className="py-2.5 font-bold text-[#0c4a9f]">{prov.name}</td>
                      <td className="py-2.5 text-center font-mono">
                        Rp {formatCmp(h["2022"])}
                      </td>
                      <td className="py-2.5 text-center font-mono">
                        Rp {formatCmp(h["2023"])}
                      </td>
                      <td className="py-2.5 text-center font-mono">
                        Rp {formatCmp(h["2024"])}
                      </td>
                      <td className="py-2.5 text-right font-mono font-bold text-slate-800">
                        Rp {formatCmp(h["2025"])}
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
