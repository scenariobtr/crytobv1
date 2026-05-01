"use client";

import { RadioTower, Timer } from "lucide-react";
import type { RadarSignal } from "../types";

type MarketSignalProps = {
  signal: RadarSignal;
  onSelect: (signal: RadarSignal) => void;
  t: (path: string) => string;
};

export const MarketSignal = ({ signal, onSelect, t }: MarketSignalProps) => {
  const tone = signal.isExpired
    ? "border-zinc-800 bg-zinc-950 text-zinc-600"
    : signal.isLocked
      ? "border-orange-300 bg-orange-500 text-black shadow-[0_0_28px_rgba(249,115,22,0.45)]"
      : signal.market.isHot
        ? "border-red-400 bg-red-600 text-white shadow-[0_0_24px_rgba(239,68,68,0.38)]"
        : "border-emerald-400 bg-emerald-500 text-black shadow-[0_0_18px_rgba(16,185,129,0.35)]";

  return (
    <button
      type="button"
      onClick={() => onSelect(signal)}
      className={`z-20 relative flex flex-col items-center justify-center gap-1 rounded-sm border-4 p-2 transition-all hover:scale-105 ${tone}`}
      style={{ gridColumn: signal.position.x + 1, gridRow: signal.position.y + 1 }}
      title={signal.market.title}
    >
      {!signal.isExpired && <span className="absolute inset-[-8px] rounded-sm border-2 border-current opacity-30 animate-ping" />}
      {signal.isLocked && <span className="absolute inset-[-12px] rounded-sm border-4 border-orange-300" />}
      <RadioTower className="h-6 w-6" />
      <span className="max-w-20 truncate text-[9px] font-black uppercase">{signal.market.title}</span>
      <span className="flex items-center gap-1 text-[8px] font-black opacity-80">
        <Timer className="h-3 w-3" />
        {signal.isExpired ? t("world.closed") : `${signal.distance.toFixed(1)} KM`}
      </span>
    </button>
  );
};
