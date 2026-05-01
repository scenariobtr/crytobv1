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

export let systemConfig: MatchConfig = {
  feePercent: 0.02,
  minBet: 10,
  maxBet: 50000,
  priorityRule: "PRICE",
  maintenanceMode: false,
};

export const getSystemStats = (threads: any[]) => {
  const totalVolume = threads.reduce((sum, t) => sum + t.makerVolume + t.takerVolume, 0);
  const totalFees = totalVolume * systemConfig.feePercent;
  
  return {
    totalVolume,
    totalFees,
    activeThreads: threads.length,
    matchedThreads: threads.filter(t => t.status === "จับคู่แล้ว").length,
    systemLiquidity: 1500000 // สมมติสภาพคล่องในระบบ 1.5M USDT
  };
};
