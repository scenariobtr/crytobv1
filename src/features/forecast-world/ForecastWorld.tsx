"use client";

import { useEffect, useMemo, useState } from "react";
import type { User } from "@/data/mockUsers";
import type { Thread } from "@/modules/market/service";
import { HUT_POSITIONS, ITEM_CATALOG } from "./constants";
import type { GameItem, InventoryItem, WorldHut } from "./types";
import { HutDetailsPanel } from "./components/HutDetailsPanel";
import { InventoryPanel } from "./components/InventoryPanel";
import { ItemShopPanel } from "./components/ItemShopPanel";
import { WorldMap } from "./components/WorldMap";
import { useAvatarMovement } from "./hooks/useAvatarMovement";

type ForecastWorldProps = {
  currentUser: User;
  threads: Thread[];
  balance: number;
  onBuyItem: (item: GameItem) => boolean;
  onUseItem: (thread: Thread, side: "YES" | "NO", item: GameItem) => void;
  t: (path: string) => string;
};

const increaseInventory = (inventory: InventoryItem[], itemId: string): InventoryItem[] => {
  const existing = inventory.find((entry) => entry.itemId === itemId);
  if (existing) {
    return inventory.map((entry) => entry.itemId === itemId ? { ...entry, quantity: entry.quantity + 1 } : entry);
  }
  return [...inventory, { itemId, quantity: 1 }];
};

const decreaseInventory = (inventory: InventoryItem[], itemId: string): InventoryItem[] => {
  return inventory
    .map((entry) => entry.itemId === itemId ? { ...entry, quantity: entry.quantity - 1 } : entry)
    .filter((entry) => entry.quantity > 0);
};

export const ForecastWorld = ({ currentUser, threads, balance, onBuyItem, onUseItem, t }: ForecastWorldProps) => {
  const { position, moveBy, moveTo } = useAvatarMovement();
  const [now, setNow] = useState(() => Date.now());
  const [selectedHut, setSelectedHut] = useState<WorldHut | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { itemId: "forecast-ticket", quantity: 1 },
  ]);

  const huts = useMemo<WorldHut[]>(() => {
    return threads.map((thread, index) => ({
      id: `hut-${thread.id}`,
      market: thread,
      position: HUT_POSITIONS[index % HUT_POSITIONS.length],
    }));
  }, [threads]);

  const selectedItem = selectedItemId ? ITEM_CATALOG.find((item) => item.id === selectedItemId) ?? null : null;

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleBuyItem = (item: GameItem) => {
    const didBuy = onBuyItem(item);
    if (!didBuy) return;
    setInventory((current) => increaseInventory(current, item.id));
    setSelectedItemId(item.id);
  };

  const handleUseItem = (side: "YES" | "NO") => {
    if (!selectedHut || !selectedItem) return;
    onUseItem(selectedHut.market, side, selectedItem);
    setInventory((current) => decreaseInventory(current, selectedItem.id));
    const remaining = inventory.find((entry) => entry.itemId === selectedItem.id)?.quantity ?? 0;
    if (remaining <= 1) setSelectedItemId(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">{t("world.title")}</h2>
          <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mt-1">
            {t("world.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {[
            ["W", t("world.up")],
            ["A", t("world.left")],
            ["S", t("world.down")],
            ["D", t("world.right")],
          ].map(([key, label]) => (
            <div key={key} className="px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-900 text-center">
              <p className="text-sm font-black text-white leading-none">{key}</p>
              <p className="mt-1 text-[8px] font-black text-zinc-600 uppercase">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 space-y-5">
          <WorldMap
            playerName={currentUser.username}
            playerPosition={position}
            now={now}
            huts={huts}
            t={t}
            onSelectHut={setSelectedHut}
            onOpenShop={() => moveTo({ x: 6, y: 4 })}
            onMoveTo={moveTo}
          />
          <div className="grid grid-cols-4 gap-3">
            <button type="button" onClick={() => moveBy({ x: 0, y: -1 })} className="py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-black uppercase hover:bg-emerald-500 hover:text-black transition-all">{t("world.up")}</button>
            <button type="button" onClick={() => moveBy({ x: -1, y: 0 })} className="py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-black uppercase hover:bg-emerald-500 hover:text-black transition-all">{t("world.left")}</button>
            <button type="button" onClick={() => moveBy({ x: 0, y: 1 })} className="py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-black uppercase hover:bg-emerald-500 hover:text-black transition-all">{t("world.down")}</button>
            <button type="button" onClick={() => moveBy({ x: 1, y: 0 })} className="py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-black uppercase hover:bg-emerald-500 hover:text-black transition-all">{t("world.right")}</button>
          </div>
        </div>

        <div className="xl:col-span-4 space-y-6">
          <HutDetailsPanel hut={selectedHut} selectedItem={selectedItem} onUseItem={handleUseItem} t={t} />
          <InventoryPanel inventory={inventory} catalog={ITEM_CATALOG} selectedItemId={selectedItemId} onSelectItem={setSelectedItemId} t={t} />
          <ItemShopPanel catalog={ITEM_CATALOG} balance={balance} onBuyItem={handleBuyItem} t={t} />
        </div>
      </div>
    </div>
  );
};
