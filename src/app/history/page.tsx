"use client";

import React from "react";
import { TrendingUp, ArrowLeft, History, Filter, ExternalLink, ChevronRight } from "lucide-react";
import Link from "next/link";

type BetHistory = {
  id: string;
  topic: string;
  side: string;
  amount: number;
  odds: number;
  status: "ชนะ" | "แพ้" | "รอผล";
  date: string;
};

const mockHistory: BetHistory[] = [
  {
    id: "TXN-8821",
    topic: "ราคา BITCOIN สิ้นปี 2026",
    side: "ใช่ (ตกลง)",
    amount: 100,
    odds: 1.5,
    status: "รอผล",
    date: "2026-05-01 14:30",
  },
  {
    id: "TXN-7742",
    topic: "แมนยู VS ลิเวอร์พูล",
    side: "ฝั่งแมนยู (รับแทง)",
    amount: 500,
    odds: 1.8,
    status: "ชนะ",
    date: "2026-04-28 21:00",
  },
  {
    id: "TXN-5531",
    topic: "การเลือกตั้งสหรัฐฯ 2028",
    side: "ผู้สมัคร A",
    amount: 250,
    odds: 2.0,
    status: "แพ้",
    date: "2026-04-20 10:15",
  },
];

import { mockUsers, User as UserType } from "../../data/mockUsers";

export default function HistoryPage() {
  const [currentUser, setCurrentUser] = React.useState<UserType | null>(null);

  React.useEffect(() => {
    const savedUserId = localStorage.getItem("current_user_id");
    if (savedUserId) {
      const user = mockUsers.find(u => u.id === savedUserId);
      if (user) setCurrentUser(user);
    }
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans pb-20">
      {/* Header */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5 bg-neutral-950 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link href="/" className="w-8 h-8 rounded-sm bg-emerald-500 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-black" />
          </Link>
          <span className="text-xl font-bold tracking-tight uppercase">ประวัติของฉัน</span>
        </div>
        <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-white flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> กลับหน้าหลัก
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Profile Summary */}
        <div className="mb-16 flex flex-col md:flex-row md:items-center justify-between gap-8 p-8 bg-neutral-900/30 border border-neutral-900 rounded-sm">
          <div className="space-y-2">
            <h2 className="text-4xl font-black uppercase tracking-tighter">
              {currentUser ? currentUser.username : "บุคคลทั่วไป"}
            </h2>
            <p className="text-neutral-500 text-sm font-sans">
              {currentUser ? currentUser.wallet : "ยังไม่ได้เชื่อมต่อกระเป๋า"}
            </p>
          </div>
          <div className="flex gap-12">
            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-600 mb-1">อัตราการชนะ</p>
              <p className="text-2xl font-black text-emerald-500 tracking-tight">
                {currentUser ? currentUser.winRate : "0%"}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-600 mb-1">กำไรรวมทั้งหมด</p>
              <p className="text-2xl font-black text-white tracking-tight">
                {currentUser ? currentUser.totalProfit : "0 USDT"}
              </p>
            </div>
          </div>
        </div>

        {/* History List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-900">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 flex items-center gap-2">
              <History className="w-4 h-4" /> รายการล่าสุด
            </h3>
            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-600 hover:text-white transition-colors">
              <Filter className="w-3 h-3" /> ตัวกรอง
            </button>
          </div>

          <div className="space-y-4">
            {mockHistory.map((bet) => (
              <div key={bet.id} className="group bg-neutral-900/20 border border-neutral-900 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:bg-neutral-900/40">
                <div className="flex-grow space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-700">{bet.id}</span>
                    <span className="text-[10px] font-bold text-neutral-600">{bet.date}</span>
                  </div>
                  <h4 className="text-lg font-black uppercase tracking-tight">{bet.topic}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-neutral-800 text-neutral-400">ฝั่ง: {bet.side}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-neutral-800 text-neutral-400">เรท: {bet.odds}X</span>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-12 border-t md:border-none border-neutral-900 pt-4 md:pt-0">
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-600 mb-1">จำนวนเงิน</p>
                    <p className="font-black text-xl">{bet.amount} USDT</p>
                  </div>
                  <div className="text-right min-w-[80px]">
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-600 mb-1">ผลลัพธ์</p>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                      bet.status === "ชนะ" ? "text-emerald-500" : 
                      bet.status === "แพ้" ? "text-red-500" : "text-neutral-500"
                    }`}>
                      {bet.status}
                    </span>
                  </div>
                  <button className="hidden md:block p-2 text-neutral-700 hover:text-white transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="w-full mt-12 py-4 border border-neutral-900 text-neutral-700 text-[10px] font-black uppercase tracking-widest hover:text-white hover:border-neutral-700 transition-all">
          โหลดรายการเพิ่มเติม
        </button>
      </main>
    </div>
  );
}
