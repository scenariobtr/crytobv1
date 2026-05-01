"use client";

import type { Position } from "../types";

type PlayerAvatarProps = {
  position: Position;
  name: string;
};

export const PlayerAvatar = ({ position, name }: PlayerAvatarProps) => {
  return (
    <div
      className="z-20 flex items-center justify-center transition-all duration-200"
      style={{ gridColumn: position.x + 1, gridRow: position.y + 1 }}
      title={name}
    >
      <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-black border-2 border-emerald-300 shadow-[0_0_24px_rgba(16,185,129,0.35)] flex items-center justify-center font-black text-xl">
        {name.slice(0, 1).toUpperCase()}
      </div>
    </div>
  );
};
