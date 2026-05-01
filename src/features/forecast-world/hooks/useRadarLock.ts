"use client";

import { useMemo } from "react";
import { RADAR_LOCK_DISTANCE } from "../constants";
import type { Position, RadarSignal } from "../types";

const getDistance = (from: Position, to: Position) => {
  const x = from.x - to.x;
  const y = from.y - to.y;
  return Math.sqrt((x * x) + (y * y));
};

export const useRadarLock = (planePosition: Position, signals: Omit<RadarSignal, "distance" | "isLocked">[]) => {
  return useMemo<RadarSignal[]>(() => {
    return signals.map((signal) => {
      const distance = getDistance(planePosition, signal.position);
      return {
        ...signal,
        distance,
        isLocked: distance <= RADAR_LOCK_DISTANCE,
      };
    });
  }, [planePosition, signals]);
};
