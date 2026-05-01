"use client";

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
    phone: user.phone || "08X-XXX-XXXX"
  });

  // แก้ไขตรรกะจำนวนวันสมาชิก: ใช้ joinedAt จริง หรือถ้าไม่มีให้เป็น 0 (เพิ่งสมัคร)
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
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Profile Header & Avatar */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-[40px] p-12 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden group">
         <div className="absolute -right-20 -top-20 opacity-[0.03] group-hover:opacity-10 transition-all duration-1000">
            <User className="w-80 h-80 text-emerald-500" />
         </div>

         <div className="relative group/avatar">
            <div className="w-48 h-48 rounded-[3rem] bg-zinc-900 border-4 border-zinc-800 overflow-hidden shadow-2xl transition-transform group-hover/avatar:scale-105">
               <img 
                 src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} 
                 alt="Avatar" 
                 className="w-full h-full object-cover"
               />
            </div>
            <button className="absolute bottom-2 right-2 p-4 bg-emerald-500 text-black rounded-2xl shadow-xl hover:bg-emerald-400 transition-all active:scale-95">
               <Camera className="w-5 h-5" />
            </button>
         </div>

         <div className="flex-1 space-y-4 text-center md:text-left relative z-10">
            <div className="space-y-1">
               <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase">{user.displayName || user.username}</h2>
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
      <div className="bg-zinc-950 border border-zinc-900 rounded-[40px] p-12">
         <div className="flex justify-between items-center mb-10">
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

         <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
               <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-2">{t("profile.display_name")}</p>
               <div className="relative group">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700 group-focus-within:text-emerald-500" />
                  <input 
                    disabled={!isEditing}
                    type="text" 
                    value={formData.displayName}
                    onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                    className="w-full pl-14 pr-6 py-5 bg-black border border-zinc-900 rounded-2xl outline-none text-white font-bold focus:border-emerald-500/50 disabled:opacity-50 transition-all"
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
                    className="w-full pl-14 pr-8 py-5 bg-black border border-zinc-900 rounded-2xl outline-none text-white font-bold focus:border-emerald-500/50 disabled:opacity-50 transition-all"
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
                    className="w-full pl-14 pr-6 py-5 bg-black border border-zinc-900 rounded-2xl outline-none text-white font-bold focus:border-emerald-500/50 disabled:opacity-50 transition-all"
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
                    className="w-full pl-14 pr-6 py-5 bg-black border border-zinc-900 rounded-2xl outline-none text-zinc-500 font-bold"
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

         <div className="mt-12 p-8 bg-zinc-900/30 border border-zinc-900 rounded-3xl flex items-center gap-6">
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
