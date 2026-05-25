import React from "react";
import RingkasanWilayah from "../RingkasanWilayah";
import SVGIndonesiaMap from "../SVGIndonesiaMap";
import IndeksDesaRadar from "../IndeksDesaRadar";
import BUMDesaChart from "../BUMDesaChart";
import PemeringkatanBUMDesa from "../PemeringkatanBUMDesa";
import BagiHasilPADes from "../BagiHasilPADes";
import NIBandProgram from "../NIBandProgram";
import { provinceDataList } from "../../data/mockData";
import { DashboardFilters } from "../../types";

interface TabRingkasanProps {
  filters: DashboardFilters;
  activeData: any;
  handleSelectProvince: (provId: string) => void;
}

export default function TabRingkasan({
  filters,
  activeData,
  handleSelectProvince,
}: TabRingkasanProps) {
  return (
    <div className="space-y-6">
      {/* Row 1: Interactive Map & Ringkasan Table List */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        <div className="xl:col-span-4 h-full">
          <RingkasanWilayah
            selectedProvince={filters.provinsi}
            onSelectProvince={handleSelectProvince}
            provinceList={provinceDataList}
          />
        </div>
        <div className="xl:col-span-5 h-full">
          <SVGIndonesiaMap
            selectedProvince={filters.provinsi}
            onSelectProvince={handleSelectProvince}
            provinceList={provinceDataList}
            tahun={filters.tahun}
          />
        </div>
        <div className="xl:col-span-3 h-full">
          <IndeksDesaRadar data={activeData} tahun={filters.tahun} />
        </div>
      </div>

      {/* Row 2: BUM Desa Donut, Aspects Rating, Line Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BUMDesaChart
          data={activeData}
          tahun={filters.tahun}
          onSelectProvince={handleSelectProvince}
          provinceList={provinceDataList}
        />
        <PemeringkatanBUMDesa data={activeData} tahun={filters.tahun} />
        <BagiHasilPADes data={activeData} tahun={filters.tahun} />
      </div>

      {/* Row 3: Bottom Row Cards (NIB, Program, BUMDesma Cooperative summaries) */}
      <NIBandProgram data={activeData} tahun={filters.tahun} />
    </div>
  );
}
