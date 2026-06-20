import React, { useMemo } from "react";
import RingkasanWilayah from "../RingkasanWilayah";
import SVGIndonesiaMap from "../SVGIndonesiaMap";
import IndeksDesaRadar from "../IndeksDesaRadar";
import BUMDesaChart from "../BUMDesaChart";
import PemeringkatanBUMDesa from "../PemeringkatanBUMDesa";
import BagiHasilPADes from "../BagiHasilPADes";
import NIBandProgram from "../NIBandProgram";
import MakanBergiziGratisChart from "../MakanBergiziGratisChart";
import AIInsightBox from "../AIInsightBox";
import { ProvinceData } from "../../types";
import { DashboardFilters } from "../../types";

interface TabRingkasanProps {
  provinceList: ProvinceData[];
  filters: DashboardFilters;
  activeData: any;
  handleSelectProvince: (provId: string) => void;
}

export default function TabRingkasan({
  filters,
  activeData,
  handleSelectProvince,
  provinceList,
}: TabRingkasanProps) {

  const aiInsightText = useMemo(() => {
    if (!activeData) return "Menganalisa data...";
    
    const activeBUM = activeData.bumDesaStatus?.aktif || 0;
    const totalBUM = (activeData.bumDesaStatus?.aktif || 0) + (activeData.bumDesaStatus?.tidakAktif || 0);
    const pctActive = totalBUM > 0 ? ((activeBUM / totalBUM) * 100).toFixed(1) : 0;
    
    const mbgBum = activeData.makanBergiziGratis?.bumDesaCount || 0;
    const mbgTarget = activeData.makanBergiziGratis?.pendapatan2026 || 0;

    let text = `Berdasarkan data ${activeData.name === "NASIONAL" ? "nasional" : `wilayah ${activeData.name}`} tahun ${filters.tahun}, tingkat adopsi BUM Desa yang aktif mencapai ${pctActive}%. `;
    
    if (mbgBum > 0) {
      text += `Khusus untuk Program Makan Bergizi Gratis, terdapat ${mbgBum.toLocaleString("id-ID")} entitas BUM Desa yang mengestimasikan kontribusi pendapatan sekitar Rp${mbgTarget.toFixed(2)} Miliar pada 2026. `;
    }
    
    if (activeData.nib?.percentage < 50) {
      text += "Namun, kepemilikan NIB masih perlu didorong karena berada di bawah 50%, yang berpotensi menghambat akselerasi legalitas usaha desa.";
    } else {
      text += "Penetrasi legalitas usaha (NIB) menunjukkan tren positif sebagai fundamental transformasi ekonomi desa.";
    }

    return text;
  }, [activeData, filters.tahun]);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* ROW 1: FULL WIDTH MAP */}
      <div className="w-full">
        <SVGIndonesiaMap
          selectedProvince={filters.provinsi}
          onSelectProvince={handleSelectProvince}
          provinceList={provinceList}
          tahun={filters.tahun}
        />
      </div>

      {/* AI INSIGHT */}
      <div className="w-full">
        <AIInsightBox insight={aiInsightText} />
      </div>

      {/* ROW 2: METRICS GRID (Radar, Donut BUMDes, Pemeringkatan, Bagi Hasil) */}
      <div className="grid grid-cols-1 gap-6 items-stretch w-full">
        <IndeksDesaRadar data={activeData} tahun={filters.tahun} />
        <BUMDesaChart
          data={activeData}
          tahun={filters.tahun}
          onSelectProvince={handleSelectProvince}
          provinceList={provinceList}
        />
        <PemeringkatanBUMDesa data={activeData} tahun={filters.tahun} />
        <BagiHasilPADes data={activeData} tahun={filters.tahun} />
      </div>

      {/* ROW 3: NIB & KLUSTERISASI (Will render as 2 columns internally) */}
      <div className="w-full">
        <NIBandProgram data={activeData} tahun={filters.tahun} />
      </div>

      {/* ROW 3.5: MAKAN BERGIZI GRATIS */}
      <div className="w-full">
        <MakanBergiziGratisChart data={activeData} tahun={filters.tahun} />
      </div>

      {/* ROW 4: DATA TABLE */}
      <div className="w-full">
        <RingkasanWilayah
          selectedProvince={filters.provinsi}
          onSelectProvince={handleSelectProvince}
          provinceList={provinceList}
        />
      </div>
    </div>
  );
}
