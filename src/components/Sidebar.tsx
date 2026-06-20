import React, { useState } from "react";
import {
  Home,
  BarChart3,
  Landmark,
  Trophy,
  Coins,
  FileCheck2,
  Users,
  Info,
  Menu,
  X,
  Table,
  Plane,
  Utensils,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: "ringkasan", label: "Ringkasan", icon: Home },
    { id: "sumber-data", label: "Sumber Data Sheets", icon: Table },
    { id: "indeks-desa", label: "Indeks Desa", icon: BarChart3 },
    { id: "bum-desa", label: "BUM Desa", icon: Landmark },
    { id: "pemeringkatan", label: "Pemeringkatan", icon: Trophy },
    { id: "pades", label: "Bagi Hasil PADes", icon: Coins },
    { id: "nib", label: "NIB & Program", icon: FileCheck2 },
    { id: "makan-bergizi-gratis", label: "MBG", icon: Utensils },
    { id: "desa-ekspor", label: "Desa Ekspor", icon: Plane },
    { id: "keterangan", label: "Keterangan", icon: Info },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-slate-900 text-slate-100 flex flex-col justify-between shadow-2xl transition-all duration-300 ease-in-out transform lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:sticky lg:h-screen border-r border-slate-800/80 bg-gradient-to-b from-slate-900 to-slate-950 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Collapse Toggle Button (Desktop Only) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3.5 top-8 w-7 h-7 bg-blue-600 rounded-full items-center justify-center text-white border-2 border-slate-900 shadow-lg hover:bg-blue-500 hover:scale-110 transition-all z-50 cursor-pointer"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Top Header & Logo */}
        <div className={`p-4 transition-all ${isCollapsed ? "pr-4" : "p-5"}`}>
          <div className={`flex items-center justify-between mb-8 ${isCollapsed ? "justify-center" : ""}`}>
            <div className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}>
              {/* Custom SVG Village/BUMDesa circular logo */}
              <div className="w-10 h-10 shrink-0 rounded-[14px] bg-gradient-to-br from-white to-slate-200 flex items-center justify-center p-1.5 shadow-[0_0_15px_rgba(255,255,255,0.15)] border border-slate-800">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full fill-none drop-shadow-xs"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="50" cy="50" r="45" fill="#f8fafc" />
                  <path d="M50 5 a45 45 0 0 1 45 45 z" fill="#bae6fd" opacity="0.6" />
                  <circle cx="50" cy="40" r="10" fill="#f59e0b" />
                  <polygon points="12,65 35,40 58,65" fill="#0ea5e9" />
                  <polygon points="40,70 65,45 90,70" fill="#0284c7" />
                  <polygon points="42,58 58,58 50,48" fill="#f97316" />
                  <rect x="44" y="58" width="12" height="12" fill="#fbbf24" />
                  <rect x="49" y="64" width="3" height="6" fill="#92400e" />
                  <path d="M10 75 Q30 65 50 75 T90 75" stroke="#22c55e" strokeWidth="6" strokeLinecap="round" />
                  <path d="M10 85 Q30 78 50 85 T90 85" stroke="#15803d" strokeWidth="8" strokeLinecap="round" />
                  <path d="M20 75 Q35 90 50 85" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
                  <path d="M80 75 Q65 90 50 85" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </div>
              
              {!isCollapsed && (
                <div className="text-left leading-none tracking-tight overflow-hidden transition-all duration-300">
                  <span className="block font-black text-[13px] tracking-wider text-blue-400 uppercase drop-shadow-sm">
                    PORTAL DATA
                  </span>
                  <span className="block text-[10px] font-bold text-slate-400 mt-0.5 tracking-widest uppercase">
                    Kementerian Desa
                  </span>
                </div>
              )}
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!isCollapsed && (
            <div className="px-3 mb-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
              Main Menu
            </div>
          )}

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  title={isCollapsed ? item.label : undefined}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsOpen(false);
                  }}
                  className={`group relative w-full flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-3"} py-2.5 rounded-xl text-xs font-semibold overflow-hidden isolation-auto cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? "bg-blue-600/10 text-white font-bold"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  }`}
                >
                  {/* Active Highlight Border */}
                  {isSelected && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                  )}
                  {isSelected && !isCollapsed && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent pointer-events-none" />
                  )}

                  <Icon className={`w-4 h-4 shrink-0 transition-transform duration-300 group-hover:scale-110 ${isSelected ? "text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" : "text-slate-500 group-hover:text-slate-300"}`} />
                  
                  {!isCollapsed && (
                    <span className={`text-left whitespace-nowrap transition-transform duration-300 ${isSelected ? "translate-x-1" : "group-hover:translate-x-1"}`}>
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Village SVG Vector Landscape Illustration */}
        <div className={`relative mt-auto w-full pt-12 overflow-hidden pointer-events-none transition-opacity duration-300 ${isCollapsed ? "opacity-0" : "opacity-40"}`}>
          {/* Layered landscape mountains background */}
          <svg
            viewBox="0 0 256 120"
            className="w-full h-auto translate-y-1 scale-105 origin-bottom"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Distant Mountains (Dark Teal Blue) */}
            <path d="M-20 120 L30 50 L100 120 Z" fill="#0f172a" opacity="0.8" />
            <path d="M60 120 L150 40 L240 120 Z" fill="#1e293b" opacity="0.9" />

            {/* Middle Hills (Muted Green-Blue) */}
            <path d="M-10 120 Q50 80 120 120 Z" fill="#0284c7" opacity="0.2" />
            <path d="M100 120 Q180 70 270 120 Z" fill="#0369a1" opacity="0.3" />

            {/* Tree 1 */}
            <circle cx="45" cy="110" r="10" fill="#0284c7" opacity="0.3" />
            <rect x="44" y="108" width="2" height="12" fill="#334155" />

            {/* House 1 */}
            <polygon points="15,115 35,115 25,108" fill="#475569" />
            <rect x="17" y="114" width="16" height="10" fill="#1e293b" />

            {/* Tree 2 */}
            <circle cx="215" cy="105" r="8" fill="#3b82f6" opacity="0.4" />
            <rect x="214" y="103" width="2" height="17" fill="#334155" />

            {/* House 2 */}
            <polygon points="180,118 198,118 189,112" fill="#38bdf8" />
            <rect x="182" y="117" width="14" height="8" fill="#0f172a" />

            {/* Winding road (Yellow/Beige path) */}
            <path
              d="M120 120 Q125 105 130 95 T145 75"
              stroke="#64748b"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              opacity="0.4"
            />
            
            {/* Grassy Foreground */}
            <path d="M-20 120 Q80 100 280 120 Z" fill="#0f172a" />
          </svg>
        </div>
      </aside>
    </>
  );
}
