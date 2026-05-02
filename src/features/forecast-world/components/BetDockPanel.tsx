"use client";

import { CircleDollarSign, Send } from "lucide-react";
import type { RadarBetSide, RadarSignal } from "../types";

type BetDockPanelProps = {
  signal: RadarSignal | null;
  balance: number;
  amount: number | "";
  onAmountChange: (amount: number | "") => void;
  onPlaceBet: (side: RadarBetSide) => void;
  t: (path: string) => string;
};

export const BetDockPanel = ({ signal, balance, amount, onAmountChange, onPlaceBet, t }: BetDockPanelProps) => {
  const isLocked = signal?.isLocked && !signal.isExpired;
  const canBet = Boolean(isLocked && amount !== "" && amount > 0 && amount <= balance);

  return (
    <section className="relative overflow-hidden rounded-sm border-4 border-emerald-950 bg-zinc-950 p-6 text-white shadow-[12px_12px_0_rgba(6,78,59,0.35)]">
      {/* Terminal Header Decor */}
      <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-emerald-500 via-transparent to-emerald-500 opacity-30" />
      
      <div className="flex items-center justify-between gap-3 border-b-2 border-emerald-900/50 pb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-sm border-2 ${isLocked ? "border-orange-500 bg-orange-500/10" : "border-emerald-900 bg-black"}`}>
            <CircleDollarSign className={`h-5 w-5 ${isLocked ? "text-orange-400" : "text-emerald-500"}`} />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest">{t("world.bet_dock")}</h3>
            <p className="text-[9px] font-black uppercase text-zinc-500 tracking-tighter">SECURE TRANSACTION NODE</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[8px] font-black uppercase text-zinc-600">AVAILABLE CREDIT</p>
          <span className="text-sm font-black uppercase text-emerald-400">{balance.toLocaleString()} USDT</span>
        </div>
      </div>

      {/* Market Details (Transaction Info) */}
      <div className="mt-5 space-y-4">
        {signal ? (
          <div className={`rounded-sm border-2 p-3 transition-all ${isLocked ? "border-emerald-500/30 bg-emerald-500/5" : "border-zinc-900 bg-black/50"}`}>
            <div className="flex justify-between items-start">
              <span className="text-[8px] font-black uppercase text-zinc-600">TARGET MARKET</span>
              {isLocked && <span className="text-[8px] font-black uppercase text-orange-500 animate-pulse">CONNECTION STABLE</span>}
            </div>
            <p className="mt-1 text-sm font-black uppercase text-white line-clamp-2">{signal.market.title}</p>
            
            {isLocked && (
              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-emerald-900/30 pt-3">
                <div>
                  <p className="text-[7px] font-black text-zinc-600 uppercase">YES VOLUME</p>
                  <p className="text-[10px] font-black text-emerald-400">{signal.market.yesVolume.toLocaleString()} USDT</p>
                </div>
                <div>
                  <p className="text-[7px] font-black text-zinc-600 uppercase">NO VOLUME</p>
                  <p className="text-[10px] font-black text-emerald-400">{signal.market.noVolume.toLocaleString()} USDT</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center border-2 border-dashed border-zinc-900 rounded-sm">
             <p className="text-[10px] font-black uppercase text-zinc-700">{t("world.radar.fly_to_lock")}</p>
          </div>
        )}

        <label className="block">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black uppercase text-zinc-400">{t("world.bet_amount")}</span>
            <span className="text-[9px] font-mono text-emerald-800">MAX: {balance}</span>
          </div>
          <div className="relative group">
            <input
              type="number"
              min={1}
              max={balance}
              value={amount}
              disabled={!isLocked}
              onChange={(event) => onAmountChange(event.target.value === "" ? "" : Number(event.target.value))}
              className="w-full border-2 border-emerald-900 bg-black px-4 py-4 text-xl font-black text-emerald-400 outline-none transition-all focus:border-emerald-500 disabled:opacity-20 disabled:grayscale"
              placeholder="0.00"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-emerald-800">USDT</div>
          </div>
        </label>

        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            disabled={!canBet}
            onClick={() => onPlaceBet("YES")}
            className="group relative flex flex-col items-center justify-center gap-1 overflow-hidden border-2 border-emerald-500/50 bg-emerald-950 py-4 text-xs font-black uppercase text-emerald-400 transition-all hover:bg-emerald-500 hover:text-black disabled:opacity-20"
          >
            <div className="flex items-center gap-2">
              <Send className="h-3 w-3" />
              <span>{t("market.yes")}</span>
            </div>
            <span className="text-[7px] opacity-60">CONFIRM POSITIVE</span>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
          </button>
          
          <button
            type="button"
            disabled={!canBet}
            onClick={() => onPlaceBet("NO")}
            className="group relative flex flex-col items-center justify-center gap-1 overflow-hidden border-2 border-red-500/50 bg-red-950 py-4 text-xs font-black uppercase text-red-400 transition-all hover:bg-red-500 hover:text-white disabled:opacity-20"
          >
            <div className="flex items-center gap-2">
              <Send className="h-3 w-3 rotate-180" />
              <span>{t("market.no")}</span>
            </div>
            <span className="text-[7px] opacity-60">CONFIRM NEGATIVE</span>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
          </button>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-emerald-900/30 pt-4">
        <p className={`text-[9px] font-black uppercase tracking-tighter transition-all ${isLocked ? "text-orange-500" : "text-zinc-600"}`}>
          {isLocked ? "SYSTEM ARMED: READY TO COMMIT" : "WAITING FOR PROXIMITY LOCK..."}
        </p>
        <div className="flex gap-1">
          <div className={`h-1.5 w-1.5 rounded-full ${isLocked ? "bg-orange-500 animate-pulse" : "bg-zinc-800"}`} />
          <div className={`h-1.5 w-1.5 rounded-full ${isLocked ? "bg-orange-500 animate-pulse delay-75" : "bg-zinc-800"}`} />
          <div className={`h-1.5 w-1.5 rounded-full ${isLocked ? "bg-orange-500 animate-pulse delay-150" : "bg-zinc-800"}`} />
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </section>
  );
};
