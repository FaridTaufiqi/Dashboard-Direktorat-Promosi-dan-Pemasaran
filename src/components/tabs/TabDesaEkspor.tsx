import React from "react";
import { ProvinceData } from "../../types";
import { Plane, BarChart4, Ship, Anchor, Search } from "lucide-react";
import { formatIndoNumber } from "../KPICards";

interface TabDesaEksporProps {
  data: ProvinceData;
}

export default function TabDesaEkspor({ data }: TabDesaEksporProps) {
  const desaEkspor = data.desaEksporData;

  if (!desaEkspor || typeof desaEkspor.klusterisasi.total === 'undefined') {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-slate-400 bg-white border border-slate-200 rounded-xl mt-5">
        <Plane className="w-12 h-12 mb-4 text-slate-300" />
        <p className="font-semibold text-lg">Data Desa Ekspor belum tersedia.</p>
        <p className="text-sm mt-2 text-slate-400 text-center">Tidak ada data klasifikasi/komoditas Desa BISA Ekspor untuk wilayah/tahun ini.</p>
      </div>
    );
  }

  const klus = desaEkspor.klusterisasi;
  const sektorEntries = Object.entries(desaEkspor.sektorKomoditas).sort((a, b) => b[1] - a[1]);
  const komoditasEntries = Object.entries(desaEkspor.komoditas).sort((a, b) => b[1] - a[1]).slice(0, 50); // top 50

  return (
    <div className="space-y-6 mt-1 lg:mt-3 pb-8">
      
      {/* HEADER CARD */}
      <div className="bg-white border text-center border-slate-200 rounded-xl p-6 md:p-8 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Graphic */}
        <div className="absolute opacity-5 left-0 bottom-0 translate-y-1/2 -translate-x-1/4 pointer-events-none">
          <Plane className="w-64 h-64 rotate-[-15deg] text-blue-600" />
        </div>
        
        <div className="p-3 bg-blue-50 text-blue-600 rounded-full mb-4 shadow-inner ring-1 ring-blue-100">
           <Plane className="w-8 h-8" />
        </div>
        <h2 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-widest leading-none mb-2 relative z-10">
          DESA BISA EKSPOR
        </h2>
        <p className="text-sm text-slate-500 font-medium max-w-2xl relative z-10">
          Analisis Klusterisasi, Sektor, dan Sebaran Komoditas Layak Ekspor untuk area <span className="font-bold text-slate-700">{data.name}</span>.
        </p>
      </div>

      {/* KLUSTERISASI & REKAP SEKTOR */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* KLUSTERISASI */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col">
          <div className="mb-4 flex items-center gap-2">
             <BarChart4 className="w-5 h-5 text-indigo-500" />
             <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest leading-none">Klusterisasi Desa BISA Ekspor</h3>
          </div>
          
          <div className="grid border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100">
            <div className="flex justify-between items-center bg-slate-50/50 p-4">
               <div>
                  <div className="font-extrabold text-slate-700 uppercase text-xs tracking-wider">KLASTER 1</div>
                  <div className="text-[10px] text-slate-400">Siap Ekspor / Skala Masih Kecil</div>
               </div>
               <div className="flex items-baseline gap-1">
                 <span className="font-mono text-2xl font-black text-indigo-600">{formatIndoNumber(klus.klaster1)}</span>
                 <span className="text-[10px] font-bold text-slate-400">Desa</span>
               </div>
            </div>
            <div className="flex justify-between items-center p-4">
               <div>
                  <div className="font-extrabold text-slate-700 uppercase text-xs tracking-wider">KLASTER 2</div>
                  <div className="text-[10px] text-slate-400">Komoditas Menonjol / Infrastruktur Perlu Penguatan</div>
               </div>
               <div className="flex items-baseline gap-1">
                 <span className="font-mono text-2xl font-black text-indigo-600">{formatIndoNumber(klus.klaster2)}</span>
                 <span className="text-[10px] font-bold text-slate-400">Desa</span>
               </div>
            </div>
            <div className="flex justify-between items-center bg-slate-50/50 p-4">
               <div>
                  <div className="font-extrabold text-slate-700 uppercase text-xs tracking-wider">SENTRA IKM</div>
                  <div className="text-[10px] text-slate-400">Sentra Industri Kecil Menengah</div>
               </div>
               <div className="flex items-baseline gap-1">
                 <span className="font-mono text-2xl font-black text-indigo-600">{formatIndoNumber(klus.sentraIkm)}</span>
                 <span className="text-[10px] font-bold text-slate-400">Desa</span>
               </div>
            </div>
          </div>
          
          <div className="mt-5 border-t border-slate-100 pt-3">
             <div className="flex justify-between items-center">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">TOTAL DATA EVALUASI</span>
                 <span className="font-mono text-xl font-black text-slate-800">{formatIndoNumber(klus.total)}</span>
             </div>
          </div>
        </div>

        {/* REKAP SEKTOR KOMODITAS */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col h-full">
           <div className="mb-4 flex items-center gap-2">
             <Anchor className="w-5 h-5 text-emerald-500" />
             <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest leading-none">Sebaran Sektor Komoditas</h3>
           </div>
           
           <div className="flex-1 border border-slate-100 rounded-xl overflow-y-auto max-h-[340px] hide-scrollbar bg-slate-50 relative">
             {sektorEntries.length === 0 ? (
                 <div className="p-8 text-center text-slate-400 text-sm">Belum ada sebaran sektor komoditas</div>
             ) : (
                <div className="divide-y divide-slate-100/60">
                   {sektorEntries.map(([sektor, count], index) => {
                       return (
                           <div key={sektor} className="flex items-center justify-between p-3.5 hover:bg-white transition-colors group">
                               <div className="flex items-center gap-3">
                                   <div className="w-6 text-center text-[10px] font-black text-slate-300 group-hover:text-emerald-500">{index + 1}</div>
                                   <div className="text-xs font-bold text-slate-700 capitalize group-hover:text-emerald-700">{sektor.toLowerCase()}</div>
                               </div>
                               <div className="font-mono font-black text-sm text-slate-600 bg-slate-200/50 px-2 py-0.5 rounded-md group-hover:bg-emerald-100 group-hover:text-emerald-700">
                                   {formatIndoNumber(count)}
                               </div>
                           </div>
                       );
                   })}
                </div>
             )}
           </div>
        </div>
      </div>

      {/* TOP KOMODITAS TABLE */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
           <div className="flex items-center gap-2">
             <Ship className="w-5 h-5 text-amber-500" />
             <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest leading-none">Top Komoditas Potensial (Max 50)</h3>
           </div>
           <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-2">
             <Search className="w-3.5 h-3.5 text-slate-400" />
             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">{komoditasEntries.length} Komoditas Ditemukan</span>
           </div>
        </div>

        <div className="overflow-x-auto pb-4">
           {komoditasEntries.length === 0 ? (
               <div className="p-10 text-center text-slate-400 text-sm border border-slate-100 rounded-xl">Belum ada data detail komoditas</div>
           ) : (
               <table className="w-full text-left font-sans text-xs border-collapse">
                   <thead>
                      <tr className="border-b-2 border-slate-200 text-slate-400 font-extrabold text-[10px] uppercase tracking-wider">
                         <th className="pb-3 px-3 w-16 text-center">Rank</th>
                         <th className="pb-3 px-2">Nama Komoditas</th>
                         <th className="pb-3 px-3 text-right">Frekuensi / Desa</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100/70 font-medium text-slate-650">
                      {komoditasEntries.map(([komoditas, count], index) => (
                           <tr key={komoditas} className="hover:bg-slate-50/80 transition-colors group">
                               <td className="py-2.5 px-3 text-center text-slate-400 font-bold">{index + 1}</td>
                               <td className="py-2.5 px-2 font-bold text-slate-700 group-hover:text-amber-700 capitalize">{komoditas.toLowerCase()}</td>
                               <td className="py-2.5 px-3 text-right">
                                  <span className="font-mono bg-slate-100 group-hover:bg-amber-100 group-hover:text-amber-800 text-slate-600 px-2 py-1 rounded-lg text-[11px] font-black">
                                       {formatIndoNumber(count)}
                                  </span>
                               </td>
                           </tr>
                      ))}
                   </tbody>
               </table>
           )}
        </div>
      </div>

    </div>
  );
}
