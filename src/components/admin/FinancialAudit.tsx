"use client";

import React, { useState } from "react";
import { ArrowUpRight, ArrowDownLeft, Search, Filter, Download, TrendingUp } from "lucide-react";
import { useTranslation } from "@/context/LangContext";

interface Transaction {
  id: string;
  username: string;
  type: "DEPOSIT" | "WITHDRAW" | "BET" | "WIN";
  amount: number;
  status: "COMPLETED" | "PENDING" | "REJECTED";
  timestamp: string;
  txHash?: string;
}

const mockTransactions: Transaction[] = [
  { id: "TX-1001", username: "BANKTHANARAT", type: "DEPOSIT", amount: 1500, status: "COMPLETED", timestamp: "2026-05-02 10:30:15", txHash: "0x7d...f3a2" },
  { id: "TX-1002", username: "ADMIN001", type: "BET", amount: 200, status: "COMPLETED", timestamp: "2026-05-02 11:15:22" },
  { id: "TX-1003", username: "BANKTHANARAT", type: "WIN", amount: 450, status: "COMPLETED", timestamp: "2026-05-02 11:45:00" },
  { id: "TX-1004", username: "ADMIN002", type: "WITHDRAW", amount: 500, status: "PENDING", timestamp: "2026-05-02 12:00:10", txHash: "0x1a...e88b" },
  { id: "TX-1005", username: "BANKTHANARAT", type: "BET", amount: 100, status: "COMPLETED", timestamp: "2026-05-02 12:30:00" },
];

export const FinancialAudit: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");

  const getTypeStyle = (type: Transaction["type"]) => {
    switch (type) {
      case "DEPOSIT": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "WIN": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "WITHDRAW": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "BET": return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white md:text-3xl">{t("nav.finance")}</h2>
          <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mt-1">{t("nav.finance_subtitle")}</p>
        </div>
        
        <div className="flex items-center gap-3">
            <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-6 py-3 text-[11px] font-black uppercase transition-all hover:bg-white hover:text-black sm:w-auto">
                <Download className="w-4 h-4" /> Export CSV
            </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { label: t("nav.total_deposits"), val: "15,400", sub: "+12% vs last week", icon: <ArrowUpRight className="text-emerald-500" /> },
          { label: t("nav.total_withdrawals"), val: "4,200", sub: "3 Pending Requests", icon: <ArrowDownLeft className="text-red-500" /> },
          { label: t("nav.system_revenue"), val: "2,850", sub: "Net Betting Margin", icon: <TrendingUp className="text-blue-500" /> }
        ].map((stat, i) => (
          <div key={i} className="p-6 bg-zinc-950 border border-zinc-900 rounded-3xl group hover:border-emerald-500/30 transition-all">
            <div className="mb-4 flex justify-between gap-3">
               <div className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800">{stat.icon}</div>
               <span className="max-w-[120px] text-right text-[10px] font-black uppercase tracking-widest text-zinc-600">{stat.sub}</span>
            </div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-white italic">{stat.val} <span className="text-xs text-zinc-600">USDT</span></p>
          </div>
        ))}
      </div>

      {/* Search and Table */}
      <div className="overflow-hidden rounded-3xl border border-zinc-900 bg-zinc-950 md:rounded-[2.5rem]">
        <div className="flex items-center justify-between gap-3 border-b border-zinc-900 p-4 md:p-6">
            <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input 
                    type="text" 
                    placeholder={t("nav.search_placeholder")}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-white outline-none focus:border-emerald-500/50 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <button className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500 hover:text-white transition-all">
                <Filter className="w-5 h-5" />
            </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[860px] w-full">
            <thead>
              <tr className="text-zinc-600 text-[10px] font-black uppercase tracking-widest border-b border-zinc-900">
                <th className="px-8 py-6 text-left">{t("nav.tx_id")}</th>
                <th className="px-8 py-6 text-left">{t("nav.member")}</th>
                <th className="px-8 py-6 text-left">{t("nav.type")}</th>
                <th className="px-8 py-6 text-right">{t("nav.amount")}</th>
                <th className="px-8 py-6 text-center">{t("nav.status")}</th>
                <th className="px-8 py-6 text-right">{t("nav.timestamp")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/50">
              {mockTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-white/[0.02] transition-all group">
                  <td className="px-8 py-6 font-mono text-[11px] text-zinc-400 font-bold uppercase tracking-widest group-hover:text-emerald-500">#{tx.id}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center border border-zinc-800 text-[10px] font-black">{tx.username.substring(0,2)}</div>
                        <span className="text-xs font-black text-white uppercase tracking-wider">{tx.username}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black border uppercase ${getTypeStyle(tx.type)}`}>
                        {tx.type}
                    </span>
                  </td>
                  <td className={`px-8 py-6 text-right font-black italic ${tx.type === 'WITHDRAW' || tx.type === 'BET' ? 'text-white' : 'text-emerald-500'}`}>
                    {tx.type === 'WITHDRAW' || tx.type === 'BET' ? '-' : '+'}{tx.amount.toLocaleString()}
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`text-[9px] font-black uppercase ${tx.status === 'COMPLETED' ? 'text-emerald-500' : 'text-zinc-500'}`}>
                        {tx.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right text-[10px] font-bold text-zinc-600 tracking-tighter">{tx.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
