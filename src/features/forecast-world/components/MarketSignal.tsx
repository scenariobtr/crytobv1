"use client";

import type { RadarSignal } from "../types";

type MarketSignalProps = {
  signal: RadarSignal;
  onSelect: (signal: RadarSignal) => void;
};

export const MarketSignal = ({ signal, onSelect }: MarketSignalProps) => {
  const isLocked = signal.isLocked && !signal.isExpired;
  
  return (
    <div className="relative flex items-center justify-center">
      {/* Radar Pulse Effect (Visible when locked/near) */}
      {isLocked && (
        <>
          <div className="absolute h-16 w-16 animate-ping rounded-full border-2 border-emerald-400 opacity-20" />
          <div className="absolute h-12 w-12 animate-[ping_2s_linear_infinite] rounded-full border-2 border-emerald-500/40" />
          <div className="absolute h-8 w-8 animate-[ping_3s_linear_infinite] rounded-full border-2 border-emerald-500/60" />
        </>
      )}

      {/* Main Signal Button (The Dot) */}
      <button
        type="button"
        onClick={() => onSelect(signal)}
        className={`group relative z-20 flex h-4 w-4 items-center justify-center transition-all duration-500 ${
          signal.isExpired ? "opacity-30 grayscale" : "opacity-100"
        }`}
        title={signal.market.title}
      >
        {/* Core Dot */}
        <div className={`h-2 w-2 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)] transition-all duration-300 ${
          signal.isExpired 
            ? "bg-zinc-600" 
            : isLocked 
              ? "bg-orange-500 scale-150 shadow-[0_0_15px_rgba(249,115,22,0.9)]" 
              : "bg-emerald-500 group-hover:scale-125"
        }`} />
        
        {/* Label (Visible when locked or hovered) */}
        <div className={`absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-sm border border-emerald-900 bg-black/90 px-2 py-1 text-[10px] font-black uppercase tracking-tighter text-emerald-400 shadow-xl transition-all duration-300 ${
          isLocked || signal.isLocked ? "scale-100 opacity-100 translate-y-0" : "scale-0 opacity-0 translate-y-2 group-hover:scale-100 group-hover:opacity-100 group-hover:translate-y-0"
        }`}>
          <div className="flex flex-col items-center">
            <span>{signal.market.title}</span>
            {!signal.isExpired && (
              <span className={`text-[8px] ${isLocked ? "text-orange-400" : "text-emerald-600"}`}>
                {signal.distance.toFixed(1)} KM
              </span>
            )}
          </div>
          {/* Arrow */}
          <div className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rotate-45 border-b border-r border-emerald-900 bg-black/90" />
        </div>
      </button>

      {/* Background Glow for Dot */}
      {!signal.isExpired && (
        <div className={`absolute h-6 w-6 animate-pulse rounded-full opacity-20 ${
          isLocked ? "bg-orange-500" : "bg-emerald-500"
        }`} />
      )}
    </div>
  );
};
