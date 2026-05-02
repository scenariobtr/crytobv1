import React, { useState } from "react";
import { User, Lock, Smartphone, ShieldCheck, Calendar, Camera, CheckCircle2, Edit2, Plane, Palette } from "lucide-react";
import { useTranslation } from "@/context/LangContext";
import type { User as UserType } from "@/data/mockUsers";
import { PlayerPlane } from "@/features/forecast-world/components/PlayerPlane";
import type { AircraftConfig } from "@/features/forecast-world/types";

type EditableProfile = Partial<Pick<UserType, "password" | "aircraftConfig">> & {
  displayName?: string;
  phone?: string;
  avatar?: string;
  joinedAt?: string;
};

interface ProfileSettingsProps {
  user: UserType & EditableProfile;
  onUpdate: (data: EditableProfile) => void;
}

const PRESET_COLORS = [
  { name: "Neon Yellow", value: "#facc15" },
  { name: "Emerald", value: "#10b981" },
  { name: "Safety Orange", value: "#f97316" },
  { name: "Cyber Blue", value: "#3b82f6" },
  { name: "Neon Pink", value: "#ec4899" },
  { name: "Ghost White", value: "#f8fafc" },
];

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, onUpdate }) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user.displayName || user.username,
    password: user.password,
    phone: user.phone || "08X-XXX-XXXX",
    aircraftConfig: user.aircraftConfig || { model: "F16", color: "#facc15" }
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

      {/* Aircraft Hangar - NEW SECTION */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-900/30 bg-zinc-950 p-5 sm:p-8 md:rounded-[40px] md:p-12">
        <div className="absolute right-0 top-0 h-64 w-64 bg-emerald-500/5 blur-[100px] -z-10" />
        
        <div className="mb-6 flex items-center justify-between md:mb-10">
          <div>
            <h3 className="text-xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
              <Plane className="w-6 h-6 text-emerald-500" /> AIRCRAFT HANGAR
            </h3>
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-1">CUSTOMIZE YOUR RADAR AVATAR</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-12">
          {/* Preview Window */}
          <div className="relative flex min-h-[220px] flex-col items-center justify-center rounded-3xl border-4 border-emerald-950 bg-black p-6 lg:col-span-5 md:p-10">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1)_0%,transparent_70%)]" />
             <div className="scale-150">
               <PlayerPlane config={formData.aircraftConfig} />
             </div>
             <div className="mt-12 text-center">
               <p className="text-xs font-black text-emerald-500 tracking-[0.2em]">{formData.aircraftConfig.model} PROTOTYPE</p>
               <p className="text-[8px] font-bold text-zinc-700 uppercase mt-1">TRANSMITTER ACTIVE</p>
             </div>
          </div>

          {/* Customization Options */}
          <div className="space-y-6 lg:col-span-7 md:space-y-8">
            <div className="space-y-4">
               <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">CHOOSE MODEL</p>
               <div className="grid grid-cols-2 gap-4">
                  {(["DRONE", "F16"] as AircraftConfig["model"][]).map((m) => (
                    <button
                      key={m}
                      onClick={() => setFormData({ ...formData, aircraftConfig: { ...formData.aircraftConfig, model: m } })}
                      className={`py-4 rounded-xl font-black text-xs tracking-widest border-2 transition-all ${
                        formData.aircraftConfig.model === m 
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]" 
                        : "border-zinc-900 bg-zinc-900/50 text-zinc-600 hover:border-zinc-700"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
               </div>
            </div>

            <div className="space-y-4">
               <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                 <Palette className="w-3 h-3" /> SELECT LIVERY COLOR
               </p>
               <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setFormData({ ...formData, aircraftConfig: { ...formData.aircraftConfig, color: c.value } })}
                      className={`h-12 rounded-lg border-2 transition-all flex items-center justify-center ${
                        formData.aircraftConfig.color === c.value ? "border-white scale-110 shadow-lg" : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: c.value }}
                      title={c.name}
                    >
                      {formData.aircraftConfig.color === c.value && <CheckCircle2 className="w-5 h-5 text-black" />}
                    </button>
                  ))}
               </div>
            </div>

            <div className="pt-4">
               <button 
                 onClick={handleSubmit}
                 className="w-full py-5 bg-zinc-900 border border-zinc-800 text-white font-black uppercase text-xs tracking-widest rounded-xl hover:bg-zinc-800 transition-all active:scale-95"
               >
                 APPLY TO HANGAR
               </button>
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
