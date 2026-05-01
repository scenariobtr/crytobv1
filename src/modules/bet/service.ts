"use client";

import { walletService } from "@/modules/wallet";

export const betService = {
  placeBet: (currentBalance: number, amount: number) => {
    if (amount > currentBalance) {
      throw new Error("Insufficient Balance");
    }
    return walletService.calculateBalance(currentBalance, amount, 'SUB');
  },

  resolveMarket: (threadId: number, winner: "YES" | "NO") => {
    // Logic สำหรับกระจายเงินรางวัลในอนาคต
    console.log(`Resolving market ${threadId} with winner ${winner}`);
    return { success: true, winner };
  }
};
