import React from "react";
import { Award, ShieldAlert, Sparkles } from "lucide-react";
import { ProvinceData } from "../types";
import { formatIndoDecimal } from "./KPICards";

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
    { key: "tataKelola", label: "Tata Kelola Pemerintahan", val: dims.tataKelola, color: "bg-orange-500" },
  ];

  const skorTotal = Number((dims.layananDasar + dims.sosial + dims.ekonomi + dims.lingkungan + dims.aksesibilitas + dims.tataKelola).toFixed(3));
  const rataRata = Number((skorTotal / 6).toFixed(3));

  // Determine Kategori Kinerja
  let kategori = "Berkembang";
  let kategoriColor = "text-amber-500 bg-amber-50 border-amber-100";
  if (rataRata >= 0.75) {
    kategori = "Mandiri";
    kategoriColor = "text-emerald-600 bg-emerald-50 border-emerald-100";
  } else if (rataRata >= 0.70) {
    kategori = "Maju";
    kategoriColor = "text-blue-600 bg-blue-50 border-blue-100";
  } else if (rataRata < 0.50) {
    kategori = "Tertinggal";
    kategoriColor = "text-rose-600 bg-rose-50 border-rose-100";
  }

  // --- MATHEMATICAL MATH FOR THE SVG RADAR CHART ---
  const width = 220;
  const height = 220;
  const center = 110;
  const maxRadius = 80;

  // Function to get x,y for a specific dimension index (0 to 5) and magnitude (0 to 1)
  const getPoint = (index: number, value: number) => {
    const angle = (index * 60 - 90) * (Math.PI / 180); // Start top-center (-90 deg)
    const x = center + maxRadius * value * Math.cos(angle);
    const y = center + maxRadius * value * Math.sin(angle);
    return { x, y };
  };

  // 1. Concentric grid layers (for values 0.25, 0.5, 0.75, 1.0)
  const gridLevels = [0.25, 0.5, 0.75, 1.0];
  const gridPaths = gridLevels.map((level) => {
    const points = Array.from({ length: 6 }).map((_, i) => {
      const p = getPoint(i, level);
      return `${p.x},${p.y}`;
    });
    return `M ${points.join(" L ")} Z`;
  });

  // 2. Data shape paths
  const dataPoints = dimensionsList.map((d, i) => getPoint(i, d.val));
  const dataPathD = `M ${dataPoints.map((p) => `${p.x},${p.y}`).join(" L ")} Z`;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between h-full">
      {/* Title */}
      <div>
        <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest leading-none mb-1">
          RINCIAN INDEKS DESA
        </h3>
        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
          Pengukuran 6 pilar indeks pembangunan
        </p>
      </div>

      {/* Main Grid: Radar on Left, List on Right */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center my-4">
        {/* Left Col: SVG Radar Chart */}
        <div className="sm:col-span-6 flex justify-center items-center relative">
          <svg width={width} height={height} className="w-full max-w-[200px] h-auto overflow-visible select-none">
            {/* Grid concentric shapes */}
            {gridPaths.map((path, idx) => (
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
                  y={p.y + 10}
                  className="fill-slate-400 font-bold"
                  style={{ fontSize: "7px", fontFamily: "monospace" }}
                >
                  {level.toFixed(2).replace(".", ",")}
                </text>
              );
            })}

            {/* Radial spoke lines */}
            {Array.from({ length: 6 }).map((_, i) => {
              const outerPoint = getPoint(i, 1.0);
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
              fill="rgba(37, 99, 235, 0.15)"
              stroke="#2563eb"
              strokeWidth="2"
              className="animate-pulse"
            />

            {/* Outer vertices data markers */}
            {dataPoints.map((p, i) => (
              <g key={`pt-${i}`}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="4"
                  fill={i === 0 ? "#2563eb" : i === 1 ? "#4f46e5" : i === 2 ? "#0d9488" : i === 3 ? "#10b981" : i === 4 ? "#eab308" : "#f97316"}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  className="transition-transform duration-200 hover:scale-150 cursor-pointer"
                />
                
                {/* Micro value tags inside the SVG near vertices */}
                <text
                  x={p.x + (p.x > center ? 6 : -22)}
                  y={p.y + (p.y > center ? 7 : -4)}
                  className="fill-slate-700 font-extrabold"
                  style={{ fontSize: "8px", fontFamily: "monospace" }}
                >
                  {dimensionsList[i].val.toFixed(3).replace(".", ",")}
                </text>
              </g>
            ))}

            {/* Short abbreviations for vertices in radar */}
            {["Dasar", "Sosial", "Ekon", "Ling", "Akses", "Kelola"].map((label, i) => {
              const p = getPoint(i, 1.15);
              return (
                <text
                  key={`lbl-${i}`}
                  x={p.x}
                  y={p.y}
                  textAnchor="middle"
                  className="fill-slate-500 font-bold"
                  style={{ fontSize: "7px", textTransform: "uppercase" }}
                >
                  {label}
                </text>
              );
            })}
          </svg>
        </div>

        {/* Right Col: Dimensions List score dashboard */}
        <div className="sm:col-span-6 space-y-2 mt-2 sm:mt-0">
          <div className="space-y-1.5">
            {dimensionsList.map((d) => (
              <div key={d.key} className="flex justify-between items-center text-xs border-b border-slate-50 pb-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className={`w-2 h-2 rounded-full ${d.color} flex-shrink-0`} />
                  <span className="text-slate-500 font-medium truncate leading-none">
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
            <span className="font-mono">{formatIndoDecimal(skorTotal)}</span>
          </div>

          {/* Large Overall ID Score Panel */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-none mb-1.5">
              Indeks Desa (ID {tahun})
            </span>
            <span className="text-2xl font-extrabold text-blue-700 font-mono leading-none">
              {formatIndoDecimal(rataRata)}
            </span>
            <div className={`mt-2 py-0.5 px-2 rounded-full border text-[10px] font-bold inline-block ${kategoriColor}`}>
              Desa {kategori}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
