export type User = {
  id: string;
  username: string;
  password: string; // เพิ่มฟิลด์รหัสผ่าน
  wallet: string;
  balance: number;
  winRate: string;
  totalProfit: string;
};

export const mockUsers: User[] = [
  {
    id: "user_1",
    username: "admin001",
    password: "12345",
    wallet: "0x71C9...976F",
    balance: 1500,
    winRate: "67%",
    totalProfit: "+850 USDT",
  },
  {
    id: "user_2",
    username: "admin002",
    password: "12345",
    wallet: "0xAb58...345E",
    balance: 3000,
    winRate: "52%",
    totalProfit: "+2,100 USDT",
  },
];
