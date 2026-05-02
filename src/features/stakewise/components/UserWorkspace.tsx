"use client";

import { MarketGrid } from "@/components/user/MarketGrid";
import { PortfolioStats } from "@/components/user/PortfolioStats";
import { ProfileSettings } from "@/components/user/ProfileSettings";
import { WalletDashboard } from "@/components/user/WalletDashboard";
import type { User } from "@/data/mockUsers";
import { ForecastWorld } from "@/features/forecast-world/ForecastWorld";
import type { RadarBetSide } from "@/features/forecast-world/types";
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
  onPlaceRadarBet: (thread: Thread, side: RadarBetSide, amount: number) => boolean;
  getTracking: (strength: "normal" | "wide" | "widest") => string;
  t: (path: string) => string;
};

export const UserWorkspace = ({
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
  onPlaceRadarBet,
  getTracking,
  t,
}: UserWorkspaceProps) => {
  return (
    <div className="space-y-6 md:space-y-12">
      <div className="flex items-center gap-3 overflow-x-auto border-b border-zinc-900 pb-px no-scrollbar sm:gap-6 md:gap-12">
        {USER_TABS.map((tab) => (
          <button key={tab} onClick={() => onUserSubTabChange(tab)} className={`relative whitespace-nowrap px-1 pb-3 text-[12px] font-black uppercase transition-all sm:text-[13px] md:pb-6 md:text-[16px] ${getTracking("wide")} ${userSubTab === tab ? "text-emerald-500" : "text-neutral-400 hover:text-neutral-200"}`}>
            {t(userTabLabelKey[tab])}
            {userSubTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 md:h-1.5 bg-emerald-500 rounded-t-full shadow-lg"></div>}
          </button>
        ))}
      </div>
      <div className="transition-all">
        {userSubTab === "WORLD" && (
          <ForecastWorld
            currentUser={currentUser}
            threads={threads}
            balance={balance}
            onPlaceRadarBet={onPlaceRadarBet}
            t={t}
          />
        )}
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
