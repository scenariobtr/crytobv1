"use client";

export interface Thread {
  id: number;
  title: string;
  description: string;
  status: string;
  yesPrice: number;
  noPrice: number;
  yesVolume: number;
  noVolume: number;
  winner: string | null;
  isHot?: boolean;
  creatorId: string;
  endDate: string; // ISO String
}

export const marketService = {
  // จำลองการดึงข้อมูลจาก API
  fetchMarkets: async (): Promise<Thread[]> => {
    // ในอนาคตเปลี่ยนเป็น fetch("/api/markets")
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    return [
      {
        id: 1,
        title: "ลิเวอร์พูล จะชนะ แมนยู หรือไม่?",
        description: "นัดชี้ชะตาพรีเมียร์ลีก",
        status: "เปิดรับ",
        yesPrice: 0.65,
        noPrice: 0.35,
        yesVolume: 1500,
        noVolume: 850,
        winner: null,
        creatorId: "admin",
        isHot: true,
        endDate: tomorrow.toISOString(),
      },
      {
        id: 2,
        title: "Bitcoin จะแตะ $100k ก่อนสิ้นปี?",
        description: "ราคาสรุป ณ เวลา 23:59 UTC",
        status: "เปิดรับ",
        yesPrice: 0.42,
        noPrice: 0.58,
        yesVolume: 5200,
        noVolume: 7100,
        winner: null,
        creatorId: "admin",
        isHot: true,
        endDate: nextWeek.toISOString(),
      }
    ];
  },

  createMarket: (title: string, creatorId: string, endDate: string = ""): Thread => {
    return {
      id: Date.now(),
      title,
      description: "",
      status: "เปิดรับ",
      yesPrice: 0.5,
      noPrice: 0.5,
      yesVolume: 0,
      noVolume: 0,
      winner: null,
      creatorId,
      isHot: false,
      endDate: endDate || new Date(Date.now() + 86400000).toISOString() // Default 24h
    };
  }
};
