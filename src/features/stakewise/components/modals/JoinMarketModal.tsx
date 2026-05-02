"use client";

import { Info, TrendingDown, TrendingUp, Zap } from "lucide-react";
import { BaseModal } from "@/components/shared/BaseModal";
import type { Thread } from "@/modules/market/service";
import type { MarketSide } from "../../types";

type JoinMarketModalProps = {
  thread: Thread | null;
  side: MarketSide | null;
  amount: number | "";
  balance: number;
  onClose: () => void;
  onSideChange: (side: MarketSide) => void;
  onAmountChange: (amount: number | "") => void;
  onSubmit: (event: React.FormEvent) => void;
  t: (path: string) => string;
};

export const JoinMarketModal = ({
  thread,
  side,
  amount,
  balance,
  onClose,
  onSideChange,
  onAmountChange,
  onSubmit,
  t,
}: JoinMarketModalProps) => {
  return (
    <BaseModal id="join-market" isOpen={!!thread} onClose={onClose} title={t("common.confirm")} icon={<Zap className="w-6 h-6 text-emerald-500" />}>
      <form className="space-y-6 sm:space-y-10" onSubmit={onSubmit}>
        <div className="space-y-4">
          <p className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.2em] px-1">{t("market.select_side")}</p>
          <div className="grid grid-cols-2 gap-3 sm:gap-5">
            <button type="button" onClick={() => onSideChange("YES")} className={`rounded-2xl border-2 py-5 text-xs font-black uppercase transition-all sm:py-8 sm:text-sm ${side === "YES" ? "bg-emerald-500 text-black border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)] scale-105" : "bg-zinc-900 border-zinc-800 text-neutral-500 opacity-50"}`}>{t("market.trade_yes")}</button>
            <button type="button" onClick={() => onSideChange("NO")} className={`rounded-2xl border-2 py-5 text-xs font-black uppercase transition-all sm:py-8 sm:text-sm ${side === "NO" ? "bg-red-600 text-white border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)] scale-105" : "bg-zinc-900 border-zinc-800 text-neutral-500 opacity-50"}`}>{t("market.trade_no")}</button>
          </div>
        </div>

        <div className={`flex items-center justify-between gap-4 rounded-2xl border-2 p-4 transition-all sm:p-6 ${side === "YES" ? "bg-emerald-500/5 border-emerald-500/20" : "bg-red-500/5 border-red-500/20"}`}>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{t("market.decision_status")}</p>
            <p className={`text-xl font-black uppercase italic sm:text-2xl ${side === "YES" ? "text-emerald-500" : "text-red-500"}`}>
              {t("market.current_bet_side")} {side}
            </p>
          </div>
          {side === "YES" ? <TrendingUp className="w-8 h-8 text-emerald-500" /> : <TrendingDown className="w-8 h-8 text-red-500" />}
        </div>

        <div className="space-y-5">
          <div className="flex flex-col gap-1 px-2 sm:flex-row sm:justify-between">
            <p className="text-[11px] font-black text-neutral-500 uppercase tracking-widest">{t("wallet.amount")} (USDT)</p>
            <p className="text-[11px] font-black text-zinc-600 uppercase tracking-widest">{t("wallet.available")}: {balance.toLocaleString()}</p>
          </div>
          <input
            required
            type="number"
            value={amount}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (val <= balance) {
                onAmountChange(val);
              }
            }}
            placeholder="0.00"
            className={`w-full rounded-2xl border bg-zinc-950 p-5 text-4xl font-black outline-none transition-all sm:p-8 sm:text-5xl ${
              Number(amount) > balance * 0.8 ? "border-orange-500 text-orange-500 shadow-[0_0_40px_rgba(249,115,22,0.15)]" : "border-zinc-900 text-emerald-500 focus:border-emerald-500"
            }`}
          />
          {Number(amount) > balance * 0.8 && (
            <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl animate-in fade-in slide-in-from-top-2">
              <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest flex items-center gap-2">
                <Info className="w-4 h-4" /> {t("market.risk_warning_80")}
              </p>
            </div>
          )}
        </div>
        <button className="w-full rounded-xl bg-emerald-500 py-5 text-base font-black uppercase text-black shadow-xl transition-all hover:bg-emerald-400 sm:py-8 sm:text-lg">{t("common.confirm")}</button>
      </form>
    </BaseModal>
  );
};
