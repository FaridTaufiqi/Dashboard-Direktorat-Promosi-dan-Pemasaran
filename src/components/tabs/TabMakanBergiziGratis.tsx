import React from "react";
import MakanBergiziGratisChart from "../MakanBergiziGratisChart";
import { ProvinceData, DashboardFilters } from "../../types";

interface TabMakanBergiziGratisProps {
  data: ProvinceData;
  tahun: string;
}

export default function TabMakanBergiziGratis({
  data,
  tahun,
}: TabMakanBergiziGratisProps) {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="w-full">
        <MakanBergiziGratisChart data={data} tahun={tahun} />
      </div>
    </div>
  );
}
