export type UserRole = "USER" | "SUPER_ADMIN";

export type User = {
  id: string;
  username: string;
  password: string;
  wallet: string;
  balance: number;
  winRate: string;
  totalProfit: string;
  role: UserRole; // เพิ่มระดับสิทธิ์
  status: "ACTIVE" | "BANNED"; // สถานะสมาชิก
  lastIp?: string;
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
    role: "SUPER_ADMIN", // บัญชีผู้ดูแลระบบสูงสุด
    status: "ACTIVE",
    lastIp: "192.168.1.149",
  },
  {
    id: "user_2",
    username: "admin002",
    password: "12345",
    wallet: "0xAb58...345E",
    balance: 3000,
    winRate: "52%",
    totalProfit: "+2,100 USDT",
    role: "USER",
    status: "ACTIVE",
    lastIp: "192.168.1.102",
  },
];
