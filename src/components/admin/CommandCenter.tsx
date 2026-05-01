"use client";

import React, { useState } from "react";
import { Server, RefreshCw, Globe, Zap, ShieldCheck, Cpu, Database, Activity, Box, Terminal as TerminalIcon } from "lucide-react";
import { useTranslation } from "@/context/LangContext";

interface CommandCenterProps {
  onUpgrade: () => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({ onUpgrade }) => {
  const { t } = useTranslation();
  const [activeBots, setActiveBots] = useState<string[]>(['BTC/USDT', 'ETH/USDT']);
  const [isUpgrading, setIsUpgrading] = useState(false);

  const toggleBot = (pair: string) => {
    setActiveBots(prev => prev.includes(pair) ? prev.filter(p => p !== pair) : [...prev, pair]);
  };

  const handleUpgrade = () => {
    setIsUpgrading(true);
    onUpgrade();
    setTimeout(() => setIsUpgrading(false), 3000);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* INFRASTRUCTURE CONTROL */}
        <div className="xl:col-span-2 bg-zinc-950 border border-zinc-900 rounded-[40px] p-10 relative overflow-hidden group">
          <div className="absolute -right-20 -top-20 opacity-[0.03] group-hover:opacity-10 transition-all duration-1000">
            <Server className="w-80 h-80 text-emerald-500" />
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
                <Box className="w-6 h-6 text-emerald-500" /> GLOBAL INFRASTRUCTURE
              </h3>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Mainframe & Oracle Management Engine</p>
            </div>
            <div className="flex gap-4">
               <div className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,1)]"></div>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">v3.2.5 STABLE</span>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 bg-black/60 border border-zinc-900 rounded-3xl space-y-6">
               <div className="flex justify-between items-center">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Database Engine</p>
                  <Database className="w-4 h-4 text-emerald-500" />
               </div>
               <div className="space-y-1">
                  <p className="text-2xl font-black text-white italic uppercase">PostgreSQL Cloud</p>
                  <p className="text-[10px] font-bold text-zinc-600">Latency: 14ms | Uptime: 99.99%</p>
               </div>
            </div>
            <div className="p-8 bg-black/60 border border-zinc-900 rounded-3xl space-y-6">
               <div className="flex justify-between items-center">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Compute Instances</p>
                  <Cpu className="w-4 h-4 text-blue-500" />
               </div>
               <div className="space-y-1">
                  <p className="text-2xl font-black text-white italic uppercase">AWS Lambda v4</p>
                  <p className="text-[10px] font-bold text-zinc-600">Nodes: 12 Active | Region: Tokyo</p>
               </div>
            </div>
          </div>

          <button 
            onClick={handleUpgrade}
            disabled={isUpgrading}
            className={`w-full mt-8 py-6 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 transition-all ${
              isUpgrading ? 'bg-zinc-900 text-zinc-600' : 'bg-white text-black hover:bg-emerald-500'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isUpgrading ? 'animate-spin' : ''}`} />
            {isUpgrading ? 'SYSTEM UPGRADING...' : 'TRIGGER AUTO UPGRADE'}
          </button>
        </div>

        {/* ORACLE BRIDGES */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-[40px] p-10 flex flex-col">
          <div className="space-y-2 mb-10">
            <h3 className="text-xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
              <Zap className="w-5 h-5 text-orange-500" /> API BRIDGES
            </h3>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Real-time Data Feeds</p>
          </div>

          <div className="space-y-4 flex-1">
            {['Binance Stream', 'Bybit API', 'CoinGecko Feed', 'Chainlink Oracle'].map(api => (
              <div key={api} className="p-6 bg-black border border-zinc-900 rounded-2xl flex justify-between items-center group hover:border-emerald-500/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                  <span className="text-[11px] font-black text-zinc-400 group-hover:text-white uppercase tracking-widest">{api}</span>
                </div>
                <span className="text-[9px] font-black text-emerald-500 uppercase bg-emerald-500/5 px-3 py-1 rounded-lg border border-emerald-500/20 italic">LIVE</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOT COMMAND CENTER */}
      <div className="bg-zinc-900/30 border border-zinc-900 rounded-[40px] p-10 space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
              <TerminalIcon className="w-8 h-8 text-emerald-500" /> {t("nav.system")}
            </h3>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Liquidity Provisioning & Arbitrage Bots</p>
          </div>
          <button className="px-12 py-5 bg-emerald-500 text-black font-black uppercase text-xs rounded-xl shadow-[0_10px_30px_rgba(16,185,129,0.3)] hover:bg-emerald-400 hover:scale-105 transition-all">
            ACTIVATE ALL BOTS
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'POLITICS/USDT'].map(pair => (
            <button 
              key={pair}
              onClick={() => toggleBot(pair)}
              className={`p-10 rounded-3xl border-2 transition-all flex flex-col items-center gap-6 group relative overflow-hidden ${
                activeBots.includes(pair) 
                ? 'bg-emerald-500/5 border-emerald-500/30 text-white' 
                : 'bg-zinc-950 border-zinc-900 text-zinc-600 hover:border-zinc-700'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                activeBots.includes(pair) ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.5)]' : 'bg-zinc-900 text-zinc-700'
              }`}>
                <Activity className="w-6 h-6" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-black italic tracking-widest">{pair}</p>
                <p className={`text-[9px] font-black uppercase ${activeBots.includes(pair) ? 'text-emerald-500' : 'text-zinc-700'}`}>
                  {activeBots.includes(pair) ? '● Running' : '○ Standby'}
                </p>
              </div>
              {activeBots.includes(pair) && (
                <div className="absolute bottom-0 left-0 h-1 w-full bg-emerald-500 animate-pulse"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
