"use client";

import { ShoppingCart } from "lucide-react";
import type { GameItem } from "../types";

type ItemShopPanelProps = {
  catalog: GameItem[];
  balance: number;
  onBuyItem: (item: GameItem) => void;
  t: (path: string) => string;
};

export const ItemShopPanel = ({ catalog, balance, onBuyItem, t }: ItemShopPanelProps) => {
  return (
    <section className="bg-zinc-950 border border-zinc-900 rounded-[2rem] p-6 space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <ShoppingCart className="w-5 h-5 text-orange-500" />
          <h3 className="text-sm font-black uppercase tracking-widest text-white">{t("world.item_shop")}</h3>
        </div>
        <span className="text-[10px] font-black text-zinc-500 uppercase">{balance.toLocaleString()} USDT</span>
      </div>
      <div className="space-y-3">
        {catalog.map((item) => (
          <div key={item.id} className="p-4 rounded-2xl bg-black border border-zinc-900">
            <div className="flex justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase text-white">{t(item.nameKey)}</p>
                <p className="mt-1 text-[10px] font-bold text-zinc-600 uppercase">{t(item.descriptionKey)}</p>
              </div>
              <p className="text-xs font-black text-emerald-500 whitespace-nowrap">{item.price} USDT</p>
            </div>
            <button
              type="button"
              disabled={balance < item.price}
              onClick={() => onBuyItem(item)}
              className="mt-4 w-full py-3 rounded-xl bg-orange-500 text-black text-[11px] font-black uppercase hover:bg-white disabled:bg-zinc-900 disabled:text-zinc-600 disabled:cursor-not-allowed transition-all"
            >
              {t("world.buy_item")}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
