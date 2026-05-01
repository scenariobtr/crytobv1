"use client";

export type WalletStatus = "ACTIVE" | "PENDING" | "BLOCKED";
export type TransactionType = "DEPOSIT" | "WITHDRAW" | "BET_PLACE" | "BET_WIN";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  status: "COMPLETED" | "PENDING" | "FAILED";
  date: string;
}

export const walletService = {
  // Logic สำหรับคำนวณเงิน (Center of Truth)
  calculateBalance: (current: number, amount: number, type: 'ADD' | 'SUB'): number => {
    return type === 'ADD' ? current + amount : current - amount;
  },

  // สร้าง Transaction ID ตามมาตรฐาน Debug
  generateTxId: () => `TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`,

  // ตรวจสอบสิทธิ์กระเป๋า
  canTransact: (status: WalletStatus): boolean => {
    return status === "ACTIVE";
  }
};
