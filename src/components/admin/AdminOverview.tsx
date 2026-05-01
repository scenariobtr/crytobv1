"use client";

import React, { useState, useEffect } from "react";
import { Activity, Database, Zap, ShieldCheck } from "lucide-react";

interface AdminOverviewProps {
  stats: {
    totalVolume: number;
    activeMarkets: number;
    pendingWithdrawals: number;
  };
}

import { useTranslation } from "@/context/LangContext";

interface AdminOverviewProps {
  stats: {
    totalVolume: number;
    activeMarkets: number;
    pendingWithdrawals: number;
  };
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ stats }) => {
  const { t } = useTranslation();
  // Real-time states for simulation
  const [cpu, setCpu] = useState(24.2);
  const [db, setDb] = useState(14);
  const [latency, setLatency] = useState(8.4);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpu(prev => Number((prev + (Math.random() * 2 - 1)).toFixed(1)));
      setDb(prev => Math.max(8, Math.min(25, prev + (Math.random() > 0.5 ? 1 : -1))));
      setLatency(prev => Number((prev + (Math.random() * 0.4 - 0.2)).toFixed(1)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-[32px] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-3xl"></div>
          <p className="text-zinc-500 text-[11px] font-black uppercase tracking-[0.2em] mb-2">Total Trading Volume</p>
          <h4 className="text-4xl font-black text-white italic">{stats.totalVolume.toLocaleString()} <span className="text-emerald-500 text-sm">USDT</span></h4>
        </div>
        <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-[32px] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-3xl"></div>
          <p className="text-zinc-500 text-[11px] font-black uppercase tracking-[0.2em] mb-2">Active Predictions</p>
          <h4 className="text-4xl font-black text-white italic">{stats.activeMarkets} <span className="text-blue-500 text-sm">MARKETS</span></h4>
        </div>
        <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-[32px] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 blur-3xl"></div>
          <p className="text-zinc-500 text-[11px] font-black uppercase tracking-[0.2em] mb-2">Pending Requests</p>
          <h4 className="text-4xl font-black text-white italic">{stats.pendingWithdrawals} <span className="text-orange-500 text-sm">TASKS</span></h4>
        </div>
      </div>

      <div className="bg-zinc-900/30 border border-zinc-900 p-10 rounded-[40px] space-y-8">
        <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">CONNECTIVITY INFRASTRUCTURE <span className="text-emerald-500 ml-2">● LIVE</span></h3>
            <button className="px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black rounded-full uppercase tracking-widest">Connected Feed</button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-black p-6 rounded-3xl border border-zinc-800 flex flex-col justify-between h-32 relative">
             <div className="flex justify-between items-start">
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest leading-none">CPU Utilization</p>
                <Activity className="w-4 h-4 text-zinc-700" />
             </div>
             <p className="text-3xl font-black text-white italic">{cpu}%</p>
             <div className="absolute bottom-0 left-0 h-1 bg-emerald-500 transition-all duration-1000" style={{ width: `${cpu}%` }}></div>
          </div>
          <div className="bg-black p-6 rounded-3xl border border-zinc-800 flex flex-col justify-between h-32 relative">
             <div className="flex justify-between items-start">
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest leading-none">DB Throughput</p>
                <Database className="w-4 h-4 text-zinc-700" />
             </div>
             <p className="text-3xl font-black text-white italic">{db}ms</p>
             <div className="absolute bottom-0 left-0 h-1 bg-blue-500 transition-all duration-1000" style={{ width: `${(db/50)*100}%` }}></div>
          </div>
          <div className="bg-black p-6 rounded-3xl border border-zinc-800 flex flex-col justify-between h-32 relative">
             <div className="flex justify-between items-start">
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest leading-none">Network Latency</p>
                <Zap className="w-4 h-4 text-zinc-700" />
             </div>
             <p className="text-3xl font-black text-white italic">{latency}k r/s</p>
             <div className="absolute bottom-0 left-0 h-1 bg-orange-500 transition-all duration-1000" style={{ width: `${(latency/20)*100}%` }}></div>
          </div>
          <div className="bg-black p-6 rounded-3xl border border-zinc-800 flex flex-col justify-between h-32 relative overflow-hidden">
             <div className="flex justify-between items-start">
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest leading-none">AI Firewall</p>
                <ShieldCheck className="w-4 h-4 text-zinc-700" />
             </div>
             <p className="text-3xl font-black text-emerald-500 italic uppercase">Shielded</p>
             <div className="absolute bottom-0 left-0 h-1 w-full bg-emerald-500/20"></div>
             <div className="absolute inset-0 bg-emerald-500/5 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
