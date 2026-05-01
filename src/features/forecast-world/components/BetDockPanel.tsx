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
  const canBet = Boolean(signal?.isLocked && !signal.isExpired && amount !== "" && amount > 0 && amount <= balance);

  return (
    <section className="space-y-5 rounded-sm border-4 border-emerald-900 bg-zinc-950 p-6 text-white shadow-[8px_8px_0_rgba(6,78,59,0.3)]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <CircleDollarSign className="h-6 w-6 text-emerald-400" />
          <h3 className="text-sm font-black uppercase">{t("world.bet_dock")}</h3>
        </div>
        <span className="border-2 border-emerald-800 bg-black px-3 py-2 text-[10px] font-black uppercase text-emerald-300">{balance.toLocaleString()} USDT</span>
      </div>

      <label className="block">
        <span className="text-[10px] font-black uppercase text-zinc-400">{t("world.bet_amount")}</span>
        <input
          type="number"
          min={1}
          max={balance}
          value={amount}
          onChange={(event) => onAmountChange(event.target.value === "" ? "" : Number(event.target.value))}
          className="mt-2 w-full border-4 border-emerald-900 bg-black px-4 py-3 text-lg font-black text-emerald-200 outline-none focus:border-emerald-400"
          placeholder="100"
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          disabled={!canBet}
          onClick={() => onPlaceBet("YES")}
          className="flex items-center justify-center gap-2 border-4 border-emerald-900 bg-emerald-500 py-4 text-sm font-black uppercase text-black shadow-[5px_5px_0_rgba(6,78,59,0.35)] transition-all hover:-translate-y-0.5 hover:bg-emerald-300 disabled:translate-y-0 disabled:border-zinc-900 disabled:bg-zinc-900 disabled:text-zinc-600 disabled:cursor-not-allowed"
        >
          <Send className="h-4 w-4" />
          YES
        </button>
        <button
          type="button"
          disabled={!canBet}
          onClick={() => onPlaceBet("NO")}
          className="flex items-center justify-center gap-2 border-4 border-red-950 bg-red-600 py-4 text-sm font-black uppercase text-white shadow-[5px_5px_0_rgba(127,29,29,0.35)] transition-all hover:-translate-y-0.5 hover:bg-red-400 disabled:translate-y-0 disabled:border-zinc-900 disabled:bg-zinc-900 disabled:text-zinc-600 disabled:cursor-not-allowed"
        >
          <Send className="h-4 w-4" />
          NO
        </button>
      </div>

      <p className="text-[10px] font-black uppercase text-zinc-500">
        {signal?.isLocked ? t("world.radar.ready_to_bet") : t("world.radar.fly_to_lock")}
      </p>
    </section>
  );
};
