"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, LogOut, Zap, LayoutDashboard, Terminal, Globe, Plus, BarChart3, Info, ImageIcon, User, Lock, Wallet, Smartphone, ShieldCheck, Edit3, Trash2, Shield, FileText, Database } from "lucide-react";

// --- Shared Components ---
import { Notification, NotifyType } from "@/components/shared/Notification";
import { BaseModal } from "@/components/shared/BaseModal";

// --- Module Components ---
import { MarketGrid } from "@/components/user/MarketGrid";
import { PortfolioStats } from "@/components/user/PortfolioStats";
import { WalletDashboard } from "@/components/user/WalletDashboard";
import { ProfileSettings } from "@/components/user/ProfileSettings";

import { AdminOverview } from "@/components/admin/AdminOverview";
import { MemberManagement } from "@/components/admin/MemberManagement";
import { CommandCenter } from "@/components/admin/CommandCenter";
import { FinancialAudit } from "@/components/admin/FinancialAudit";

// --- Services (Service Layer) ---
import { authService } from "@/modules/auth/service";
import { marketService, Thread } from "@/modules/market/service";
import { betService } from "@/modules/bet/service";
import { walletService } from "@/modules/wallet";
import { logService } from "@/services/logService";

// --- Context & Hooks ---
import { useTranslation } from "@/context/LangContext";

// --- Data ---
import versionInfo from "@/data/version.json";
import { mockUsers as initialUsers, User as UserType } from "@/data/mockUsers";
import { getSystemStats } from "@/modules/matching";

export default function Home() {
  const { t, lang, setLang } = useTranslation();
  
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"USER" | "ADMIN">("USER");
  const [userSubTab, setUserSubTab] = useState<"MARKETS" | "PORTFOLIO" | "WALLET" | "PROFILE">("MARKETS");
  const [adminTab, setAdminTab] = useState<"OVERVIEW" | "USERS" | "SYSTEM" | "FINANCE">("OVERVIEW");
  
  const [users, setUsers] = useState<UserType[]>(initialUsers);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [userBets] = useState<any[]>([]);
  const [balance, setBalance] = useState<number>(0);

  const [notify, setNotify] = useState({ isOpen: false, message: "", type: "SUCCESS" as NotifyType });

  const [joinModalThread, setJoinModalThread] = useState<Thread | null>(null);
  const [joinSide, setJoinSide] = useState<"YES" | "NO" | null>(null);
  const [joinAmount, setJoinAmount] = useState<number | "">("");

  // Auth State
  const [authView, setAuthView] = useState<"LOGIN" | "REGISTER" | "OTP">("LOGIN");
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [otpInput, setOtpInput] = useState("");

  // Market Management State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMarket, setEditingMarket] = useState<Thread | null>(null);
  const [newMarket, setNewMarket] = useState({ 
    title: "", 
    description: "", 
    liquidity: 0,
    side: "YES" as "YES" | "NO",
    endDate: new Date(Date.now() + 86400000).toISOString().slice(0, 16)
  });

  // NEW: Sync users from Logs on mount
  useEffect(() => {
    const syncUsers = async () => {
      try {
        const loggedUsers = await logService.getAllUsers();
        if (loggedUsers.length > 0) {
            setUsers(prev => {
                const final = [...prev];
                loggedUsers.forEach(lu => {
                    const idx = final.findIndex(u => u.username === lu.username);
                    if (idx === -1) final.push(lu);
                    else final[idx] = lu;
                });
                return final;
            });
        }
      } catch (err) {
        console.error("User sync error:", err);
      }
    };
    syncUsers();
  }, []);

  // Check Session
  useEffect(() => {
    const currentId = localStorage.getItem("current_user_id");
    if (currentId) {
        const found = users.find(u => u.id === currentId);
        if (found) {
            setCurrentUser(found);
            setBalance(found.balance);
        }
    }
  }, [users]);

  useEffect(() => {
    const init = async () => {
      const startTime = Date.now();
      const initialThreads = await marketService.fetchMarkets();
      setThreads(initialThreads);
      const minDuration = 4000; 
      const elapsed = Date.now() - startTime;
      if (elapsed < minDuration) {
        setTimeout(() => setIsLoading(false), minDuration - elapsed);
      } else {
        setIsLoading(false);
      }
    };
    init();
  }, [users]);

  const showNotify = (message: string, type: NotifyType = "SUCCESS") => {
    setNotify({ isOpen: true, message, type });
    setTimeout(() => setNotify(prev => ({ ...prev, isOpen: false })), 3000);
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(async () => {
      try {
        // 1. ลองหาในรายชื่อ Mock Data
        let user = users.find(u => u.username === usernameInput);
        
        // 2. ถ้าไม่เจอ ลองหาในฐานข้อมูลไฟล์ Log
        if (!user) {
           const loggedUser = await logService.verifyUser(usernameInput);
           if (loggedUser && loggedUser.password === passwordInput) {
              user = loggedUser;
           }
        }

        if (user && user.password === passwordInput) {
           authService.login(user.username, [user as any]);
           setCurrentUser(user as any);
           setBalance(user.balance);
           setIsLoading(false);
           showNotify(`${t("common.success")}`, "SUCCESS");
           await logService.logLogin(user.username);
        } else {
           setIsLoading(false);
           showNotify("Invalid credentials", "ERROR");
        }
      } catch (err) {
        setIsLoading(false);
        showNotify("System error", "ERROR");
      }
    }, 2500);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
       setIsLoading(false);
       setAuthView("OTP");
       showNotify("OTP sent to your mobile", "INFO");
    }, 2000);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
     e.preventDefault();
     if (otpInput === "1234") {
        setIsLoading(true);
        setTimeout(async () => {
           const demoUser = {
              id: `user_${Date.now()}`,
              username: usernameInput,
              password: passwordInput,
              phone: phoneInput,
              wallet: "0x" + Math.random().toString(16).slice(2, 10).toUpperCase(),
              balance: 1000,
              role: "USER" as const,
              status: "ACTIVE" as const,
              walletStatus: "ACTIVE" as const,
              lastIp: "127.0.0.1"
           };
           
           authService.login(demoUser.username, [demoUser as any]);
           setCurrentUser(demoUser as any);
           setBalance(demoUser.balance);
           setIsLoading(false);
           showNotify("Registration successful", "SUCCESS");
           
           await logService.initUser(demoUser.username, demoUser);
           await logService.logLogin(demoUser.username);
        }, 2000);
     } else {
        showNotify("Invalid OTP (Try 1234)", "ERROR");
     }
  };

  const handleSocialLogin = (provider: string) => {
     setIsLoading(true);
     setTimeout(() => {
        setIsLoading(false);
        showNotify(`${provider} Login is currently disabled.`, "ERROR");
     }, 1000);
  };

  const handleLogout = () => {
    setIsLoading(true);
    setTimeout(() => {
      authService.logout();
      setCurrentUser(null);
      setUsernameInput("");
      setPasswordInput("");
      setAuthView("LOGIN");
      setIsLoading(false);
    }, 1500);
  };

  const toggleLang = () => {
    setLang(lang === "EN" ? "TH" : "EN");
  };

  const handleJoinMarket = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const amount = Number(joinAmount);
      const newBalance = betService.placeBet(balance, amount);
      setBalance(newBalance);
      showNotify(t("common.success"), "SUCCESS");
      
      if (currentUser && joinModalThread) {
          logService.logTransaction(
              currentUser.username, 
              'BET', 
              amount, 
              `Placed bet on ${joinSide} for market: ${joinModalThread.title}`
          );
      }
      
      setJoinModalThread(null);
    } catch (err: any) {
      showNotify(err.message, "ERROR");
    }
  };

  const handleCreateMarket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const market: Thread = {
      id: Date.now(),
      title: newMarket.title,
      description: newMarket.description,
      status: "OPEN",
      yesPrice: 0.5,
      noPrice: 0.5,
      yesVolume: 0,
      noVolume: 0,
      winner: null,
      creatorId: currentUser.id,
      endDate: new Date(newMarket.endDate).toISOString()
    };
    setThreads([market, ...threads]);
    setIsCreateModalOpen(false);
    setNewMarket({ 
      title: "", 
      description: "", 
      liquidity: 0, 
      side: "YES",
      endDate: new Date(Date.now() + 86400000).toISOString().slice(0, 16) 
    });
    showNotify(t("common.success"), "SUCCESS");

    if (currentUser) {
        await logService.logMarketCreation(currentUser.username, market);
        await logService.logTransaction(currentUser.username, 'CREATE_MARKET', 0, `Created new market: ${market.title}`);
    }
  };

  const handleDeleteMarket = (id: number) => {
    if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบตลาดนี้?")) {
      setThreads(threads.filter(t => t.id !== id));
      showNotify("ลบตลาดเรียบร้อยแล้ว", "SUCCESS");
      if (currentUser) {
        logService.logTransaction(currentUser.username, 'DELETE_MARKET', 0, `Deleted market ID: ${id}`);
      }
    }
  };

  const handleOpenEdit = (thread: Thread) => {
    setEditingMarket(thread);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMarket) {
      setThreads(threads.map(t => t.id === editingMarket.id ? editingMarket : t));
      setIsEditModalOpen(false);
      showNotify("แก้ไขข้อมูลตลาดเรียบร้อยแล้ว", "SUCCESS");
      if (currentUser) {
        logService.logTransaction(currentUser.username, 'EDIT_MARKET', 0, `Edited market: ${editingMarket.title}`);
      }
    }
  };

  const handleUpdateUserStatus = (userId: string, newStatus: "ACTIVE" | "BANNED") => {
     setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
     showNotify(`User status updated to ${newStatus}`, "SUCCESS");
     if (currentUser) {
        logService.logTransaction(currentUser.username, 'ADMIN_ACTION', 0, `Changed status of user ${userId} to ${newStatus}`);
     }
  };

  const handleDeposit = async () => {
      const amount = 500;
      setBalance(p => p + amount);
      showNotify(`Deposited ${amount} USDT`, "SUCCESS");
      if (currentUser) {
          await logService.logTransaction(currentUser.username, 'DEPOSIT', amount, 'Manual deposit via dashboard');
      }
  }

  const getTracking = (strength: "normal" | "wide" | "widest") => {
    if (lang === "TH") return "tracking-normal";
    if (strength === "widest") return "tracking-[0.1em]";
    if (strength === "wide") return "tracking-widest";
    return "tracking-normal";
  };

  if (isLoading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none animate-pulse"></div>
       <div className="text-center space-y-12 relative z-10 animate-in fade-in zoom-in duration-1000">
          <Zap className="w-24 h-24 text-emerald-500 mx-auto animate-bounce" />
          <div className="space-y-6">
            <h1 className="text-9xl font-black text-white italic tracking-tighter leading-none">STAKE<span className="text-emerald-500">WISE</span></h1>
            <p className="text-neutral-400 text-2xl font-bold uppercase tracking-normal opacity-80 italic">{t("auth.slogan_desc")}</p>
          </div>
          <div className="pt-16">
            <div className="w-64 h-1 bg-zinc-900 mx-auto rounded-full overflow-hidden">
               <div className="h-full bg-emerald-500 animate-shimmer"></div>
            </div>
          </div>
       </div>
    </div>
  );

  if (!currentUser) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
         {/* AUTH LANGUAGE SWITCHER */}
         <div className="absolute top-10 right-10 z-[70] animate-in fade-in slide-in-from-right-4 duration-1000">
            <button onClick={toggleLang} className="flex items-center gap-3 px-6 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-[12px] font-black text-neutral-300 hover:text-emerald-500 hover:border-emerald-500/30 backdrop-blur-xl transition-all shadow-2xl group">
               <Globe className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" /> {lang}
            </button>
         </div>

         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none"></div>
         <div className="text-center space-y-6 relative z-10 w-full max-w-sm">
            <Zap className="w-14 h-14 text-emerald-500 mx-auto" />
            <div className="space-y-2">
              <h1 className="text-7xl font-black text-white italic tracking-tighter leading-none">STAKE<span className="text-emerald-500">WISE</span></h1>
              <p className="text-neutral-400 text-base font-bold uppercase tracking-normal opacity-80 italic">{t("auth.slogan")}</p>
            </div>
            
            {authView === "LOGIN" && (
               <form onSubmit={handleAuth} className="space-y-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-2 relative group">
                     <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors">
                        <User className="w-4 h-4" />
                     </div>
                     <input required type="text" value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} placeholder="USERNAME" className="w-full pl-14 pr-8 py-5 bg-zinc-950 border border-zinc-900 rounded-2xl outline-none text-white font-black tracking-widest focus:border-emerald-500/50 transition-all placeholder:text-zinc-800 text-sm" />
                  </div>
                  <div className="space-y-2 relative group">
                     <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors">
                        <Lock className="w-4 h-4" />
                     </div>
                     <input required type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} placeholder="PASSWORD" className="w-full pl-14 pr-8 py-5 bg-zinc-950 border border-zinc-900 rounded-2xl outline-none text-white font-black tracking-widest focus:border-emerald-500/50 transition-all placeholder:text-zinc-800 text-sm" />
                  </div>
                  <button type="submit" className="w-full mt-2 px-10 py-5 bg-emerald-500 text-black font-black uppercase text-base hover:bg-white transition-all rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.2)] active:scale-95">{t("auth.access_terminal")}</button>
                  <button type="button" onClick={() => setAuthView("REGISTER")} className="w-full text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.2em] hover:text-white transition-colors">{t("auth.register_link")}</button>
               </form>
            )}

            {authView === "REGISTER" && (
               <form onSubmit={handleRegister} className="space-y-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-2 relative group">
                     <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors">
                        <User className="w-4 h-4" />
                     </div>
                     <input required type="text" value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} placeholder="CHOOSE USERNAME" className="w-full pl-14 pr-8 py-5 bg-zinc-950 border border-zinc-900 rounded-2xl outline-none text-white font-black tracking-widest focus:border-emerald-500/50 transition-all placeholder:text-zinc-800 text-sm" />
                  </div>
                  <div className="space-y-2 relative group">
                     <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors">
                        <Smartphone className="w-4 h-4" />
                     </div>
                     <input required type="tel" value={phoneInput} onChange={(e) => setPhoneInput(e.target.value)} placeholder="PHONE NUMBER" className="w-full pl-14 pr-8 py-5 bg-zinc-950 border border-zinc-900 rounded-2xl outline-none text-white font-black tracking-widest focus:border-emerald-500/50 transition-all placeholder:text-zinc-800 text-sm" />
                  </div>
                  <div className="space-y-2 relative group">
                     <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors">
                        <Lock className="w-4 h-4" />
                     </div>
                     <input required type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} placeholder="SET PASSWORD" className="w-full pl-14 pr-8 py-5 bg-zinc-950 border border-zinc-900 rounded-2xl outline-none text-white font-black tracking-widest focus:border-emerald-500/50 transition-all placeholder:text-zinc-800 text-sm" />
                  </div>
                  <button type="submit" className="w-full mt-2 px-10 py-5 bg-white text-black font-black uppercase text-base hover:bg-emerald-500 transition-all rounded-2xl shadow-xl active:scale-95">{t("auth.send_otp")}</button>
                  <button type="button" onClick={() => setAuthView("LOGIN")} className="w-full text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] hover:text-white transition-colors">กลับหน้าล็อกอิน / BACK TO LOGIN</button>
               </form>
            )}

            {authView === "OTP" && (
               <form onSubmit={handleVerifyOtp} className="space-y-6 pt-4 animate-in fade-in zoom-in duration-500">
                  <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl text-center">
                     <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto mb-4" />
                     <p className="text-[11px] font-black text-neutral-400 uppercase tracking-widest leading-relaxed">
                        กรุณากรอกรหัส OTP 4 หลัก ที่ส่งไปยัง <br/>
                        <span className="text-white">{phoneInput}</span>
                     </p>
                  </div>
                  <input required type="text" maxLength={4} value={otpInput} onChange={(e) => setOtpInput(e.target.value)} placeholder="0 0 0 0" className="w-full py-6 bg-zinc-950 border border-zinc-900 rounded-2xl outline-none text-white font-black text-4xl text-center tracking-[0.5em] focus:border-emerald-500 transition-all" />
                  <button type="submit" className="w-full px-10 py-5 bg-emerald-500 text-black font-black uppercase text-base hover:bg-white transition-all rounded-2xl shadow-xl">ยืนยันตัวตน</button>
                  <button type="button" onClick={() => setAuthView("REGISTER")} className="w-full text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">ขอรหัสอีกครั้ง / RESEND</button>
               </form>
            )}

            {authView !== "OTP" && (
               <>
                  <div className="flex items-center gap-6 py-2">
                     <div className="h-[1px] flex-1 bg-zinc-900"></div>
                     <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">OR CONTINUE WITH</span>
                     <div className="h-[1px] flex-1 bg-zinc-900"></div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                     {/* Google Button - Disabled */}
                     <button disabled className="py-4 bg-zinc-950 border border-zinc-900 rounded-2xl flex items-center justify-center grayscale opacity-30 cursor-not-allowed">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                     </button>

                     {/* Apple Button - Disabled */}
                     <button disabled className="py-4 bg-zinc-950 border border-zinc-900 rounded-2xl flex items-center justify-center grayscale opacity-30 cursor-not-allowed">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516s1.52.087 2.475-1.258.762-2.391.728-2.43m3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422s1.675-2.789 1.698-2.854-.597-.79-1.254-1.157a3.7 3.7 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56s.625 1.924 1.273 2.796c.576.984 1.34 1.667 1.659 1.899s1.219.386 1.843.067c.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758q.52-1.185.473-1.282"/>
                        </svg>
                     </button>

                     {/* MetaMask Button - Disabled */}
                     <button disabled className="py-4 bg-zinc-950 border border-zinc-900 rounded-2xl flex items-center justify-center grayscale opacity-30 cursor-not-allowed group overflow-hidden">
                        <svg className="w-7 h-7" viewBox="0 0 507.83 470.86">
                          <polygon fill="#e2761b" points="482.09 0.5 284.32 147.38 320.9 60.72 482.09 0.5"/>
                          <polygon fill="#e4761b" points="25.54 0.5 221.72 148.77 186.93 60.72 25.54 0.5"/>
                          <polygon fill="#e4761b" points="410.93 340.97 358.26 421.67 470.96 452.67 503.36 342.76 410.93 340.97"/>
                          <polygon fill="#e4761b" points="4.67 342.76 36.87 452.67 149.57 421.67 96.9 340.97 4.67 342.76"/>
                          <polygon fill="#e4761b" points="143.21 204.62 111.8 252.13 223.7 257.1 219.73 136.85 143.21 204.62"/>
                          <polygon fill="#e4761b" points="364.42 204.62 286.91 135.46 284.32 257.1 396.03 252.13 364.42 204.62"/>
                          <polygon fill="#e4761b" points="149.57 421.67 216.75 388.87 158.71 343.55 149.57 421.67"/>
                          <polygon fill="#e4761b" points="290.88 388.87 358.26 421.67 348.92 343.55 290.88 388.87"/>
                          <polygon fill="#d7c1b3" points="358.26 421.67 290.88 388.87 296.25 432.8 295.65 451.28 358.26 421.67"/>
                          <polygon fill="#d7c1b3" points="149.57 421.67 212.18 451.28 211.78 432.8 216.75 388.87 149.57 421.67"/>
                          <polygon fill="#233447" points="213.17 314.54 157.12 298.04 196.67 279.95 213.17 314.54"/>
                          <polygon fill="#233447" points="294.46 314.54 310.96 279.95 350.71 298.04 294.46 314.54"/>
                          <polygon fill="#cd6116" points="149.57 421.67 159.11 340.97 96.9 342.76 149.57 421.67"/>
                          <polygon fill="#cd6116" points="348.72 340.97 358.26 421.67 410.93 342.76 348.72 340.97"/>
                          <polygon fill="#cd6116" points="396.03 252.13 284.32 257.1 294.66 314.54 311.16 279.95 350.91 298.04 396.03 252.13"/>
                          <polygon fill="#cd6116" points="157.12 298.04 196.87 279.95 213.17 314.54 223.7 257.1 111.8 252.13 157.12 298.04"/>
                          <polygon fill="#e4751f" points="111.8 252.13 158.71 343.55 157.12 298.04 111.8 252.13"/>
                          <polygon fill="#e4751f" points="350.91 298.04 348.92 343.55 396.03 252.13 350.91 298.04"/>
                          <polygon fill="#e4751f" points="223.7 257.1 213.17 314.54 226.29 382.31 229.27 293.07 223.7 257.1"/>
                          <polygon fill="#e4751f" points="284.32 257.1 278.96 292.87 281.34 382.31 294.66 314.54 284.32 257.1"/>
                          <polygon fill="#f6851b" points="294.66 314.54 281.34 382.31 290.88 388.87 348.92 343.55 350.91 298.04 294.66 314.54"/>
                          <polygon fill="#f6851b" points="157.12 298.04 158.71 343.55 216.75 388.87 226.29 382.31 213.17 314.54 157.12 298.04"/>
                          <polygon fill="#c0ad9e" points="295.65 451.28 296.25 432.8 291.28 428.42 216.35 428.42 211.78 432.8 212.18 451.28 149.57 421.67 171.43 439.55 215.75 470.36 291.88 470.36 336.4 439.55 358.26 421.67 295.65 451.28"/>
                          <polygon fill="#161616" points="290.88 388.87 281.34 382.31 226.29 382.31 216.75 388.87 211.78 432.8 216.35 428.42 291.28 428.42 296.25 432.8 290.88 388.87"/>
                          <polygon fill="#763d16" points="490.44 156.92 507.33 75.83 482.09 0.5 290.88 142.41 364.42 204.62 468.37 235.03 491.43 208.2 481.49 201.05 497.39 186.54 485.07 177 500.97 164.87 490.44 156.92"/>
                          <polygon fill="#763d16" points="0.5 75.83 17.39 156.92 6.66 164.87 22.56 177 10.44 186.54 26.34 201.05 16.4 208.2 39.26 235.03 143.21 204.62 216.75 142.41 25.54 0.5 0.5 75.83"/>
                          <polygon fill="#f6851b" points="468.37 235.03 364.42 204.62 396.03 252.13 348.92 343.55 410.93 342.76 503.36 342.76 468.37 235.03"/>
                          <polygon fill="#f6851b" points="143.21 204.62 39.26 235.03 4.67 342.76 96.9 342.76 158.71 343.55 111.8 252.13 143.21 204.62"/>
                          <polygon fill="#f6851b" points="284.32 257.1 290.88 142.41 321.1 60.72 186.93 60.72 216.75 142.41 223.7 257.1 226.09 293.27 226.29 382.31 281.34 382.31 281.74 293.27 284.32 257.1"/>
                        </svg>
                     </button>
                  </div>
               </>
            )}

            <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest pt-6">
                STAKEWISE TERMINAL v{versionInfo.version} - SECURE ACCESS ONLY - UPDATED {new Date(versionInfo.lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
             </p>
         </div>
      </div>
    );
  }

  return (
    <div id="page-root-layout" className="min-h-screen bg-black text-neutral-100 selection:bg-emerald-500 selection:text-black">
      <nav id="nav-global-header" className="flex items-center justify-between px-10 py-6 border-b border-zinc-900 bg-black/80 backdrop-blur-xl sticky top-0 z-[60] h-[80px]">
        <div id="cont-nav-left" className="flex items-center">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-emerald-500 rounded-xl shadow-lg">
              <TrendingUp className="w-5 h-5 text-black" />
            </div>
            <span className="text-3xl font-black text-white italic tracking-tighter">STAKE<span className="text-emerald-500">WISE</span></span>
          </div>
        </div>

        {currentUser.role === 'SUPER_ADMIN' && (
          <div id="cont-nav-center" className="hidden lg:flex bg-zinc-900 rounded-2xl p-1.5 border border-zinc-800 shadow-xl">
            <button onClick={() => setViewMode("USER")} className={`flex items-center gap-2.5 px-10 py-3.5 text-[13px] font-black uppercase rounded-xl transition-all ${viewMode === "USER" ? "bg-emerald-500 text-black shadow-lg" : "text-neutral-500 hover:text-white"}`}>
              <LayoutDashboard className="w-4 h-4" /> {t("common.dashboard")}
            </button>
            <button onClick={() => setViewMode("ADMIN")} className={`flex items-center gap-2.5 px-10 py-3.5 text-[13px] font-black uppercase rounded-xl transition-all ${viewMode === "ADMIN" ? "bg-emerald-500 text-black shadow-lg" : "text-neutral-500 hover:text-white"}`}>
              <Terminal className="w-4 h-4" /> {t("common.terminal")}
            </button>
          </div>
        )}

        <div id="cont-nav-right" className="flex items-center gap-6 h-full">
          <button onClick={toggleLang} className="flex items-center gap-3 px-6 bg-zinc-900 border border-zinc-800 rounded-xl text-[12px] font-black text-neutral-300 hover:text-emerald-500 transition-all shadow-xl h-[48px]">
            <Globe className="w-4 h-4" /> {lang}
          </button>
          <div className="flex items-center gap-5 bg-zinc-950 pl-8 pr-2.5 py-1 rounded-xl border border-zinc-800 shadow-xl h-[48px]">
            <div className="text-right">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">{currentUser.username}</p>
              <p className="text-white font-black text-lg leading-none">{balance.toLocaleString()} <span className="text-emerald-500 text-[10px]">USDT</span></p>
            </div>
            <button onClick={handleLogout} className="p-3.5 bg-zinc-900 hover:bg-red-500/10 hover:text-red-500 transition-all rounded-xl border border-zinc-800 group">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-[1500px] mx-auto px-10 py-16">
        {viewMode === "ADMIN" && currentUser.role === 'SUPER_ADMIN' ? (
          <div className="space-y-12">
            <div className="flex gap-5">
              {['OVERVIEW', 'USERS', 'FINANCE', 'SYSTEM'].map(tab => (
                <button key={tab} onClick={() => setAdminTab(tab as any)} className={`px-12 py-5 rounded-2xl border text-[13px] font-black uppercase transition-all ${adminTab === tab ? "bg-emerald-500 text-black border-emerald-400 shadow-xl" : "bg-zinc-900 border-zinc-800 text-neutral-500 hover:text-white"}`}>{t(`nav.${tab.toLowerCase()}`)}</button>
              ))}
            </div>
            {adminTab === "OVERVIEW" && (
              <AdminOverview 
                stats={{
                  totalVolume: getSystemStats(threads).totalVolume,
                  activeMarkets: getSystemStats(threads).activeThreads,
                  pendingWithdrawals: 12 // Mock data for pending tasks
                }} 
              />
            )}
            {adminTab === "USERS" && <MemberManagement users={users} onUpdateStatus={handleUpdateUserStatus} />}
            {adminTab === "FINANCE" && <FinancialAudit />}
            {adminTab === "SYSTEM" && <CommandCenter onUpgrade={() => showNotify("Upgrade Initiated", "INFO")} />}
          </div>
        ) : (
          <div className="space-y-16">
            <div className="flex items-center gap-16 border-b border-zinc-900 overflow-x-auto no-scrollbar">
              {['MARKETS', 'PORTFOLIO', 'WALLET', 'PROFILE'].map(tab => (
                <button key={tab} onClick={() => setUserSubTab(tab as any)} className={`text-[16px] font-black uppercase ${getTracking("wide")} pb-8 transition-all relative ${userSubTab === tab ? "text-emerald-500" : "text-neutral-400 hover:text-neutral-200"}`}>
                  {t(`nav.${tab === 'MARKETS' ? 'prediction_markets' : tab === 'PORTFOLIO' ? 'your_assets' : tab === 'WALLET' ? 'wallet_hub' : 'profile'}`)}
                  {userSubTab === tab && <div className="absolute bottom-0 left-0 w-full h-1.5 bg-emerald-500 rounded-t-full shadow-lg"></div>}
                </button>
              ))}
            </div>
            <div className="transition-all">
              {userSubTab === "MARKETS" && (
                <MarketGrid 
                  threads={threads} 
                  onJoin={(thread, side) => { setJoinModalThread(thread); setJoinSide(side); }} 
                  onCreateOpen={() => setIsCreateModalOpen(true)} 
                  isAdmin={currentUser.role === 'SUPER_ADMIN'}
                  onDelete={handleDeleteMarket}
                  onEdit={handleOpenEdit}
                />
              )}
              {userSubTab === "PORTFOLIO" && <PortfolioStats userBets={userBets} />}
              {userSubTab === "WALLET" && <WalletDashboard balance={balance} walletStatus={currentUser.walletStatus} walletAddress={currentUser.wallet} transactions={[]} onDeposit={handleDeposit} />}
              {userSubTab === "PROFILE" && (
                <ProfileSettings 
                  user={currentUser} 
                  onUpdate={(updatedData: any) => {
                    setCurrentUser({...currentUser, ...updatedData});
                    showNotify("อัปเดตโปรไฟล์เรียบร้อยแล้ว", "SUCCESS");
                  }} 
                />
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="max-w-[1500px] mx-auto px-10 py-10 border-t border-zinc-900 mt-10">
         <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
               <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
               <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">
                  STAKEWISE TERMINAL <span className="text-white">v{versionInfo.version}</span> {versionInfo.buildType}
               </p>
            </div>
            <div className="text-right">
               <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1 italic">Last Deploy Updated</p>
               <p className="text-[11px] font-black text-zinc-400 uppercase tracking-tighter">
                  {new Date(versionInfo.lastUpdated).toLocaleString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}
               </p>
            </div>
         </div>
      </footer>

      {/* CREATE MARKET MODAL */}
      <BaseModal id="create-market" isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="สร้างตลาดพยากรณ์ใหม่" icon={<Plus className="w-6 h-6 text-emerald-500" />} size="4xl">
        <form className="space-y-6" onSubmit={handleCreateMarket}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Image & Description */}
            <div className="space-y-6">
              <div className="w-full h-40 bg-zinc-950 border-2 border-dashed border-zinc-900 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-emerald-500/50 transition-all cursor-pointer group">
                <ImageIcon className="w-6 h-6 text-zinc-700 group-hover:text-emerald-500" />
                <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest group-hover:text-white text-center px-4">อัปโหลดภาพประกอบเหตุการณ์<br/>(RECOMMENDED 16:9)</p>
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest px-1">รายละเอียดเงื่อนไข</p>
                <textarea rows={6} value={newMarket.description} onChange={(e) => setNewMarket({...newMarket, description: e.target.value})} placeholder="ระบุเงื่อนไขการตัดสินผล..." className="w-full p-5 bg-zinc-950 border border-zinc-900 rounded-xl outline-none text-[13px] font-bold text-neutral-400 focus:border-emerald-500 resize-none" />
              </div>
            </div>

            {/* Right Column: Title & Stats */}
            <div className="space-y-6 flex flex-col">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest px-1">{t("market.event_name")}</p>
                  <input required type="text" value={newMarket.title} onChange={(e) => setNewMarket({...newMarket, title: e.target.value})} placeholder="BTC จะแตะ $150K หรือไม่?" className="w-full p-5 bg-zinc-950 border border-zinc-900 rounded-xl outline-none text-lg font-black text-white focus:border-emerald-500" />
                </div>
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest px-1">{t("market.end_date")}</p>
                  <input required type="datetime-local" value={newMarket.endDate} onChange={(e) => setNewMarket({...newMarket, endDate: e.target.value})} className="w-full p-5 bg-zinc-950 border border-zinc-900 rounded-xl outline-none text-sm font-black text-white focus:border-emerald-500 transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-4">
                     <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest px-2">{t("market.select_side")}</p>
                     <div className="grid grid-cols-2 gap-4">
                        <button type="button" onClick={() => setNewMarket({...newMarket, side: "YES"})} className={`py-6 rounded-2xl border-2 font-black uppercase text-xs transition-all ${newMarket.side === "YES" ? "bg-emerald-500 text-black border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.2)]" : "bg-zinc-950 border-zinc-900 text-zinc-600 opacity-60"}`}>
                           {t("market.trade_yes")}
                        </button>
                        <button type="button" onClick={() => setNewMarket({...newMarket, side: "NO"})} className={`py-6 rounded-2xl border-2 font-black uppercase text-xs transition-all ${newMarket.side === "NO" ? "bg-red-600 text-white border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.2)]" : "bg-zinc-950 border-zinc-900 text-zinc-600 opacity-60"}`}>
                           {t("market.trade_no")}
                        </button>
                     </div>
                     <div className={`p-4 rounded-xl border border-dashed transition-all text-center ${newMarket.side === "YES" ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-500" : "bg-red-500/5 border-red-500/20 text-red-500"}`}>
                        <p className="text-[10px] font-black uppercase tracking-widest">{t("market.starting_side")} {newMarket.side}</p>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest px-2">{t("market.initial_liquidity")}</p>
                  <input 
                    required 
                    type="number" 
                    value={newMarket.liquidity} 
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val <= balance) {
                        setNewMarket({...newMarket, liquidity: val});
                      }
                    }} 
                    placeholder="0.00" 
                    className={`w-full p-5 bg-zinc-950 border rounded-xl outline-none text-2xl font-black transition-all ${
                      newMarket.liquidity > balance * 0.8 ? 'border-orange-500 text-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.1)]' : 'border-zinc-900 text-emerald-500 focus:border-emerald-500'
                    }`} 
                  />
                  {newMarket.liquidity > balance * 0.8 && (
                    <p className="text-[10px] font-black text-orange-500 uppercase tracking-tighter animate-pulse">
                      {t("market.warning_80")}
                    </p>
                  )}
                  {newMarket.liquidity === balance && (
                    <p className="text-[10px] font-black text-red-500 uppercase tracking-tighter">
                      {t("market.max_reached")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <button type="submit" className="w-full py-8 bg-emerald-500 text-black font-black uppercase text-lg rounded-xl shadow-xl hover:bg-emerald-400 transition-all mt-4">{t("common.confirm")}</button>
        </form>
      </BaseModal>

      {/* EDIT MARKET MODAL */}
      <BaseModal id="edit-market" isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="แก้ไขข้อมูลตลาดพยากรณ์" icon={<Edit3 className="w-6 h-6 text-emerald-500" />} size="4xl">
        {editingMarket && (
          <form className="space-y-6" onSubmit={handleSaveEdit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-8 col-span-2">
                 <div className="space-y-3">
                   <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest px-1">{t("market.event_name")}</p>
                   <input required type="text" value={editingMarket.title} onChange={(e) => setEditingMarket({...editingMarket, title: e.target.value})} className="w-full p-6 bg-zinc-950 border border-zinc-900 rounded-2xl outline-none text-2xl font-black text-white focus:border-emerald-500 shadow-2xl transition-all" />
                 </div>
              </div>

              <div className="space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3 col-span-2">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest px-1 flex items-center gap-2"><Database className="w-3 h-3" /> {t("market.end_date")}</p>
                    <input 
                      required 
                      type="datetime-local" 
                      value={new Date(editingMarket.endDate).toISOString().slice(0, 16)} 
                      onChange={(e) => setEditingMarket({...editingMarket, endDate: new Date(e.target.value).toISOString()})} 
                      className="w-full p-5 bg-zinc-950 border border-zinc-900 rounded-xl outline-none text-sm font-black text-white focus:border-emerald-500" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-emerald-500/50 uppercase tracking-widest px-1">YES RATE (USDT)</p>
                    <input type="number" step="0.01" value={editingMarket.yesPrice} onChange={(e) => setEditingMarket({...editingMarket, yesPrice: Number(e.target.value)})} className="w-full p-5 bg-emerald-500/5 border border-emerald-500/20 rounded-xl outline-none text-2xl font-black text-emerald-500 focus:border-emerald-500" />
                  </div>
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-red-500/50 uppercase tracking-widest px-1">NO RATE (USDT)</p>
                    <input type="number" step="0.01" value={editingMarket.noPrice} onChange={(e) => setEditingMarket({...editingMarket, noPrice: Number(e.target.value)})} className="w-full p-5 bg-red-500/5 border border-red-500/20 rounded-xl outline-none text-2xl font-black text-red-500 focus:border-red-500" />
                  </div>
                </div>

                <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl space-y-4">
                   <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                      <Database className="w-4 h-4" /> {t("market.system_revenue")}
                   </p>
                   <div className="grid grid-cols-2 gap-4 text-[11px] font-bold">
                      <div className="text-zinc-500">{t("market.net_profit")}:</div>
                      <div className="text-right text-emerald-500">
                         + {((editingMarket.yesVolume + editingMarket.noVolume) * 0.025).toLocaleString()} USDT
                      </div>
                      <div className="text-zinc-500">{t("market.fee_ratio")}:</div>
                      <div className="text-right text-white">2.5% Fixed Fee</div>
                   </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-5 bg-zinc-950 border border-zinc-900 rounded-2xl">
                      <p className="text-[9px] font-black text-zinc-600 uppercase mb-1">{t("market.total_bettors")}</p>
                      <p className="text-2xl font-black text-white italic">{(editingMarket.yesVolume / 50 + editingMarket.noVolume / 30).toFixed(0)} <span className="text-[10px] text-zinc-700">USERS</span></p>
                   </div>
                   <div className="p-5 bg-zinc-950 border border-zinc-900 rounded-2xl">
                      <p className="text-[9px] font-black text-zinc-600 uppercase mb-1">{t("market.creator")}</p>
                      <p className="text-lg font-black text-emerald-500 italic truncate uppercase">{editingMarket.creatorId || 'System'}</p>
                   </div>
                </div>

                <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-2xl space-y-4">
                   <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{t("market.liquidity")}</p>
                   <div className="space-y-4">
                      <div>
                         <div className="flex justify-between text-[11px] font-bold mb-2 uppercase">
                            <span className="text-emerald-500">{t("market.yes_pool")}</span>
                            <span className="text-white">{editingMarket.yesVolume.toLocaleString()} USDT</span>
                         </div>
                         <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: `${(editingMarket.yesVolume / (editingMarket.yesVolume + editingMarket.noVolume)) * 100}%` }}></div>
                         </div>
                      </div>
                      <div>
                         <div className="flex justify-between text-[11px] font-bold mb-2 uppercase">
                            <span className="text-red-500">{t("market.no_pool")}</span>
                            <span className="text-white">{editingMarket.noVolume.toLocaleString()} USDT</span>
                         </div>
                         <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500" style={{ width: `${(editingMarket.noVolume / (editingMarket.yesVolume + editingMarket.noVolume)) * 100}%` }}></div>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="flex-1"></div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-5 bg-zinc-900 text-zinc-500 font-black uppercase text-sm rounded-xl hover:bg-zinc-800 transition-all">{t("common.cancel")}</button>
                  <button type="submit" className="flex-[2] py-5 bg-emerald-500 text-black font-black uppercase text-sm rounded-xl shadow-xl hover:bg-emerald-400 transition-all">{t("common.confirm_changes")}</button>
                </div>
              </div>
            </div>
          </form>
        )}
      </BaseModal>

      {/* JOIN MARKET MODAL */}
      <BaseModal id="join-market" isOpen={!!joinModalThread} onClose={() => setJoinModalThread(null)} title={t("common.confirm")} icon={<Zap className="w-6 h-6 text-emerald-500" />}>
        <form className="space-y-10" onSubmit={handleJoinMarket}>
          <div className="space-y-4">
             <p className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.2em] px-1">{t("market.select_side")}</p>
             <div className="grid grid-cols-2 gap-5">
                <button type="button" onClick={() => setJoinSide("YES")} className={`py-8 rounded-2xl border-2 font-black uppercase text-sm transition-all ${joinSide === "YES" ? "bg-emerald-500 text-black border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)] scale-105" : "bg-zinc-900 border-zinc-800 text-neutral-500 opacity-50"}`}>{t("market.trade_yes")}</button>
                <button type="button" onClick={() => setJoinSide("NO")} className={`py-8 rounded-2xl border-2 font-black uppercase text-sm transition-all ${joinSide === "NO" ? "bg-red-600 text-white border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)] scale-105" : "bg-zinc-900 border-zinc-800 text-neutral-500 opacity-50"}`}>{t("market.trade_no")}</button>
             </div>
          </div>

          <div className={`p-6 rounded-2xl border-2 flex items-center justify-between transition-all ${joinSide === "YES" ? "bg-emerald-500/5 border-emerald-500/20" : "bg-red-500/5 border-red-500/20"}`}>
             <div className="space-y-1">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{t("market.decision_status")}</p>
                <p className={`text-2xl font-black italic uppercase ${joinSide === "YES" ? "text-emerald-500" : "text-red-500"}`}>
                   {t("market.current_bet_side")} {joinSide}
                </p>
             </div>
             {joinSide === "YES" ? <TrendingUp className="w-8 h-8 text-emerald-500" /> : <TrendingDown className="w-8 h-8 text-red-500" />}
          </div>
          <div className="space-y-5">
             <div className="flex justify-between px-2">
                <p className="text-[11px] font-black text-neutral-500 uppercase tracking-widest">{t("wallet.amount")} (USDT)</p>
                <p className="text-[11px] font-black text-zinc-600 uppercase tracking-widest">{t("wallet.available")}: {balance.toLocaleString()}</p>
             </div>
             <input 
                required 
                type="number" 
                value={joinAmount} 
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val <= balance) {
                    setJoinAmount(val);
                  }
                }} 
                placeholder="0.00" 
                className={`w-full p-8 bg-zinc-950 border rounded-2xl outline-none text-5xl font-black transition-all ${
                  Number(joinAmount) > balance * 0.8 ? 'border-orange-500 text-orange-500 shadow-[0_0_40px_rgba(249,115,22,0.15)]' : 'border-zinc-900 text-emerald-500 focus:border-emerald-500'
                }`} 
             />
             {Number(joinAmount) > balance * 0.8 && (
               <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl animate-in fade-in slide-in-from-top-2">
                  <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest flex items-center gap-2">
                    <Info className="w-4 h-4" /> {t("market.risk_warning_80")}
                  </p>
               </div>
             )}
             
          </div>
          <button className="w-full py-8 bg-emerald-500 text-black font-black uppercase text-lg rounded-xl shadow-xl hover:bg-emerald-400 transition-all">{t("common.confirm")}</button>
        </form>
      </BaseModal>

      <Notification isOpen={notify.isOpen} message={notify.message} type={notify.type} onClose={() => setNotify(prev => ({ ...prev, isOpen: false }))} />
    </div>
  );
}
