"use client";

import React from "react";
import { Wallet, CreditCard, ArrowDownLeft, Copy, ShieldAlert } from "lucide-react";
import { useTranslation } from "@/context/LangContext";

interface Transaction {
  id: string;
  amount: number;
  status: string;
}

interface WalletDashboardProps {
  balance: number;
  walletStatus: string;
  walletAddress: string;
  transactions: Transaction[];
  onDeposit: () => void;
}

export const WalletDashboard: React.FC<WalletDashboardProps> = ({ 
  balance, 
  walletStatus, 
  walletAddress, 
  transactions,
  onDeposit 
}) => {
  const { t, lang } = useTranslation();

  const getTracking = (strength: "normal" | "wide" | "widest") => {
    if (lang === "TH") return "tracking-normal";
    if (strength === "wide") return "tracking-widest";
    if (strength === "widest") return "tracking-[0.4em]";
    return "tracking-wide";
  };

  return (
    <div id="cont-user-wallet-root" className="space-y-12 animate-in fade-in duration-500">
      
      <div id="grid-user-wallet-main" className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Main Wallet Card */}
        <div id="card-wallet-balance-info" className="xl:col-span-8 bg-neutral-900/80 border border-neutral-800 rounded-[2rem] p-10 md:p-14 relative overflow-hidden flex flex-col justify-between min-h-[350px] shadow-2xl">
          <Wallet id="icon-wallet-bg" className="absolute -right-16 -bottom-16 w-80 h-80 text-emerald-500/10 rotate-12 pointer-events-none" />
          
          <div id="cont-wallet-header" className="flex flex-col md:flex-row justify-between items-start gap-6 relative z-10">
            <div id="cont-balance-labels">
              <p id="lbl-wallet-total-txt" className={`text-[11px] font-black uppercase ${getTracking("wide")} text-neutral-400 mb-3`}>{t("wallet.total_balance")}</p>
              <h2 id="lbl-wallet-balance-val" className="text-6xl md:text-8xl font-black text-white tracking-tighter italic flex items-baseline gap-4">
                {balance.toLocaleString()} <span id="lbl-wallet-balance-unit" className="text-emerald-500 text-3xl md:text-4xl not-italic font-black">USDT</span>
              </h2>
            </div>
            
            <div 
              id="badge-wallet-status-indicator"
              className={`px-6 py-2 border-2 font-black text-[11px] uppercase ${getTracking("wide")} rounded-full flex items-center gap-2 shadow-lg ${walletStatus === "ACTIVE" ? "border-emerald-500 text-emerald-400 bg-emerald-500/10" : "border-red-500 text-red-400 bg-red-500/10"}`}
            >
              <div className={`w-2 h-2 rounded-full animate-pulse ${walletStatus === "ACTIVE" ? "bg-emerald-500" : "bg-red-500"}`}></div>
              {walletStatus}
            </div>
          </div>

          <div id="cont-wallet-footer" className="mt-16 flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
            <div id="cont-wallet-address-box" className="space-y-4 flex-1 max-lg">
              <p id="lbl-wallet-address-txt" className={`text-[11px] font-black text-neutral-400 uppercase ${getTracking("wide")}`}>{t("wallet.public_address")}</p>
              <div className="flex gap-3">
                <div 
                  id="txt-wallet-address-val"
                  className="flex-1 px-5 py-4 bg-black/60 border border-neutral-700 text-sm font-mono text-neutral-300 rounded-xl flex items-center shadow-inner"
                >
                  {walletAddress}
                </div>
                <button id="btn-wallet-address-copy" className="p-4 bg-neutral-800 hover:bg-emerald-500 hover:text-black text-white rounded-xl transition-all active:scale-90 shadow-lg group">
                  <Copy className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div 
          id="card-wallet-action-panel"
          className={`xl:col-span-4 rounded-[2rem] p-10 flex flex-col justify-between border-2 transition-all relative overflow-hidden ${walletStatus === "ACTIVE" ? "bg-emerald-500 border-emerald-400" : "bg-neutral-900 border-neutral-800"}`}
        >
          {walletStatus !== "ACTIVE" && (
             <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-0"></div>
          )}

          <div id="cont-action-header" className="space-y-4 relative z-10">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${walletStatus === "ACTIVE" ? "bg-black" : "bg-red-500/20 text-red-500"}`}>
               {walletStatus === "ACTIVE" ? <ArrowDownLeft className="w-7 h-7 text-emerald-500" /> : <ShieldAlert className="w-7 h-7" />}
            </div>
            <div>
              <h4 id="lbl-action-title" className={`font-black text-4xl uppercase leading-none italic ${walletStatus === "ACTIVE" ? "text-black" : "text-white"}`}>
                {t("wallet.quick_deposit")}
              </h4>
              <div className="h-4"></div>
              <p id="lbl-action-desc" className={`text-xs font-black uppercase ${getTracking("wide")} px-3 py-1 rounded inline-block ${walletStatus === "ACTIVE" ? "bg-black/10 text-black/80" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}>
                {walletStatus === "ACTIVE" ? t("wallet.deposit_desc") : t("wallet.suspended")}
              </p>
            </div>
          </div>

          <button 
            id="btn-wallet-quick-deposit"
            disabled={walletStatus !== "ACTIVE"} 
            onClick={onDeposit} 
            className={`w-full py-6 font-black uppercase text-sm ${getTracking("wide")} flex items-center justify-center gap-3 transition-all active:scale-95 disabled:cursor-not-allowed shadow-2xl rounded-2xl relative z-10 ${walletStatus === "ACTIVE" ? "bg-black text-white hover:bg-neutral-900" : "bg-neutral-800 text-neutral-600"}`}
          >
            {t("wallet.quick_deposit")} 500 USDT
          </button>
        </div>
      </div>

      {/* Transaction Table */}
      <section id="sect-user-wallet-history" className="space-y-8 pt-12">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl">
              <CreditCard id="icon-history-card" className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 id="lbl-wallet-history-title" className={`text-xl font-black uppercase ${getTracking("widest")} text-white italic`}>{t("wallet.tx_logs")}</h3>
          </div>
        </div>
        
        <div id="cont-wallet-table-wrapper" className="bg-neutral-900/50 border border-neutral-800 rounded-[2rem] overflow-hidden shadow-2xl">
          <table id="tbl-wallet-transactions" className="w-full text-left border-collapse">
            <thead id="thead-wallet-tx" className={`bg-black/80 text-[11px] font-black uppercase text-neutral-300 border-b border-neutral-800 ${getTracking("wide")}`}>
              <tr id="tr-wallet-tx-head">
                <th id="th-tx-id" className="px-8 py-7">{t("wallet.ref_hash")}</th>
                <th id="th-tx-amount" className="px-8 py-7 text-right">{t("wallet.amount")}</th>
                <th id="th-tx-status" className="px-8 py-7 text-center">{t("wallet.status")}</th>
              </tr>
            </thead>
            <tbody id="tbody-wallet-tx" className="divide-y divide-neutral-800">
              {transactions.length > 0 ? transactions.map(tx => (
                <tr key={tx.id} id={`row-tx-${tx.id}`} className="hover:bg-emerald-500/5 transition-all group cursor-default">
                  <td id={`cell-tx-id-${tx.id}`} className="px-8 py-8 font-mono text-neutral-400 group-hover:text-white text-sm tracking-tighter">{tx.id}</td>
                  <td id={`cell-tx-amount-${tx.id}`} className="px-8 py-8 text-right font-black text-white text-xl italic">{tx.amount.toLocaleString()} <span className="text-xs text-emerald-500 not-italic ml-1">USDT</span></td>
                  <td id={`cell-tx-status-${tx.id}`} className="px-8 py-8 text-center">
                    <span 
                      id={`badge-tx-status-${tx.id}`}
                      className={`px-4 py-1.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase rounded-lg border border-emerald-500/30 shadow-sm ${getTracking("wide")}`}
                    >
                      {tx.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr id="tr-no-data">
                  <td colSpan={3} className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-40">
                       <CreditCard className="w-12 h-12 text-neutral-400" />
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
