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
      <section className="relative flex flex-col items-center justify-center rounded-sm border-4 border-emerald-950 bg-zinc-950 py-12 text-center shadow-[10px_10px_0_rgba(6,78,59,0.35)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,transparent_70%)]" />
        <RadioTower className="relative mb-4 h-12 w-12 text-emerald-900 animate-pulse" />
        <p className="relative text-[10px] font-black uppercase tracking-widest text-zinc-600">{t("world.radar.pick_signal")}</p>
        <div className="mt-4 flex gap-1">
          <span className="h-1 w-4 bg-emerald-900/30" />
          <span className="h-1 w-8 bg-emerald-900/50" />
          <span className="h-1 w-4 bg-emerald-900/30" />
        </div>
      </section>
    );
  }

  const isLocked = signal.isLocked && !signal.isExpired;

  return (
    <section className="relative space-y-6 rounded-sm border-4 border-emerald-950 bg-zinc-950 p-6 text-white shadow-[10px_10px_0_rgba(6,78,59,0.35)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${isLocked ? "bg-orange-500 animate-pulse" : "bg-zinc-800"}`} />
            <p className={`text-[10px] font-black uppercase tracking-widest ${isLocked ? "text-orange-400" : "text-zinc-600"}`}>
              {isLocked ? "TARGET LOCKED" : "SIGNAL WEAK"}
            </p>
          </div>
          <h3 className="mt-2 text-2xl font-black uppercase leading-[1.1] tracking-tighter text-white drop-shadow-md">
            {signal.market.title}
          </h3>
          <p className="mt-3 text-[10px] font-black uppercase leading-relaxed text-zinc-500 line-clamp-3 border-l-2 border-emerald-900/50 pl-3">
            {signal.market.description}
          </p>
        </div>
        <div className={`rounded-sm border-2 p-2 ${isLocked ? "border-orange-500/50 bg-orange-500/10" : "border-zinc-900 bg-black"}`}>
          <Lock className={`h-6 w-6 ${isLocked ? "text-orange-400" : "text-zinc-800"}`} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="relative overflow-hidden rounded-sm border-2 border-emerald-900 bg-black/40 p-4 transition-all hover:bg-emerald-500/5">
          <p className="text-[9px] font-black uppercase text-emerald-700 tracking-widest">AFFIRMATIVE</p>
          <p className="mt-1 text-3xl font-black text-emerald-400 tracking-tighter">{(signal.market.yesPrice * 100).toFixed(0)}<span className="text-sm">¢</span></p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[8px] font-black text-zinc-600 uppercase">VOL</span>
            <span className="text-[9px] font-black text-emerald-800">{signal.market.yesVolume.toLocaleString()} USDT</span>
          </div>
          <div className="absolute right-0 bottom-0 h-1 w-full bg-emerald-500/10" />
        </div>
        <div className="relative overflow-hidden rounded-sm border-2 border-red-950 bg-black/40 p-4 transition-all hover:bg-red-500/5">
          <p className="text-[9px] font-black uppercase text-red-900 tracking-widest">NEGATIVE</p>
          <p className="mt-1 text-3xl font-black text-red-400 tracking-tighter">{(signal.market.noPrice * 100).toFixed(0)}<span className="text-sm">¢</span></p>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[8px] font-black text-zinc-600 uppercase">VOL</span>
            <span className="text-[9px] font-black text-red-900">{signal.market.noVolume.toLocaleString()} USDT</span>
          </div>
          <div className="absolute right-0 bottom-0 h-1 w-full bg-red-500/10" />
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-emerald-900/30 pt-4">
        <div className="flex flex-col">
          <span className="text-[8px] font-black text-zinc-600 uppercase">COORDINATE DISTANCE</span>
          <span className="text-sm font-black text-emerald-400">{signal.distance.toFixed(2)} KILOMETERS</span>
        </div>
        <div className="h-10 w-10 opacity-20 grayscale invert contrast-200">
           {/* Simple decoration */}
           <div className="h-full w-full border-2 border-emerald-400 rounded-full flex items-center justify-center">
              <div className="h-1/2 w-1/2 bg-emerald-400 rounded-full" />
           </div>
        </div>
      </div>
    </section>
  );
};
