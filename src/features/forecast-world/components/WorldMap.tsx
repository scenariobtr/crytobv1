"use client";

import { ShoppingBag } from "lucide-react";
import { SHOP_POSITION, WORLD_SIZE } from "../constants";
import type { Position, WorldHut } from "../types";
import { MarketHut } from "./MarketHut";
import { PlayerAvatar } from "./PlayerAvatar";

type WorldMapProps = {
  playerName: string;
  playerPosition: Position;
  now: number;
  huts: WorldHut[];
  t: (path: string) => string;
  onSelectHut: (hut: WorldHut) => void;
  onOpenShop: () => void;
  onMoveTo: (position: Position) => void;
};

export const WorldMap = ({ playerName, playerPosition, now, huts, t, onSelectHut, onOpenShop, onMoveTo }: WorldMapProps) => {
  const tiles = Array.from({ length: WORLD_SIZE.columns * WORLD_SIZE.rows }, (_, index) => ({
    x: index % WORLD_SIZE.columns,
    y: Math.floor(index / WORLD_SIZE.columns),
  }));

  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-[2rem] p-6 shadow-2xl">
      <div
        className="grid gap-2 aspect-[8/6]"
        style={{
          gridTemplateColumns: `repeat(${WORLD_SIZE.columns}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${WORLD_SIZE.rows}, minmax(0, 1fr))`,
        }}
      >
        {tiles.map((tile) => (
          <button
            key={`${tile.x}-${tile.y}`}
            type="button"
            onClick={() => onMoveTo(tile)}
            className="rounded-2xl bg-zinc-900/70 border border-zinc-800 hover:border-emerald-500/30 transition-all"
            style={{ gridColumn: tile.x + 1, gridRow: tile.y + 1 }}
            aria-label={`${t("world.move_to")} ${tile.x}, ${tile.y}`}
          />
        ))}

        <button
          type="button"
          onClick={onOpenShop}
          className="z-10 rounded-2xl border border-orange-500/30 bg-orange-500/10 text-orange-400 hover:bg-orange-500 hover:text-black transition-all flex flex-col items-center justify-center gap-1"
          style={{ gridColumn: SHOP_POSITION.x + 1, gridRow: SHOP_POSITION.y + 1 }}
        >
          <ShoppingBag className="w-6 h-6" />
          <span className="text-[9px] font-black uppercase">{t("world.shop")}</span>
        </button>

        {huts.map((hut) => (
          <MarketHut key={hut.id} hut={hut} now={now} onSelect={onSelectHut} t={t} />
        ))}

        <PlayerAvatar position={playerPosition} name={playerName} />
      </div>
    </div>
  );
};
