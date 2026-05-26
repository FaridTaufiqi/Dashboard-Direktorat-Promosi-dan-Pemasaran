import React, { useState } from "react";
import { Coins, HelpCircle } from "lucide-react";
import { ProvinceData } from "../types";
import { formatIndoNumber } from "./KPICards";

interface BagiHasilPADesProps {
  data: ProvinceData;
  tahun: string;
}

export default function BagiHasilPADes({ data, tahun }: BagiHasilPADesProps) {
  const [activePointIdx, setActivePointIdx] = useState<number | null>(null);

  // Extract years and values
  const bagiHasil = data.bagiHasilPADes;
  const years = ["2022", "2023", "2024", "2025"];
  const values = years.map((y) => bagiHasil[y] || 0);

  // Extracted dynamically format
  const formatAuto = (val: number) => {
    if (val >= 1000000000) return (val / 1000000000).toFixed(1).replace(".", ",") + "M";
    if (val >= 1000000) return (val / 1000000).toFixed(1).replace(".", ",") + "Jt";
    return formatIndoNumber(Math.round(val));
  };

  // Math for SVG Chart
  const svgWidth = 330;
  const svgHeight = 160;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 25;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  // Dynamically calculate scale limits
  const maxVal = Math.max(...values, 10);
  const maxAxisLimit = Math.ceil(maxVal * 1.15); // Add 15% headroom

  // Get coordinates
  const getCoords = (index: number, val: number) => {
    const x = paddingLeft + (index * (chartWidth / (years.length - 1)));
    const y = svgHeight - paddingBottom - ((val / maxAxisLimit) * chartHeight);
    return { x, y };
  };

  const points = values.map((val, idx) => getCoords(idx, val));
  
  // Create line path string (Polyline)
  const linePathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.y}`).join(" ");
  
  // Create area path string (Connecting down to zero ground line)
  const areaPathD = `
    ${linePathD}
    L ${points[points.length - 1].x},${svgHeight - paddingBottom}
    L ${points[0].x},${svgHeight - paddingBottom}
    Z
  `;

  // Horizontal grid values
  const gridCount = 4;
  const gridLines = Array.from({ length: gridCount }).map((_, i) => {
    const fraction = (i + 1) / gridCount;
    const val = maxAxisLimit * fraction;
    const y = svgHeight - paddingBottom - (fraction * chartHeight);
    return { val, y };
  });

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between h-full">
      {/* Title */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest leading-none mb-1">
            BAGI HASIL BUM DESA KE PADES
          </h3>
          <div className="text-slate-400 hover:text-slate-600 cursor-help">
            <HelpCircle className="w-4 h-4" />
          </div>
        </div>
        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
          Kontribusi laba bersih BUM Desa (Rp)
        </p>
      </div>

      {/* Main SVG Area Line Chart */}
      <div className="my-3 relative flex items-center justify-center">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto overflow-visible select-none"
        >
          {/* Definitions for Gradients */}
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>

          {/* Horizontal grid lines */}
          {gridLines.map((line, idx) => (
            <g key={`grid-${idx}`}>
              <line
                x1={paddingLeft}
                y1={line.y}
                x2={svgWidth - paddingRight}
                y2={line.y}
                stroke="#f1f5f9"
                strokeWidth="1"
                strokeDasharray="4,4"
              />
              {/* Y Axis scale label values */}
              <text
                x={paddingLeft - 8}
                y={line.y + 3}
                className="fill-slate-400 font-bold font-mono text-left"
                style={{ fontSize: "8px", textAnchor: "end" }}
              >
                {formatAuto(line.val)}
              </text>
            </g>
          ))}

          {/* Baseline zero line */}
          <line
            x1={paddingLeft}
            y1={svgHeight - paddingBottom}
            x2={svgWidth - paddingRight}
            y2={svgHeight - paddingBottom}
            stroke="#cbd5e1"
            strokeWidth="1"
          />
          <text
            x={paddingLeft - 8}
            y={svgHeight - paddingBottom + 3}
            className="fill-slate-400 font-bold font-mono text-right"
            style={{ fontSize: "8px", textAnchor: "end" }}
          >
            0
          </text>

          {/* Shaded Area fill */}
          <path d={areaPathD} fill="url(#areaGradient)" />

          {/* Bold Line connecting coordinates */}
          <path
            d={linePathD}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive vertical hover helper line */}
          {activePointIdx !== null && (
            <line
              x1={points[activePointIdx].x}
              y1={paddingTop}
              x2={points[activePointIdx].x}
              y2={svgHeight - paddingBottom}
              stroke="#cbd5e1"
              strokeWidth="0.75"
              strokeDasharray="2,2"
            />
          )}

          {/* Active / Idle Points */}
          {points.map((p, i) => {
            const isHovered = activePointIdx === i;
            const isTargetYear = years[i] === tahun;
            
            // Highlight years color coding matching standard UI
            let dotColor = "#3b82f6"; // 2022
            if (i === 1) dotColor = "#10b981"; // 2023 green
            if (i === 2) dotColor = "#f59e0b"; // 2024 orange
            if (i === 3) dotColor = "#8b5cf6"; // 2025 violet matching template chart colors!

            return (
              <g key={`pt-${i}`}>
                {/* Pulse wave ring on the active selected Year */}
                {isTargetYear && (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="9"
                    fill="transparent"
                    stroke={dotColor}
                    strokeWidth="1.5"
                    className="animate-ping"
                    opacity="0.4"
                  />
                )}

                {/* Outer interactive hover ring */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? "8.5" : "6"}
                  fill={dotColor}
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="transition-all duration-150 cursor-pointer shadow-xs"
                  onMouseEnter={() => setActivePointIdx(i)}
                  onMouseLeave={() => setActivePointIdx(null)}
                />

                {/* Floating micro values above dots */}
                <text
                  x={p.x}
                  y={p.y - 10}
                  textAnchor="middle"
                  className={`font-mono font-extrabold ${isTargetYear ? "fill-blue-700 text-[10px]" : "fill-slate-600 text-[8px]"}`}
                >
                  {formatAuto(values[i])}
                </text>
              </g>
            );
          })}

          {/* X Axis labels (Years) */}
          {years.map((year, i) => {
            const isCurrent = year === tahun;
            return (
              <text
                key={`year-${i}`}
                x={points[i].x}
                y={svgHeight - paddingBottom + 16}
                textAnchor="middle"
                className={`font-semibold transition-all ${
                  isCurrent ? "fill-blue-600 font-extrabold text-[10px]" : "fill-slate-400 text-[8.5px]"
                }`}
              >
                {year}
              </text>
            );
          })}
        </svg>

        {/* Chart Legend info overlay box */}
        {activePointIdx !== null && (
          <div className="absolute top-1 right-2 bg-slate-900 text-white rounded-lg px-2 py-1 text-[10px] shadow-md border border-slate-700 pointer-events-none font-medium flex items-center gap-1.5 animate-fade-in z-20">
            <Coins className="w-3.5 h-3.5 text-amber-300" />
            <span>Tahun {years[activePointIdx]}:</span>
            <span className="font-extrabold text-amber-300 font-mono">Rp {formatIndoNumber(Math.round(values[activePointIdx]))}</span>
          </div>
        )}
      </div>

      {/* Target Status indicators */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs mt-4">
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 block" />2022</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block" />2023</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 block" />2024</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-500 block" />2025</span>
        </div>

        <div className="text-right text-[10px] font-bold text-slate-400">
          NILAI PADes AKTUAL
        </div>
      </div>
    </div>
  );
}
