"use client";

import { Home, Sparkles } from "lucide-react";
import type { GameItem, WorldHut } from "../types";

type HutDetailsPanelProps = {
  hut: WorldHut | null;
  selectedItem: GameItem | null;
  onUseItem: (side: "YES" | "NO") => void;
  t: (path: string) => string;
};

export const HutDetailsPanel = ({ hut, selectedItem, onUseItem, t }: HutDetailsPanelProps) => {
  if (!hut) {
    return (
      <section className="bg-zinc-950 border border-zinc-900 rounded-[2rem] p-6 min-h-64 flex flex-col items-center justify-center text-center">
        <Home className="w-10 h-10 text-zinc-700 mb-4" />
        <p className="text-sm font-black uppercase text-zinc-500">{t("world.empty_hut_prompt")}</p>
      </section>
    );
  }

  return (
    <section className="bg-zinc-950 border border-zinc-900 rounded-[2rem] p-6 space-y-6">
      <div>
        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">{t("world.selected_hut")}</p>
        <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">{hut.market.title}</h3>
        <p className="mt-2 text-sm font-bold text-zinc-500 uppercase">{hut.market.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
          <p className="text-[10px] font-black text-emerald-500 uppercase">YES</p>
          <p className="text-3xl font-black text-white italic">{(hut.market.yesPrice * 100).toFixed(0)}¢</p>
        </div>
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
          <p className="text-[10px] font-black text-red-500 uppercase">NO</p>
          <p className="text-3xl font-black text-white italic">{(hut.market.noPrice * 100).toFixed(0)}¢</p>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-black border border-zinc-900">
        <p className="text-[10px] font-black text-zinc-500 uppercase mb-1">{t("world.selected_item")}</p>
        <p className="text-sm font-black text-white uppercase flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-orange-500" />
          {selectedItem ? `${t(selectedItem.nameKey)} (${selectedItem.power} USDT)` : t("world.choose_item_first")}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          disabled={!selectedItem || selectedItem.side === "NO"}
          onClick={() => onUseItem("YES")}
          className="py-5 rounded-2xl bg-emerald-500 text-black text-xs font-black uppercase hover:bg-white disabled:bg-zinc-900 disabled:text-zinc-600 disabled:cursor-not-allowed transition-all"
        >
          {t("world.forecast_yes")}
        </button>
        <button
          type="button"
          disabled={!selectedItem || selectedItem.side === "YES"}
          onClick={() => onUseItem("NO")}
          className="py-5 rounded-2xl bg-red-600 text-white text-xs font-black uppercase hover:bg-white hover:text-black disabled:bg-zinc-900 disabled:text-zinc-600 disabled:cursor-not-allowed transition-all"
        >
          {t("world.forecast_no")}
        </button>
      </div>
    </section>
  );
};
