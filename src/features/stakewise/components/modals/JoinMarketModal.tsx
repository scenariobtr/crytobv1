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
      <form className="space-y-10" onSubmit={onSubmit}>
        <div className="space-y-4">
          <p className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.2em] px-1">{t("market.select_side")}</p>
          <div className="grid grid-cols-2 gap-5">
            <button type="button" onClick={() => onSideChange("YES")} className={`py-8 rounded-2xl border-2 font-black uppercase text-sm transition-all ${side === "YES" ? "bg-emerald-500 text-black border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)] scale-105" : "bg-zinc-900 border-zinc-800 text-neutral-500 opacity-50"}`}>{t("market.trade_yes")}</button>
            <button type="button" onClick={() => onSideChange("NO")} className={`py-8 rounded-2xl border-2 font-black uppercase text-sm transition-all ${side === "NO" ? "bg-red-600 text-white border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)] scale-105" : "bg-zinc-900 border-zinc-800 text-neutral-500 opacity-50"}`}>{t("market.trade_no")}</button>
          </div>
        </div>

        <div className={`p-6 rounded-2xl border-2 flex items-center justify-between transition-all ${side === "YES" ? "bg-emerald-500/5 border-emerald-500/20" : "bg-red-500/5 border-red-500/20"}`}>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{t("market.decision_status")}</p>
            <p className={`text-2xl font-black italic uppercase ${side === "YES" ? "text-emerald-500" : "text-red-500"}`}>
              {t("market.current_bet_side")} {side}
            </p>
          </div>
          {side === "YES" ? <TrendingUp className="w-8 h-8 text-emerald-500" /> : <TrendingDown className="w-8 h-8 text-red-500" />}
        </div>

        <div className="space-y-5">
          <div className="flex justify-between px-2">
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
            className={`w-full p-8 bg-zinc-950 border rounded-2xl outline-none text-5xl font-black transition-all ${
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
        <button className="w-full py-8 bg-emerald-500 text-black font-black uppercase text-lg rounded-xl shadow-xl hover:bg-emerald-400 transition-all">{t("common.confirm")}</button>
      </form>
    </BaseModal>
  );
};
