import React from "react";
import { CheckCircle2 } from "lucide-react";
import NIBandProgram from "../NIBandProgram";
import { DashboardFilters } from "../../types";

interface TabNIBProps {
  filters: DashboardFilters;
  activeData: any;
}

export default function TabNIB({ filters, activeData }: TabNIBProps) {
  return (
    <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-6">
      <div>
        <h2 className="text-lg font-black text-[#0c4a9f] uppercase tracking-tight leading-none mb-1">
          LEGALITAS PERIZINAN & PROGRAM STRATEGIS
        </h2>
        <p className="text-xs text-slate-400 font-bold uppercase">
          Pemetaan status pendaftaran NIB dan inovasi binaan nasional
        </p>
      </div>

      {/* Grid block reuse bottom metrics */}
      <NIBandProgram data={activeData} tahun={filters.tahun} />

      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl mt-4">
        <h4 className="text-xs font-black text-[#0c4a9f] uppercase mb-1.5 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          Manfaat Pembinaan Desa BRILian & MBG (Makanan Bergizi Gratis)
        </h4>
        <p className="text-xs text-slate-500 leading-relaxed">
          Melalui kolaborasi lintas-instansi Kementerian Desa dan perbankan BUMN (seperti Bank
          BRI), program <strong>Desa BRILian</strong> mempercepat literasi keuangan digital
          pedesaan. Di sisi lain, program <strong>MBG (Makanan Bergizi Gratis)</strong> tahun
          2025/2026 menunjuk BUM Desa sebagai pemasok eksklusif hasil pertanian and peternakan
          lokal, secara sirkular mengentaskan kemiskinan dan meningkatkan serapan pasar domestik
          secara masif.
        </p>
      </div>
    </div>
  );
}
