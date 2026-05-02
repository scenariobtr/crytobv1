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

export const AdminOverview: React.FC<AdminOverviewProps> = ({ stats }) => {
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
    <div className="space-y-6 animate-in fade-in duration-1000 md:space-y-10">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-8">
        <div className="group relative overflow-hidden rounded-3xl border border-zinc-900 bg-zinc-950 p-5 sm:p-8">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-3xl"></div>
          <p className="text-zinc-500 text-[11px] font-black uppercase tracking-[0.2em] mb-2">Total Trading Volume</p>
          <h4 className="text-3xl font-black italic text-white md:text-4xl">{stats.totalVolume.toLocaleString()} <span className="text-sm text-emerald-500">USDT</span></h4>
        </div>
        <div className="group relative overflow-hidden rounded-3xl border border-zinc-900 bg-zinc-950 p-5 sm:p-8">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-3xl"></div>
          <p className="text-zinc-500 text-[11px] font-black uppercase tracking-[0.2em] mb-2">Active Predictions</p>
          <h4 className="text-3xl font-black italic text-white md:text-4xl">{stats.activeMarkets} <span className="text-sm text-blue-500">MARKETS</span></h4>
        </div>
        <div className="group relative overflow-hidden rounded-3xl border border-zinc-900 bg-zinc-950 p-5 sm:p-8">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 blur-3xl"></div>
          <p className="text-zinc-500 text-[11px] font-black uppercase tracking-[0.2em] mb-2">Pending Requests</p>
          <h4 className="text-3xl font-black italic text-white md:text-4xl">{stats.pendingWithdrawals} <span className="text-sm text-orange-500">TASKS</span></h4>
        </div>
      </div>

      <div className="space-y-6 rounded-3xl border border-zinc-900 bg-zinc-900/30 p-5 sm:p-8 md:space-y-8 md:rounded-[40px] md:p-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-black uppercase italic tracking-tighter text-white md:text-xl">CONNECTIVITY INFRASTRUCTURE <span className="ml-2 text-emerald-500">● LIVE</span></h3>
            <button className="px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black rounded-full uppercase tracking-widest">Connected Feed</button>
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
          <div className="relative flex h-28 flex-col justify-between rounded-3xl border border-zinc-800 bg-black p-5 md:h-32 md:p-6">
             <div className="flex justify-between items-start">
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest leading-none">CPU Utilization</p>
                <Activity className="w-4 h-4 text-zinc-700" />
             </div>
             <p className="text-2xl font-black italic text-white md:text-3xl">{cpu}%</p>
             <div className="absolute bottom-0 left-0 h-1 bg-emerald-500 transition-all duration-1000" style={{ width: `${cpu}%` }}></div>
          </div>
          <div className="relative flex h-28 flex-col justify-between rounded-3xl border border-zinc-800 bg-black p-5 md:h-32 md:p-6">
             <div className="flex justify-between items-start">
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest leading-none">DB Throughput</p>
                <Database className="w-4 h-4 text-zinc-700" />
             </div>
             <p className="text-2xl font-black italic text-white md:text-3xl">{db}ms</p>
             <div className="absolute bottom-0 left-0 h-1 bg-blue-500 transition-all duration-1000" style={{ width: `${(db/50)*100}%` }}></div>
          </div>
          <div className="relative flex h-28 flex-col justify-between rounded-3xl border border-zinc-800 bg-black p-5 md:h-32 md:p-6">
             <div className="flex justify-between items-start">
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest leading-none">Network Latency</p>
                <Zap className="w-4 h-4 text-zinc-700" />
             </div>
             <p className="text-2xl font-black italic text-white md:text-3xl">{latency}k r/s</p>
             <div className="absolute bottom-0 left-0 h-1 bg-orange-500 transition-all duration-1000" style={{ width: `${(latency/20)*100}%` }}></div>
          </div>
          <div className="relative flex h-28 flex-col justify-between overflow-hidden rounded-3xl border border-zinc-800 bg-black p-5 md:h-32 md:p-6">
             <div className="flex justify-between items-start">
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest leading-none">AI Firewall</p>
                <ShieldCheck className="w-4 h-4 text-zinc-700" />
             </div>
             <p className="text-2xl font-black uppercase italic text-emerald-500 md:text-3xl">Shielded</p>
             <div className="absolute bottom-0 left-0 h-1 w-full bg-emerald-500/20"></div>
             <div className="absolute inset-0 bg-emerald-500/5 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
