"use client";

import type React from "react";
import { Crosshair, Navigation } from "lucide-react";
import { WORLD_SIZE } from "../constants";
import type { AircraftConfig, CombatAction, FlightTelemetry, Position, RadarSignal } from "../types";
import { MarketSignal } from "./MarketSignal";
import { PlayerPlane } from "./PlayerPlane";

type MissileStyle = React.CSSProperties & {
  "--start-x": string;
  "--start-y": string;
  "--target-x": string;
  "--target-y": string;
};

type RadarMapProps = {
  playerName: string;
  planePosition: Position;
  signals: RadarSignal[];
  selectedSignal: RadarSignal | null;
  telemetry: FlightTelemetry;
  aircraftConfig?: AircraftConfig;
  combatAction?: CombatAction | null;
  onSelectSignal: (signal: RadarSignal) => void;
  onMoveTo: (position: Position) => void;
  t: (path: string) => string;
};

export const RadarMap = ({ playerName, planePosition, signals, selectedSignal, telemetry, aircraftConfig, combatAction, onSelectSignal, onMoveTo, t }: RadarMapProps) => {
  const tiles = Array.from({ length: WORLD_SIZE.columns * WORLD_SIZE.rows }, (_, index) => ({
    x: index % WORLD_SIZE.columns,
    y: Math.floor(index / WORLD_SIZE.columns),
  }));

  const isCombatActive = Boolean(combatAction);

  return (
    <section className="overflow-hidden rounded-sm border-2 border-emerald-950 bg-zinc-950 p-2 shadow-[5px_5px_0_rgba(6,78,59,0.35)] sm:p-3 md:border-4 md:p-4 md:shadow-[10px_10px_0_rgba(6,78,59,0.35)]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 md:gap-4">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="relative h-8 w-8 md:h-10 md:w-10 overflow-hidden rounded-full border-2 border-emerald-500/50 bg-emerald-950/30 p-1">
            <Crosshair className={`h-full w-full ${isCombatActive ? "text-red-500 scale-125 animate-pulse" : "text-emerald-400"} transition-all`} />
            <div className="absolute inset-0 animate-[radarSweep_4s_linear_infinite] bg-gradient-to-t from-emerald-500/20 to-transparent" />
          </div>
          <div>
            <p className="text-[10px] md:text-xs font-black uppercase text-white tracking-widest">{t("world.radar.scan_online")}</p>
            <div className="flex items-center gap-1.5 md:gap-2">
              <span className={`h-1 w-1 md:h-1.5 md:w-1.5 rounded-full ${isCombatActive ? "bg-red-500 animate-ping" : selectedSignal?.isLocked ? "bg-orange-500 animate-pulse" : "bg-emerald-500 animate-ping"}`} />
              <p className={`text-[8px] md:text-[10px] font-black uppercase tracking-tighter ${isCombatActive ? "text-red-500" : "text-emerald-400"}`}>
                {isCombatActive ? "WEAPONS RELEASED" : selectedSignal?.isLocked ? t("world.radar.locked") : t("world.radar.searching")}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 md:gap-2 text-[8px] md:text-[10px] font-black uppercase text-emerald-200">
          <div className="flex flex-col border-2 border-emerald-900 bg-black/80 px-2 md:px-3 py-1">
            <span className="text-[6px] md:text-[7px] text-emerald-600">ALTITUDE</span>
            <span>{telemetry.altitude} FT</span>
          </div>
          <div className="flex flex-col border-2 border-emerald-900 bg-black/80 px-2 md:px-3 py-1">
            <span className="text-[6px] md:text-[7px] text-emerald-600">VELOCITY</span>
            <span>{telemetry.speed} KTS</span>
          </div>
          <div className="flex flex-col border-2 border-emerald-900 bg-black/80 px-2 md:px-3 py-1">
            <span className="text-[6px] md:text-[7px] text-emerald-600">HEADING</span>
            <span>{telemetry.heading}</span>
          </div>
        </div>
      </div>

      <div
        className={`relative aspect-[4/5] overflow-hidden border-2 border-emerald-900 bg-emerald-950 transition-all duration-700 sm:aspect-[8/6] md:border-4 ${isCombatActive ? "border-red-900 shadow-[0_0_50px_rgba(127,29,29,0.4)] sm:scale-[1.03]" : ""}`}
      >
        {/* Terrain Map Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center grayscale contrast-125 brightness-75 transition-all duration-700"
          style={{ 
            backgroundImage: 'url("/radar-map.png")',
            filter: isCombatActive ? "grayscale(0.5) contrast(1.5) brightness(0.5) sepia(0.2) hue-rotate(-20deg)" : "grayscale(1) contrast(1.25) brightness(0.75)"
          }}
        />
        
        {/* Tactical Overlays */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(6,78,59,0.4)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[length:32px_32px]" />
        
        {/* Radar Sweep */}
        {!isCombatActive && <div className="pointer-events-none absolute left-1/2 top-1/2 h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2 origin-center animate-[radarSweep_6s_linear_infinite] bg-[conic-gradient(from_0deg,rgba(16,185,129,0.15)_0deg,transparent_60deg,transparent_360deg)]" />}

        {/* Navigation Grid (Invisible buttons for interaction) */}
        <div 
          className="absolute inset-0 grid"
          style={{
            gridTemplateColumns: `repeat(${WORLD_SIZE.columns}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${WORLD_SIZE.rows}, minmax(0, 1fr))`,
          }}
        >
          {tiles.map((tile) => (
            <button
              key={`${tile.x}-${tile.y}`}
              type="button"
              disabled={isCombatActive}
              onClick={() => onMoveTo(tile)}
              className="z-10 bg-transparent transition-all hover:bg-emerald-500/5 group"
              aria-label={`${t("world.move_to")} ${tile.x}, ${tile.y}`}
            >
               <span className="opacity-0 group-hover:opacity-100 text-[8px] text-emerald-500/30 font-mono">
                {tile.x},{tile.y}
               </span>
            </button>
          ))}
        </div>

        {/* Signals and Plane */}
        <div 
          className="absolute inset-0 grid pointer-events-none"
          style={{
            gridTemplateColumns: `repeat(${WORLD_SIZE.columns}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${WORLD_SIZE.rows}, minmax(0, 1fr))`,
          }}
        >
          {signals.map((signal) => (
            <div 
              key={signal.id}
              className="relative flex items-center justify-center pointer-events-auto"
              style={{ gridColumn: signal.position.x + 1, gridRow: signal.position.y + 1 }}
            >
              <MarketSignal signal={signal} onSelect={onSelectSignal} />
            </div>
          ))}

          <div 
            className="relative flex items-center justify-center transition-all duration-1000 ease-in-out"
            style={{ gridColumn: planePosition.x + 1, gridRow: planePosition.y + 1 }}
          >
            <PlayerPlane config={aircraftConfig} name={playerName} />
          </div>
        </div>

        {/* Combat Layer (Locking, Missiles and Explosions) */}
        {combatAction && (
          <div className="absolute inset-0 pointer-events-none z-50">
            {/* Target Lock UI */}
            {combatAction.type === "LOCKING" && (
              <div 
                className="absolute h-24 w-24 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                style={{
                  left: `${(combatAction.targetPos.x + 0.5) * (100 / WORLD_SIZE.columns)}%`,
                  top: `${(combatAction.targetPos.y + 0.5) * (100 / WORLD_SIZE.rows)}%`,
                }}
              >
                 <div className="absolute inset-0 border-4 border-red-500 rounded-full animate-ping opacity-50" />
                 <div className="absolute inset-4 border-2 border-dashed border-red-500 rounded-full animate-[spin_1s_linear_infinite]" />
                 <Crosshair className="w-12 h-12 text-red-500 animate-pulse" />
                 <div className="absolute -top-8 whitespace-nowrap text-[10px] font-black text-red-500 tracking-widest animate-bounce">
                    TARGET LOCKED // ACQUIRING...
                 </div>
              </div>
            )}

            {/* Missile */}
            {combatAction.type === "MISSILE_LAUNCH" && (
              <div 
                className={`absolute h-4 w-1 rounded-full shadow-[0_0_15px_rgba(255,255,255,1)] ${
                  combatAction.side === "YES" ? "bg-emerald-400" : "bg-red-500"
                }`}
                style={{
                  '--start-x': `${(combatAction.startPos.x + 0.5) * (100 / WORLD_SIZE.columns)}%`,
                  '--start-y': `${(combatAction.startPos.y + 0.5) * (100 / WORLD_SIZE.rows)}%`,
                  '--target-x': `${(combatAction.targetPos.x + 0.5) * (100 / WORLD_SIZE.columns)}%`,
                  '--target-y': `${(combatAction.targetPos.y + 0.5) * (100 / WORLD_SIZE.rows)}%`,
                  transform: `translate(-50%, -50%) rotate(${
                    Math.atan2(combatAction.targetPos.y - combatAction.startPos.y, combatAction.targetPos.x - combatAction.startPos.x) * (180 / Math.PI) + 90
                  }deg)`,
                  animation: "missileFly 1.5s forwards ease-in"
                } as MissileStyle}
              >
                {/* Missile Trail */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-16 bg-gradient-to-t from-transparent via-white/20 to-white/60 blur-[2px]" />
              </div>
            )}

            {/* Explosion (Delayed to match missile impact) */}
            {(combatAction.type === "MISSILE_LAUNCH" || combatAction.type === "EXPLOSION") && (
              <div 
                className="absolute h-32 w-32 -translate-x-1/2 -translate-y-1/2 animate-[explosion_1s_forwards_1.5s] opacity-0"
                style={{
                  left: `${(combatAction.targetPos.x + 0.5) * (100 / WORLD_SIZE.columns)}%`,
                  top: `${(combatAction.targetPos.y + 0.5) * (100 / WORLD_SIZE.rows)}%`,
                }}
              >
                 <div className="absolute inset-0 rounded-full bg-orange-600 blur-xl animate-ping" />
                 <div className="absolute inset-4 rounded-full bg-yellow-400 blur-lg animate-pulse" />
                 <div className="absolute inset-8 rounded-full bg-white animate-pulse" />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[8px] md:text-[10px] font-black uppercase text-emerald-300">
          <Navigation className="h-3 w-3 md:h-4 md:w-4" />
          <span className="break-words">{t("world.radar.coordinates")}: LAT {planePosition.x * 12.5}°N / LONG {planePosition.y * 15.2}°E</span>
        </div>
        <div className="flex flex-wrap gap-3 md:gap-4">
          <span className={`text-[8px] md:text-[10px] font-black ${isCombatActive ? "text-red-500 animate-pulse" : "text-emerald-900"}`}>
            {isCombatActive ? "WEAPON LOCK ACTIVE" : "SYSTEM READY"}
          </span>
          <span className="text-[8px] md:text-[10px] font-black text-emerald-500 animate-pulse">ENCRYPTION ACTIVE</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes radarSweep {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes missileFly {
          0% { 
            left: var(--start-x); 
            top: var(--start-y); 
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          95% {
            opacity: 1;
          }
          100% { 
            left: var(--target-x); 
            top: var(--target-y); 
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
          }
        }
        @keyframes explosion {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
          20% { transform: translate(-50%, -50%) scale(1.5); opacity: 1; }
          50% { transform: translate(-50%, -50%) scale(2); opacity: 0.8; filter: brightness(2); }
          100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
        }
      `}</style>
    </section>
  );
};
