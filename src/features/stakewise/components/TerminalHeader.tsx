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
    <nav id="nav-global-header" className="sticky top-0 z-[60] flex min-h-[64px] flex-wrap items-center justify-between gap-3 border-b border-zinc-900 bg-black/90 px-3 py-3 backdrop-blur-xl sm:px-4 md:px-8 md:py-4 lg:h-[80px] lg:flex-nowrap lg:px-10">
      <div id="cont-nav-left" className="flex min-w-0 items-center">
        <div className="flex items-center gap-2 md:gap-4">
          <div className="rounded-lg bg-emerald-500 p-2 shadow-lg md:rounded-xl md:p-2.5">
            <TrendingUp className="h-4 w-4 text-black md:h-5 md:w-5" />
          </div>
          <span className="truncate text-lg font-black italic tracking-tighter text-white sm:text-xl md:text-3xl">
            STAKE<span className="text-emerald-500">WISE</span>
          </span>
        </div>
      </div>

      {currentUser.role === "SUPER_ADMIN" && (
        <div id="cont-nav-center" className="order-3 flex w-full overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900 p-1 shadow-xl no-scrollbar lg:order-none lg:w-auto lg:rounded-2xl lg:p-1.5">
          <button onClick={() => onViewModeChange("USER")} className={`flex min-w-0 flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-[11px] font-black uppercase transition-all lg:flex-none lg:rounded-xl lg:px-10 lg:py-3.5 lg:text-[13px] ${viewMode === "USER" ? "bg-emerald-500 text-black shadow-lg" : "text-neutral-500 hover:text-white"}`}>
            <LayoutDashboard className="w-4 h-4" /> {t("common.dashboard")}
          </button>
          <button onClick={() => onViewModeChange("ADMIN")} className={`flex min-w-0 flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-[11px] font-black uppercase transition-all lg:flex-none lg:rounded-xl lg:px-10 lg:py-3.5 lg:text-[13px] ${viewMode === "ADMIN" ? "bg-emerald-500 text-black shadow-lg" : "text-neutral-500 hover:text-white"}`}>
            <Terminal className="w-4 h-4" /> {t("common.terminal")}
          </button>
        </div>
      )}

      <div id="cont-nav-right" className="flex h-full items-center gap-2 md:gap-4 lg:gap-6">
        <button onClick={onToggleLang} className="flex h-[38px] items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-[10px] font-black text-neutral-300 shadow-xl transition-all hover:text-emerald-500 md:h-[48px] md:justify-start md:rounded-xl md:px-6 md:text-[12px]">
          <Globe className="h-3 w-3 md:h-4 md:w-4" /> <span>{lang}</span>
        </button>
        <div className="flex h-[38px] items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 py-1 pl-3 pr-1.5 shadow-xl md:h-[48px] md:gap-5 md:rounded-xl md:pl-8 md:pr-2.5">
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
          <button onClick={onLogout} className="rounded-lg border border-zinc-800 bg-zinc-900 p-2 transition-all hover:bg-red-500/10 hover:text-red-500 md:rounded-xl md:p-3.5 group">
            <LogOut className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};
