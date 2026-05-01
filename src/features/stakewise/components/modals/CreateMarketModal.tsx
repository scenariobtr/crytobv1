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
      <form className="space-y-6" onSubmit={onSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="w-full h-40 bg-zinc-950 border-2 border-dashed border-zinc-900 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-emerald-500/50 transition-all cursor-pointer group">
              <ImageIcon className="w-6 h-6 text-zinc-700 group-hover:text-emerald-500" />
              <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest group-hover:text-white text-center px-4">อัปโหลดภาพประกอบเหตุการณ์<br />(RECOMMENDED 16:9)</p>
            </div>
            <div className="space-y-3">
              <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest px-1">รายละเอียดเงื่อนไข</p>
              <textarea rows={6} value={market.description} onChange={(e) => onMarketChange({ ...market, description: e.target.value })} placeholder="ระบุเงื่อนไขการตัดสินผล..." className="w-full p-5 bg-zinc-950 border border-zinc-900 rounded-xl outline-none text-[13px] font-bold text-neutral-400 focus:border-emerald-500 resize-none" />
            </div>
          </div>

          <div className="space-y-6 flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest px-1">{t("market.event_name")}</p>
                <input required type="text" value={market.title} onChange={(e) => onMarketChange({ ...market, title: e.target.value })} placeholder="BTC จะแตะ $150K หรือไม่?" className="w-full p-5 bg-zinc-950 border border-zinc-900 rounded-xl outline-none text-lg font-black text-white focus:border-emerald-500" />
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest px-1">{t("market.end_date")}</p>
                <input required type="datetime-local" value={market.endDate} onChange={(e) => onMarketChange({ ...market, endDate: e.target.value })} className="w-full p-5 bg-zinc-950 border border-zinc-900 rounded-xl outline-none text-sm font-black text-white focus:border-emerald-500 transition-all" />
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest px-2">{t("market.select_side")}</p>
              <div className="grid grid-cols-2 gap-4">
                <button type="button" onClick={() => setSide("YES")} className={`py-6 rounded-2xl border-2 font-black uppercase text-xs transition-all ${market.side === "YES" ? "bg-emerald-500 text-black border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.2)]" : "bg-zinc-950 border-zinc-900 text-zinc-600 opacity-60"}`}>{t("market.trade_yes")}</button>
                <button type="button" onClick={() => setSide("NO")} className={`py-6 rounded-2xl border-2 font-black uppercase text-xs transition-all ${market.side === "NO" ? "bg-red-600 text-white border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.2)]" : "bg-zinc-950 border-zinc-900 text-zinc-600 opacity-60"}`}>{t("market.trade_no")}</button>
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
                className={`w-full p-5 bg-zinc-950 border rounded-xl outline-none text-2xl font-black transition-all ${market.liquidity > balance * 0.8 ? "border-orange-500 text-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.1)]" : "border-zinc-900 text-emerald-500 focus:border-emerald-500"}`}
              />
              {market.liquidity > balance * 0.8 && <p className="text-[10px] font-black text-orange-500 uppercase tracking-tighter animate-pulse">{t("market.warning_80")}</p>}
              {market.liquidity === balance && <p className="text-[10px] font-black text-red-500 uppercase tracking-tighter">{t("market.max_reached")}</p>}
            </div>
          </div>
        </div>
        <button type="submit" className="w-full py-8 bg-emerald-500 text-black font-black uppercase text-lg rounded-xl shadow-xl hover:bg-emerald-400 transition-all mt-4">{t("common.confirm")}</button>
      </form>
    </BaseModal>
  );
};
