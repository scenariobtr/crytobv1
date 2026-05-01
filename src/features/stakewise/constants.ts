import type { AdminTab, MarketDraft, UserSubTab } from "./types";

export const ADMIN_TABS: AdminTab[] = ["OVERVIEW", "USERS", "FINANCE", "SYSTEM"];

export const USER_TABS: UserSubTab[] = ["WORLD", "MARKETS", "PORTFOLIO", "WALLET", "PROFILE"];

export const userTabLabelKey: Record<UserSubTab, string> = {
  WORLD: "world.nav",
  MARKETS: "nav.prediction_markets",
  PORTFOLIO: "nav.your_assets",
  WALLET: "nav.wallet_hub",
  PROFILE: "nav.profile",
};

export const createDefaultMarketDraft = (): MarketDraft => ({
  title: "",
  description: "",
  liquidity: 0,
  side: "YES" as const,
  endDate: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
});
