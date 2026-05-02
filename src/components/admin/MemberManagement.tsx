"use client";

import React, { useState } from "react";
import { User, Shield, Activity, Eye, FileText, Ban, CheckCircle } from "lucide-react";
import { User as UserType } from "@/data/mockUsers";
import { BaseModal } from "@/components/shared/BaseModal";
import { logService } from "@/services/logService";

import { useTranslation } from "@/context/LangContext";

interface MemberManagementProps {
  users: UserType[];
  onUpdateStatus: (id: string, status: "ACTIVE" | "BANNED") => void;
}

export const MemberManagement: React.FC<MemberManagementProps> = ({ users, onUpdateStatus }) => {
  const { t } = useTranslation();
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [userLogContent, setUserLogContent] = useState<string>("");
  const [isLogLoading, setIsLogLoading] = useState(false);

  const handleViewDetails = async (user: UserType) => {
    setSelectedUser(user);
    setIsLogLoading(true);
    try {
      const log = await logService.getUserLog(user.username);
      setUserLogContent(log || t("nav.no_log_found"));
    } catch {
      setUserLogContent(t("nav.error_loading_log"));
    } finally {
      setIsLogLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:mb-8">
        <div>
          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white md:text-3xl">{t("nav.users")}</h2>
          <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mt-1">{t("nav.users_subtitle")}</p>
        </div>
        <div className="px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-xl">
           <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mr-3">{t("nav.total_members")}:</span>
           <span className="text-emerald-500 font-black text-xl">{users.length}</span>
        </div>
      </div>

      <div className="grid gap-4">
        {users.map((user) => (
          <div key={user.id} className="group flex flex-col gap-5 rounded-3xl border border-zinc-900 bg-zinc-950 p-5 transition-all hover:border-emerald-500/30 sm:flex-row sm:items-center sm:justify-between md:p-6">
            <div className="flex min-w-0 items-center gap-4 md:gap-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 transition-all group-hover:border-emerald-500/50 md:h-14 md:w-14">
                <User className="w-6 h-6 text-emerald-500" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                  <h3 className="truncate text-base font-black uppercase tracking-wider text-white md:text-lg">{user.username}</h3>
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${user.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                    {user.status}
                  </span>
                  {user.role === 'SUPER_ADMIN' && <Shield className="w-4 h-4 text-orange-500" />}
                </div>
                <div className="mt-1 flex min-w-0 flex-col gap-1 text-zinc-500 sm:flex-row sm:items-center sm:gap-4">
                   <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest">
                      <Activity className="w-3 h-3 text-emerald-500" /> IP: {user.lastIp || 'N/A'}
                   </div>
                   <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
                   <div className="max-w-[220px] truncate text-[10px] font-bold uppercase tracking-widest sm:max-w-[320px]">WALLET: {user.wallet}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:justify-end">
              <button onClick={() => handleViewDetails(user)} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-3 text-[11px] font-black uppercase transition-all hover:bg-white hover:text-black sm:flex-none sm:px-6">
                <Eye className="w-4 h-4" /> {t("nav.view_details")}
              </button>
              {user.status === 'ACTIVE' ? (
                <button onClick={() => onUpdateStatus(user.id, 'BANNED')} className="p-3 bg-zinc-900 hover:bg-red-500/20 text-zinc-600 hover:text-red-500 rounded-xl border border-zinc-800 transition-all">
                  <Ban className="w-5 h-5" />
                </button>
              ) : (
                <button onClick={() => onUpdateStatus(user.id, 'ACTIVE')} className="p-3 bg-zinc-900 hover:bg-emerald-500/20 text-zinc-600 hover:text-emerald-500 rounded-xl border border-zinc-800 transition-all">
                  <CheckCircle className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <BaseModal id="user-details" isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} title={`USER DATA: ${selectedUser?.username}`} icon={<FileText className="w-6 h-6 text-emerald-500" />} size="4xl">
        {selectedUser && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
               <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">{t("nav.current_balance")}</p>
                  <p className="text-xl font-black italic text-white md:text-2xl">{selectedUser.balance.toLocaleString()} <span className="text-sm text-emerald-500">USDT</span></p>
               </div>
               <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">{t("nav.last_active_ip")}</p>
                  <p className="break-words text-xl font-black italic text-white md:text-2xl">{selectedUser.lastIp || 'SECRET'}</p>
               </div>
            </div>

            <div className="space-y-4">
               <p className="text-[11px] font-black text-neutral-500 uppercase tracking-widest px-2">{t("nav.activity_log")}</p>
               <div className="w-full h-80 bg-black border border-zinc-800 rounded-2xl p-6 font-mono text-[11px] overflow-y-auto no-scrollbar relative">
                  {isLogLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                       <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500"></div>
                    </div>
                  ) : (
                    <pre className="text-zinc-400 whitespace-pre-wrap leading-relaxed">
                      {userLogContent}
                    </pre>
                  )}
               </div>
            </div>

            <button onClick={() => setSelectedUser(null)} className="w-full py-6 bg-zinc-900 text-white font-black uppercase text-sm rounded-xl hover:bg-zinc-800 transition-all border border-zinc-800">{t("nav.close_window")}</button>
          </div>
        )}
      </BaseModal>
    </div>
  );
};
