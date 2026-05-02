import type { Thread } from "@/modules/market/service";

export type Position = {
  x: number;
  y: number;
};

export type RadarSignal = {
  id: string;
  market: Thread;
  position: Position;
  intensity: number;
  distance: number;
  isLocked: boolean;
  isExpired: boolean;
};

export type FlightTelemetry = {
  altitude: number;
  speed: number;
  heading: string;
};

export type RadarBetSide = "YES" | "NO";

export type AircraftModel = "DRONE" | "F16";
export type AircraftConfig = {
  model: AircraftModel;
  color: string;
};

export type CombatAction = {
  type: "LOCKING" | "MISSILE_LAUNCH" | "EXPLOSION";
  startPos: Position;
  targetPos: Position;
  side: RadarBetSide;
  timestamp: number;
};
