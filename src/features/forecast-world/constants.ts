import type { Position } from "./types";

export const WORLD_SIZE = {
  columns: 8,
  rows: 6,
};

export const INITIAL_PLAYER_POSITION: Position = { x: 1, y: 4 };
export const INITIAL_PLANE_POSITION: Position = INITIAL_PLAYER_POSITION;
export const RADAR_LOCK_DISTANCE = 1.5;

export const HUT_POSITIONS: Position[] = [
  { x: 1, y: 1 },
  { x: 4, y: 1 },
  { x: 6, y: 2 },
  { x: 2, y: 3 },
  { x: 5, y: 4 },
  { x: 3, y: 5 },
];
