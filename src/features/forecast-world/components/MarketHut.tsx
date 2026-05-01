"use client";

import { Home, Timer } from "lucide-react";
import type { WorldHut } from "../types";

type MarketHutProps = {
  hut: WorldHut;
  now: number;
  onSelect: (hut: WorldHut) => void;
  t: (path: string) => string;
};

export const MarketHut = ({ hut, now, onSelect, t }: MarketHutProps) => {
  const isExpired = new Date(hut.market.endDate).getTime() <= now;

  return (
    <button
      type="button"
      onClick={() => onSelect(hut)}
      className={`z-10 rounded-2xl border p-2 flex flex-col items-center justify-center gap-1 transition-all hover:scale-105 ${
        isExpired ? "bg-zinc-900 border-zinc-800 text-zinc-500" : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-black"
      }`}
      style={{ gridColumn: hut.position.x + 1, gridRow: hut.position.y + 1 }}
      title={hut.market.title}
    >
      <Home className="w-6 h-6" />
      <span className="max-w-[70px] truncate text-[9px] font-black uppercase">{hut.market.title}</span>
      <span className="flex items-center gap-1 text-[8px] font-black opacity-70">
        <Timer className="w-3 h-3" />
        {isExpired ? t("world.closed") : t("world.open")}
      </span>
    </button>
  );
};
