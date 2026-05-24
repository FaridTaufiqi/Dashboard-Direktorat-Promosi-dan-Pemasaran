import React from "react";
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
  Table
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
  const menuItems = [
    { id: "ringkasan", label: "Ringkasan", icon: Home },
    { id: "sumber-data", label: "Sumber Data Sheets", icon: Table },
    { id: "indeks-desa", label: "Indeks Desa", icon: BarChart3 },
    { id: "bum-desa", label: "BUM Desa", icon: Landmark },
    { id: "pemeringkatan", label: "Pemeringkatan", icon: Trophy },
    { id: "pades", label: "Bagi Hasil PADes", icon: Coins },
    { id: "nib", label: "NIB & Program", icon: FileCheck2 },
    { id: "bumdes-bersama", label: "BUM Desa Bersama", icon: Users },
    { id: "keterangan", label: "Keterangan", icon: Info },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-100 flex flex-col justify-between shadow-xl transition-transform duration-300 transform lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:sticky lg:h-screen border-r border-slate-800`}
      >
        {/* Top Header & Logo */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              {/* Custom SVG Village/BUMDesa circular logo */}
              <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center p-1.5 shadow-md border border-slate-700">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full fill-none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Sky & Sun */}
                  <circle cx="50" cy="50" r="45" fill="#f8fafc" />
                  <path d="M50 5 a45 45 0 0 1 45 45 z" fill="#bae6fd" opacity="0.5" />
                  <circle cx="50" cy="40" r="10" fill="#f59e0b" />
                  
                  {/* Mountains */}
                  <polygon points="12,65 35,40 58,65" fill="#0284c7" />
                  <polygon points="40,70 65,45 90,70" fill="#0369a1" />
                  
                  {/* Village House */}
                  <polygon points="42,58 58,58 50,48" fill="#ea580c" />
                  <rect x="44" y="58" width="12" height="12" fill="#f59e0b" />
                  <rect x="49" y="64" width="3" height="6" fill="#78350f" />
                  
                  {/* Soil & Fields */}
                  <path d="M10 75 Q30 65 50 75 T90 75" stroke="#22c55e" strokeWidth="6" strokeLinecap="round" />
                  <path d="M10 85 Q30 78 50 85 T90 85" stroke="#15803d" strokeWidth="8" strokeLinecap="round" />
                  
                  {/* Framing Leaves */}
                  <path d="M20 75 Q35 90 50 85" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
                  <path d="M80 75 Q65 90 50 85" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </div>
              <div className="text-left leading-none">
                <span className="block font-black text-xs tracking-wider text-blue-400 uppercase">
                  PORTAL DATA
                </span>
                <span className="block text-[11px] font-bold text-slate-400 mt-0.5">
                  DESA & BUMDES
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            MENU UTAMA
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsOpen(false); // Close drawer on mobile
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-md shadow-blue-900/30 font-bold"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isSelected ? "text-white" : "text-slate-500"}`} />
                  <span className="text-left">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Village SVG Vector Landscape Illustration */}
        <div className="relative mt-auto w-full pt-12 overflow-hidden pointer-events-none opacity-40">
          {/* Layered landscape mountains background */}
          <svg
            viewBox="0 0 256 120"
            className="w-full h-auto translate-y-1 scale-105 origin-bottom"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Distant Mountains (Dark Teal Blue) */}
            <path
              d="M-20 120 L30 50 L100 120 Z"
              fill="#0f172a"
              opacity="0.8"
            />
            <path
              d="M60 120 L150 40 L240 120 Z"
              fill="#1e293b"
              opacity="0.9"
            />

            {/* Middle Hills (Muted Green-Blue) */}
            <path
              d="M-10 120 Q50 80 120 120 Z"
              fill="#0284c7"
              opacity="0.2"
            />
            <path
              d="M100 120 Q180 70 270 120 Z"
              fill="#0369a1"
              opacity="0.3"
            />

            {/* Farmhouses and Trees */}
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
            <path
              d="M-20 120 Q80 100 280 120 Z"
              fill="#0f172a"
            />
          </svg>
        </div>
      </aside>
    </>
  );
}
