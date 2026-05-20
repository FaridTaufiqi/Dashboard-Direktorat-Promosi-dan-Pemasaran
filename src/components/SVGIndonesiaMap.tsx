import React, { useState } from "react";
import { MapPin, Info } from "lucide-react";
import { ProvinceData } from "../types";
import { formatIndoDecimal, formatIndoNumber } from "./KPICards";

interface SVGIndonesiaMapProps {
  selectedProvince: string;
  onSelectProvince: (provId: string) => void;
  provinceList: ProvinceData[];
  tahun: string;
}

interface IslandData {
  id: string;
  name: string;
  provinces: string[]; // corresponding province IDs
  averageID: number;
  bumdesCount: number;
  pathD: string; // SVG path representation
}

export default function SVGIndonesiaMap({
  selectedProvince,
  onSelectProvince,
  provinceList,
  tahun,
}: SVGIndonesiaMapProps) {
  const [hoveredIsland, setHoveredIsland] = useState<IslandData | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Stylized main island regions of Indonesia
  const islands: IslandData[] = [
    {
      id: "sumatera",
      name: "Sumatera (Sumatra)",
      provinces: ["12", "11", "18"], // North Sumatra, Aceh, Lampung
      averageID: 0.646,
      bumdesCount: 9361,
      // Stylized island shape
      pathD: "M10 20 L45 5 L65 30 L85 75 L60 90 L30 65 L15 45 Z"
    },
    {
      id: "jawa",
      name: "Jawa (Java)",
      provinces: ["32", "33", "35", "34", "31"], // West, Central, East Java, Yogyakarta, Jakarta
      averageID: 0.738,
      bumdesCount: 17612,
      pathD: "M75 105 L155 105 L215 107 Q190 115 160 115 T100 114 Z"
    },
    {
      id: "kalimantan",
      name: "Kalimantan (Borneo)",
      provinces: [], // General
      averageID: 0.654,
      bumdesCount: 4210,
      pathD: "M105 15 L145 10 L185 25 L190 55 L165 78 L125 78 L100 50 Z"
    },
    {
      id: "sulawesi",
      name: "Sulawesi (Celebes)",
      provinces: ["73"], // South Sulawesi
      averageID: 0.662,
      bumdesCount: 2577,
      pathD: "M205 25 L215 25 L220 40 L235 40 L240 50 Q215 50 215 65 L210 80 L200 80 Q205 60 195 55 L200 40 Z"
    },
    {
      id: "nusatenggara",
      name: "Bali & Nusa Tenggara",
      provinces: ["51", "52"], // Bali, NTB
      averageID: 0.700,
      bumdesCount: 1715,
      pathD: "M220 110 L230 110 L242 110 L255 112 L265 112 Q250 115 230 114 Z"
    },
    {
      id: "papua",
      name: "Maluku & Papua",
      provinces: [], 
      averageID: 0.612,
      bumdesCount: 3105,
      pathD: "M285 45 L320 40 L345 55 L345 95 L315 95 Q305 75 285 65 Z"
    }
  ];

  const handleMouseMove = (e: React.MouseEvent) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - bounds.left + 15,
      y: e.clientY - bounds.top + 15,
    });
  };

  // Top 5 sorted by ID in 2025/active year
  const rawTopList = [...provinceList]
    .map(p => ({
      id: p.id,
      name: p.name,
      idValue: p.indeksDesa[tahun] || 0.678
    }))
    .sort((a, b) => b.idValue - a.idValue)
    .slice(0, 5);

  const bestProvinces = rawTopList.length > 0 ? rawTopList : [
    { id: "34", name: "DI Yogyakarta", idValue: 0.801 },
    { id: "31", name: "DKI Jakarta", idValue: 0.771 },
    { id: "51", name: "Bali", idValue: 0.742 },
    { id: "33", name: "Jawa Tengah", idValue: 0.719 },
    { id: "32", name: "Jawa Barat", idValue: 0.702 }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between h-full space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest leading-none mb-1">
            PETA SEBARAN INDEKS DESA
          </h3>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
            Klik region pulau untuk menyaring filter data
          </p>
        </div>
        <div className="bg-blue-50 text-blue-600 p-1.5 rounded-lg shrink-0">
          <Info className="w-4 h-4" />
        </div>
      </div>

      {/* Main Flex Wrapper: Map + Top Province List with robust flex-wrap */}
      <div className="flex flex-wrap lg:flex-nowrap gap-5 items-stretch w-full">
        {/* Left Col: SVG Map Container - Flexible and robust */}
        <div className="flex-[3] min-w-[280px] xs:min-w-[320px] relative bg-slate-50 border border-slate-150 rounded-xl p-4 flex flex-col justify-between min-h-[250px]">
          <div
            className="w-full h-full relative cursor-crosshair flex items-center justify-center"
            onMouseMove={handleMouseMove}
          >
            <svg
              viewBox="0 0 360 140"
              className="w-full h-auto drop-shadow-xs select-none max-w-[340px]"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Sea Background subtle grid lines */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.5" opacity="0.3"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" rx="8" />

              {/* Island Paths */}
              {islands.map((island) => {
                const isActive = island.provinces.includes(selectedProvince);
                const isHovered = hoveredIsland?.id === island.id;
                
                // Color scaling based on Average ID
                let fillCol = "#10b981";
                if (island.averageID >= 0.72) fillCol = "#0c4a9f"; // Navy
                else if (island.averageID >= 0.68) fillCol = "#0284c7"; // Skies
                else if (island.averageID >= 0.64) fillCol = "#0d9488"; // Teal
                else if (island.averageID >= 0.60) fillCol = "#14b8a6"; // Light teal
                
                return (
                  <path
                    key={island.id}
                    d={island.pathD}
                    fill={fillCol}
                    stroke="#ffffff"
                    strokeWidth={isActive ? "2.5" : isHovered ? "1.5" : "1.0"}
                    strokeLinejoin="round"
                    className="transition-all duration-200 cursor-pointer"
                    opacity={isActive ? "1" : isHovered ? "0.95" : "0.75"}
                    style={{
                      transform: isHovered ? "scale(1.02) translateY(-1px)" : "none",
                      transformOrigin: "center",
                      filter: isActive ? "drop-shadow(0 4px 6px rgba(0,0,0,0.15))" : "none"
                    }}
                    onMouseEnter={() => setHoveredIsland(island)}
                    onMouseLeave={() => setHoveredIsland(null)}
                    onClick={() => {
                      if (island.provinces.length > 0) {
                        onSelectProvince(island.provinces[0]);
                      } else {
                        onSelectProvince("ALL");
                      }
                    }}
                  />
                );
              })}

              {/* Interactive labels for islands */}
              {islands.map((island) => {
                let coords = { x: 0, y: 0 };
                if (island.id === "sumatera") coords = { x: 45, y: 55 };
                else if (island.id === "jawa") coords = { x: 145, y: 121 };
                else if (island.id === "kalimantan") coords = { x: 145, y: 45 };
                else if (island.id === "sulawesi") coords = { x: 215, y: 50 };
                else if (island.id === "nusatenggara") coords = { x: 242, y: 121 };
                else if (island.id === "papua") coords = { x: 310, y: 70 };

                return (
                  <g key={`lbl-${island.id}`} className="pointer-events-none">
                    <text
                      x={coords.x}
                      y={coords.y}
                      textAnchor="middle"
                      className="fill-slate-700/80 font-bold select-none transition-all"
                      style={{ fontSize: "6.5px", fontFamily: "monospace", letterSpacing: "0.02em" }}
                    >
                      {island.name.split(" ")[0]}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Box */}
            {hoveredIsland && (
              <div
                className="absolute z-30 bg-slate-900/95 text-white text-xs p-3 rounded-xl shadow-lg pointer-events-none border border-slate-800 backdrop-blur-md max-w-xs transition-opacity duration-150"
                style={{
                  left: `${tooltipPos.x}px`,
                  top: `${tooltipPos.y}px`,
                }}
              >
                <p className="font-extrabold text-amber-300 text-[12px] border-b border-slate-800 pb-1 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {hoveredIsland.name}
                </p>
                <div className="space-y-1 font-medium text-slate-300 text-[10.5px]">
                  <div className="flex justify-between gap-4">
                    <span>Rata-rata Indeks Desa:</span>
                    <span className="font-bold text-white font-mono">{formatIndoDecimal(hoveredIsland.averageID)}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>Terdaftar BUM Desa:</span>
                    <span className="font-bold text-white font-mono">{formatIndoNumber(hoveredIsland.bumdesCount)} unit</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Color Scale Legend */}
          <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2.5 text-slate-500">
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                INDEKS DESA (ID {tahun})
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[9px] font-bold font-mono text-slate-400">0,000</span>
                <div className="h-2 w-24 rounded-full bg-gradient-to-r from-[#14b8a6] via-[#0284c7] to-[#0c4a9f]" />
                <span className="text-[9px] font-bold font-mono text-slate-400">1,000</span>
              </div>
            </div>
            
            <div className="text-left xs:text-right">
              <span className="text-[9px] font-black text-slate-400 uppercase block leading-none">
                SKALA WARNA REGIONAL
              </span>
              <span className="text-[10px] font-bold text-slate-500 block mt-1">
                Turquoise ke Navy (Rendah &rsaquo; Tinggi)
              </span>
            </div>
          </div>
        </div>

        {/* Right Col: Top 5 Provinces scoreboard with absolute zero squeeze risk */}
        <div className="flex-[2] min-w-[220px] self-stretch flex flex-col justify-between">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-150 flex-1 flex flex-col justify-between gap-4">
            <div>
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block mb-2.5">
                Rata-rata ID per Provinsi (Top 5)
              </span>
              <div className="space-y-2">
                {bestProvinces.map((prov, index) => {
                  const isSelected = selectedProvince === prov.id;
                  return (
                    <div
                      key={prov.id}
                      onClick={() => onSelectProvince(prov.id)}
                      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all min-w-0 gap-2 border ${
                        isSelected
                          ? "bg-blue-600 text-white shadow-xs border-blue-600"
                          : "bg-white hover:bg-slate-100 text-slate-700 border-slate-150"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold ${
                          isSelected ? "bg-white/20 text-white" : "bg-blue-50 text-blue-700"
                        }`}>
                          {index + 1}
                        </span>
                        <span className="text-[12px] font-bold truncate">
                          {prov.name}
                        </span>
                      </div>
                      <span className="text-[12px] font-bold font-mono shrink-0 pl-1">
                        {formatIndoDecimal(prov.idValue)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* National Target Card inside */}
            <div className="pt-3 border-t border-slate-200 text-center">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">
                Rata-rata Nasional
              </span>
              <span className="text-xl font-bold text-blue-700 font-mono">
                0,678
              </span>
              <span className="text-[10px] text-slate-400 font-bold block mt-1 leading-none">
                Kategori ID: Berkembang
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
