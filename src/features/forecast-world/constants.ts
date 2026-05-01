import type { GameItem, Position } from "./types";

export const WORLD_SIZE = {
  columns: 8,
  rows: 6,
};

export const INITIAL_PLAYER_POSITION: Position = { x: 1, y: 4 };

export const SHOP_POSITION: Position = { x: 6, y: 4 };

export const HUT_POSITIONS: Position[] = [
  { x: 1, y: 1 },
  { x: 4, y: 1 },
  { x: 6, y: 2 },
  { x: 2, y: 3 },
  { x: 5, y: 4 },
  { x: 3, y: 5 },
];

export const ITEM_CATALOG: GameItem[] = [
  {
    id: "forecast-ticket",
    nameKey: "world.items.forecast_ticket.name",
    descriptionKey: "world.items.forecast_ticket.description",
    price: 100,
    type: "FORECAST_TOKEN",
    power: 100,
  },
  {
    id: "yes-charm",
    nameKey: "world.items.yes_charm.name",
    descriptionKey: "world.items.yes_charm.description",
    price: 150,
    type: "FORECAST_TOKEN",
    side: "YES",
    power: 150,
  },
  {
    id: "no-charm",
    nameKey: "world.items.no_charm.name",
    descriptionKey: "world.items.no_charm.description",
    price: 150,
    type: "FORECAST_TOKEN",
    side: "NO",
    power: 150,
  },
];
