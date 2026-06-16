import React from "react";
import RingkasanWilayah from "../RingkasanWilayah";
import SVGIndonesiaMap from "../SVGIndonesiaMap";
import IndeksDesaRadar from "../IndeksDesaRadar";
import BUMDesaChart from "../BUMDesaChart";
import PemeringkatanBUMDesa from "../PemeringkatanBUMDesa";
import BagiHasilPADes from "../BagiHasilPADes";
import NIBandProgram from "../NIBandProgram";
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
