"use client";

import { Database, Edit3 } from "lucide-react";
import { BaseModal } from "@/components/shared/BaseModal";
import type { Thread } from "@/modules/market/service";

type EditMarketModalProps = {
  market: Thread | null;
  onClose: () => void;
  onSubmit: (event: React.FormEvent) => void;
  onMarketChange: (market: Thread) => void;
  t: (path: string) => string;
};

export const EditMarketModal = ({ market, onClose, onSubmit, onMarketChange, t }: EditMarketModalProps) => {
  const totalVolume = market ? market.yesVolume + market.noVolume : 0;
  const yesWidth = totalVolume > 0 && market ? (market.yesVolume / totalVolume) * 100 : 0;
  const noWidth = totalVolume > 0 && market ? (market.noVolume / totalVolume) * 100 : 0;

  return (
    <BaseModal id="edit-market" isOpen={!!market} onClose={onClose} title="แก้ไขข้อมูลตลาดพยากรณ์" icon={<Edit3 className="w-6 h-6 text-emerald-500" />} size="4xl">
      {market && (
        <form className="space-y-6" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-8 col-span-2">
              <div className="space-y-3">
                <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest px-1">{t("market.event_name")}</p>
                <input required type="text" value={market.title} onChange={(e) => onMarketChange({ ...market, title: e.target.value })} className="w-full p-6 bg-zinc-950 border border-zinc-900 rounded-2xl outline-none text-2xl font-black text-white focus:border-emerald-500 shadow-2xl transition-all" />
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest px-1 flex items-center gap-2"><Database className="w-3 h-3" /> {t("market.end_date")}</p>
                <input required type="datetime-local" value={new Date(market.endDate).toISOString().slice(0, 16)} onChange={(e) => onMarketChange({ ...market, endDate: new Date(e.target.value).toISOString() })} className="w-full p-5 bg-zinc-950 border border-zinc-900 rounded-xl outline-none text-sm font-black text-white focus:border-emerald-500" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-emerald-500/50 uppercase tracking-widest px-1">YES RATE (USDT)</p>
                  <input type="number" step="0.01" value={market.yesPrice} onChange={(e) => onMarketChange({ ...market, yesPrice: Number(e.target.value) })} className="w-full p-5 bg-emerald-500/5 border border-emerald-500/20 rounded-xl outline-none text-2xl font-black text-emerald-500 focus:border-emerald-500" />
                </div>
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-red-500/50 uppercase tracking-widest px-1">NO RATE (USDT)</p>
                  <input type="number" step="0.01" value={market.noPrice} onChange={(e) => onMarketChange({ ...market, noPrice: Number(e.target.value) })} className="w-full p-5 bg-red-500/5 border border-red-500/20 rounded-xl outline-none text-2xl font-black text-red-500 focus:border-red-500" />
                </div>
              </div>

              <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl space-y-4">
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2"><Database className="w-4 h-4" /> {t("market.system_revenue")}</p>
                <div className="grid grid-cols-2 gap-4 text-[11px] font-bold">
                  <div className="text-zinc-500">{t("market.net_profit")}:</div>
                  <div className="text-right text-emerald-500">+ {(totalVolume * 0.025).toLocaleString()} USDT</div>
                  <div className="text-zinc-500">{t("market.fee_ratio")}:</div>
                  <div className="text-right text-white">2.5% Fixed Fee</div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-zinc-950 border border-zinc-900 rounded-2xl">
                  <p className="text-[9px] font-black text-zinc-600 uppercase mb-1">{t("market.total_bettors")}</p>
                  <p className="text-2xl font-black text-white italic">{(market.yesVolume / 50 + market.noVolume / 30).toFixed(0)} <span className="text-[10px] text-zinc-700">USERS</span></p>
                </div>
                <div className="p-5 bg-zinc-950 border border-zinc-900 rounded-2xl">
                  <p className="text-[9px] font-black text-zinc-600 uppercase mb-1">{t("market.creator")}</p>
                  <p className="text-lg font-black text-emerald-500 italic truncate uppercase">{market.creatorId || "System"}</p>
                </div>
              </div>

              <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-2xl space-y-4">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{t("market.liquidity")}</p>
                <div>
                  <div className="flex justify-between text-[11px] font-bold mb-2 uppercase"><span className="text-emerald-500">{t("market.yes_pool")}</span><span className="text-white">{market.yesVolume.toLocaleString()} USDT</span></div>
                  <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden"><div className="h-full bg-emerald-500" style={{ width: `${yesWidth}%` }}></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] font-bold mb-2 uppercase"><span className="text-red-500">{t("market.no_pool")}</span><span className="text-white">{market.noVolume.toLocaleString()} USDT</span></div>
                  <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden"><div className="h-full bg-red-500" style={{ width: `${noWidth}%` }}></div></div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={onClose} className="flex-1 py-5 bg-zinc-900 text-zinc-500 font-black uppercase text-sm rounded-xl hover:bg-zinc-800 transition-all">{t("common.cancel")}</button>
                <button type="submit" className="flex-[2] py-5 bg-emerald-500 text-black font-black uppercase text-sm rounded-xl shadow-xl hover:bg-emerald-400 transition-all">{t("common.confirm_changes")}</button>
              </div>
            </div>
          </div>
        </form>
      )}
    </BaseModal>
  );
};
