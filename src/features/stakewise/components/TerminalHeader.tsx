"use client";

import { Globe, LayoutDashboard, LogOut, Terminal, TrendingUp } from "lucide-react";
import type { User } from "@/data/mockUsers";
import type { ViewMode } from "../types";

type TerminalHeaderProps = {
  currentUser: User;
  balance: number;
  lang: "EN" | "TH";
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onToggleLang: () => void;
  onLogout: () => void;
  t: (path: string) => string;
};

export const TerminalHeader = ({
  currentUser,
  balance,
  lang,
  viewMode,
  onViewModeChange,
  onToggleLang,
  onLogout,
  t,
}: TerminalHeaderProps) => {
  return (
    <nav id="nav-global-header" className="flex items-center justify-between px-4 md:px-10 py-4 md:py-6 border-b border-zinc-900 bg-black/80 backdrop-blur-xl sticky top-0 z-[60] h-[70px] md:h-[80px]">
      <div id="cont-nav-left" className="flex items-center">
        <div className="flex items-center gap-2 md:gap-4">
          <div className="p-2 md:p-2.5 bg-emerald-500 rounded-lg md:rounded-xl shadow-lg">
            <TrendingUp className="w-4 h-4 md:w-5 md:w-5 text-black" />
          </div>
          <span className="text-xl md:text-3xl font-black text-white italic tracking-tighter">
            STAKE<span className="text-emerald-500">WISE</span>
          </span>
        </div>
      </div>

      {currentUser.role === "SUPER_ADMIN" && (
        <div id="cont-nav-center" className="hidden lg:flex bg-zinc-900 rounded-2xl p-1.5 border border-zinc-800 shadow-xl">
          <button onClick={() => onViewModeChange("USER")} className={`flex items-center gap-2.5 px-10 py-3.5 text-[13px] font-black uppercase rounded-xl transition-all ${viewMode === "USER" ? "bg-emerald-500 text-black shadow-lg" : "text-neutral-500 hover:text-white"}`}>
            <LayoutDashboard className="w-4 h-4" /> {t("common.dashboard")}
          </button>
          <button onClick={() => onViewModeChange("ADMIN")} className={`flex items-center gap-2.5 px-10 py-3.5 text-[13px] font-black uppercase rounded-xl transition-all ${viewMode === "ADMIN" ? "bg-emerald-500 text-black shadow-lg" : "text-neutral-500 hover:text-white"}`}>
            <Terminal className="w-4 h-4" /> {t("common.terminal")}
          </button>
        </div>
      )}

      <div id="cont-nav-right" className="flex items-center gap-2 md:gap-6 h-full">
        <button onClick={onToggleLang} className="flex items-center justify-center md:justify-start gap-2 px-3 md:px-6 bg-zinc-900 border border-zinc-800 rounded-lg md:rounded-xl text-[10px] md:text-[12px] font-black text-neutral-300 hover:text-emerald-500 transition-all shadow-xl h-[40px] md:h-[48px]">
          <Globe className="w-3 h-3 md:w-4 md:h-4" /> <span className="hidden xs:inline">{lang}</span>
        </button>
        <div className="flex items-center gap-3 md:gap-5 bg-zinc-950 pl-3 md:pl-8 pr-1.5 md:pr-2.5 py-1 rounded-lg md:rounded-xl border border-zinc-800 shadow-xl h-[40px] md:h-[48px]">
          <div className="text-right hidden sm:block">
            <p className="text-[8px] md:text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">{currentUser.username}</p>
            <p className="text-white font-black text-sm md:text-lg leading-none">
              {balance.toLocaleString()} <span className="text-emerald-500 text-[8px] md:text-[10px]">USDT</span>
            </p>
          </div>
          <div className="text-right sm:hidden">
            <p className="text-white font-black text-xs leading-none">
              {balance.toLocaleString()}
            </p>
            <p className="text-emerald-500 font-black text-[8px] uppercase tracking-tighter">USDT</p>
          </div>
          <button onClick={onLogout} className="p-2 md:p-3.5 bg-zinc-900 hover:bg-red-500/10 hover:text-red-500 transition-all rounded-lg md:rounded-xl border border-zinc-800 group">
            <LogOut className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};
