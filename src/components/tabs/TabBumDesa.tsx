import React from "react";
import { BookmarkCheck } from "lucide-react";
import BUMDesaChart from "../BUMDesaChart";
import { formatIndoNumber } from "../KPICards";
import { ProvinceData } from "../../types";
import { DashboardFilters } from "../../types";

interface TabBumDesaProps {
  provinceList: ProvinceData[];
  filters: DashboardFilters;
  activeData: any;
  handleSelectProvince: (provId: string) => void;
}

export default function TabBumDesa({
  filters,
  activeData,
  handleSelectProvince,
  provinceList,
}: TabBumDesaProps) {
  return (
    <div className="space-y-6 bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
      <div>
        <h2 className="text-lg font-black text-[#0c4a9f] uppercase tracking-tight leading-none mb-1">
          POPULASI & INTEGRITY BUM DESA
        </h2>
        <p className="text-xs text-slate-400 font-bold uppercase">
          Peningkatan kompetensi kelembagaan unit usaha mandiri pedesaan
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BUMDesaChart
          data={activeData}
          tahun={filters.tahun}
          onSelectProvince={handleSelectProvince}
          provinceList={provinceList}
        />

        {/* Advanced statistics table */}
        <div className="space-y-4">
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center gap-3">
            <BookmarkCheck className="w-8 h-8 text-blue-600 flex-shrink-0" />
            <div>
              <span className="text-sm font-bold text-slate-700 block text-ellipsis truncate">
                Sertifikat Badan Hukum BUM Desa
              </span>
              <p className="text-xs text-slate-400 leading-normal mt-0.5">
                Melalui regulasi penunjang UU Cipta Kerja, BUM Desa kini dinaikkan statusnya menjadi
                Badan Hukum formal, memberikan jaminan kelayakan transaksi perbankan dan kucuran
                modal negara.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block mb-2 leading-none">
              Peta Populasi & Status Unit per Provinsi
            </span>
            <table className="w-full text-left font-sans text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-extrabold text-[10px] uppercase">
                  <th className="pb-2">Provinsi</th>
                  <th className="pb-2 text-center text-blue-600">Total BUM Desa</th>
                  <th className="pb-2 text-center text-blue-600">Total BERSAMA</th>
                  <th className="pb-2 text-center text-emerald-600">Aktif Keduanya</th>
                  <th className="pb-2 text-right text-rose-600">Pasif/Mati</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-650">
                {provinceList.map((prov) => {
                  const s = prov.bumDesaStatus[filters.tahun] || {
                    aktif: 0,
                    tidakAktif: 0,
                    dalamPengembangan: 0,
                  };
                  const bersamaSum = prov.bumDesaBersama?.count ?? 0;
                  const bersamaAktif = prov.bumDesaBersama?.aktif ?? 0;
                  const bersamaPasif = prov.bumDesaBersama?.tidakAktif ?? 0;

                  return (
                    <tr
                      key={prov.id}
                      className="hover:bg-slate-50 cursor-pointer"
                      onClick={() => handleSelectProvince(prov.id)}
                    >
                      <td className="py-2.5 font-bold text-slate-700">{prov.name}</td>
                      <td className="py-2.5 text-center font-mono text-blue-700 font-bold">
                        {formatIndoNumber(prov.bumDesaCount)}
                      </td>
                      <td className="py-2.5 text-center font-mono text-blue-700 font-bold">
                        {formatIndoNumber(bersamaSum)}
                      </td>
                      <td className="py-2.5 text-center font-mono text-emerald-600">
                        {formatIndoNumber(s.aktif + bersamaAktif)}
                      </td>
                      <td className="py-2.5 text-right font-mono text-rose-650">
                        {formatIndoNumber(s.tidakAktif + bersamaPasif)}
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
