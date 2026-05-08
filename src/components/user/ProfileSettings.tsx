import React, { useState } from "react";
import { User, Lock, Smartphone, ShieldCheck, Calendar, Camera, CheckCircle2, Edit2 } from "lucide-react";
import { useTranslation } from "@/context/LangContext";
import type { User as UserType } from "@/data/mockUsers";

type EditableProfile = Partial<Pick<UserType, "password">> & {
  displayName?: string;
  phone?: string;
  avatar?: string;
  joinedAt?: string;
};

interface ProfileSettingsProps {
  user: UserType & EditableProfile;
  onUpdate: (data: EditableProfile) => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, onUpdate }) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user.displayName || user.username,
    password: user.password,
    phone: user.phone || "08X-XXX-XXXX",
  });

  const calculateDays = () => {
    if (!user.joinedAt) return 0;
    const joinedDate = new Date(user.joinedAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - joinedDate.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  const diffDays = calculateDays();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setIsEditing(false);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 md:space-y-10">
      
      {/* Profile Header & Avatar */}
      <div className="group relative flex flex-col items-center gap-6 overflow-hidden rounded-3xl border border-zinc-900 bg-zinc-950 p-5 sm:p-8 md:flex-row md:gap-12 md:rounded-[40px] md:p-12">
         <div className="absolute -right-20 -top-20 opacity-[0.03] group-hover:opacity-10 transition-all duration-1000">
            <User className="w-80 h-80 text-emerald-500" />
         </div>

         <div className="relative group/avatar">
            <div className="h-32 w-32 overflow-hidden rounded-3xl border-4 border-zinc-800 bg-zinc-900 shadow-2xl transition-transform group-hover/avatar:scale-105 sm:h-40 sm:w-40 md:h-48 md:w-48 md:rounded-[3rem]">
               <img 
                 src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} 
                 alt="Avatar" 
                 className="w-full h-full object-cover"
               />
            </div>
            <button className="absolute bottom-1 right-1 rounded-2xl bg-emerald-500 p-3 text-black shadow-xl transition-all hover:bg-emerald-400 active:scale-95 sm:bottom-2 sm:right-2 sm:p-4">
               <Camera className="w-5 h-5" />
            </button>
         </div>

         <div className="flex-1 space-y-4 text-center md:text-left relative z-10">
            <div className="space-y-1">
               <h2 className="break-words text-[clamp(2rem,12vw,3rem)] font-black uppercase italic leading-none tracking-tighter text-white">{user.displayName || user.username}</h2>
               <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs flex items-center justify-center md:justify-start gap-2">
                  @{user.username} <span className="text-zinc-800">|</span> 
                  <span className="text-emerald-500 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> {t("profile.verified_status").toUpperCase()}</span>
               </p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
               <div className="px-5 py-2 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-zinc-600" />
                  <span className="text-[11px] font-black text-white uppercase tracking-widest">
                    {diffDays === 0 ? t("profile.just_joined") : `${t("profile.member_since")} ${diffDays} ${t("profile.days")}`}
                  </span>
               </div>
            </div>
         </div>
      </div>

      {/* Profile Details Form */}
      <div className="rounded-3xl border border-zinc-900 bg-zinc-950 p-5 sm:p-8 md:rounded-[40px] md:p-12">
         <div className="mb-8 flex items-start justify-between gap-4 md:mb-10">
            <h3 className="text-xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
               <Edit2 className="w-5 h-5 text-emerald-500" /> {t("profile.settings_title")}
            </h3>
            <button 
              onClick={() => setIsEditing(!isEditing)} 
              className="text-xs font-black text-emerald-500 uppercase tracking-widest hover:text-white transition-colors"
            >
               {isEditing ? t("profile.cancel") : t("profile.edit_profile")}
            </button>
         </div>

         <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
            <div className="space-y-4">
               <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-2">{t("profile.display_name")}</p>
               <div className="relative group">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700 group-focus-within:text-emerald-500" />
                  <input 
                    disabled={!isEditing}
                    type="text" 
                    value={formData.displayName}
                    onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                    className="w-full rounded-2xl border border-zinc-900 bg-black py-4 pl-14 pr-6 font-bold text-white outline-none transition-all focus:border-emerald-500/50 disabled:opacity-50 md:py-5"
                  />
               </div>
            </div>

            <div className="space-y-4">
               <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-2">{t("profile.phone")}</p>
               <div className="relative group">
                  <Smartphone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700 group-focus-within:text-emerald-500" />
                  <input 
                    disabled={!isEditing}
                    type="text" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full rounded-2xl border border-zinc-900 bg-black py-4 pl-14 pr-8 font-bold text-white outline-none transition-all focus:border-emerald-500/50 disabled:opacity-50 md:py-5"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-emerald-500">
                     <CheckCircle2 className="w-5 h-5" />
                  </div>
               </div>
            </div>

            <div className="space-y-4">
               <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-2">{t("profile.password")}</p>
               <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700 group-focus-within:text-emerald-500" />
                  <input 
                    disabled={!isEditing}
                    type="password" 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full rounded-2xl border border-zinc-900 bg-black py-4 pl-14 pr-6 font-bold text-white outline-none transition-all focus:border-emerald-500/50 disabled:opacity-50 md:py-5"
                  />
               </div>
            </div>

            <div className="space-y-4 opacity-50">
               <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-2">{t("profile.username_main")}</p>
               <div className="relative group">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700" />
                  <input 
                    disabled
                    type="text" 
                    value={user.username}
                    className="w-full rounded-2xl border border-zinc-900 bg-black py-4 pl-14 pr-6 font-bold text-zinc-500 md:py-5"
                  />
               </div>
            </div>

            {isEditing && (
               <div className="md:col-span-2 pt-4">
                  <button type="submit" className="w-full py-6 bg-emerald-500 text-black font-black uppercase text-sm rounded-xl shadow-xl hover:bg-emerald-400 transition-all active:scale-95">
                     {t("profile.save_changes")}
                  </button>
               </div>
            )}
         </form>

         <div className="mt-8 flex items-start gap-4 rounded-3xl border border-zinc-900 bg-zinc-900/30 p-5 sm:items-center md:mt-12 md:gap-6 md:p-8">
            <div className="p-4 bg-emerald-500/10 rounded-2xl">
               <ShieldCheck className="w-8 h-8 text-emerald-500" />
            </div>
            <div>
               <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{t("profile.verified_status")}</p>
               <p className="text-sm font-bold text-zinc-400 leading-tight">{t("profile.verified_desc")}</p>
            </div>
         </div>
      </div>
    </div>
  );
};