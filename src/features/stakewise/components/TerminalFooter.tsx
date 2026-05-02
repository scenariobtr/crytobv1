"use client";

import versionInfo from "@/data/version.json";

export const TerminalFooter = () => {
  return (
    <footer className="max-w-[1500px] mx-auto px-4 md:px-10 py-6 md:py-10 border-t border-zinc-900 mt-10">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">
            STAKEWISE TERMINAL <span className="text-white">v{versionInfo.version}</span> {versionInfo.buildType}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1 italic">Last Deploy Updated</p>
          <p className="text-[11px] font-black text-zinc-400 uppercase tracking-tighter">
            {new Date(versionInfo.lastUpdated).toLocaleString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
        </div>
      </div>
    </footer>
  );
};
