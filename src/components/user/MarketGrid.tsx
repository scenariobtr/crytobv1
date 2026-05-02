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
    <div className="space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-white italic uppercase tracking-tighter">Prediction Markets</h2>
          <p className="text-zinc-500 text-xs md:text-sm font-bold uppercase tracking-widest mt-1">{t("auth.slogan_desc")}</p>
        </div>
        <button onClick={onCreateOpen} className="flex items-center justify-center gap-3 px-6 md:px-8 py-3 md:py-4 bg-emerald-500 text-black font-black uppercase text-xs md:text-sm rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:bg-white transition-all active:scale-95 group">
           <Plus className="w-4 h-4 md:w-5 md:h-5 group-hover:rotate-90 transition-transform" /> {t("market.create_market")}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {threads.map((thread) => {
          const isExpired = new Date(thread.endDate).getTime() <= now;
          return (
            <div key={thread.id} className={`bg-zinc-950 border border-zinc-900 rounded-[32px] p-8 hover:border-emerald-500/50 transition-all group relative overflow-hidden flex flex-col h-full shadow-2xl ${isExpired ? 'opacity-75 grayscale-[0.5]' : ''}`}>
            {/* Admin Control Bar (Top) */}
            {isAdmin && (
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-900">
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                   <Shield className="w-3 h-3 text-orange-500" /> Admin Control
                </span>
                <div className="flex gap-2">
                  <button onClick={() => onEdit?.(thread)} className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 text-white rounded-xl hover:bg-white hover:text-black transition-all text-[10px] font-black uppercase">
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button onClick={() => onDelete?.(thread.id)} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all text-[10px] font-black uppercase">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            )}

            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[60px] rounded-full pointer-events-none"></div>
            
            <div className="mb-6 flex justify-between items-start">
               <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800 group-hover:border-emerald-500/50 transition-all group-hover:scale-110 duration-500">
                  <Zap className={`w-8 h-8 ${thread.isHot ? 'text-orange-500' : 'text-emerald-500'}`} />
               </div>
               <div className="text-right">
                  <div className="flex items-center gap-2 text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">
                     <Users className="w-3 h-3" /> {(thread.yesVolume + thread.noVolume).toLocaleString()} <span className="text-[8px]">USDT VOL.</span>
                  </div>
                  <div className="flex items-center gap-2">
                   <Countdown endDate={thread.endDate} />
                </div>
               </div>
            </div>

            <div className="flex-1 space-y-4 mb-8">
               <h3 className="text-2xl font-black text-white italic leading-tight group-hover:text-emerald-500 transition-colors line-clamp-2">
                 {thread.title}
               </h3>
               <p className="text-zinc-500 text-sm font-bold line-clamp-2 leading-relaxed uppercase tracking-tight">
                 {thread.description}
               </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <button 
                disabled={isExpired}
                onClick={() => onJoin(thread, "YES")} 
                className={`group/btn relative h-20 border rounded-2xl p-4 flex items-center justify-between transition-all ${isExpired ? 'bg-zinc-900 border-zinc-800 cursor-not-allowed opacity-50' : 'bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500'}`}
               >
                  <div className="text-left">
                     <p className={`text-[10px] font-black uppercase leading-none mb-1 ${isExpired ? 'text-zinc-600' : 'text-emerald-500 group-hover/btn:text-black'}`}>YES</p>
                     <p className={`text-2xl font-black italic leading-none ${isExpired ? 'text-zinc-500' : 'text-white group-hover/btn:text-black'}`}>{(thread.yesPrice * 100).toFixed(0)}¢</p>
                  </div>
                  <TrendingUp className={`w-6 h-6 transition-all ${isExpired ? 'text-zinc-700' : 'text-emerald-500 group-hover/btn:text-black group-hover/btn:scale-110'}`} />
               </button>

               <button 
                disabled={isExpired}
                onClick={() => onJoin(thread, "NO")} 
                className={`group/btn relative h-20 border rounded-2xl p-4 flex items-center justify-between transition-all ${isExpired ? 'bg-zinc-900 border-zinc-800 cursor-not-allowed opacity-50' : 'bg-red-500/10 border-red-500/20 hover:bg-red-500'}`}
               >
                  <div className="text-left">
                     <p className={`text-[10px] font-black uppercase leading-none mb-1 ${isExpired ? 'text-zinc-600' : 'text-red-500 group-hover/btn:text-white'}`}>NO</p>
                     <p className={`text-2xl font-black italic leading-none ${isExpired ? 'text-zinc-500' : 'text-white'}`}>{(thread.noPrice * 100).toFixed(0)}¢</p>
                  </div>
                  <TrendingDown className={`w-6 h-6 transition-all ${isExpired ? 'text-zinc-700' : 'text-red-500 group-hover/btn:text-white group-hover/btn:scale-110'}`} />
               </button>
            </div>

            <div className="mt-6 pt-6 border-t border-zinc-900 flex justify-between items-center">
               <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Chance: {Math.round(thread.yesPrice * 100)}% YES</div>
               <div className="w-32 h-1 bg-zinc-900 rounded-full overflow-hidden">
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
