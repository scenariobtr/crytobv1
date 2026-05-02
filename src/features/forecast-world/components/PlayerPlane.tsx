import type { AircraftConfig, Position } from "../types";

type PlayerPlaneProps = {
  position?: Position;
  name?: string;
  config?: AircraftConfig;
};

export const PlayerPlane = ({ config, name }: PlayerPlaneProps) => {
  const model = config?.model || "F16";
  const mainColor = config?.color || "#facc15";

  if (model === "DRONE") {
    return (
      <div className="z-50 flex items-center justify-center transition-all duration-300 ease-out" title={name}>
        <div className="relative h-20 w-20 scale-90">
           {/* Drone Design */}
           <div className="absolute left-1/2 top-1/2 h-10 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-zinc-900 shadow-[0_0_20px_rgba(16,185,129,0.3)]" style={{ borderColor: mainColor }} />
           <div className="absolute left-1/2 top-1/2 h-2 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-80" style={{ backgroundColor: mainColor }} />
           <div className="absolute bottom-1 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full blur-[2px] animate-pulse" style={{ backgroundColor: mainColor }} />
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-24 w-24 rounded-full border animate-ping" style={{ borderColor: mainColor, opacity: 0.2 }} />
        </div>
      </div>
    );
  }

  return (
    <div
      className="z-50 flex items-center justify-center transition-all duration-300 ease-out"
      title={name}
    >
      <div className="relative h-24 w-24 scale-90 xl:scale-110">
        {/* Radar Proximity Glow */}
        <div className="absolute inset-0 rounded-full blur-xl animate-pulse" style={{ backgroundColor: `${mainColor}20` }} />

        {/* F-16 Wings (Main) */}
        <div className="absolute left-1/2 top-[55%] h-12 w-16 -translate-x-1/2 -translate-y-1/2 clip-path-f16-wings bg-zinc-800 border-x-2 shadow-[0_0_20px_rgba(0,0,0,0.4)]" style={{ borderColor: mainColor }} />
        
        {/* Wingtip Details */}
        <div className="absolute left-[calc(50%-32px)] top-[60%] h-4 w-1 shadow-[0_0_10px_rgba(0,0,0,0.5)]" style={{ backgroundColor: mainColor }} />
        <div className="absolute left-[calc(50%+28px)] top-[60%] h-4 w-1 shadow-[0_0_10px_rgba(0,0,0,0.5)]" style={{ backgroundColor: mainColor }} />

        {/* Fuselage (Body) */}
        <div className="absolute left-1/2 top-1/2 h-20 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-x bg-gradient-to-b from-zinc-700 via-zinc-900 to-black shadow-[0_0_25px_rgba(0,0,0,0.4)]" style={{ borderColor: `${mainColor}80` }} />
        
        {/* Nose Cone */}
        <div className="absolute left-1/2 top-2 h-6 w-3 -translate-x-1/2 clip-path-f16-nose" style={{ backgroundColor: mainColor }} />

        {/* Bubble Canopy */}
        <div className="absolute left-1/2 top-8 h-6 w-2.5 -translate-x-1/2 rounded-full bg-gradient-to-tr from-white/80 via-white to-zinc-200 shadow-[0_0_15px_rgba(255,255,255,1)]" />

        {/* Vertical Tail Fin */}
        <div className="absolute left-1/2 bottom-4 h-6 w-1 -translate-x-1/2 shadow-[0_0_12px_rgba(0,0,0,0.5)]" style={{ backgroundColor: mainColor }} />

        {/* Horizontal Stabilizers */}
        <div className="absolute left-1/2 bottom-4 h-4 w-10 -translate-x-1/2 clip-path-f16-rear bg-zinc-900 border-x" style={{ borderColor: mainColor }} />

        {/* Engine Afterburner */}
        <div className="absolute -bottom-1 left-1/2 h-8 w-4 -translate-x-1/2 rounded-t-full bg-gradient-to-t from-red-600 via-orange-400 to-yellow-200 blur-[1px] animate-pulse" />
      </div>

      <style jsx>{`
        .clip-path-f16-wings {
          clip-path: polygon(50% 0%, 100% 100%, 85% 100%, 50% 85%, 15% 100%, 0% 100%);
        }
        .clip-path-f16-nose {
          clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
        }
        .clip-path-f16-rear {
          clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%);
        }
      `}</style>
    </div>
  );
};
