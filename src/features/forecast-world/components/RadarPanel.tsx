"use client";

import { Lock, RadioTower } from "lucide-react";
import type { RadarSignal } from "../types";

type RadarPanelProps = {
  signal: RadarSignal | null;
  t: (path: string) => string;
};

export const RadarPanel = ({ signal, t }: RadarPanelProps) => {
  if (!signal) {
    return (
      <section className="rounded-sm border-4 border-emerald-900 bg-zinc-950 p-6 text-center shadow-[8px_8px_0_rgba(6,78,59,0.3)]">
        <RadioTower className="mx-auto mb-4 h-10 w-10 text-emerald-500" />
        <p className="text-sm font-black uppercase text-zinc-400">{t("world.radar.pick_signal")}</p>
      </section>
    );
  }

  return (
    <section className="space-y-5 rounded-sm border-4 border-emerald-900 bg-zinc-950 p-6 text-white shadow-[8px_8px_0_rgba(6,78,59,0.3)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={`text-[10px] font-black uppercase ${signal.isLocked ? "text-orange-400" : "text-zinc-500"}`}>{signal.isLocked ? t("world.radar.locked") : t("world.radar.out_of_range")}</p>
          <h3 className="mt-1 text-2xl font-black uppercase leading-tight">{signal.market.title}</h3>
          <p className="mt-2 text-xs font-black uppercase text-zinc-500">{signal.market.description}</p>
        </div>
        <Lock className={`h-7 w-7 ${signal.isLocked ? "text-orange-400" : "text-red-500"}`} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="border-4 border-emerald-900 bg-emerald-500/15 p-4">
          <p className="text-[10px] font-black uppercase">YES</p>
          <p className="text-3xl font-black text-emerald-400">{(signal.market.yesPrice * 100).toFixed(0)}¢</p>
          <p className="text-[10px] font-black uppercase text-zinc-500">{signal.market.yesVolume.toLocaleString()} USDT</p>
        </div>
        <div className="border-4 border-red-950 bg-red-500/15 p-4">
          <p className="text-[10px] font-black uppercase">NO</p>
          <p className="text-3xl font-black text-red-400">{(signal.market.noPrice * 100).toFixed(0)}¢</p>
          <p className="text-[10px] font-black uppercase text-zinc-500">{signal.market.noVolume.toLocaleString()} USDT</p>
        </div>
      </div>

      <div className="border-4 border-emerald-900 bg-black p-4 text-[11px] font-black uppercase text-emerald-300">
        {t("world.radar.distance")}: {signal.distance.toFixed(1)} KM
      </div>
    </section>
  );
};
