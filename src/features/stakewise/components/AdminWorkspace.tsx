"use client";

import { AdminOverview } from "@/components/admin/AdminOverview";
import { CommandCenter } from "@/components/admin/CommandCenter";
import { FinancialAudit } from "@/components/admin/FinancialAudit";
import { MemberManagement } from "@/components/admin/MemberManagement";
import type { User } from "@/data/mockUsers";
import type { Thread } from "@/modules/market/service";
import { getSystemStats } from "@/modules/matching";
import { ADMIN_TABS } from "../constants";
import type { AdminTab } from "../types";

type AdminWorkspaceProps = {
  adminTab: AdminTab;
  users: User[];
  threads: Thread[];
  onAdminTabChange: (tab: AdminTab) => void;
  onUpdateUserStatus: (userId: string, newStatus: "ACTIVE" | "BANNED") => void;
  onUpgrade: () => void;
  t: (path: string) => string;
};

export const AdminWorkspace = ({
  adminTab,
  users,
  threads,
  onAdminTabChange,
  onUpdateUserStatus,
  onUpgrade,
  t,
}: AdminWorkspaceProps) => {
  return (
    <div className="space-y-12">
      <div className="flex flex-wrap gap-3 md:gap-5">
        {ADMIN_TABS.map((tab) => (
          <button key={tab} onClick={() => onAdminTabChange(tab)} className={`px-6 md:px-12 py-3 md:py-5 rounded-xl md:rounded-2xl border text-[11px] md:text-[13px] font-black uppercase transition-all ${adminTab === tab ? "bg-emerald-500 text-black border-emerald-400 shadow-xl" : "bg-zinc-900 border-zinc-800 text-neutral-500 hover:text-white"}`}>
            {t(`nav.${tab.toLowerCase()}`)}
          </button>
        ))}
      </div>
      {adminTab === "OVERVIEW" && (
        <AdminOverview
          stats={{
            totalVolume: getSystemStats(threads).totalVolume,
            activeMarkets: getSystemStats(threads).activeThreads,
            pendingWithdrawals: 12,
          }}
        />
      )}
      {adminTab === "USERS" && <MemberManagement users={users} onUpdateStatus={onUpdateUserStatus} />}
      {adminTab === "FINANCE" && <FinancialAudit />}
      {adminTab === "SYSTEM" && <CommandCenter onUpgrade={onUpgrade} />}
    </div>
  );
};
