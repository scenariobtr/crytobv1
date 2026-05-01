"use client";

import { useCallback, useEffect, useState } from "react";
import { INITIAL_PLAYER_POSITION, WORLD_SIZE } from "../constants";
import type { Position } from "../types";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const useAvatarMovement = () => {
  const [position, setPosition] = useState<Position>(INITIAL_PLAYER_POSITION);

  const moveBy = useCallback((delta: Position) => {
    setPosition((current) => ({
      x: clamp(current.x + delta.x, 0, WORLD_SIZE.columns - 1),
      y: clamp(current.y + delta.y, 0, WORLD_SIZE.rows - 1),
    }));
  }, []);

  const moveTo = useCallback((next: Position) => {
    setPosition({
      x: clamp(next.x, 0, WORLD_SIZE.columns - 1),
      y: clamp(next.y, 0, WORLD_SIZE.rows - 1),
    });
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp" || event.key.toLowerCase() === "w") moveBy({ x: 0, y: -1 });
      if (event.key === "ArrowDown" || event.key.toLowerCase() === "s") moveBy({ x: 0, y: 1 });
      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") moveBy({ x: -1, y: 0 });
      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") moveBy({ x: 1, y: 0 });
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [moveBy]);

  return { position, moveBy, moveTo };
};
