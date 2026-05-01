"use client";

import type { Position } from "../types";

type PlayerPlaneProps = {
  position: Position;
  name: string;
};

export const PlayerPlane = ({ position, name }: PlayerPlaneProps) => {
  return (
    <div
      className="z-30 flex items-center justify-center transition-all duration-200 ease-out"
      style={{ gridColumn: position.x + 1, gridRow: position.y + 1 }}
      title={name}
    >
      <div className="relative h-14 w-14 drop-shadow-[0_0_16px_rgba(16,185,129,0.45)]">
        <div className="absolute left-5 top-1 h-12 w-4 rounded-sm border-2 border-emerald-950 bg-emerald-400" />
        <div className="absolute left-2 top-5 h-4 w-10 rounded-sm border-2 border-emerald-950 bg-zinc-100" />
        <div className="absolute left-5 top-0 h-4 w-4 rounded-sm border-2 border-emerald-950 bg-cyan-200" />
        <div className="absolute left-6 top-9 h-5 w-2 rounded-sm border-2 border-emerald-950 bg-emerald-700" />
        <div className="absolute left-4 top-12 h-2 w-6 rounded-sm border-2 border-emerald-950 bg-orange-500" />
      </div>
    </div>
  );
};
