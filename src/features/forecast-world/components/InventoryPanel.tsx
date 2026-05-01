"use client";

import { Package } from "lucide-react";
import type { GameItem, InventoryItem } from "../types";

type InventoryPanelProps = {
  inventory: InventoryItem[];
  catalog: GameItem[];
  selectedItemId: string | null;
  onSelectItem: (itemId: string) => void;
  t: (path: string) => string;
};

export const InventoryPanel = ({ inventory, catalog, selectedItemId, onSelectItem, t }: InventoryPanelProps) => {
  return (
    <section className="bg-zinc-950 border border-zinc-900 rounded-[2rem] p-6 space-y-5">
      <div className="flex items-center gap-3">
        <Package className="w-5 h-5 text-emerald-500" />
        <h3 className="text-sm font-black uppercase tracking-widest text-white">{t("world.inventory")}</h3>
      </div>
      <div className="space-y-3">
        {inventory.length === 0 && <p className="text-xs font-bold text-zinc-600 uppercase">{t("world.empty_inventory")}</p>}
        {inventory.map((entry) => {
          const item = catalog.find((catalogItem) => catalogItem.id === entry.itemId);
          if (!item) return null;

          return (
            <button
              key={entry.itemId}
              type="button"
              onClick={() => onSelectItem(entry.itemId)}
              className={`w-full p-4 rounded-2xl border text-left transition-all ${selectedItemId === entry.itemId ? "bg-emerald-500 text-black border-emerald-400" : "bg-black border-zinc-900 text-zinc-300 hover:border-emerald-500/30"}`}
            >
              <div className="flex justify-between gap-3">
                <span className="text-xs font-black uppercase">{t(item.nameKey)}</span>
                <span className="text-xs font-black">x{entry.quantity}</span>
              </div>
              <p className="mt-1 text-[10px] font-bold opacity-70 uppercase">{t(item.descriptionKey)}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
};
