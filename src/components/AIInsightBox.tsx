import React from "react";
import { Sparkles, BrainCircuit } from "lucide-react";

interface AIInsightBoxProps {
  title?: string;
  insight: React.ReactNode;
  className?: string;
}

export default function AIInsightBox({ title = "Analytic AI", insight, className = "" }: AIInsightBoxProps) {
  return (
    <div className={`group relative overflow-hidden rounded-2xl bg-white border border-indigo-100/60 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(79,70,229,0.08)] transition-all duration-500 ${className}`}>
      {/* Background decoration with animated glow on hover */}
      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-indigo-50/40 via-blue-50/20 to-white pointer-events-none" />
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      
      {/* Subtle border top accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-400 via-blue-500 to-sky-400 opacity-60" />

      {/* Shimmer sweep effect */}
      <div className="absolute inset-0 z-0 animate-shimmer opacity-[0.03] pointer-events-none" />
      
      <div className="relative z-10 p-5 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-5">
        <div className="flex-shrink-0">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100/80 flex items-center justify-center text-indigo-600 shadow-inner group-hover:scale-110 transition-transform duration-500">
            <BrainCircuit className="w-5 h-5 relative z-10" />
            <div className="absolute inset-0 rounded-xl bg-indigo-400/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </div>
        <div className="flex-1">
          <h4 className="text-[11px] font-black text-indigo-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            {title} <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          </h4>
          <div className="text-[13px] sm:text-sm font-medium text-slate-700 leading-relaxed font-sans">
            {insight}
          </div>
        </div>
      </div>
    </div>
  );
}
