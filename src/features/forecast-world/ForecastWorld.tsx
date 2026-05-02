"use client";

import { useEffect, useMemo, useState } from "react";
import type { User } from "@/data/mockUsers";
import type { Thread } from "@/modules/market/service";
import { HUT_POSITIONS } from "./constants";
import { BetDockPanel } from "./components/BetDockPanel";
import { RadarMap } from "./components/RadarMap";
import { RadarPanel } from "./components/RadarPanel";
import { useFlightMovement } from "./hooks/useFlightMovement";
import { useRadarLock } from "./hooks/useRadarLock";
import type { CombatAction, FlightTelemetry, RadarBetSide, RadarSignal } from "./types";

type ForecastWorldProps = {
  currentUser: User;
  threads: Thread[];
  balance: number;
  onPlaceRadarBet: (thread: Thread, side: RadarBetSide, amount: number) => boolean;
  t: (path: string) => string;
};

const getSignalIntensity = (thread: Thread) => {
  const totalVolume = thread.yesVolume + thread.noVolume;
  if (thread.isHot) return 1;
  return Math.min(0.95, Math.max(0.35, totalVolume / 10000));
};

const getHeading = (position: { x: number; y: number }) => {
  if (position.x >= 5 && position.y <= 2) return "NE";
  if (position.x >= 5 && position.y > 2) return "SE";
  if (position.x < 5 && position.y > 2) return "SW";
  return "NW";
};

export const ForecastWorld = ({ currentUser, threads, balance, onPlaceRadarBet, t }: ForecastWorldProps) => {
  const { position, moveBy, moveTo } = useFlightMovement();
  const [now, setNow] = useState(() => Date.now());
  const [selectedSignalId, setSelectedSignalId] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState<number | "">(100);
  const [combatAction, setCombatAction] = useState<CombatAction | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (combatAction) {
      const timer = setTimeout(() => setCombatAction(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [combatAction]);

  const signalBase = useMemo<Omit<RadarSignal, "distance" | "isLocked">[]>(() => {
    return threads.map((thread, index) => ({
      id: `signal-${thread.id}`,
      market: thread,
      position: HUT_POSITIONS[index % HUT_POSITIONS.length],
      intensity: getSignalIntensity(thread),
      isExpired: new Date(thread.endDate).getTime() <= now,
    }));
  }, [now, threads]);

  const signals = useRadarLock(position, signalBase);
  const selectedSignal = selectedSignalId ? signals.find((signal) => signal.id === selectedSignalId) ?? null : null;
  const lockedSignal = signals.find((signal) => signal.isLocked && !signal.isExpired) ?? null;
  const activeSignal = selectedSignal ?? lockedSignal;

  const telemetry = useMemo<FlightTelemetry>(() => ({
    altitude: 1200 + (position.y * 80),
    speed: 240 + (position.x * 12),
    heading: getHeading(position),
  }), [position]);

  const handleSelectSignal = (signal: RadarSignal) => {
    setSelectedSignalId(signal.id);
    moveTo(signal.position);
  };

  const handlePlaceBet = (side: RadarBetSide) => {
    if (!activeSignal || !activeSignal.isLocked || activeSignal.isExpired || betAmount === "") return;
    
    // Stage 1: Lock Target
    setCombatAction({
      type: "LOCKING",
      startPos: { ...position },
      targetPos: { ...activeSignal.position },
      side,
      timestamp: Date.now(),
    });

    // Stage 2: Weapons Release (After 1s)
    setTimeout(() => {
      setCombatAction(prev => prev ? { ...prev, type: "MISSILE_LAUNCH", timestamp: Date.now() } : null);

      // Stage 3: Impact & Finalize (After 2.5s total to watch impact + explosion)
      setTimeout(() => {
        const didBet = onPlaceRadarBet(activeSignal.market, side, Number(betAmount));
        if (didBet) setBetAmount("");
      }, 2500); // Increased from 1500ms to 2500ms
    }, 1000);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-700 md:space-y-8">
      <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
        <div>
          <p className="text-xs md:text-sm font-black uppercase tracking-widest text-emerald-400">{t("world.radar.kicker")}</p>
          <h2 className="text-2xl font-black uppercase tracking-normal text-white sm:text-3xl md:text-4xl">{t("world.title")}</h2>
          <p className="mt-1 text-xs md:text-sm font-bold uppercase tracking-normal text-zinc-500">
            {t("world.subtitle")}
          </p>
        </div>
        <div className="hidden sm:grid grid-cols-4 gap-3">
          {[
            ["W", t("world.up")],
            ["A", t("world.left")],
            ["S", t("world.down")],
            ["D", t("world.right")],
          ].map(([key, label]) => (
            <div key={key} className="border-2 md:border-4 border-emerald-900 bg-zinc-950 px-3 md:px-4 py-2 md:py-3 text-center text-emerald-300 shadow-[3px_3px_0_rgba(6,78,59,0.3)] md:shadow-[5px_5px_0_rgba(6,78,59,0.3)]">
              <p className="text-xs md:text-sm font-black leading-none">{key}</p>
              <p className="mt-1 text-[7px] md:text-[8px] font-black uppercase text-zinc-600">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:gap-8 xl:grid-cols-12">
        <div className="space-y-5 xl:col-span-8">
          <RadarMap
            playerName={currentUser.username}
            planePosition={position}
            signals={signals}
            selectedSignal={activeSignal}
            telemetry={telemetry}
            aircraftConfig={currentUser.aircraftConfig}
            combatAction={combatAction}
            onSelectSignal={handleSelectSignal}
            onMoveTo={moveTo}
            t={t}
          />
          <div className="grid grid-cols-4 gap-2 md:gap-3">
            <button type="button" onClick={() => moveBy({ x: 0, y: -1 })} className="border-2 md:border-4 border-emerald-900 bg-zinc-950 py-2 md:py-3 text-[10px] md:text-xs font-black uppercase text-emerald-300 shadow-[3px_3px_0_rgba(6,78,59,0.3)] md:shadow-[5px_5px_0_rgba(6,78,59,0.3)] transition-all hover:bg-emerald-500 hover:text-black active:scale-95">{t("world.up")}</button>
            <button type="button" onClick={() => moveBy({ x: -1, y: 0 })} className="border-2 md:border-4 border-emerald-900 bg-zinc-950 py-2 md:py-3 text-[10px] md:text-xs font-black uppercase text-emerald-300 shadow-[3px_3px_0_rgba(6,78,59,0.3)] md:shadow-[5px_5px_0_rgba(6,78,59,0.3)] transition-all hover:bg-emerald-500 hover:text-black active:scale-95">{t("world.left")}</button>
            <button type="button" onClick={() => moveBy({ x: 0, y: 1 })} className="border-2 md:border-4 border-emerald-900 bg-zinc-950 py-2 md:py-3 text-[10px] md:text-xs font-black uppercase text-emerald-300 shadow-[3px_3px_0_rgba(6,78,59,0.3)] md:shadow-[5px_5px_0_rgba(6,78,59,0.3)] transition-all hover:bg-emerald-500 hover:text-black active:scale-95">{t("world.down")}</button>
            <button type="button" onClick={() => moveBy({ x: 1, y: 0 })} className="border-2 md:border-4 border-emerald-900 bg-zinc-950 py-2 md:py-3 text-[10px] md:text-xs font-black uppercase text-emerald-300 shadow-[3px_3px_0_rgba(6,78,59,0.3)] md:shadow-[5px_5px_0_rgba(6,78,59,0.3)] transition-all hover:bg-emerald-500 hover:text-black active:scale-95">{t("world.right")}</button>
          </div>
        </div>

        <div className="space-y-6 xl:col-span-4">
          <RadarPanel signal={activeSignal} t={t} />
          <BetDockPanel
            signal={activeSignal}
            balance={balance}
            amount={betAmount}
            onAmountChange={setBetAmount}
            onPlaceBet={handlePlaceBet}
            t={t}
          />
        </div>
      </div>
    </div>
  );
};
