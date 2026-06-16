import React from "react";
import { Award, ShieldAlert, Sparkles } from "lucide-react";
import { ProvinceData } from "../types";
import { formatIndoDecimal, formatIndoPrecise } from "./KPICards";

interface IndeksDesaRadarProps {
  data: ProvinceData;
  tahun: string;
}

export default function IndeksDesaRadar({ data, tahun }: IndeksDesaRadarProps) {
  // Extract dimensions for the active year
  const dims = data.idDimensions[tahun] || data.idDimensions["2025"] || {
    layananDasar: 0.721,
    sosial: 0.691,
    ekonomi: 0.692,
    lingkungan: 0.645,
    aksesibilitas: 0.624,
    tataKelola: 0.683,
  };

  const dimensionsList = [
    { key: "layananDasar", label: "Layanan Dasar", val: dims.layananDasar, color: "bg-blue-600" },
    { key: "sosial", label: "Sosial", val: dims.sosial, color: "bg-indigo-600" },
    { key: "ekonomi", label: "Ekonomi", val: dims.ekonomi, color: "bg-teal-600" },
    { key: "lingkungan", label: "Lingkungan", val: dims.lingkungan, color: "bg-emerald-600" },
    { key: "aksesibilitas", label: "Aksesibilitas", val: dims.aksesibilitas, color: "bg-amber-400" },
    { key: "tataKelola", label: "Tata Kelola", val: dims.tataKelola, color: "bg-orange-500" },
  ];

  const averagePoint = data.indeksDesa[tahun] || 70.60907572;
  const skorTotal = Number((dims.layananDasar + dims.sosial + dims.ekonomi + dims.lingkungan + dims.aksesibilitas + dims.tataKelola).toFixed(3));

  // Determine Kategori Kinerja based on SKOR INDEKS DESA
  const rawIdxVal = averagePoint > 10.0 ? averagePoint / 100 : averagePoint;
  let kategori = "Berkembang";
  let kategoriColor = "text-amber-500 bg-amber-50 border-amber-100";
  if (rawIdxVal >= 0.75) {
    kategori = "Mandiri";
    kategoriColor = "text-emerald-600 bg-emerald-50 border-emerald-100";
  } else if (rawIdxVal >= 0.70) {
    kategori = "Maju";
    kategoriColor = "text-blue-600 bg-blue-50 border-blue-100";
  } else if (rawIdxVal < 0.50) {
    kategori = "Tertinggal";
    kategoriColor = "text-rose-600 bg-rose-50 border-rose-100";
  }

  // --- MATHEMATICAL MATH FOR THE SVG RADAR CHART ---
  const width = 220;
  const height = 220;
  const center = 110;
  const maxRadius = 70; // Slightly reduced to give breathing space for labels within container

  // Function to get x,y for a specific dimension index (0 to 5) and magnitude (0 to 1 scale)
  const getPoint = (index: number, rawValue: number) => {
    // Values are in tens (e.g. 70.5), so we scale by / 100 for SVG radius fraction
    const scaledVal = rawValue > 1.2 ? rawValue / 100 : rawValue;
    const angle = (index * 60 - 90) * (Math.PI / 180); // Start top-center (-90 deg)
    const x = center + maxRadius * scaledVal * Math.cos(angle);
    const y = center + maxRadius * scaledVal * Math.sin(angle);
    return { x, y };
  };

  // 1. Concentric grid layers (for values 25, 50, 75, 100 to map to 0.25, 0.5, 0.75, 1.0)
  const gridLevels = [25, 50, 75, 100];
  const scaleFractionLevels = [0.25, 0.5, 0.75, 1.0];
  const gridPaths = scaleFractionLevels.map((level) => {
    const points = Array.from({ length: 6 }).map((_, i) => {
      // Pass the unscaled "level" as if it was 1.0 (so passing frac directly here)
      // wait, `getPoint` expects the rawValue. So we should pass 25, 50 etc to `getPoint`
      return "";
    }); // Just remap directly
    return "";
  });
  
  const finalGridPaths = gridLevels.map((rawLevel) => {
    const points = Array.from({ length: 6 }).map((_, i) => {
      const p = getPoint(i, rawLevel);
      return `${p.x},${p.y}`;
    });
    return `M ${points.join(" L ")} Z`;
  });

  // 2. Data shape paths
  const dataPoints = dimensionsList.map((d, i) => getPoint(i, d.val));
  const dataPathD = `M ${dataPoints.map((p) => `${p.x},${p.y}`).join(" L ")} Z`;


  return (
    <div className="bg-white rounded-[24px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col justify-between h-full">
      {/* Title */}
      <div>
        <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest leading-none mb-1">
          RINCIAN INDEKS DESA
        </h3>
        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
          Pengukuran 6 pilar indeks pembangunan
        </p>
      </div>

      {/* Main Stack: Centered Radar on left, list details on right for full width */}
      <div className="flex flex-col lg:flex-row items-center justify-between my-4 flex-1 gap-10 lg:pl-4 lg:pr-10">
        {/* Radar Chart with scaling for widescreen */}
        <div className="flex justify-center flex-1 items-center w-full max-w-[360px] h-auto aspect-square relative select-none shrink-0">
          <svg viewBox="0 0 220 220" className="overflow-visible w-full h-full">
            {/* Grid concentric shapes */}
            {finalGridPaths.map((path, idx) => (
              <path
                key={`grid-${idx}`}
                d={path}
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="0.75"
                strokeDasharray="2,2"
                opacity={0.8}
              />
            ))}

            {/* Scale indicator labels */}
            {gridLevels.map((level, idx) => {
              const p = getPoint(0, level); // label along the top vertical spoke
              return (
                <text
                  key={`scale-${idx}`}
                  x={p.x - 4}
                  y={p.y + 9}
                  className="fill-slate-400 font-bold"
                  style={{ fontSize: "7px", fontFamily: "monospace" }}
                >
                  {level.toString()}
                </text>
              );
            })}

            {/* Radial spoke lines */}
            {Array.from({ length: 6 }).map((_, i) => {
              const outerPoint = getPoint(i, 100.0);
              return (
                <line
                  key={`spoke-${i}`}
                  x1={center}
                  y1={center}
                  x2={outerPoint.x}
                  y2={outerPoint.y}
                  stroke="#e2e8f0"
                  strokeWidth="0.75"
                />
              );
            })}

            {/* Filled data polygon */}
            <path
              d={dataPathD}
              fill="rgba(37, 99, 235, 0.12)"
              stroke="#2563eb"
              strokeWidth="2"
            />

            {/* Outer vertices data markers */}
            {dataPoints.map((p, i) => (
              <circle
                key={`pt-${i}`}
                cx={p.x}
                cy={p.y}
                r="3.5"
                fill={i === 0 ? "#2563eb" : i === 1 ? "#4f46e5" : i === 2 ? "#0d9488" : i === 3 ? "#10b981" : i === 4 ? "#eab308" : "#f97316"}
                stroke="#ffffff"
                strokeWidth="1.5"
              />
            ))}

            {/* Smart non-overlapping Abbreviation Labels */}
            {["Dasar", "Sosial", "Ekonomi", "Lingk", "Akses", "Kelola"].map((label, i) => {
              const p = getPoint(i, 1.25);
              
              // Smart anchoring based on position in clockwise layout starting at top-center
              let textAnchor = "middle";
              if (i === 1 || i === 2) textAnchor = "start";
              if (i === 4 || i === 5) textAnchor = "end";
              
              let dy = 3;
              if (i === 0) dy = -3; // Push top label up
              if (i === 3) dy = 9;  // Push bottom label down
              
              return (
                <text
                  key={`lbl-${i}`}
                  x={p.x}
                  y={p.y + dy}
                  textAnchor={textAnchor}
                  className="fill-slate-500 font-black"
                  style={{ fontSize: "7.5px", textTransform: "uppercase", letterSpacing: "0.03em" }}
                >
                  {label}
                </text>
              );
            })}
          </svg>
        </div>

        {/* Detailed stats list */}
        <div className="flex-1 w-full space-y-3 lg:max-w-md flex justify-center flex-col">
          <div className="space-y-4">
            {dimensionsList.map((d) => (
              <div key={d.key} className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`w-2.5 h-2.5 rounded-full ${d.color} flex-shrink-0`} />
                  <span className="text-slate-600 font-bold truncate leading-none">
                    {d.label}
                  </span>
                </div>
                <span className="font-extrabold text-slate-800 font-mono tracking-tight pl-2">
                  {formatIndoDecimal(d.val)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-between items-center text-xs font-bold text-slate-700 border-t border-slate-100">
            <span>SKOR INDEKS DESA:</span>
            <span className="font-mono text-slate-800">{formatIndoDecimal(skorTotal)}</span>
          </div>

          {/* Large Overall ID Score Panel */}
          <div className="bg-slate-50 border border-slate-150 rounded-xl p-3 text-center mt-2">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block leading-none mb-1">
              RATA-RATA INDEKS DESA (SKOR INDEKS DESA)
            </span>
            <span className="text-2xl font-black text-blue-700 font-mono leading-none">
              {formatIndoPrecise(averagePoint)}
            </span>
            <div className="block mt-1.5">
              <span className={`py-0.5 px-2.5 rounded-full border text-[9px] font-bold inline-block ${kategoriColor}`}>
                Desa {kategori}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

