"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Wallet, Plus, Trash2, X, CheckCircle2, TrendingUp, Activity, 
  ShieldCheck, Users, Settings, Globe, Zap, Cpu, AlertTriangle, 
  BarChart3, ShieldAlert, LogOut, ArrowRight, Gavel, Award, UserPlus, User,
  Flame, LineChart, History, PieChart, Timer
} from "lucide-react";
import Link from "next/link";
import { mockUsers as initialUsers, User as UserType } from "../data/mockUsers";
import { securityManager, mockSystemLogs } from "../modules/security";
import { getSystemStats, systemConfig as initialConfig } from "../modules/matching";

type ThreadStatus = "เปิดรับ" | "จับคู่แล้ว" | "ตัดสินผลแล้ว" | "ปิดถาวร";

type BetEntry = {
  id: string;
  marketTitle: string;
  side: "YES" | "NO";
  amount: number;
  price: number;
  timestamp: number;
  result: "WIN" | "LOSS" | "PENDING";
};

type Thread = {
  id: number;
  title: string;
  description: string;
  status: ThreadStatus;
  makerName: string; 
  takerName: string; 
  yesPrice: number;  
  noPrice: number;   
  yesVolume: number; 
  noVolume: number;  
  winner: "YES" | "NO" | null;
  creatorId: string;
  isHot?: boolean;
};

const initialThreads: Thread[] = [
  {
    id: 1,
    title: "ลิเวอร์พูล จะชนะ แมนยู หรือไม่?",
    description: "นัดชี้ชะตาพรีเมียร์ลีก วันเสาร์นี้",
    status: "เปิดรับ",
    makerName: "YES",
    takerName: "NO",
    yesPrice: 0.65,
    noPrice: 0.35,
    yesVolume: 1500,
    noVolume: 850,
    winner: null,
    creatorId: "user_2",
    isHot: true,
  },
  {
    id: 2,
    title: "Bitcoin จะแตะ $100k ก่อนสิ้นปี?",
    description: "ราคาสรุป ณ เวลา 23:59 UTC ของวันสุดท้าย",
    status: "เปิดรับ",
    makerName: "YES",
    takerName: "NO",
    yesPrice: 0.42,
    noPrice: 0.58,
    yesVolume: 5200,
    noVolume: 7100,
    winner: null,
    creatorId: "user_1",
    isHot: true,
  },
  {
    id: 3,
    title: "Etheurm จะอัปเกรดเสร็จใน Q4 หรือไม่?",
    description: "นับตามประกาศทางการของ Foundation",
    status: "เปิดรับ",
    makerName: "YES",
    takerName: "NO",
    yesPrice: 0.75,
    noPrice: 0.25,
    yesVolume: 400,
    noVolume: 150,
    winner: null,
    creatorId: "user_2",
  },
];

export default function Home() {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"USER" | "ADMIN">("USER");
  const [userSubTab, setUserSubTab] = useState<"MARKETS" | "PORTFOLIO">("MARKETS");
  const [adminTab, setAdminTab] = useState<"OVERVIEW" | "USERS" | "MARKETS" | "SECURITY">("OVERVIEW");
  
  // Data States
  const [users, setUsers] = useState<UserType[]>(initialUsers);
  const [threads, setThreads] = useState<Thread[]>(initialThreads);
  const [userBets, setUserBets] = useState<BetEntry[]>([]);
  const [balance, setBalance] = useState<number>(0);

  // Notification States
  const [notify, setNotify] = useState<{ isOpen: boolean; message: string; type: "SUCCESS" | "ERROR" | "INFO" }>({
    isOpen: false,
    message: "",
    type: "SUCCESS",
  });

  const showNotify = (message: string, type: "SUCCESS" | "ERROR" | "INFO" = "SUCCESS") => {
    setNotify({ isOpen: true, message, type });
    // ปิดอัตโนมัติหลังจาก 3 วินาที
    setTimeout(() => setNotify(prev => ({ ...prev, isOpen: false })), 3000);
  };
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [joinModalThread, setJoinModalThread] = useState<Thread | null>(null);
  const [joinSide, setJoinSide] = useState<"YES" | "NO" | null>(null);
  const [joinAmount, setJoinAmount] = useState<number | "">("");
  const [resolutionModalThread, setResolutionModalThread] = useState<Thread | null>(null);

  // Auth Inputs
  const [authMode, setAuthMode] = useState<"LOGIN" | "REGISTER">("LOGIN");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const savedUserId = localStorage.getItem("current_user_id");
    if (savedUserId) {
      const user = users.find(u => u.id === savedUserId);
      if (user) {
        setCurrentUser(user);
        setBalance(user.balance);
      }
    }
    setIsLoading(false);
  }, []);

  const saveLog = async (type: "user" | "admin", filename: string, content: string) => {
    try {
      await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, filename, content })
      });
    } catch (e) {}
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (authMode === "LOGIN") {
      const user = users.find(u => u.username === username && u.password === password);
      if (user) {
        localStorage.setItem("current_user_id", user.id);
        setCurrentUser(user);
        setBalance(user.balance);
        saveLog("user", user.username, `Login SUCCESS from 192.168.1.149`);
      } else setError("Invalid credentials");
    } else {
      const newUser: UserType = {
        id: `user_${Date.now()}`,
        username,
        password,
        wallet: `0x${Math.random().toString(16).slice(2, 12)}`,
        balance: 1000,
        winRate: "0%",
        totalProfit: "0 USDT",
        role: "USER",
        status: "ACTIVE"
      };
      setUsers([...users, newUser]);
      setCurrentUser(newUser);
      setBalance(newUser.balance);
      localStorage.setItem("current_user_id", newUser.id);
      saveLog("user", newUser.username, `Registered NEW ACCOUNT`);
      showNotify("สมัครสมาชิกสำเร็จ! ยินดีต้อนรับสู่ CryptoBet", "SUCCESS");
    }
  };

  const handleJoinMarket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinSide || !joinAmount || !joinModalThread) return;
    const amount = Number(joinAmount);
    if (amount > balance) return showNotify("ยอดเงินของคุณไม่เพียงพอ!", "ERROR");

    setBalance(prev => prev - amount);
    const newBet: BetEntry = {
      id: `bet_${Date.now()}`,
      marketTitle: joinModalThread.title,
      side: joinSide,
      amount,
      price: joinSide === "YES" ? joinModalThread.yesPrice : joinModalThread.noPrice,
      timestamp: Date.now(),
      result: "PENDING"
    };
    setUserBets([newBet, ...userBets]);
    
    setThreads(threads.map(t => t.id === joinModalThread.id ? (joinSide === "YES" ? { ...t, yesVolume: t.yesVolume + amount } : { ...t, noVolume: t.noVolume + amount }) : t));
    saveLog("user", currentUser!.username, `Placed BET: ${joinSide} on ${joinModalThread.title} for ${amount} USDT`);
    setJoinModalThread(null);
    showNotify("ทายผลสำเร็จ! บันทึกข้อมูลเรียบร้อย", "SUCCESS");
  };

  const handleLogout = () => {
    localStorage.removeItem("current_user_id");
    setCurrentUser(null);
    setViewMode("USER");
  };

  const resolveMarket = (threadId: number, winner: "YES" | "NO") => {
    const thread = threads.find(t => t.id === threadId);
    setThreads(threads.map(t => t.id === threadId ? { ...t, status: "ตัดสินผลแล้ว", winner } : t));
    saveLog("admin", "actions", `Resolved ${thread?.title} -> ${winner}`);
    setResolutionModalThread(null);
    showNotify(`ตัดสินผลเรียบร้อย: ฝั่ง ${winner} ชนะ!`, "SUCCESS");
  };

  if (isLoading) return <div className="min-h-screen bg-black"></div>;

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8 text-center">
           <Zap className="w-16 h-16 text-emerald-500 fill-emerald-500 mx-auto" />
           <h1 className="text-4xl font-black uppercase text-white tracking-tighter">CRYPTOBET <span className="text-emerald-500">PRO</span></h1>
           <div className="bg-neutral-900 border border-neutral-800 p-10 space-y-6">
              <div className="flex border-b border-neutral-800">
                <button onClick={() => setAuthMode("LOGIN")} className={`flex-1 py-3 text-[10px] font-black uppercase ${authMode === "LOGIN" ? "text-emerald-500 border-b-2 border-emerald-500" : "text-neutral-600"}`}>Login</button>
                <button onClick={() => setAuthMode("REGISTER")} className={`flex-1 py-3 text-[10px] font-black uppercase ${authMode === "REGISTER" ? "text-emerald-500 border-b-2 border-emerald-500" : "text-neutral-600"}`}>Register</button>
              </div>
              <form onSubmit={handleAuth} className="space-y-6">
                <input required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="USERNAME" className="w-full p-4 bg-neutral-950 border border-neutral-800 focus:border-emerald-500 outline-none uppercase font-bold text-xs" />
                <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="PASSWORD" className="w-full p-4 bg-neutral-950 border border-neutral-800 focus:border-emerald-500 outline-none uppercase font-bold text-xs" />
                <button className="w-full py-5 bg-emerald-500 text-black font-black uppercase tracking-widest hover:bg-emerald-400">Authorize Access</button>
              </form>
           </div>
        </div>
      </div>
    );
  }

  const stats = getSystemStats(threads);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5 bg-neutral-950 sticky top-0 z-[60]">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-emerald-500" />
            <span className="text-xl font-black tracking-tighter uppercase text-white">CryptoBet</span>
          </div>
          <div className="hidden lg:flex bg-neutral-900/50 p-1 border border-neutral-800">
            <button onClick={() => setViewMode("USER")} className={`px-5 py-1.5 text-[10px] font-black uppercase ${viewMode === "USER" ? "bg-emerald-500 text-black" : "text-neutral-500 hover:text-white"}`}>USER DASHBOARD</button>
            {currentUser.role === "SUPER_ADMIN" && (
              <button onClick={() => setViewMode("ADMIN")} className={`px-5 py-1.5 text-[10px] font-black uppercase ${viewMode === "ADMIN" ? "bg-emerald-500 text-black" : "text-neutral-500 hover:text-white"}`}>ADMIN CONSOLE</button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] font-black text-neutral-500 uppercase">{currentUser.username}</p>
            <p className="text-emerald-400 font-black tracking-tight">{balance.toLocaleString()} USDT</p>
          </div>
          <button onClick={handleLogout} className="text-neutral-700 hover:text-red-500 transition-colors"><LogOut className="w-5 h-5" /></button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-12">
        {viewMode === "ADMIN" ? (
          /* --- ADMIN VIEW --- */
          <div className="space-y-8 animate-in fade-in duration-500">
             <div className="flex gap-4 border-b border-neutral-900 pb-8">
                {[
                  { id: "OVERVIEW", label: "ภาพรวมระบบ", icon: BarChart3 },
                  { id: "USERS", label: "จัดการสมาชิก", icon: Users },
                  { id: "MARKETS", label: "จัดการตลาด", icon: Settings },
                  { id: "SECURITY", label: "ความปลอดภัย", icon: ShieldAlert },
                ].map(tab => (
                  <button 
                    key={tab.id} 
                    onClick={() => setAdminTab(tab.id as any)} 
                    className={`flex items-center gap-2 px-6 py-3 border transition-all text-[10px] font-black uppercase tracking-widest ${adminTab === tab.id ? "bg-emerald-500 text-black border-emerald-500" : "bg-neutral-900 border-neutral-800 text-neutral-500 hover:border-neutral-700"}`}
                  >
                    <tab.icon className="w-3 h-3" /> {tab.label}
                  </button>
                ))}
             </div>

             {/* TAB: OVERVIEW */}
             {adminTab === "OVERVIEW" && (
               <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-neutral-900/50 border border-neutral-900 p-6 space-y-2">
                      <p className="text-[10px] font-black text-neutral-600 uppercase">Volume รวม</p>
                      <p className="text-2xl font-black text-white">{stats.totalVolume.toLocaleString()} USDT</p>
                    </div>
                    <div className="bg-neutral-900/50 border border-neutral-900 p-6 space-y-2">
                      <p className="text-[10px] font-black text-neutral-600 uppercase">ค่าธรรมเนียมสะสม</p>
                      <p className="text-2xl font-black text-emerald-500">{stats.totalFees.toLocaleString()} USDT</p>
                    </div>
                    <div className="bg-neutral-900/50 border border-neutral-900 p-6 space-y-2">
                      <p className="text-[10px] font-black text-neutral-600 uppercase">ตลาดที่แอคทีฟ</p>
                      <p className="text-2xl font-black text-white">{stats.activeThreads}</p>
                    </div>
                    <div className="bg-neutral-900/50 border border-neutral-900 p-6 space-y-2">
                      <p className="text-[10px] font-black text-neutral-600 uppercase">สภาพคล่องระบบ</p>
                      <p className="text-2xl font-black text-white">1.5M USDT</p>
                    </div>
                  </div>
                  <div className="bg-neutral-900/30 border border-neutral-900 p-8 h-64 flex items-end gap-2">
                    {[40, 70, 45, 90, 65, 80, 50, 95, 60, 85].map((h, i) => (
                      <div key={i} className="flex-1 bg-emerald-500/20 hover:bg-emerald-500 transition-all cursor-pointer" style={{ height: `${h}%` }}></div>
                    ))}
                  </div>
               </div>
             )}

             {/* TAB: USERS */}
             {adminTab === "USERS" && (
               <div className="bg-neutral-900/30 border border-neutral-900 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                  <table className="w-full text-left">
                    <thead className="bg-black/50 border-b border-neutral-800 text-[10px] font-black uppercase text-neutral-600">
                      <tr><th className="p-6">Username</th><th className="p-6">Wallet</th><th className="p-6">Balance</th><th className="p-6 text-center">สถานะ</th><th className="p-6 text-right">จัดการ</th></tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/50">
                      {users.map(u => (
                        <tr key={u.id} className="hover:bg-neutral-800/20 text-xs">
                          <td className="p-6 font-black uppercase">{u.username}</td>
                          <td className="p-6 text-neutral-500 font-mono">{u.wallet}</td>
                          <td className="p-6 font-black text-emerald-500">{u.balance.toLocaleString()}</td>
                          <td className="p-6 text-center">
                            <span className={`px-2 py-1 text-[8px] font-black uppercase ${u.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}>
                              {u.status}
                            </span>
                          </td>
                          <td className="p-6 text-right">
                            <button onClick={() => {
                              setUsers(users.map(user => user.id === u.id ? { ...user, status: user.status === "ACTIVE" ? "BANNED" : "ACTIVE" } : user));
                              showNotify(`อัปเดตสถานะ ${u.username} เรียบร้อย`, "SUCCESS");
                            }} className="p-2 bg-neutral-800 hover:bg-red-500 transition-colors">
                              {u.status === "ACTIVE" ? <UserMinus className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
             )}

             {/* TAB: MARKETS */}
             {adminTab === "MARKETS" && (
               <div className="bg-neutral-900/30 border border-neutral-900 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                 <table className="w-full text-left">
                   <thead className="bg-black/50 border-b border-neutral-800 text-[10px] font-black uppercase text-neutral-600">
                     <tr><th className="p-6">หัวข้อ</th><th className="p-6 text-center">สถานะ</th><th className="p-6 text-right">Liquidity</th><th className="p-6 text-right">ดำเนินการ</th></tr>
                   </thead>
                   <tbody>
                     {threads.map(t => (
                       <tr key={t.id} className="hover:bg-neutral-800/20 border-b border-neutral-800/50">
                         <td className="p-6 font-black uppercase text-sm">{t.title}</td>
                         <td className="p-6 text-center"><span className="text-[10px] font-black px-2 py-1 bg-emerald-500/10 text-emerald-500">{t.status}</span></td>
                         <td className="p-6 text-right text-sm font-black">{(t.yesVolume + t.noVolume).toLocaleString()}</td>
                         <td className="p-6 text-right">{t.status === "เปิดรับ" && <button onClick={() => setResolutionModalThread(t)} className="px-4 py-2 bg-emerald-500 text-black text-[10px] font-black uppercase">ตัดสินผล</button>}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             )}

             {/* TAB: SECURITY */}
             {adminTab === "SECURITY" && (
               <div className="bg-neutral-900/30 border border-neutral-900 p-8 animate-in fade-in slide-in-from-bottom-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-neutral-500 mb-6 flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> System Audit Logs</h3>
                  <div className="space-y-4">
                    {mockSystemLogs.map(log => (
                      <div key={log.id} className="p-4 bg-black/40 border border-neutral-800 flex justify-between items-center text-[10px] font-black uppercase">
                        <div className="flex gap-4">
                          <span className={log.type === "DANGER" ? "text-red-500" : "text-emerald-500"}>[{log.type}]</span>
                          <span className="text-white">{log.action}</span>
                          <span className="text-neutral-600">เป้าหมาย: {log.target}</span>
                        </div>
                        <span className="text-neutral-700">{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </div>
                    ))}
                  </div>
               </div>
             )}
          </div>
        ) : (
          /* --- USER VIEW --- */
          <div className="space-y-12 animate-in fade-in duration-700">
            {/* User Sub Navigation */}
            <div className="flex gap-8 border-b border-neutral-900 pb-4">
              <button onClick={() => setUserSubTab("MARKETS")} className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${userSubTab === "MARKETS" ? "text-emerald-500 border-b-2 border-emerald-500 pb-4" : "text-neutral-600"}`}><Globe className="w-4 h-4" /> ตลาดทายผล</button>
              <button onClick={() => setUserSubTab("PORTFOLIO")} className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${userSubTab === "PORTFOLIO" ? "text-emerald-500 border-b-2 border-emerald-500 pb-4" : "text-neutral-600"}`}><PieChart className="w-4 h-4" /> พอร์ตโฟลิโอ & สถิติ</button>
            </div>

            {userSubTab === "MARKETS" ? (
              <>
                {/* Hot Trends */}
                <section>
                   <h3 className="text-xs font-black uppercase tracking-[0.4em] text-neutral-700 mb-6 flex items-center gap-2"><Flame className="w-4 h-4 text-orange-500" /> ตลาดที่กำลังร้อนแรง (Hot Trends)</h3>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {threads.filter(t => t.isHot).map(t => (
                        <div key={t.id} className="bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 p-6 space-y-4 hover:border-emerald-500/50 transition-all">
                           <div className="flex justify-between items-center text-[8px] font-black uppercase text-emerald-500">
                              <span>TRENDING NOW</span>
                              <div className="flex gap-1"><div className="w-1 h-1 bg-emerald-500 rounded-full animate-ping"></div><div className="w-1 h-1 bg-emerald-500 rounded-full"></div></div>
                           </div>
                           <h4 className="font-black uppercase text-sm leading-tight line-clamp-2">{t.title}</h4>
                           <div className="flex justify-between items-end">
                              <p className="text-2xl font-black">{(t.yesPrice * 100).toFixed(0)}¢</p>
                              <button onClick={() => setJoinModalThread(t)} className="text-[10px] font-black text-white hover:text-emerald-500 underline uppercase">Trade Now</button>
                           </div>
                        </div>
                      ))}
                   </div>
                </section>

                {/* All Markets */}
                <section className="space-y-8">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-black uppercase tracking-[0.4em] text-neutral-700 flex items-center gap-2"><Zap className="w-4 h-4" /> ตลาดทั้งหมด</h3>
                    <button onClick={() => setIsCreateModalOpen(true)} className="px-6 py-3 bg-neutral-900 border border-neutral-800 text-white text-[10px] font-black uppercase hover:bg-neutral-800 transition-all flex items-center gap-2"><Plus className="w-3 h-3" /> สร้างตลาด</button>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {threads.map(t => (
                      <div key={t.id} className="bg-neutral-900/30 border border-neutral-900 p-8 hover:border-white/10 transition-all flex flex-col relative">
                        <div className="flex justify-between mb-6 text-[10px] font-black uppercase text-neutral-600">
                          <span>{t.status}</span>
                          <span>Vol: {(t.yesVolume + t.noVolume).toLocaleString()} USDT</span>
                        </div>
                        <h4 className="text-2xl font-black uppercase tracking-tight mb-8 group-hover:text-emerald-500 transition-colors">{t.title}</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <button onClick={() => { setJoinModalThread(t); setJoinSide("YES"); }} className="p-4 bg-emerald-500/5 border border-emerald-500/20 hover:bg-emerald-500 hover:text-black transition-all text-center">
                            <span className="text-[10px] font-black uppercase block mb-1">YES</span>
                            <span className="text-2xl font-black">{(t.yesPrice * 100).toFixed(0)}¢</span>
                          </button>
                          <button onClick={() => { setJoinModalThread(t); setJoinSide("NO"); }} className="p-4 bg-neutral-950 border border-neutral-800 hover:bg-white hover:text-black transition-all text-center">
                            <span className="text-[10px] font-black uppercase block mb-1">NO</span>
                            <span className="text-2xl font-black">{(t.noPrice * 100).toFixed(0)}¢</span>
                          </button>
                        </div>
                        {t.status === "ตัดสินผลแล้ว" && (
                          <div className="absolute inset-0 bg-neutral-950/90 flex flex-col items-center justify-center text-center p-6">
                            <Award className="w-12 h-12 text-emerald-500 mb-2" />
                            <p className="text-xl font-black text-emerald-500 uppercase">WINNER: {t.winner}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              </>
            ) : (
              /* --- PORTFOLIO VIEW --- */
              <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-neutral-900/30 border border-neutral-900 p-8 space-y-4">
                       <p className="text-[10px] font-black text-neutral-600 uppercase">กำไรทั้งหมด (Total Profit)</p>
                       <p className="text-4xl font-black text-emerald-500 tracking-tighter">+450.25 <span className="text-sm">USDT</span></p>
                    </div>
                    <div className="bg-neutral-900/30 border border-neutral-900 p-8 space-y-4">
                       <p className="text-[10px] font-black text-neutral-600 uppercase">อัตราการชนะ (Win Rate)</p>
                       <p className="text-4xl font-black text-white tracking-tighter">68%</p>
                    </div>
                    <div className="bg-neutral-900/30 border border-neutral-900 p-8 space-y-4">
                       <p className="text-[10px] font-black text-neutral-600 uppercase">จำนวนการทาย (Total Bets)</p>
                       <p className="text-4xl font-black text-white tracking-tighter">{userBets.length}</p>
                    </div>
                 </div>

                 {/* Performance Chart Simulation */}
                 <section className="bg-neutral-900/30 border border-neutral-900 p-8">
                    <h3 className="text-xs font-black uppercase tracking-[0.4em] text-neutral-700 mb-10 flex items-center gap-2"><LineChart className="w-4 h-4" /> แนวโน้มการเติบโต (Equity Curve)</h3>
                    <div className="h-48 flex items-end gap-3 px-4 border-b border-neutral-800 pb-2">
                       {[20, 35, 30, 45, 60, 55, 75, 90, 85, 100].map((h, i) => (
                         <div key={i} className="flex-1 bg-emerald-500/20 hover:bg-emerald-500 transition-all relative group" style={{ height: `${h}%` }}>
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-[10px] p-1 px-2 border border-neutral-800 hidden group-hover:block whitespace-nowrap">Week {i+1}: +{h}%</div>
                         </div>
                       ))}
                    </div>
                    <p className="mt-4 text-[10px] text-neutral-700 italic uppercase text-center">สถิติย้อนหลัง 10 รายการล่าสุด</p>
                 </section>

                 {/* Recent Activity */}
                 <section className="space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-[0.4em] text-neutral-700 flex items-center gap-2"><History className="w-4 h-4" /> ประวัติการทายผลล่าสุด</h3>
                    <div className="bg-neutral-900/30 border border-neutral-900 overflow-hidden">
                       <table className="w-full text-left">
                          <thead className="bg-black/50 border-b border-neutral-800 text-[10px] font-black uppercase text-neutral-600">
                             <tr><th className="p-6">ตลาด</th><th className="p-6">ฝั่ง</th><th className="p-6 text-right">จำนวน</th><th className="p-6 text-right">สถานะ</th></tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-800/50">
                             {userBets.length > 0 ? userBets.map(bet => (
                               <tr key={bet.id} className="text-xs hover:bg-neutral-800/20">
                                 <td className="p-6 font-bold uppercase">{bet.marketTitle}</td>
                                 <td className="p-6"><span className={bet.side === "YES" ? "text-emerald-500" : "text-white"}>{bet.side}</span></td>
                                 <td className="p-6 text-right">{bet.amount} USDT</td>
                                 <td className="p-6 text-right"><span className="text-[8px] font-black uppercase px-2 py-1 bg-neutral-800 text-neutral-500">{bet.result}</span></td>
                               </tr>
                             )) : (
                               <tr><td colSpan={4} className="p-12 text-center text-neutral-600 italic">ยังไม่มีประวัติการทายผล</td></tr>
                             )}
                          </tbody>
                       </table>
                    </div>
                 </section>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Join Modal */}
      {joinModalThread && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
           <div className="bg-neutral-950 border border-neutral-800 w-full max-w-md p-10 relative animate-in zoom-in duration-300">
             <button onClick={() => setJoinModalThread(null)} className="absolute right-6 top-6 text-neutral-500 hover:text-white"><X /></button>
             <h3 className="text-xl font-black uppercase tracking-widest mb-10 flex items-center gap-3 text-white">
               <Zap className="w-5 h-5 text-emerald-500 fill-emerald-500" /> ยืนยันการทำรายการ
             </h3>
             <form className="space-y-8" onSubmit={handleJoinMarket}>
               <div className="p-4 bg-neutral-900 border border-neutral-800">
                  <p className="text-[10px] text-neutral-500 font-black uppercase mb-1">ตลาดที่เลือก</p>
                  <p className="text-sm font-black uppercase text-white">{joinModalThread.title}</p>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <button type="button" onClick={() => setJoinSide("YES")} className={`p-4 border transition-all ${joinSide === "YES" ? "bg-emerald-500 text-black border-emerald-500" : "bg-neutral-900 border-neutral-800 text-neutral-500"}`}>
                    <p className="text-[10px] font-black uppercase">ทายฝั่ง YES</p>
                    <p className="font-black text-lg">{(joinModalThread.yesPrice * 100).toFixed(0)}¢</p>
                  </button>
                  <button type="button" onClick={() => setJoinSide("NO")} className={`p-4 border transition-all ${joinSide === "NO" ? "bg-white text-black border-white" : "bg-neutral-900 border-neutral-800 text-neutral-500"}`}>
                    <p className="text-[10px] font-black uppercase">ทายฝั่ง NO</p>
                    <p className="font-black text-lg">{(joinModalThread.noPrice * 100).toFixed(0)}¢</p>
                  </button>
               </div>
               <input required type="number" value={joinAmount} onChange={(e) => setJoinAmount(Number(e.target.value))} placeholder="จำนวน (USDT)..." className="w-full p-5 bg-neutral-950 border border-neutral-800 outline-none text-2xl font-black text-emerald-500" />
               <button className="w-full py-5 bg-emerald-500 text-black font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20">Sign Transaction</button>
             </form>
           </div>
        </div>
      )}

      {/* Admin Resolution Modal */}
      {resolutionModalThread && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
           <div className="bg-neutral-950 border border-neutral-800 w-full max-w-md p-10 relative">
             <button onClick={() => setResolutionModalThread(null)} className="absolute right-6 top-6 text-neutral-500 hover:text-white"><X /></button>
             <h3 className="text-xl font-black uppercase tracking-widest mb-10 flex items-center gap-3 text-white"><Gavel className="w-6 h-6 text-emerald-500" /> ตัดสินผลตลาด</h3>
             <p className="text-neutral-500 text-sm mb-8 italic">"{resolutionModalThread.title}"</p>
             <div className="grid grid-cols-2 gap-4">
                <button onClick={() => {
                   setThreads(threads.map(t => t.id === resolutionModalThread.id ? { ...t, status: "ตัดสินผลแล้ว", winner: "YES" } : t));
                   saveLog("admin", "actions", `Resolved ${resolutionModalThread.title} -> YES`);
                   setResolutionModalThread(null);
                }} className="py-6 bg-emerald-500 text-black font-black uppercase tracking-widest">ฝั่ง YES ชนะ</button>
                <button onClick={() => {
                   setThreads(threads.map(t => t.id === resolutionModalThread.id ? { ...t, status: "ตัดสินผลแล้ว", winner: "NO" } : t));
                   saveLog("admin", "actions", `Resolved ${resolutionModalThread.title} -> NO`);
                   setResolutionModalThread(null);
                }} className="py-6 bg-white text-black font-black uppercase tracking-widest">ฝั่ง NO ชนะ</button>
             </div>
           </div>
        </div>
      )}

      {/* Create Market Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
           <div className="bg-neutral-950 border border-neutral-800 w-full max-w-lg p-10 relative">
             <button onClick={() => setIsCreateModalOpen(false)} className="absolute right-6 top-6 text-neutral-500 hover:text-white"><X /></button>
             <h3 className="text-xl font-black uppercase tracking-widest mb-10">สร้างตลาดใหม่</h3>
             <form className="space-y-6" onSubmit={(e) => {
               e.preventDefault();
               const title = (e.target as any).title.value;
               const desc = (e.target as any).desc.value;
               const newMarket: Thread = {
                 id: Date.now(), title, description: desc, status: "เปิดรับ", makerName: "YES", takerName: "NO",
                 yesPrice: 0.5, noPrice: 0.5, yesVolume: 0, noVolume: 0, winner: null, creatorId: currentUser.id
               };
               setThreads([newMarket, ...threads]);
               setIsCreateModalOpen(false);
               saveLog("user", currentUser.username, `Created Market: ${title}`);
               showNotify("สร้างตลาดใหม่สำเร็จ!", "SUCCESS");
             }}>
               <input name="title" required placeholder="หัวข้อ..." className="w-full p-4 bg-neutral-950 border border-neutral-800 focus:border-emerald-500 outline-none uppercase font-bold text-xs text-white" />
               <textarea name="desc" required rows={3} placeholder="รายละเอียด..." className="w-full p-4 bg-neutral-950 border border-neutral-800 focus:border-emerald-500 outline-none text-xs italic resize-none text-white" />
               <button className="w-full py-5 bg-emerald-500 text-black font-black uppercase tracking-widest">เปิดตลาด</button>
             </form>
           </div>
        </div>
      )}
      {/* Notification Modal */}
      {notify.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className={`w-full max-w-sm p-8 border shadow-2xl animate-in zoom-in slide-in-from-bottom-4 duration-500 relative overflow-hidden ${
             notify.type === "SUCCESS" ? "bg-emerald-950 border-emerald-500" : 
             notify.type === "ERROR" ? "bg-red-950 border-red-500" : "bg-neutral-900 border-neutral-700"
           }`}>
             {/* Progress bar animation */}
             <div className={`absolute bottom-0 left-0 h-1 transition-all duration-[3000ms] ease-linear w-full ${
               notify.type === "SUCCESS" ? "bg-emerald-500" : notify.type === "ERROR" ? "bg-red-500" : "bg-white"
             }`} style={{ width: '0%', animation: 'progress 3s linear' }}></div>
             
             <style jsx>{`
               @keyframes progress {
                 from { width: 100%; }
                 to { width: 0%; }
               }
             `}</style>

             <div className="flex flex-col items-center text-center space-y-4">
               <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                 notify.type === "SUCCESS" ? "bg-emerald-500/20 text-emerald-500" : 
                 notify.type === "ERROR" ? "bg-red-500/20 text-red-500" : "bg-white/10 text-white"
               }`}>
                 {notify.type === "SUCCESS" ? <CheckCircle2 className="w-6 h-6" /> : 
                  notify.type === "ERROR" ? <AlertTriangle className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
               </div>
               <h4 className="text-sm font-black uppercase tracking-widest text-white">{notify.message}</h4>
               <button 
                onClick={() => setNotify(prev => ({ ...prev, isOpen: false }))}
                className="text-[10px] font-black uppercase text-neutral-500 hover:text-white transition-colors"
               >
                 Dismiss
               </button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}
