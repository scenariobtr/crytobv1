"use client";

import React, { useState, useRef, useEffect } from "react";
import { Wallet, Plus, Trash2, X, CheckCircle2, TrendingUp, Search, ArrowRight, Coins, Lock, User } from "lucide-react";
import Link from "next/link";
import { mockUsers, User as UserType } from "../data/mockUsers";

type Thread = {
  id: number;
  title: string;
  description: string;
  status: "เปิดรับ" | "จับคู่แล้ว" | "ปิดแล้ว";
  makerName: string;
  takerName: string;
  makerOdds: number;
  takerOdds: number;
  makerVolume: number;
  takerVolume: number;
};

const initialThreads: Thread[] = [
  {
    id: 1,
    title: "แมนเชสเตอร์ ยูไนเต็ด vs ลิเวอร์พูล",
    description: "ฟุตบอลพรีเมียร์ลีก นัดชี้ชะตา ใครจะเป็นผู้ชนะ?",
    status: "เปิดรับ",
    makerName: "ฝั่งแมนยู (รับแทง)",
    takerName: "ฝั่งลิเวอร์พูล (วางเดิมพัน)",
    makerOdds: 1.8,
    takerOdds: 2.1,
    makerVolume: 500,
    takerVolume: 250,
  },
  {
    id: 2,
    title: "ราคา Bitcoin สิ้นปี 2026",
    description: "BTC จะทะลุ $150,000 หรือไม่ภายในสิ้นปีนี้?",
    status: "เปิดรับ",
    makerName: "ใช่ (ตกลง)",
    takerName: "ไม่ใช่ (ไม่ตกลง)",
    makerOdds: 1.5,
    takerOdds: 2.5,
    makerVolume: 1200,
    takerVolume: 800,
  },
  {
    id: 3,
    title: "การเลือกตั้งสหรัฐฯ 2028",
    description: "ใครจะได้เป็นประธานาธิบดีคนต่อไปของสหรัฐอเมริกา?",
    status: "จับคู่แล้ว",
    makerName: "ผู้สมัคร A",
    takerName: "ผู้สมัคร B",
    makerOdds: 1.9,
    takerOdds: 1.9,
    makerVolume: 5000,
    takerVolume: 5000,
  },
];

export default function Home() {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Login States
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [balance, setBalance] = useState<number>(0);
  const [threads, setThreads] = useState<Thread[]>(initialThreads);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [joinModalThread, setJoinModalThread] = useState<Thread | null>(null);

  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [makerName, setMakerName] = useState("");
  const [takerName, setTakerName] = useState("");

  const [joinSide, setJoinSide] = useState<"MAKER" | "TAKER" | null>(null);
  const [joinAmount, setJoinAmount] = useState<number | "">("");

  const threadsSectionRef = useRef<HTMLElement>(null);

  // เช็ค Login เมื่อโหลดหน้าเว็บ
  useEffect(() => {
    const savedUserId = localStorage.getItem("current_user_id");
    if (savedUserId) {
      const user = mockUsers.find(u => u.id === savedUserId);
      if (user) {
        setCurrentUser(user);
        setBalance(user.balance);
      }
    }
    setIsLoading(false);
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    const user = mockUsers.find(
      (u) => u.username === loginUsername && u.password === loginPassword
    );

    if (user) {
      localStorage.setItem("current_user_id", user.id);
      setCurrentUser(user);
      setBalance(user.balance);
    } else {
      setLoginError("ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("current_user_id");
    setCurrentUser(null);
  };

  const handleConnectWallet = (e: React.MouseEvent) => {
    e.preventDefault();
    // จำลองการสลับ User เพื่อการทดสอบ
    if (currentUser?.id === "user_1") {
      const u2 = mockUsers[1];
      setCurrentUser(u2);
      setBalance(u2.balance);
      localStorage.setItem("current_user_id", u2.id);
    } else {
      const u1 = mockUsers[0];
      setCurrentUser(u1);
      setBalance(u1.balance);
      localStorage.setItem("current_user_id", u1.id);
    }
  };

  const handleDeleteThread = (id: number) => {
    setThreads(threads.filter((t) => t.id !== id));
  };

  const scrollToThreads = (e: React.MouseEvent) => {
    e.preventDefault();
    threadsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const newThread: Thread = {
      id: Date.now(),
      title: newTitle,
      description: newDesc,
      status: "เปิดรับ",
      makerName: makerName || "ใช่ (ตกลง)",
      takerName: takerName || "ไม่ใช่ (ไม่ตกลง)",
      makerOdds: 2.0,
      takerOdds: 2.0,
      makerVolume: 0,
      takerVolume: 0,
    };

    setThreads([newThread, ...threads]);
    setIsCreateModalOpen(false);
    setNewTitle("");
    setNewDesc("");
    setMakerName("");
    setTakerName("");
  };

  const openJoinModal = (thread: Thread) => {
    setJoinModalThread(thread);
    setJoinSide(null);
    setJoinAmount("");
  };

  const handleJoinThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinSide || !joinAmount) return alert("กรุณาเลือกฝั่งและระบุจำนวนเงิน");
    if (Number(joinAmount) <= 0) return alert("จำนวนเงินต้องมากกว่า 0");
    if (Number(joinAmount) > balance) return alert("ยอดเงินไม่เพียงพอ");

    setBalance((prev) => prev - Number(joinAmount));

    setThreads(
      threads.map((t) => {
        if (t.id === joinModalThread?.id) {
          if (joinSide === "MAKER") return { ...t, makerVolume: t.makerVolume + Number(joinAmount) };
          if (joinSide === "TAKER") return { ...t, takerVolume: t.takerVolume + Number(joinAmount) };
        }
        return t;
      })
    );

    setJoinModalThread(null);
    alert("เข้าร่วมทายผลสำเร็จ! ระบบได้ทำการล็อคยอดเงินของคุณไว้แล้ว");
  };

  if (isLoading) return <div className="min-h-screen bg-neutral-950"></div>;

  // ถ้ายังไม่ล็อกอิน ให้แสดงหน้า Login
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8 animate-in fade-in duration-700">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="w-14 h-14 rounded-sm bg-emerald-500 flex items-center justify-center shadow-2xl shadow-emerald-500/20">
              <TrendingUp className="w-10 h-10 text-black" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase">CryptoBet Login</h1>
            <p className="text-neutral-500 text-sm italic">
              ใช้บัญชี <span className="text-emerald-500 font-bold">admin001</span> หรือ <span className="text-emerald-500 font-bold">admin002</span> <br />
              รหัสผ่านคือ <span className="text-white font-bold">12345</span>
            </p>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-sm">
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-600 mb-2">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-700" />
                  <input
                    required
                    type="text"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="ระบุชื่อผู้ใช้งาน..."
                    className="w-full pl-12 pr-4 py-4 bg-neutral-950 border border-neutral-800 focus:border-emerald-500 outline-none transition-all uppercase text-xs font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-neutral-600 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-700" />
                  <input
                    required
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="ระบุรหัสผ่าน..."
                    className="w-full pl-12 pr-4 py-4 bg-neutral-950 border border-neutral-800 focus:border-emerald-500 outline-none transition-all uppercase text-xs font-bold"
                  />
                </div>
              </div>
              
              {loginError && <p className="text-[10px] text-red-500 font-black uppercase text-center">{loginError}</p>}

              <button type="submit" className="w-full py-5 bg-emerald-500 text-black font-black uppercase tracking-widest hover:bg-emerald-400 transition-all">
                เข้าสู่ระบบทันที
              </button>
            </form>
          </div>
          <p className="text-center text-[10px] text-neutral-800 font-black uppercase tracking-[0.3em]">
            Decentralized Betting Protocol v1.0
          </p>
        </div>
      </div>
    );
  }

  // ถ้าล็อกอินแล้ว แสดงหน้า Dashboard
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-emerald-500/30 pb-20 relative">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-neutral-950 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-emerald-500 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white uppercase">
            CryptoBet
          </span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <span className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">วงแลน:</span>
            <span className="text-[10px] font-black tracking-widest text-emerald-500">192.168.1.149:3000</span>
          </div>

          <div className="flex items-center gap-6 mr-2">
            <Link href="/history" className="text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-white transition-colors">
              ประวัติ
            </Link>
            <button onClick={handleLogout} className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors">
              ออกจากระบบ
            </button>
          </div>

          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">{currentUser.username}</span>
            <span className="text-emerald-400 font-medium">{balance.toLocaleString()} USDT</span>
          </div>
          <button
            onClick={handleConnectWallet}
            className="flex items-center gap-2 px-5 py-2 text-sm font-bold bg-neutral-900 text-neutral-300 border border-neutral-800 rounded-sm hover:bg-neutral-800 transition-all"
          >
            <Wallet className="w-4 h-4" />
            {currentUser.wallet}
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12 relative z-10">
        {/* Hero Section */}
        <section className="text-center mb-24 space-y-8">
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none uppercase">
            ทายผล <br />
            <span className="text-emerald-500">ทุกสิ่งในโลก.</span>
          </h1>
          <p className="text-lg text-neutral-400 max-w-xl mx-auto italic">
            แพลตฟอร์มตัวกลางที่ให้คุณตั้งกระทู้รับแทง หรือร่วมทายผลด้วย Crypto 
            เรียบง่าย โปร่งใส และไร้คนกลาง
          </p>
          <div className="pt-8 flex justify-center gap-4">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-8 py-4 bg-emerald-500 text-black font-black text-xs uppercase tracking-widest hover:bg-emerald-400 transition-all rounded-sm flex items-center gap-2 relative z-20"
            >
              <Plus className="w-4 h-4" />
              สร้างกระทู้ใหม่
            </button>
            <button
              onClick={scrollToThreads}
              className="px-8 py-4 bg-neutral-900 border border-neutral-800 text-white font-black text-xs uppercase tracking-widest hover:bg-neutral-800 transition-all rounded-sm relative z-20"
            >
              ดูกระทู้ทั้งหมด
            </button>
          </div>
        </section>

        {/* Live Threads */}
        <section ref={threadsSectionRef} className="scroll-mt-24">
          <div className="flex items-center justify-between mb-12 pb-4 border-b border-neutral-900">
            <h2 className="text-2xl font-black uppercase tracking-widest">รายการสด</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {threads.map((thread) => (
              <div
                key={thread.id}
                className={`bg-neutral-900/40 border border-neutral-900 p-8 flex flex-col relative ${
                  thread.status === "จับคู่แล้ว" ? "opacity-40" : "hover:border-emerald-500/40"
                }`}
              >
                <div className="flex justify-between items-start mb-6">
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 ${
                    thread.status === "เปิดรับ" ? "bg-emerald-500/10 text-emerald-400" : "bg-neutral-800 text-neutral-500"
                  }`}>
                    {thread.status}
                  </span>
                  <button onClick={() => handleDeleteThread(thread.id)} className="text-neutral-700 hover:text-red-500 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <h3 className="text-2xl font-black mb-3 uppercase tracking-tight">{thread.title}</h3>
                <p className="text-neutral-500 text-sm mb-10 flex-grow italic">{thread.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-4 bg-black/40 border border-neutral-900">
                    <div className="text-[10px] uppercase tracking-widest text-neutral-600 mb-2 font-bold">{thread.makerName}</div>
                    <div className="flex items-end justify-between">
                      <div className="text-2xl font-black text-emerald-500">{thread.makerOdds.toFixed(1)}X</div>
                      <div className="text-[10px] text-neutral-700 mb-1 font-bold">{thread.makerVolume} USDT</div>
                    </div>
                  </div>
                  <div className="p-4 bg-black/40 border border-neutral-900">
                    <div className="text-[10px] uppercase tracking-widest text-neutral-600 mb-2 font-bold">{thread.takerName}</div>
                    <div className="flex items-end justify-between">
                      <div className="text-2xl font-black text-neutral-200">{thread.takerOdds.toFixed(1)}X</div>
                      <div className="text-[10px] text-neutral-700 mb-1 font-bold">{thread.takerVolume} USDT</div>
                    </div>
                  </div>
                </div>

                <button
                  disabled={thread.status === "จับคู่แล้ว"}
                  onClick={() => openJoinModal(thread)}
                  className={`w-full py-4 text-xs font-black uppercase tracking-[0.2em] transition-all border ${
                    thread.status === "จับคู่แล้ว"
                      ? "bg-neutral-900 text-neutral-700 border-transparent"
                      : "bg-white text-black hover:bg-emerald-400 border-white"
                  }`}
                >
                  {thread.status === "จับคู่แล้ว" ? "จับคู่แล้ว" : "เข้าร่วมทายผล"}
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Modals Container */}
      <div className="relative z-[100]">
        {/* Create Thread Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="bg-neutral-950 border border-neutral-800 w-full max-w-lg p-8 rounded-sm shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black uppercase tracking-widest">สร้างกระทู้ใหม่</h3>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-neutral-500 hover:text-white p-2">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleCreateThread} className="space-y-6">
                <input required value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="ระบุหัวข้อ..." className="w-full p-4 bg-neutral-900 border border-neutral-800 focus:border-emerald-500 outline-none uppercase font-bold" />
                <textarea required value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="อธิบายเงื่อนไข..." rows={3} className="w-full p-4 bg-neutral-900 border border-neutral-800 focus:border-emerald-500 outline-none resize-none" />
                <div className="grid grid-cols-2 gap-4">
                  <input value={makerName} onChange={(e) => setMakerName(e.target.value)} placeholder="ฝั่ง A..." className="w-full p-3 bg-neutral-900 border border-neutral-800 text-xs" />
                  <input value={takerName} onChange={(e) => setTakerName(e.target.value)} placeholder="ฝั่ง B..." className="w-full p-3 bg-neutral-900 border border-neutral-800 text-xs" />
                </div>
                <button type="submit" className="w-full py-4 bg-emerald-500 text-black font-black uppercase tracking-widest mt-6">ยืนยันการสร้าง</button>
              </form>
            </div>
          </div>
        )}

        {/* Join Bet Modal */}
        {joinModalThread && (
          <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="bg-neutral-950 border border-neutral-800 w-full max-w-md p-8 rounded-sm shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black uppercase tracking-widest">เข้าร่วมทายผล</h3>
                <button onClick={() => setJoinModalThread(null)} className="text-neutral-500 hover:text-white p-2">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleJoinThread} className="space-y-6">
                <div>
                  <p className="text-[10px] text-neutral-600 font-black mb-1 uppercase">หัวข้อที่เลือก</p>
                  <p className="font-black text-lg uppercase">{joinModalThread.title}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setJoinSide("MAKER")} className={`p-4 border transition-all text-center ${joinSide === "MAKER" ? "bg-emerald-500 text-black font-black border-emerald-500" : "bg-neutral-950/50 border-neutral-800 text-neutral-500"}`}>
                    <div className="text-[10px] uppercase font-bold">{joinModalThread.makerName}</div>
                    <div className="text-xs font-black">{joinModalThread.makerOdds}X</div>
                  </button>
                  <button type="button" onClick={() => setJoinSide("TAKER")} className={`p-4 border transition-all text-center ${joinSide === "TAKER" ? "bg-white text-black font-black border-white" : "bg-neutral-900/50 border-neutral-800 text-neutral-500"}`}>
                    <div className="text-[10px] uppercase font-bold">{joinModalThread.takerName}</div>
                    <div className="text-xs font-black">{joinModalThread.takerOdds}X</div>
                  </button>
                </div>
                <input required type="number" value={joinAmount} onChange={(e) => setJoinAmount(Number(e.target.value))} placeholder="ระบุจำนวนเงิน..." className="w-full p-4 bg-neutral-900 border border-neutral-800 focus:border-emerald-500 outline-none font-black" />
                <button type="submit" className="w-full py-4 bg-emerald-500 text-black font-black uppercase tracking-widest">ยืนยันการทายผล</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
