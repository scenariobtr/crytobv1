"use client";

import React from "react";
import { TrendingUp, PieChart, Wallet, User } from "lucide-react";
import type { UserSubTab } from "@/features/stakewise/types";
import { USER_TABS } from "@/features/stakewise/constants";

type MobileNavProps = {
  activeTab: UserSubTab;
  onTabChange: (tab: UserSubTab) => void;
  t: (path: string) => string;
};

const iconMap: Record<UserSubTab, React.ElementType> = {
  MARKETS: TrendingUp,
  PORTFOLIO: PieChart,
  WALLET: Wallet,
  PROFILE: User,
};

const labelMap: Record<UserSubTab, string> = {
  MARKETS: "nav.prediction_markets",
  PORTFOLIO: "nav.your_assets",
  WALLET: "nav.wallet_hub",
  PROFILE: "nav.profile",
};

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, onTabChange, t }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-950 border-t border-zinc-800 px-2 py-2 sm:hidden pb-safe">
      <div className="flex items-center justify-around">
        {USER_TABS.map((tab) => {
          const Icon = iconMap[tab];
          const isActive = activeTab === tab;
          
          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`flex flex-col items-center justify-center gap-1 min-w-[64px] min-h-[56px] py-2 px-3 rounded-2xl transition-all touch-manipulation ${
                isActive 
                  ? "text-emerald-500 bg-emerald-500/10" 
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? "stroke-[2.5]" : ""}`} />
              <span className={`text-[10px] font-black uppercase tracking-wider truncate max-w-[60px] ${isActive ? "text-emerald-500" : ""}`}>
                {t(labelMap[tab]).split(" ")[0]}
              </span>
              {isActive && (
                <div className="absolute -bottom-0 w-8 h-0.5 bg-emerald-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};