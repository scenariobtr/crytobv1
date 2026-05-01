import type { Thread } from "@/modules/market/service";

export type ViewMode = "USER" | "ADMIN";
export type UserSubTab = "WORLD" | "MARKETS" | "PORTFOLIO" | "WALLET" | "PROFILE";
export type AdminTab = "OVERVIEW" | "USERS" | "FINANCE" | "SYSTEM";
export type AuthView = "LOGIN" | "REGISTER" | "OTP";
export type MarketSide = "YES" | "NO";

export type PortfolioBet = {
  id: string;
  marketTitle: string;
  side: MarketSide;
  amount: number;
  result: "WIN" | "LOSS" | "PENDING";
};

export type MarketDraft = Pick<Thread, "title" | "description"> & {
  liquidity: number;
  side: MarketSide;
  endDate: string;
};
