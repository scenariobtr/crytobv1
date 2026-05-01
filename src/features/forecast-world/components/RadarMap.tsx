"use client";

import { Crosshair, Navigation } from "lucide-react";
import { WORLD_SIZE } from "../constants";
import type { FlightTelemetry, Position, RadarSignal } from "../types";
import { MarketSignal } from "./MarketSignal";
import { PlayerPlane } from "./PlayerPlane";

type RadarMapProps = {
  playerName: string;
  planePosition: Position;
  signals: RadarSignal[];
  selectedSignal: RadarSignal | null;
  telemetry: FlightTelemetry;
  onSelectSignal: (signal: RadarSignal) => void;
  onMoveTo: (position: Position) => void;
  t: (path: string) => string;
};

export const RadarMap = ({ playerName, planePosition, signals, selectedSignal, telemetry, onSelectSignal, onMoveTo, t }: RadarMapProps) => {
  const tiles = Array.from({ length: WORLD_SIZE.columns * WORLD_SIZE.rows }, (_, index) => ({
    x: index % WORLD_SIZE.columns,
    y: Math.floor(index / WORLD_SIZE.columns),
  }));

  return (
    <section className="overflow-hidden rounded-sm border-4 border-emerald-950 bg-zinc-950 p-4 shadow-[10px_10px_0_rgba(6,78,59,0.35)]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Crosshair className="h-5 w-5 text-emerald-400" />
          <div>
            <p className="text-xs font-black uppercase text-white">{t("world.radar.scan_online")}</p>
            <p className="text-[10px] font-black uppercase text-emerald-400">{selectedSignal?.isLocked ? t("world.radar.locked") : t("world.radar.searching")}</p>
          </div>
        </div>
        <div className="flex gap-2 text-[10px] font-black uppercase text-emerald-200">
          <span className="border-2 border-emerald-900 bg-black px-3 py-2">ALT {telemetry.altitude}</span>
          <span className="border-2 border-emerald-900 bg-black px-3 py-2">SPD {telemetry.speed}</span>
          <span className="border-2 border-emerald-900 bg-black px-3 py-2">{telemetry.heading}</span>
        </div>
      </div>

      <div
        className="relative grid gap-2 overflow-hidden border-4 border-emerald-900 bg-emerald-950 p-3 aspect-[8/6]"
        style={{
          gridTemplateColumns: `repeat(${WORLD_SIZE.columns}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${WORLD_SIZE.rows}, minmax(0, 1fr))`,
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.16)_2px,transparent_2px),linear-gradient(90deg,rgba(16,185,129,0.16)_2px,transparent_2px)] bg-[length:48px_48px]" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[140%] w-4 origin-top animate-[radarSweep_4s_linear_infinite] bg-emerald-300/25" />
        <div className="pointer-events-none absolute inset-8 rounded-full border-4 border-emerald-400/35" />
        <div className="pointer-events-none absolute inset-20 rounded-full border-4 border-emerald-400/20" />

        {tiles.map((tile) => (
          <button
            key={`${tile.x}-${tile.y}`}
            type="button"
            onClick={() => onMoveTo(tile)}
            className="z-10 rounded-sm border-2 border-emerald-900/60 bg-black/25 transition-all hover:bg-emerald-500/25"
            style={{ gridColumn: tile.x + 1, gridRow: tile.y + 1 }}
            aria-label={`${t("world.move_to")} ${tile.x}, ${tile.y}`}
          />
        ))}

        {signals.map((signal) => (
          <MarketSignal key={signal.id} signal={signal} onSelect={onSelectSignal} t={t} />
        ))}

        <PlayerPlane position={planePosition} name={playerName} />
      </div>

      <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase text-emerald-300">
        <Navigation className="h-4 w-4" />
        <span>{t("world.radar.coordinates")}: X{planePosition.x} Y{planePosition.y}</span>
      </div>

      <style jsx>{`
        @keyframes radarSweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};
