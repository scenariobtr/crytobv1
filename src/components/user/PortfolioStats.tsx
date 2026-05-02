"use client";

import React from "react";
import { LineChart, History, TrendingUp, Target, Activity } from "lucide-react";
import { useTranslation } from "@/context/LangContext";

interface BetEntry {
  id: string;
  marketTitle: string;
  side: "YES" | "NO";
  amount: number;
  result: "WIN" | "LOSS" | "PENDING";
}

interface PortfolioStatsProps {
  userBets: BetEntry[];
}

export const PortfolioStats: React.FC<PortfolioStatsProps> = ({ userBets }) => {
  const { t, lang } = useTranslation();

  const getTracking = (strength: "normal" | "wide" | "widest") => {
    if (lang === "TH") return "tracking-normal";
    if (strength === "wide") return "tracking-widest";
    if (strength === "widest") return "tracking-[0.4em]";
    return "tracking-wide";
  };

  return (
    <div id="cont-user-portfolio-root" className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700 md:space-y-12">
      
      {/* High-Level Stats Cards */}
      <div id="grid-user-stats-cards" className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-8">
        
        {/* Net Profit Card */}
        <div id="card-stats-profit" className="group relative space-y-5 overflow-hidden rounded-3xl border border-amber-500/20 bg-neutral-900 p-6 shadow-2xl md:p-10">
          <div className="absolute -right-12 -top-12 w-40 h-40 bg-amber-500/10 blur-[80px] group-hover:bg-amber-500/20 transition-all duration-700"></div>
          <div className="flex justify-between items-center">
            <p id="lbl-stats-profit-txt" className={`text-[11px] font-black text-neutral-300 uppercase ${getTracking("wide")}`}>Net Profit</p>
            <TrendingUp className="w-5 h-5 text-amber-500" />
          </div>
          <p id="lbl-stats-profit-val" className="text-4xl font-black italic tracking-tighter text-amber-500 md:text-5xl">+450.25 <span id="lbl-stats-profit-unit" className="text-sm not-italic text-amber-500/50">USDT</span></p>
        </div>
        
        {/* Win Rate Card */}
        <div id="card-stats-winrate" className="group space-y-5 rounded-3xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl transition-all hover:border-emerald-500/30 md:p-10">
          <div className="flex justify-between items-center">
            <p id="lbl-stats-winrate-txt" className={`text-[11px] font-black text-neutral-300 uppercase ${getTracking("wide")}`}>Win Rate</p>
            <Target className="w-5 h-5 text-emerald-500" />
          </div>
          <p id="lbl-stats-winrate-val" className="text-4xl font-black italic tracking-tighter text-white md:text-5xl">68<span className="not-italic text-emerald-500">%</span></p>
        </div>
        
        {/* Total Trades Card */}
        <div id="card-stats-total" className="group space-y-5 rounded-3xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl transition-all hover:border-emerald-500/30 md:p-10">
          <div className="flex justify-between items-center">
            <p id="lbl-stats-total-txt" className={`text-[11px] font-black text-neutral-300 uppercase ${getTracking("wide")}`}>Total Trades</p>
            <Activity className="w-5 h-5 text-neutral-500" />
          </div>
          <p id="lbl-stats-total-val" className="text-4xl font-black italic tracking-tighter text-white md:text-5xl">{userBets.length}</p>
        </div>
      </div>

      {/* Performance Curve */}
      <section id="sect-user-portfolio-chart" className="space-y-6 rounded-3xl border border-neutral-800 bg-neutral-900 p-5 shadow-2xl sm:p-8 md:space-y-10 md:p-12">
        <div className="flex justify-between items-center">
           <h3 id="lbl-chart-title" className={`text-xs font-black uppercase ${getTracking("widest")} text-neutral-300 flex items-center gap-4`}>
             <div className="p-2 bg-emerald-500/10 rounded-lg">
               <LineChart id="icon-chart-line" className="w-5 h-5 text-emerald-500" />
             </div>
             Performance Curve (USDT)
           </h3>
        </div>
        
        <div id="cont-chart-bars" className="relative flex h-56 items-end gap-1.5 border-b border-neutral-800 px-1 pb-2 sm:h-72 sm:gap-3 sm:px-6 md:h-80">
          <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none opacity-10">
             {[...Array(5)].map((_, i) => <div key={i} className="w-full border-t border-neutral-600 border-dashed"></div>)}
          </div>
          
          {[20, 35, 30, 45, 60, 55, 75, 90, 85, 100, 60, 80, 70, 95].map((h, i) => (
            <div 
              key={i} 
              id={`chart-bar-entry-${i}`}
              className="flex-1 bg-emerald-500/20 hover:bg-emerald-500 transition-all relative group rounded-t-xl border-x border-t border-emerald-500/10 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]" 
              style={{ height: `${h}%` }}
            >
               <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-black px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-2xl whitespace-nowrap z-10">
                 +{h * 15} USDT
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section id="sect-user-portfolio-history" className="space-y-8 pt-8">
        <div className="flex items-center gap-4 border-l-4 border-emerald-500 pl-6">
          <div className="p-3 bg-neutral-900 rounded-xl">
            <History id="icon-history-clock" className="w-6 h-6 text-neutral-400" />
          </div>
          <h3 id="lbl-history-title" className={`text-xl font-black uppercase ${getTracking("widest")} text-white italic`}>{t("wallet.tx_logs")}</h3>
        </div>
        
        <div id="cont-history-table" className="overflow-x-auto rounded-3xl border border-neutral-800 bg-neutral-900/50 shadow-2xl">
          <table id="tbl-user-history" className="min-w-[720px] w-full text-left">
            <thead id="thead-user-history" className={`bg-black/80 text-[11px] font-black uppercase text-neutral-300 border-b border-neutral-800 ${getTracking("wide")}`}>
              <tr id="tr-history-head">
                <th id="th-history-market" className="px-10 py-7">{t("market.vol")}</th>
                <th id="th-history-side" className="px-10 py-7">{t("nav.your_assets")}</th>
                <th id="th-history-amount" className="px-10 py-7 text-right">{t("wallet.amount")}</th>
                <th id="th-history-status" className="px-10 py-7 text-right">Status</th>
              </tr>
            </thead>
            <tbody id="tbody-user-history" className="divide-y divide-neutral-800">
              {userBets.length > 0 ? userBets.map(bet => (
                <tr key={bet.id} id={`row-history-${bet.id}`} className="hover:bg-emerald-500/5 transition-all group">
                  <td id={`cell-history-title-${bet.id}`} className="px-10 py-8 font-black uppercase text-white tracking-tight">{bet.marketTitle}</td>
                  <td id={`cell-history-side-${bet.id}`} className="px-10 py-8">
                     <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase border ${bet.side === "YES" ? "border-emerald-500/30 text-emerald-500 bg-emerald-500/5" : "border-white/20 text-white bg-white/5"}`}>
                        {bet.side}
                     </span>
                  </td>
                  <td id={`cell-history-amount-${bet.id}`} className="px-10 py-8 text-right font-black text-neutral-200 text-lg">{bet.amount} <span className="text-[10px] text-neutral-600">USDT</span></td>
                  <td id={`cell-history-result-${bet.id}`} className="px-10 py-8 text-right">
                    <span className={`text-sm font-black px-4 py-1.5 rounded-lg ${bet.result === "WIN" ? "text-amber-500 bg-amber-500/10" : "text-neutral-500 bg-neutral-800/50"}`}>
                      {bet.result}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr id="tr-no-data-portfolio">
                  <td colSpan={4} className="px-10 py-32 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-40">
                       <LineChart className="w-12 h-12 text-neutral-400" />
                       <p className={`text-sm font-black uppercase ${getTracking("widest")} text-neutral-300`}>{t("wallet.no_data")}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
