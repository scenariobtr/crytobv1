"use client";

import React from "react";
import { MarketGrid } from "@/components/user/MarketGrid";
import { PortfolioStats } from "@/components/user/PortfolioStats";
import { ProfileSettings } from "@/components/user/ProfileSettings";
import { WalletDashboard } from "@/components/user/WalletDashboard";
import { MobileNav } from "@/components/shared/MobileNav";
import type { User } from "@/data/mockUsers";
import type { Thread } from "@/modules/market/service";
import { USER_TABS, userTabLabelKey } from "../constants";
import type { PortfolioBet, UserSubTab } from "../types";

type UserWorkspaceProps = {
  userSubTab: UserSubTab;
  currentUser: User;
  threads: Thread[];
  userBets: PortfolioBet[];
  balance: number;
  onUserSubTabChange: (tab: UserSubTab) => void;
  onJoinMarket: (thread: Thread, side: "YES" | "NO") => void;
  onCreateMarketOpen: () => void;
  onDeleteMarket: (id: number) => void;
  onEditMarket: (thread: Thread) => void;
  onProfileUpdate: (updatedData: Partial<User>) => void;
  getTracking: (strength: "normal" | "wide" | "widest") => string;
  t: (path: string) => string;
};

export const UserWorkspace: React.FC<UserWorkspaceProps> = ({
  userSubTab,
  currentUser,
  threads,
  userBets,
  balance,
  onUserSubTabChange,
  onJoinMarket,
  onCreateMarketOpen,
  onDeleteMarket,
  onEditMarket,
  onProfileUpdate,
  getTracking,
  t,
}) => {
  return (
    <div className="space-y-5 md:space-y-12 pb-20 sm:pb-0">
      {/* Desktop Tab Bar - hidden on mobile */}
      <div className="hidden sm:flex items-center gap-6 md:gap-12 border-b border-zinc-900 pb-px">
        {USER_TABS.map((tab) => (
          <button 
            key={tab} 
            onClick={() => onUserSubTabChange(tab)} 
            className={`relative whitespace-nowrap px-1 pb-4 md:pb-6 text-[13px] md:text-[16px] font-black uppercase transition-all ${getTracking("wide")} ${
              userSubTab === tab 
                ? "text-emerald-500" 
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            {t(userTabLabelKey[tab])}
            {userSubTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-1.5 bg-emerald-500 rounded-t-full shadow-lg"></div>
            )}
          </button>
        ))}
      </div>
      
      {/* Mobile Navigation - visible only on mobile */}
      <MobileNav 
        activeTab={userSubTab} 
        onTabChange={onUserSubTabChange} 
        t={t}
      />

      {/* Content */}
      <div className="transition-all animate-in fade-in duration-300">
        {userSubTab === "MARKETS" && (
          <MarketGrid
            threads={threads}
            onJoin={onJoinMarket}
            onCreateOpen={onCreateMarketOpen}
            isAdmin={currentUser.role === "SUPER_ADMIN"}
            onDelete={onDeleteMarket}
            onEdit={onEditMarket}
          />
        )}
        {userSubTab === "PORTFOLIO" && <PortfolioStats userBets={userBets} />}
        {userSubTab === "WALLET" && (
          <WalletDashboard
            balance={balance}
            walletStatus={currentUser.walletStatus}
            walletAddress={currentUser.wallet}
            transactions={[]}
            onWalletConnect={(walletAddress) => onProfileUpdate({ wallet: walletAddress, walletStatus: "ACTIVE" })}
          />
        )}
        {userSubTab === "PROFILE" && <ProfileSettings user={currentUser} onUpdate={onProfileUpdate} />}
      </div>
    </div>
  );
};