"use client";

import React, { useState, useEffect } from "react";
// --- Shared Components ---
import { Notification, NotifyType } from "@/components/shared/Notification";

// --- Module Components ---
// --- Services (Service Layer) ---
import { authService } from "@/modules/auth/service";
import { marketService, Thread } from "@/modules/market/service";
import { betService } from "@/modules/bet/service";
import { logService } from "@/services/logService";
import type { RadarBetSide } from "@/features/forecast-world/types";

// --- Context & Hooks ---
import { useTranslation } from "@/context/LangContext";

// --- Data ---
import { mockUsers as initialUsers, User as UserType } from "@/data/mockUsers";
import { createDefaultMarketDraft } from "./constants";
import { AdminWorkspace } from "./components/AdminWorkspace";
import { AuthScreen } from "./components/AuthScreen";
import { LoadingScreen } from "./components/LoadingScreen";
import { TerminalFooter } from "./components/TerminalFooter";
import { TerminalHeader } from "./components/TerminalHeader";
import { UserWorkspace } from "./components/UserWorkspace";
import { CreateMarketModal } from "./components/modals/CreateMarketModal";
import { EditMarketModal } from "./components/modals/EditMarketModal";
import { JoinMarketModal } from "./components/modals/JoinMarketModal";
import type { AdminTab, AuthView, PortfolioBet, UserSubTab, ViewMode } from "./types";

export function StakewiseTerminal() {
  const { t, lang, setLang } = useTranslation();
  
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(false); // ปิด Loading เริ่มต้นเพื่อแก้ปัญหาค้างบนมือถือ
  const [viewMode, setViewMode] = useState<ViewMode>("USER");
  const [userSubTab, setUserSubTab] = useState<UserSubTab>("MARKETS");
  const [adminTab, setAdminTab] = useState<AdminTab>("OVERVIEW");
  
  const [users, setUsers] = useState<UserType[]>(initialUsers);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [userBets] = useState<PortfolioBet[]>([]);
  const [balance, setBalance] = useState<number>(0);

  const [notify, setNotify] = useState({ isOpen: false, message: "", type: "SUCCESS" as NotifyType });

  const [joinModalThread, setJoinModalThread] = useState<Thread | null>(null);
  const [joinSide, setJoinSide] = useState<"YES" | "NO" | null>(null);
  const [joinAmount, setJoinAmount] = useState<number | "">("");

  // Auth State
  const [authView, setAuthView] = useState<AuthView>("LOGIN");
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [otpInput, setOtpInput] = useState("");

  // Market Management State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingMarket, setEditingMarket] = useState<Thread | null>(null);
  const [newMarket, setNewMarket] = useState(createDefaultMarketDraft);

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
    if (currentUser) return; // บังคับหยุดถ้าล็อกอินอยู่แล้ว ป้องกันการเด้งกลับหน้า Login
    try {
      if (typeof window === "undefined") return;
      const currentId = localStorage.getItem("current_user_id");
      if (currentId) {
          const found = users.find(u => u.id === currentId);
          if (found) {
            setCurrentUser(found);
            setBalance(found.balance);
          }
      }
    } catch (err) {
      console.error("Session check error:", err);
    }
  }, [users]);

  // Initial Data Fetch
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      const startTime = Date.now();
      try {
        const initialThreads = await marketService.fetchMarkets();
        if (mounted) setThreads(initialThreads);
      } catch (err) {
        console.error("Market fetch error:", err);
      } finally {
        const minDuration = 2000; 
        const elapsed = Date.now() - startTime;
        const wait = Math.max(0, minDuration - elapsed);
        
        setTimeout(() => {
          if (mounted) setIsLoading(false);
        }, wait);
      }
    };
    init();
    return () => { mounted = false; };
  }, []);

  // Failsafe: บังคับปิด Loading หลังจาก 5 วินาทีแน่นอน ไม่ว่าจะเกิดอะไรขึ้น
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const showNotify = (message: string, type: NotifyType = "SUCCESS") => {
    setNotify({ isOpen: true, message, type });
    setTimeout(() => setNotify(prev => ({ ...prev, isOpen: false })), 3000);
  };

  const handleAuth = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // ป้องกันการกดซ้ำ
    if (isLoading) return;

    try {
      // 1. ตรวจสอบข้อมูลเบื้องต้น
      if (!usernameInput || !passwordInput) {
        showNotify("Please enter credentials", "ERROR");
        return;
      }

      // 2. เช็คจาก Mock Data (รวดเร็วที่สุด)
      const user = users.find(u => u.username === usernameInput);
      
      if (user) {
          if (user.password === passwordInput) {
            const loggedInUser = authService.login(user.username, [user]);
            if (loggedInUser) {
              setCurrentUser(loggedInUser);
              setBalance(loggedInUser.balance);
              showNotify(`${t("common.success")}`, "SUCCESS");
              logService.logLogin(loggedInUser.username).catch(() => {});
              return;
            }
          } else {
            showNotify("Incorrect password", "ERROR");
            return;
          }
      }
      
      // 3. ถ้าไม่เจอใน Mock ลองเช็คจากฐานข้อมูล Log (ใช้ setIsLoading เฉพาะส่วนนี้)
      setIsLoading(true);
      const loggedUser = await logService.verifyUser(usernameInput) as UserType | null;
      setIsLoading(false);

      if (loggedUser && loggedUser.password === passwordInput) {
          const loggedInUser = authService.login(loggedUser.username, [loggedUser]);
          if (loggedInUser) {
            setCurrentUser(loggedInUser);
            setBalance(loggedInUser.balance);
            showNotify(`${t("common.success")}`, "SUCCESS");
            return;
          }
      }

      showNotify("User not found", "ERROR");
    } catch (err) {
      console.error("Auth error:", err);
      setIsLoading(false);
      showNotify("System error", "ERROR");
    }
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
           const demoUser: UserType & { phone: string } = {
              id: `user_${Date.now()}`,
              username: usernameInput,
              password: passwordInput,
              phone: phoneInput,
              wallet: "0x" + Math.random().toString(16).slice(2, 10).toUpperCase(),
              balance: 1000,
              winRate: "0%",
              totalProfit: "0 USDT",
              role: "USER" as const,
              status: "ACTIVE" as const,
              walletStatus: "ACTIVE" as const,
              lastIp: "127.0.0.1"
           };
           
           authService.login(demoUser.username, [demoUser]);
           setCurrentUser(demoUser);
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
    } catch (err: unknown) {
      showNotify(err instanceof Error ? err.message : "Unable to place bet", "ERROR");
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
    setNewMarket(createDefaultMarketDraft());
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
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMarket) {
      setThreads(threads.map(t => t.id === editingMarket.id ? editingMarket : t));
      setEditingMarket(null);
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

  const handlePlaceRadarBet = (thread: Thread, side: RadarBetSide, amount: number) => {
    if (!currentUser) return false;
    if (amount <= 0 || amount > balance) {
      showNotify(t("world.insufficient_balance"), "ERROR");
      return false;
    }

    try {
      const newBalance = betService.placeBet(balance, amount);
      setBalance(newBalance);
      setThreads((current) => current.map((market) => {
        if (market.id !== thread.id) return market;
        return side === "YES"
          ? { ...market, yesVolume: market.yesVolume + amount }
          : { ...market, noVolume: market.noVolume + amount };
      }));

      showNotify(`${t("world.radar.bet_confirmed")} ${side} ${amount} USDT`, "SUCCESS");
      logService.logTransaction(currentUser.username, "RADAR_BET", amount, `Radar bet ${side} on ${thread.title}`);
      return true;
    } catch (err: unknown) {
      showNotify(err instanceof Error ? err.message : t("world.insufficient_balance"), "ERROR");
      return false;
    }
  };

  const getTracking = (strength: "normal" | "wide" | "widest") => {
    if (lang === "TH") return "tracking-normal";
    if (strength === "widest") return "tracking-[0.1em]";
    if (strength === "wide") return "tracking-widest";
    return "tracking-normal";
  };

  if (isLoading) return <LoadingScreen slogan={t("auth.slogan_desc")} />;

  if (!currentUser) {
    return (
      <AuthScreen
        authView={authView}
        usernameInput={usernameInput}
        passwordInput={passwordInput}
        phoneInput={phoneInput}
        otpInput={otpInput}
        lang={lang}
        onAuthViewChange={setAuthView}
        onUsernameChange={setUsernameInput}
        onPasswordChange={setPasswordInput}
        onPhoneChange={setPhoneInput}
        onOtpChange={setOtpInput}
        onLogin={handleAuth}
        onRegister={handleRegister}
        onVerifyOtp={handleVerifyOtp}
        onToggleLang={toggleLang}
        t={t}
      />
    );
  }

  return (
    <div id="page-root-layout" className="min-h-screen bg-black text-neutral-100 selection:bg-emerald-500 selection:text-black">
      <TerminalHeader
        currentUser={currentUser}
        balance={balance}
        lang={lang}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onToggleLang={toggleLang}
        onLogout={handleLogout}
        t={t}
      />

      <main className="max-w-[1500px] mx-auto px-4 md:px-10 py-8 md:py-16">
        {viewMode === "ADMIN" && currentUser.role === 'SUPER_ADMIN' ? (
          <AdminWorkspace
            adminTab={adminTab}
            users={users}
            threads={threads}
            onAdminTabChange={setAdminTab}
            onUpdateUserStatus={handleUpdateUserStatus}
            onUpgrade={() => showNotify("Upgrade Initiated", "INFO")}
            t={t}
          />
        ) : (
          <UserWorkspace
            userSubTab={userSubTab}
            currentUser={currentUser}
            threads={threads}
            userBets={userBets}
            balance={balance}
            onUserSubTabChange={setUserSubTab}
            onJoinMarket={(thread, side) => { setJoinModalThread(thread); setJoinSide(side); }}
            onCreateMarketOpen={() => setIsCreateModalOpen(true)}
            onDeleteMarket={handleDeleteMarket}
            onEditMarket={handleOpenEdit}
            onDeposit={handleDeposit}
            onProfileUpdate={(updatedData: Partial<UserType>) => {
              setCurrentUser({...currentUser, ...updatedData});
              showNotify("อัปเดตโปรไฟล์เรียบร้อยแล้ว", "SUCCESS");
            }}
            onPlaceRadarBet={handlePlaceRadarBet}
            getTracking={getTracking}
            t={t}
          />
        )}
      </main>

      <TerminalFooter />

      <CreateMarketModal
        isOpen={isCreateModalOpen}
        market={newMarket}
        balance={balance}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateMarket}
        onMarketChange={setNewMarket}
        t={t}
      />

      <EditMarketModal
        market={editingMarket}
        onClose={() => setEditingMarket(null)}
        onSubmit={handleSaveEdit}
        onMarketChange={setEditingMarket}
        t={t}
      />

      <JoinMarketModal
        thread={joinModalThread}
        side={joinSide}
        amount={joinAmount}
        balance={balance}
        onClose={() => setJoinModalThread(null)}
        onSideChange={setJoinSide}
        onAmountChange={setJoinAmount}
        onSubmit={handleJoinMarket}
        t={t}
      />

      <Notification isOpen={notify.isOpen} message={notify.message} type={notify.type} onClose={() => setNotify(prev => ({ ...prev, isOpen: false }))} />
    </div>
  );
}
