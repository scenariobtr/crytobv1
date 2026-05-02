"use client";

import { Zap } from "lucide-react";

type LoadingScreenProps = {
  slogan: string;
};

export const LoadingScreen = ({ slogan }: LoadingScreenProps) => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none animate-pulse"></div>
      <div className="text-center space-y-8 md:space-y-12 relative z-10 animate-in fade-in zoom-in duration-1000">
        <Zap className="w-16 h-16 md:w-24 md:h-24 text-emerald-500 mx-auto animate-bounce" />
        <div className="space-y-4 md:space-y-6">
          <h1 className="text-6xl md:text-9xl font-black text-white italic tracking-tighter leading-none">
            STAKE<span className="text-emerald-500">WISE</span>
          </h1>
          <p className="text-neutral-400 text-lg md:text-2xl font-bold uppercase tracking-normal opacity-80 italic">
            {slogan}
          </p>
        </div>
        <div className="pt-16">
          <div className="w-64 h-1 bg-zinc-900 mx-auto rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 animate-shimmer"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
