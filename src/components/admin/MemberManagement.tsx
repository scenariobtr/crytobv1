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
    } catch (err) {
      setUserLogContent(t("nav.error_loading_log"));
    } finally {
      setIsLogLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">{t("nav.users")}</h2>
          <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mt-1">{t("nav.users_subtitle")}</p>
        </div>
        <div className="px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-xl">
           <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mr-3">{t("nav.total_members")}:</span>
           <span className="text-emerald-500 font-black text-xl">{users.length}</span>
        </div>
      </div>

      <div className="grid gap-4">
        {users.map((user) => (
          <div key={user.id} className="bg-zinc-950 border border-zinc-900 p-6 rounded-3xl flex items-center justify-between hover:border-emerald-500/30 transition-all group">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800 group-hover:border-emerald-500/50 transition-all">
                <User className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-black text-white uppercase tracking-wider">{user.username}</h3>
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${user.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                    {user.status}
                  </span>
                  {user.role === 'SUPER_ADMIN' && <Shield className="w-4 h-4 text-orange-500" />}
                </div>
                <div className="flex items-center gap-4 mt-1 text-zinc-500">
                   <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest">
                      <Activity className="w-3 h-3 text-emerald-500" /> IP: {user.lastIp || 'N/A'}
                   </div>
                   <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
                   <div className="text-[10px] font-bold uppercase tracking-widest">WALLET: {user.wallet}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => handleViewDetails(user)} className="flex items-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-white hover:text-black rounded-xl text-[11px] font-black uppercase transition-all">
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
            <div className="grid grid-cols-2 gap-4">
               <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">{t("nav.current_balance")}</p>
                  <p className="text-2xl font-black text-white italic">{selectedUser.balance.toLocaleString()} <span className="text-emerald-500 text-sm">USDT</span></p>
               </div>
               <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">{t("nav.last_active_ip")}</p>
                  <p className="text-2xl font-black text-white italic">{selectedUser.lastIp || 'SECRET'}</p>
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
