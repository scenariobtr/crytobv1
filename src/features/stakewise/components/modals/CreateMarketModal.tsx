"use client";

import { ImageIcon, Plus } from "lucide-react";
import { BaseModal } from "@/components/shared/BaseModal";
import type { MarketDraft, MarketSide } from "../../types";

type CreateMarketModalProps = {
  isOpen: boolean;
  market: MarketDraft;
  balance: number;
  onClose: () => void;
  onSubmit: (event: React.FormEvent) => void;
  onMarketChange: (market: MarketDraft) => void;
  t: (path: string) => string;
};

export const CreateMarketModal = ({ isOpen, market, balance, onClose, onSubmit, onMarketChange, t }: CreateMarketModalProps) => {
  const setSide = (side: MarketSide) => onMarketChange({ ...market, side });

  return (
    <BaseModal id="create-market" isOpen={isOpen} onClose={onClose} title="สร้างตลาดพยากรณ์ใหม่" icon={<Plus className="w-6 h-6 text-emerald-500" />} size="4xl">
      <form className="space-y-5 md:space-y-6" onSubmit={onSubmit}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          <div className="space-y-6">
            <div className="group flex h-32 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-zinc-900 bg-zinc-950 transition-all hover:border-emerald-500/50 sm:h-40">
              <ImageIcon className="w-6 h-6 text-zinc-700 group-hover:text-emerald-500" />
              <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest group-hover:text-white text-center px-4">อัปโหลดภาพประกอบเหตุการณ์<br />(RECOMMENDED 16:9)</p>
            </div>
            <div className="space-y-3">
              <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest px-1">รายละเอียดเงื่อนไข</p>
              <textarea rows={5} value={market.description} onChange={(e) => onMarketChange({ ...market, description: e.target.value })} placeholder="ระบุเงื่อนไขการตัดสินผล..." className="w-full resize-none rounded-xl border border-zinc-900 bg-zinc-950 p-4 text-[13px] font-bold text-neutral-400 outline-none focus:border-emerald-500 sm:p-5" />
            </div>
          </div>

          <div className="space-y-6 flex flex-col">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest px-1">{t("market.event_name")}</p>
                <input required type="text" value={market.title} onChange={(e) => onMarketChange({ ...market, title: e.target.value })} placeholder="BTC จะแตะ $150K หรือไม่?" className="w-full rounded-xl border border-zinc-900 bg-zinc-950 p-4 text-base font-black text-white outline-none focus:border-emerald-500 sm:p-5 sm:text-lg" />
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest px-1">{t("market.end_date")}</p>
                <input required type="datetime-local" value={market.endDate} onChange={(e) => onMarketChange({ ...market, endDate: e.target.value })} className="w-full rounded-xl border border-zinc-900 bg-zinc-950 p-4 text-sm font-black text-white outline-none transition-all focus:border-emerald-500 sm:p-5" />
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest px-2">{t("market.select_side")}</p>
              <div className="grid grid-cols-2 gap-4">
                <button type="button" onClick={() => setSide("YES")} className={`rounded-2xl border-2 py-4 text-xs font-black uppercase transition-all sm:py-6 ${market.side === "YES" ? "bg-emerald-500 text-black border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.2)]" : "bg-zinc-950 border-zinc-900 text-zinc-600 opacity-60"}`}>{t("market.trade_yes")}</button>
                <button type="button" onClick={() => setSide("NO")} className={`rounded-2xl border-2 py-4 text-xs font-black uppercase transition-all sm:py-6 ${market.side === "NO" ? "bg-red-600 text-white border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.2)]" : "bg-zinc-950 border-zinc-900 text-zinc-600 opacity-60"}`}>{t("market.trade_no")}</button>
              </div>
              <div className={`p-4 rounded-xl border border-dashed transition-all text-center ${market.side === "YES" ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-500" : "bg-red-500/5 border-red-500/20 text-red-500"}`}>
                <p className="text-[10px] font-black uppercase tracking-widest">{t("market.starting_side")} {market.side}</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest px-2">{t("market.initial_liquidity")}</p>
              <input
                required
                type="number"
                value={market.liquidity}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val <= balance) onMarketChange({ ...market, liquidity: val });
                }}
                placeholder="0.00"
                className={`w-full rounded-xl border bg-zinc-950 p-4 text-xl font-black outline-none transition-all sm:p-5 sm:text-2xl ${market.liquidity > balance * 0.8 ? "border-orange-500 text-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.1)]" : "border-zinc-900 text-emerald-500 focus:border-emerald-500"}`}
              />
              {market.liquidity > balance * 0.8 && <p className="text-[10px] font-black text-orange-500 uppercase tracking-tighter animate-pulse">{t("market.warning_80")}</p>}
              {market.liquidity === balance && <p className="text-[10px] font-black text-red-500 uppercase tracking-tighter">{t("market.max_reached")}</p>}
            </div>
          </div>
        </div>
        <button type="submit" className="mt-2 w-full rounded-xl bg-emerald-500 py-5 text-base font-black uppercase text-black shadow-xl transition-all hover:bg-emerald-400 sm:py-8 sm:text-lg">{t("common.confirm")}</button>
      </form>
    </BaseModal>
  );
};
