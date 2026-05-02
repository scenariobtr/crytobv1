"use client";

import React from "react";
import { Zap, TrendingUp, TrendingDown, Users, Plus, Trash2, Edit3, Shield, Clock } from "lucide-react";
import { Thread } from "@/modules/market/service";

import { useTranslation } from "@/context/LangContext";

const Countdown: React.FC<{ endDate: string }> = ({ endDate }) => {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = React.useState("");

  React.useEffect(() => {
    const target = new Date(endDate).getTime();
    
    const update = () => {
      const now = new Date().getTime();
      const diff = target - now;
      
      if (diff <= 0) {
        setTimeLeft(t("market.expired"));
        return;
      }
      
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      
      if (d > 0) setTimeLeft(`${d}d ${h}h`);
      else if (h > 0) setTimeLeft(`${h}h ${m}m`);
      else setTimeLeft(`${m}m ${s}s`);
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [endDate, t]);

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${timeLeft === 'EXPIRED' ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'}`}>
       <Clock className="w-3 h-3" /> {timeLeft}
    </div>
  );
};

interface MarketGridProps {
  threads: Thread[];
  onJoin: (thread: Thread, side: "YES" | "NO") => void;
  onCreateOpen: () => void;
  isAdmin?: boolean;
  onDelete?: (id: number) => void;
  onEdit?: (thread: Thread) => void;
}

export const MarketGrid: React.FC<MarketGridProps> = ({ 
  threads, 
  onJoin, 
  onCreateOpen, 
  isAdmin = false,
  onDelete,
  onEdit
}) => {
  const { t } = useTranslation();
  const [now, setNow] = React.useState(() => Date.now());

  React.useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6 md:space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white sm:text-3xl md:text-4xl">Prediction Markets</h2>
          <p className="text-zinc-500 text-xs md:text-sm font-bold uppercase tracking-widest mt-1">{t("auth.slogan_desc")}</p>
        </div>
        <button onClick={onCreateOpen} className="flex items-center justify-center gap-3 px-6 md:px-8 py-3 md:py-4 bg-emerald-500 text-black font-black uppercase text-xs md:text-sm rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:bg-white transition-all active:scale-95 group">
           <Plus className="w-4 h-4 md:w-5 md:h-5 group-hover:rotate-90 transition-transform" /> {t("market.create_market")}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3 xl:gap-8">
        {threads.map((thread) => {
          const isExpired = new Date(thread.endDate).getTime() <= now;
          return (
            <div key={thread.id} className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border border-zinc-900 bg-zinc-950 p-5 shadow-2xl transition-all hover:border-emerald-500/50 sm:p-6 md:p-8 ${isExpired ? 'opacity-75 grayscale-[0.5]' : ''}`}>
            {/* Admin Control Bar (Top) */}
            {isAdmin && (
              <div className="mb-5 flex flex-col gap-3 border-b border-zinc-900 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                   <Shield className="w-3 h-3 text-orange-500" /> Admin Control
                </span>
                <div className="grid grid-cols-2 gap-2 sm:flex">
                  <button onClick={() => onEdit?.(thread)} className="flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-[10px] font-black uppercase text-white transition-all hover:bg-white hover:text-black sm:px-4">
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button onClick={() => onDelete?.(thread.id)} className="flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-[10px] font-black uppercase text-red-500 transition-all hover:bg-red-500 hover:text-white sm:px-4">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            )}

            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[60px] rounded-full pointer-events-none"></div>
            
            <div className="mb-5 flex items-start justify-between gap-4">
               <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 transition-all duration-500 group-hover:scale-110 group-hover:border-emerald-500/50 sm:h-16 sm:w-16">
                  <Zap className={`h-6 w-6 sm:h-8 sm:w-8 ${thread.isHot ? 'text-orange-500' : 'text-emerald-500'}`} />
               </div>
               <div className="min-w-0 text-right">
                  <div className="mb-1 flex items-center justify-end gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-600 sm:text-[10px]">
                     <Users className="w-3 h-3" /> {(thread.yesVolume + thread.noVolume).toLocaleString()} <span className="text-[8px]">USDT VOL.</span>
                  </div>
                  <div className="flex items-center gap-2">
                   <Countdown endDate={thread.endDate} />
                </div>
               </div>
            </div>

            <div className="flex-1 space-y-4 mb-8">
               <h3 className="line-clamp-2 text-xl font-black italic leading-tight text-white transition-colors group-hover:text-emerald-500 sm:text-2xl">
                 {thread.title}
               </h3>
               <p className="text-zinc-500 text-sm font-bold line-clamp-2 leading-relaxed uppercase tracking-tight">
                 {thread.description}
               </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
               <button 
                disabled={isExpired}
                onClick={() => onJoin(thread, "YES")} 
                className={`group/btn relative flex h-16 items-center justify-between rounded-2xl border p-3 transition-all sm:h-20 sm:p-4 ${isExpired ? 'bg-zinc-900 border-zinc-800 cursor-not-allowed opacity-50' : 'bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500'}`}
               >
                  <div className="text-left">
                     <p className={`text-[10px] font-black uppercase leading-none mb-1 ${isExpired ? 'text-zinc-600' : 'text-emerald-500 group-hover/btn:text-black'}`}>YES</p>
                     <p className={`text-xl font-black italic leading-none sm:text-2xl ${isExpired ? 'text-zinc-500' : 'text-white group-hover/btn:text-black'}`}>{(thread.yesPrice * 100).toFixed(0)}¢</p>
                  </div>
                  <TrendingUp className={`w-6 h-6 transition-all ${isExpired ? 'text-zinc-700' : 'text-emerald-500 group-hover/btn:text-black group-hover/btn:scale-110'}`} />
               </button>

               <button 
                disabled={isExpired}
                onClick={() => onJoin(thread, "NO")} 
                className={`group/btn relative flex h-16 items-center justify-between rounded-2xl border p-3 transition-all sm:h-20 sm:p-4 ${isExpired ? 'bg-zinc-900 border-zinc-800 cursor-not-allowed opacity-50' : 'bg-red-500/10 border-red-500/20 hover:bg-red-500'}`}
               >
                  <div className="text-left">
                     <p className={`text-[10px] font-black uppercase leading-none mb-1 ${isExpired ? 'text-zinc-600' : 'text-red-500 group-hover/btn:text-white'}`}>NO</p>
                     <p className={`text-xl font-black italic leading-none sm:text-2xl ${isExpired ? 'text-zinc-500' : 'text-white'}`}>{(thread.noPrice * 100).toFixed(0)}¢</p>
                  </div>
                  <TrendingDown className={`w-6 h-6 transition-all ${isExpired ? 'text-zinc-700' : 'text-red-500 group-hover/btn:text-white group-hover/btn:scale-110'}`} />
               </button>
            </div>

            <div className="mt-5 flex items-center justify-between gap-4 border-t border-zinc-900 pt-5">
               <div className="text-[9px] font-black uppercase tracking-widest text-zinc-600 sm:text-[10px]">Chance: {Math.round(thread.yesPrice * 100)}% YES</div>
               <div className="h-1 w-24 shrink-0 overflow-hidden rounded-full bg-zinc-900 sm:w-32">
                  <div className="h-full bg-emerald-500" style={{ width: `${thread.yesPrice * 100}%` }}></div>
               </div>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
};
