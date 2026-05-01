import type { Thread } from "@/modules/market/service";

export type Position = {
  x: number;
  y: number;
};

export type WorldTileType = "GRASS" | "PATH" | "HUT" | "SHOP" | "BLOCK";

export type WorldTile = Position & {
  type: WorldTileType;
  marketId?: number;
};

export type WorldHut = {
  id: string;
  market: Thread;
  position: Position;
};

export type GameItemType = "FORECAST_TOKEN" | "BOOST" | "COSMETIC";

export type GameItem = {
  id: string;
  nameKey: string;
  descriptionKey: string;
  price: number;
  type: GameItemType;
  side?: "YES" | "NO";
  power: number;
};

export type InventoryItem = {
  itemId: string;
  quantity: number;
};

export type PlayerAvatar = {
  userId: string;
  displayName: string;
  position: Position;
};
