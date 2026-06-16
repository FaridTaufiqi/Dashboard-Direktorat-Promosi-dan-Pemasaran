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
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      {/* LEFT PANEL - Graphics & Metrics */}
      <div className="xl:col-span-7 flex flex-col gap-6">
        <SVGIndonesiaMap
          selectedProvince={filters.provinsi}
          onSelectProvince={handleSelectProvince}
          provinceList={provinceList}
          tahun={filters.tahun}
        />
        <NIBandProgram data={activeData} tahun={filters.tahun} />
      </div>

      {/* RIGHT PANEL - Analytics & Lists */}
      <div className="xl:col-span-5 flex flex-col gap-6">
        {/* Radar & Donut Charts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <IndeksDesaRadar data={activeData} tahun={filters.tahun} />
          <BUMDesaChart
            data={activeData}
            tahun={filters.tahun}
            onSelectProvince={handleSelectProvince}
            provinceList={provinceList}
          />
        </div>

        {/* Pemeringkatan & PADes Sub-lists */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <PemeringkatanBUMDesa data={activeData} tahun={filters.tahun} />
          <BagiHasilPADes data={activeData} tahun={filters.tahun} />
        </div>

        {/* Regional List (Scrollable Area) */}
        <RingkasanWilayah
          selectedProvince={filters.provinsi}
          onSelectProvince={handleSelectProvince}
          provinceList={provinceList}
        />
      </div>
    </div>
  );
}
