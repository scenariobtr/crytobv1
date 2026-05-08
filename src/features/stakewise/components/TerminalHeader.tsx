"use client";

import React, { useState } from "react";
import { Globe, LayoutDashboard, LogOut, Terminal, TrendingUp, Menu, X, ChevronDown } from "lucide-react";
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

export const TerminalHeader: React.FC<TerminalHeaderProps> = ({
  currentUser,
  balance,
  lang,
  viewMode,
  onViewModeChange,
  onToggleLang,
  onLogout,
  t,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modeDropdownOpen, setModeDropdownOpen] = useState(false);
  const isAdmin = currentUser.role === "SUPER_ADMIN";

  return (
    <nav className="sticky top-0 z-[60] bg-black/95 backdrop-blur-xl border-b border-zinc-900">
      {/* Main Header Row */}
      <div className="flex items-center justify-between px-3 py-3 gap-2 md:px-6 md:py-4 lg:h-[80px]">
        {/* Logo */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="rounded-lg bg-emerald-500 p-1.5 md:p-2 shadow-lg shrink-0">
            <TrendingUp className="h-4 w-4 text-black md:h-5 md:w-5" />
          </div>
          <span className="truncate text-lg font-black italic tracking-tighter text-white md:text-2xl lg:text-3xl">
            STAKE<span className="text-emerald-500">WISE</span>
          </span>
        </div>

        {/* Right Side - Mobile Optimized */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Language Toggle */}
          <button 
            onClick={onToggleLang} 
            className="flex items-center justify-center gap-1.5 h-10 px-3 rounded-lg border border-zinc-800 bg-zinc-900 text-[10px] font-black text-neutral-300 shadow-lg transition-all hover:text-emerald-500 active:scale-95 touch-manipulation md:h-12 md:rounded-xl md:px-5 md:text-xs"
          >
            <Globe className="w-3.5 h-3.5 md:w-4 md:h-4" /> 
            <span className="w-5">{lang}</span>
          </button>

          {/* Balance Display */}
          <div className="flex items-center gap-2 h-10 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1 shadow-lg md:h-12 md:gap-4 md:px-5">
            <div className="text-right min-w-0">
              <p className="text-white font-black text-sm leading-none md:text-lg truncate max-w-[80px] md:max-w-none">
                {balance.toLocaleString()}
              </p>
              <p className="text-emerald-500 font-black text-[8px] uppercase tracking-tighter md:text-[10px]">USDT</p>
            </div>
            <button 
              onClick={onLogout} 
              className="rounded-lg border border-zinc-800 bg-zinc-900 p-2 transition-all hover:bg-red-500/10 hover:text-red-500 md:rounded-xl md:p-2.5 touch-manipulation"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Toggle - Only show for Admin */}
          {isAdmin && (
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center justify-center h-10 w-10 rounded-lg border border-zinc-800 bg-zinc-900 p-2 md:hidden touch-manipulation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Admin Toggle Dropdown */}
      {isAdmin && mobileMenuOpen && (
        <div className="border-t border-zinc-800 px-3 py-3 md:hidden animate-in slide-in-from-top duration-200">
          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Switch Mode</p>
          <div className="flex gap-2">
            <button 
              onClick={() => { onViewModeChange("USER"); setMobileMenuOpen(false); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase transition-all ${
                viewMode === "USER" 
                  ? "bg-emerald-500 text-black" 
                  : "bg-zinc-900 border border-zinc-800 text-neutral-400"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" /> {t("common.dashboard")}
            </button>
            <button 
              onClick={() => { onViewModeChange("ADMIN"); setMobileMenuOpen(false); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase transition-all ${
                viewMode === "ADMIN" 
                  ? "bg-emerald-500 text-black" 
                  : "bg-zinc-900 border border-zinc-800 text-neutral-400"
              }`}
            >
              <Terminal className="w-4 h-4" /> {t("common.terminal")}
            </button>
          </div>
        </div>
      )}

      {/* Desktop Admin Toggle - Always visible for admin */}
      {isAdmin && (
        <div className="hidden md:flex items-center justify-center py-3 border-t border-zinc-800/50">
          <div className="flex rounded-2xl border border-zinc-800 bg-zinc-900 p-1.5">
            <button 
              onClick={() => onViewModeChange("USER")} 
              className={`flex items-center gap-2 rounded-xl px-8 py-3 text-[13px] font-black uppercase transition-all ${
                viewMode === "USER" 
                  ? "bg-emerald-500 text-black shadow-lg" 
                  : "text-neutral-500 hover:text-white"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" /> {t("common.dashboard")}
            </button>
            <button 
              onClick={() => onViewModeChange("ADMIN")} 
              className={`flex items-center gap-2 rounded-xl px-8 py-3 text-[13px] font-black uppercase transition-all ${
                viewMode === "ADMIN" 
                  ? "bg-emerald-500 text-black shadow-lg" 
                  : "text-neutral-500 hover:text-white"
              }`}
            >
              <Terminal className="w-4 h-4" /> {t("common.terminal")}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};