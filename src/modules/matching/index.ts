/**
 * Advanced Matching Engine & System Config (V2 - Thai)
 */

export type MatchConfig = {
  feePercent: number;
  minBet: number;
  maxBet: number;
  priorityRule: "PRICE" | "TIME" | "BALANCED";
  maintenanceMode: boolean;
};

export const systemConfig: MatchConfig = {
  feePercent: 0.02,
  minBet: 10,
  maxBet: 50000,
  priorityRule: "PRICE",
  maintenanceMode: false,
};

type MarketVolumeSource = {
  yesVolume?: number;
  noVolume?: number;
  makerVolume?: number;
  takerVolume?: number;
  status?: string;
};

export const getSystemStats = (threads: MarketVolumeSource[]) => {
  const totalVolume = threads.reduce((sum, t) => {
    const predictionVolume = (t.yesVolume ?? 0) + (t.noVolume ?? 0);
    const legacyVolume = (t.makerVolume ?? 0) + (t.takerVolume ?? 0);
    return sum + Math.max(predictionVolume, legacyVolume);
  }, 0);
  const totalFees = totalVolume * systemConfig.feePercent;
  
  return {
    totalVolume,
    totalFees,
    activeThreads: threads.length,
    matchedThreads: threads.filter(t => t.status === "จับคู่แล้ว").length,
    systemLiquidity: 1500000 // สมมติสภาพคล่องในระบบ 1.5M USDT
  };
};
